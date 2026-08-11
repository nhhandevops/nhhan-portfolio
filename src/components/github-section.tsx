import { Section } from "@/components/ui/section";
import { Tag } from "@/components/ui/tag";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { formatDate } from "@/lib/format";
import type { GitHubResult } from "@/lib/github";

export function GitHubSection({
  locale,
  dict,
  result,
}: {
  locale: Locale;
  dict: Dictionary;
  result: GitHubResult;
}) {
  // Chưa cấu hình username hoặc token thì coi như chưa bật tính năng — ẩn hẳn
  // section thay vì hiện lỗi cho người xem.
  if (!result.ok && result.reason !== "request-failed") return null;

  return (
    <Section
      id="github"
      title={dict.github.title}
      subtitle={dict.github.subtitle}
    >
      {result.ok ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {result.repos.map((repo) => (
            <a
              key={repo.name}
              href={repo.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col rounded-lg border bg-surface p-5 transition-colors hover:border-accent"
            >
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-base font-semibold break-all">
                  {repo.name}
                </h3>
                {repo.pinned ? <Tag emphasis>{dict.github.pinned}</Tag> : null}
              </div>

              {repo.description ? (
                <p className="mt-2 text-sm leading-relaxed text-muted text-pretty">
                  {repo.description}
                </p>
              ) : null}

              {repo.topics.length > 0 ? (
                <ul className="mt-3 flex flex-wrap gap-1.5">
                  {repo.topics.map((topic) => (
                    <li key={topic}>
                      <Tag>{topic}</Tag>
                    </li>
                  ))}
                </ul>
              ) : null}

              <div className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-1 pt-4 text-xs text-muted">
                {repo.language ? (
                  <span className="inline-flex items-center gap-1.5">
                    <span
                      aria-hidden="true"
                      className="size-2.5 rounded-full border"
                      style={
                        repo.language.color
                          ? { backgroundColor: repo.language.color }
                          : undefined
                      }
                    />
                    {repo.language.name}
                  </span>
                ) : null}

                {repo.stars > 0 ? (
                  <span>
                    {repo.stars} {dict.github.stars}
                  </span>
                ) : null}

                <span className="tabular-nums">
                  {dict.github.updated} {formatDate(repo.pushedAt, locale)}
                </span>
              </div>
            </a>
          ))}
        </div>
      ) : (
        <p className="rounded-lg border bg-surface p-5 text-sm text-muted">
          {dict.github.unavailable}
        </p>
      )}

      {result.profileUrl ? (
        <p className="mt-6 text-sm">
          <a
            href={result.profileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-accent hover:underline"
          >
            {dict.github.viewProfile} →
          </a>
        </p>
      ) : null}
    </Section>
  );
}
