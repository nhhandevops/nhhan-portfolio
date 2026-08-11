import type { MetadataRoute } from "next";

import { site } from "@/data/site";
import { htmlLang, locales } from "@/i18n/config";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return locales.map((lang) => ({
    url: `${site.url}/${lang}`,
    lastModified,
    changeFrequency: "weekly",
    priority: 1,
    alternates: {
      languages: Object.fromEntries(
        locales.map((code) => [htmlLang[code], `${site.url}/${code}`]),
      ),
    },
  }));
}
