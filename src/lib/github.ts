import "server-only";

import { unstable_cache } from "next/cache";

import { site } from "@/data/site";

export type GitHubRepo = {
  name: string;
  description: string | null;
  url: string;
  stars: number;
  forks: number;
  /** ISO 8601. */
  pushedAt: string;
  language: { name: string; color: string | null } | null;
  topics: string[];
  /** true nếu repo được ghim trên trang cá nhân GitHub. */
  pinned: boolean;
};

export type GitHubResult =
  | { ok: true; repos: GitHubRepo[]; profileUrl: string }
  | { ok: false; reason: GitHubFailure; profileUrl: string | null };

/**
 * `no-username` và `no-token` là trạng thái cấu hình chưa xong, không phải lỗi.
 * `request-failed` gồm cả rate limit, token hết hạn, và GitHub trả lỗi.
 */
type GitHubFailure = "no-username" | "no-token" | "request-failed";

const REVALIDATE_SECONDS = 60 * 60; // 1 giờ

const GRAPHQL_ENDPOINT = "https://api.github.com/graphql";

/**
 * Một request duy nhất lấy cả repo đã ghim lẫn repo mới push.
 * REST API không trả được danh sách ghim, nên bắt buộc dùng GraphQL —
 * và GraphQL của GitHub luôn yêu cầu token, kể cả với dữ liệu công khai.
 */
const QUERY = /* GraphQL */ `
  query PortfolioRepos($login: String!, $recentLimit: Int!) {
    user(login: $login) {
      url
      pinnedItems(first: 6, types: REPOSITORY) {
        nodes {
          ... on Repository {
            ...RepoFields
          }
        }
      }
      repositories(
        first: $recentLimit
        privacy: PUBLIC
        isFork: false
        ownerAffiliations: OWNER
        orderBy: { field: PUSHED_AT, direction: DESC }
      ) {
        nodes {
          ...RepoFields
        }
      }
    }
  }

  fragment RepoFields on Repository {
    name
    description
    url
    stargazerCount
    forkCount
    pushedAt
    isArchived
    primaryLanguage {
      name
      color
    }
    repositoryTopics(first: 5) {
      nodes {
        topic {
          name
        }
      }
    }
  }
`;

type RawRepo = {
  name: string;
  description: string | null;
  url: string;
  stargazerCount: number;
  forkCount: number;
  pushedAt: string;
  isArchived: boolean;
  primaryLanguage: { name: string; color: string | null } | null;
  repositoryTopics: { nodes: { topic: { name: string } }[] };
};

type QueryResponse = {
  data?: {
    user: {
      url: string;
      pinnedItems: { nodes: (RawRepo | Record<string, never>)[] };
      repositories: { nodes: RawRepo[] };
    } | null;
  };
  errors?: { message: string }[];
};

function isRawRepo(node: RawRepo | Record<string, never>): node is RawRepo {
  return typeof (node as RawRepo).name === "string";
}

function normalize(raw: RawRepo, pinned: boolean): GitHubRepo {
  return {
    name: raw.name,
    description: raw.description,
    url: raw.url,
    stars: raw.stargazerCount,
    forks: raw.forkCount,
    pushedAt: raw.pushedAt,
    language: raw.primaryLanguage,
    topics: raw.repositoryTopics.nodes.map((n) => n.topic.name),
    pinned,
  };
}

async function fetchRepos(
  login: string,
  token: string,
  limit: number,
): Promise<GitHubResult> {
  let response: Response;

  try {
    response = await fetch(GRAPHQL_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        // GitHub từ chối request không có User-Agent.
        "User-Agent": "portfolio-site",
      },
      body: JSON.stringify({
        query: QUERY,
        // Lấy dư để còn chỗ loại repo archived và repo trùng với danh sách ghim.
        variables: { login, recentLimit: limit + 10 },
      }),
      // Bản thân fetch không cache được vì là POST — việc cache do
      // unstable_cache ở dưới đảm nhiệm. Đặt no-store để tránh cache tầng khác.
      cache: "no-store",
    });
  } catch (error) {
    console.error("[github] network error", error);
    return { ok: false, reason: "request-failed", profileUrl: null };
  }

  if (!response.ok) {
    console.error(
      `[github] HTTP ${response.status} ${response.statusText}`,
      await response.text().catch(() => ""),
    );
    return { ok: false, reason: "request-failed", profileUrl: null };
  }

  const payload = (await response.json()) as QueryResponse;

  // GraphQL trả HTTP 200 kể cả khi query lỗi, nên phải kiểm tra `errors` riêng.
  if (payload.errors?.length) {
    console.error("[github] GraphQL errors", payload.errors);
    return { ok: false, reason: "request-failed", profileUrl: null };
  }

  const user = payload.data?.user;
  if (!user) {
    console.error(`[github] user "${login}" not found`);
    return { ok: false, reason: "request-failed", profileUrl: null };
  }

  // Áp cho CẢ hai danh sách: repo bị loại thì dù có ghim cũng không hiện.
  const excluded = new Set(
    site.githubExclude.map((name) => name.toLowerCase()),
  );
  const isExcluded = (repo: RawRepo) => excluded.has(repo.name.toLowerCase());

  const pinned = user.pinnedItems.nodes
    .filter(isRawRepo)
    .filter((repo) => !repo.isArchived && !isExcluded(repo))
    .map((repo) => normalize(repo, true));

  const pinnedNames = new Set(pinned.map((repo) => repo.name));

  const recent = user.repositories.nodes
    .filter(
      (repo) =>
        !repo.isArchived && !isExcluded(repo) && !pinnedNames.has(repo.name),
    )
    .map((repo) => normalize(repo, false));

  return {
    ok: true,
    repos: [...pinned, ...recent].slice(0, limit),
    profileUrl: user.url,
  };
}

/**
 * Kết quả được cache 1 giờ. Trang gọi hàm này là Server Component nên token
 * không bao giờ đi tới trình duyệt.
 *
 * Hàm KHÔNG bao giờ throw: mọi lỗi trả về `ok: false` để section GitHub hiển thị
 * thông báo nhẹ nhàng thay vì làm sập cả trang.
 */
export const getGitHubRepos = unstable_cache(
  async (): Promise<GitHubResult> => {
    const login = site.githubUsername.trim();
    if (!login) {
      return { ok: false, reason: "no-username", profileUrl: null };
    }

    const profileUrl = `https://github.com/${login}`;

    const token = process.env.GITHUB_TOKEN?.trim();
    if (!token) {
      return { ok: false, reason: "no-token", profileUrl };
    }

    const result = await fetchRepos(login, token, site.githubRepoLimit);
    // Giữ profileUrl kể cả khi lỗi, để vẫn link được sang GitHub.
    return result.ok ? result : { ...result, profileUrl };
  },
  ["github-repos"],
  { revalidate: REVALIDATE_SECONDS, tags: ["github-repos"] },
);
