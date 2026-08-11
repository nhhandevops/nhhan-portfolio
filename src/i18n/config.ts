export const locales = ["en", "vi"] as const;

export type Locale = (typeof locales)[number];

/** Ngôn ngữ mặc định — `/` sẽ redirect về đây (xem next.config.ts). */
export const defaultLocale: Locale = "en";

export const localeLabels: Record<Locale, string> = {
  en: "EN",
  vi: "VI",
};

/** Dùng cho thẻ <html lang> và hreflang. */
export const htmlLang: Record<Locale, string> = {
  en: "en",
  vi: "vi",
};

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

/**
 * Một giá trị có hai bản dịch. Toàn bộ nội dung trong src/data dùng kiểu này,
 * nên khi thêm nội dung mới TypeScript sẽ báo lỗi nếu bạn quên một ngôn ngữ.
 */
export type Localized<T = string> = Record<Locale, T>;

/** Lấy bản dịch theo locale. */
export function t<T>(value: Localized<T>, locale: Locale): T {
  return value[locale];
}
