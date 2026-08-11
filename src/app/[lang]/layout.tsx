import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { notFound } from "next/navigation";

import { profile } from "@/data/profile";
import { site } from "@/data/site";
import { defaultLocale, htmlLang, isLocale, locales, t } from "@/i18n/config";

import "../globals.css";

const inter = Inter({
  subsets: ["latin", "vietnamese"],
  variable: "--font-inter",
  display: "swap",
});

/** Sinh sẵn cả /en và /vi lúc build — không có route động nào cần server. */
export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

/**
 * Chốt danh sách locale lại đúng những gì generateStaticParams trả về.
 *
 * Mặc định của Next là `true`, nghĩa là mọi đường dẫn một đoạn KHÔNG có trong danh
 * sách trên vẫn được render lúc có request rồi mới 404 — tức mỗi lần bot quét
 * /admin, /.env, /wp-login.php là một function invocation. Kể cả /favicon.ico cũng
 * khớp `[lang]` và rơi vào đây.
 *
 * `false` khiến chúng trả 404 tĩnh, không chạm tới server. Phải khai báo riêng ở
 * cả opengraph-image.tsx — thiết lập này KHÔNG lan từ layout sang route ảnh.
 */
export const dynamicParams = false;

export async function generateMetadata({
  params,
}: LayoutProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};

  const title = `${profile.name} — ${t(profile.headline, lang)}`;
  const description = t(profile.summary, lang);

  return {
    metadataBase: new URL(site.url),
    title,
    description,
    alternates: {
      canonical: `/${lang}`,
      // Báo cho Google biết hai bản dịch là cùng một trang.
      languages: {
        ...Object.fromEntries(
          locales.map((code) => [htmlLang[code], `/${code}`]),
        ),
        // Người xem không dùng en lẫn vi thì đưa về bản mặc định. Thiếu dòng này
        // Google tự đoán, và có thể đẩy recruiter nước ngoài vào bản tiếng Việt.
        "x-default": `/${defaultLocale}`,
      },
    },
    openGraph: {
      type: "profile",
      title,
      description,
      url: `/${lang}`,
      locale: lang === "vi" ? "vi_VN" : "en_US",
      siteName: profile.name,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

/**
 * Chạy trước khi trình duyệt vẽ khung hình đầu tiên, nên không bị nháy trắng
 * khi người dùng đã chọn giao diện tối.
 */
const themeScript = `
try {
  var stored = localStorage.getItem('theme');
  var isDark = stored
    ? stored === 'dark'
    : window.matchMedia('(prefers-color-scheme: dark)').matches;
  if (isDark) document.documentElement.classList.add('dark');
} catch (e) {}
`;

export default async function RootLayout({
  children,
  params,
}: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  return (
    <html
      lang={htmlLang[lang]}
      // Next 16 không còn tự ghi đè scroll-behavior khi điều hướng;
      // thuộc tính này bật lại hành vi cuộn tức thì giữa các trang.
      data-scroll-behavior="smooth"
      suppressHydrationWarning
      className={inter.variable}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="font-sans">{children}</body>
    </html>
  );
}
