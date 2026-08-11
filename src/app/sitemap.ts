import type { MetadataRoute } from "next";

import { site } from "@/data/site";
import { defaultLocale, htmlLang, locales } from "@/i18n/config";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return locales.map((lang) => ({
    url: `${site.url}/${lang}`,
    lastModified,
    changeFrequency: "weekly",
    priority: 1,
    alternates: {
      // Giữ khớp với alternates.languages trong [lang]/layout.tsx — sửa một bên
      // mà quên bên kia là Google nhận hai tín hiệu hreflang mâu thuẫn.
      languages: {
        ...Object.fromEntries(
          locales.map((code) => [htmlLang[code], `${site.url}/${code}`]),
        ),
        "x-default": `${site.url}/${defaultLocale}`,
      },
    },
  }));
}
