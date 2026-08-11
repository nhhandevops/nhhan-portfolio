import type { Locale } from "@/i18n/config";

const intlLocale: Record<Locale, string> = {
  en: "en-US",
  vi: "vi-VN",
};

/**
 * "2024-01" -> "Jan 2024" / "01/2024".
 * Nhận cả chuỗi ISO đầy đủ.
 */
export function formatMonth(value: string, locale: Locale): string {
  const [year, month] = value.split("-");
  if (!year) return value;
  if (!month) return year;

  if (locale === "vi") return `${month}/${year}`;

  const date = new Date(Number(year), Number(month) - 1, 1);
  return new Intl.DateTimeFormat(intlLocale.en, {
    month: "short",
    year: "numeric",
  }).format(date);
}

/** "2024-01" + null -> "Jan 2024 — Present". */
export function formatPeriod(
  start: string,
  end: string | null,
  locale: Locale,
  presentLabel: string,
): string {
  return `${formatMonth(start, locale)} — ${end ? formatMonth(end, locale) : presentLabel}`;
}

/** Ngày tuyệt đối, dùng cho "Cập nhật <ngày>" ở section GitHub. */
export function formatDate(iso: string, locale: Locale): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;

  return new Intl.DateTimeFormat(intlLocale[locale], {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}

/** Nối class, bỏ qua giá trị rỗng. */
export function cx(...values: (string | false | null | undefined)[]): string {
  return values.filter(Boolean).join(" ");
}
