import { ImageResponse } from "next/og";

import { profile } from "@/data/profile";
import { defaultLocale, isLocale, locales, t } from "@/i18n/config";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = profile.name;

/**
 * Bắt buộc khai báo lại ở đây: route ảnh metadata KHÔNG kế thừa
 * generateStaticParams của layout. Thiếu nó thì ảnh bị render động,
 * tức mỗi lượt scrape link lại tốn một function invocation.
 */
export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

/**
 * Ảnh preview khi dán link lên LinkedIn, Zalo, Messenger, Slack.
 * Sinh lúc build nên không tốn gì khi chạy.
 *
 * Next 16: `params` của các hàm sinh ảnh giờ là Promise (breaking change từ v15).
 */
export default async function Image({
  params,
}: {
  // Next chỉ sinh sẵn helper toàn cục cho PageProps/LayoutProps/RouteContext,
  // không có ImageProps — nên khai báo tay.
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const locale = isLocale(lang) ? lang : defaultLocale;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          backgroundColor: "#0b0f19",
          color: "#e6edf7",
        }}
      >
        <div
          style={{
            width: "72px",
            height: "6px",
            backgroundColor: "#60a5fa",
            borderRadius: "3px",
          }}
        />
        <div
          style={{
            marginTop: "40px",
            fontSize: "76px",
            fontWeight: 700,
            letterSpacing: "-0.02em",
          }}
        >
          {profile.name}
        </div>
        <div style={{ marginTop: "20px", fontSize: "38px", color: "#60a5fa" }}>
          {t(profile.headline, locale)}
        </div>
        <div style={{ marginTop: "16px", fontSize: "28px", color: "#94a3b8" }}>
          {t(profile.location, locale)}
        </div>
      </div>
    ),
    size,
  );
}
