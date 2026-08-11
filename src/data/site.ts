/**
 * Cấu hình chung của site. Sửa file này sau khi có domain thật.
 */
export const site = {
  /**
   * URL production, KHÔNG có dấu / ở cuối. Dùng cho metadata, sitemap, hreflang.
   * Trên Vercel, đặt biến môi trường NEXT_PUBLIC_SITE_URL để không phải sửa code.
   */
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(
    /\/$/,
    "",
  ),

  /**
   * Username GitHub dùng để kéo repository.
   * Đặt qua biến môi trường GITHUB_USERNAME, hoặc sửa giá trị mặc định ở đây.
   */
  githubUsername: process.env.GITHUB_USERNAME ?? "nhhandevops",

  /** Số repo tối đa hiển thị ở section GitHub. */
  githubRepoLimit: 6,
} as const;
