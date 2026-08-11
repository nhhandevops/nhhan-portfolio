import type { NextConfig } from "next";

import { defaultLocale } from "./src/i18n/config";

const nextConfig: NextConfig = {
  /**
   * `/` không có trang riêng — chuyển thẳng về ngôn ngữ mặc định.
   * Dùng redirect ở tầng config thay vì proxy/middleware để trang vẫn tĩnh
   * hoàn toàn và không phát sinh function invocation trên Vercel.
   *
   * permanent: false để sau này đổi ngôn ngữ mặc định không bị trình duyệt
   * và Google nhớ vĩnh viễn cái cũ.
   */
  async redirects() {
    return [
      {
        source: "/",
        destination: `/${defaultLocale}`,
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
