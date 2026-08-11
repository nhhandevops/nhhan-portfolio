import Link from "next/link";

import { ThemeToggle } from "@/components/theme-toggle";
import { Container } from "@/components/ui/section";
import { profile } from "@/data/profile";
import { localeLabels, locales, type Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { cx } from "@/lib/format";

type Props = {
  locale: Locale;
  dict: Dictionary;
  /** Chỉ hiện link tới các section thực sự được render. */
  sections: { id: string; label: string }[];
};

export function SiteHeader({ locale, dict, sections }: Props) {
  return (
    <header className="sticky top-0 z-50 border-b bg-background/85 backdrop-blur-sm">
      <Container>
        <div className="flex h-16 items-center justify-between gap-4">
          <a
            href="#top"
            className="shrink-0 text-sm font-semibold tracking-tight"
          >
            {profile.name}
          </a>

          {/*
            Dưới md không hiện nav: trang chỉ có một cột và khá ngắn, cuộn tay
            nhanh hơn là mở menu. Tránh luôn phần JS của hamburger.
          */}
          <nav
            aria-label={dict.nav.sections}
            className="hidden md:block"
          >
            <ul className="flex items-center gap-5 text-sm text-muted">
              {sections.map((section) => (
                <li key={section.id}>
                  <a
                    href={`#${section.id}`}
                    className="transition-colors hover:text-foreground"
                  >
                    {section.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex shrink-0 items-center gap-2">
            <div
              className="flex items-center rounded-md border bg-surface p-0.5"
              role="group"
              aria-label={dict.language.switch}
            >
              {locales.map((code) => (
                <Link
                  key={code}
                  href={`/${code}`}
                  hrefLang={code}
                  aria-current={code === locale ? "true" : undefined}
                  className={cx(
                    "rounded px-2 py-1 text-xs font-medium transition-colors",
                    code === locale
                      ? "bg-accent text-accent-contrast"
                      : "text-muted hover:text-foreground",
                  )}
                >
                  {localeLabels[code]}
                </Link>
              ))}
            </div>

            <ThemeToggle label={dict.theme.toggle} />
          </div>
        </div>
      </Container>
    </header>
  );
}
