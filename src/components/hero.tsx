import Image from "next/image";

import { Container } from "@/components/ui/section";
import { focusAreas, profile } from "@/data/profile";
import { t, type Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";

export function Hero({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const cvHref = profile.cv[locale];

  return (
    <section id="top" className="py-16 sm:py-24">
      <Container>
        <div className="flex flex-col gap-8 sm:flex-row sm:items-center">
          {profile.avatar ? (
            <Image
              src={profile.avatar}
              alt={profile.name}
              width={112}
              height={112}
              priority
              className="size-24 shrink-0 rounded-full border object-cover sm:size-28"
            />
          ) : null}

          <div className="min-w-0">
            <p className="text-sm font-medium text-accent">
              {t(profile.headline, locale)}
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
              {profile.name}
            </h1>
            <p className="mt-1 text-sm text-muted">
              {t(profile.location, locale)}
            </p>
          </div>
        </div>

        <p className="mt-8 max-w-2xl text-base leading-relaxed text-pretty">
          {t(profile.summary, locale)}
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          {profile.email ? (
            <a
              href={`mailto:${profile.email}`}
              className="inline-flex items-center rounded-md bg-accent px-4 py-2.5 text-sm font-medium text-accent-contrast transition-opacity hover:opacity-90"
            >
              {dict.hero.contactCta}
            </a>
          ) : null}

          {cvHref ? (
            <a
              href={cvHref}
              download
              className="inline-flex items-center rounded-md border bg-surface px-4 py-2.5 text-sm font-medium transition-colors hover:border-accent"
            >
              {dict.hero.resumeCta}
            </a>
          ) : null}
        </div>

        {/*
          Khối "Trọng tâm" nằm ngay đầu trang thay vì thành một section riêng —
          tránh làm thanh nav dài thêm trong khi nội dung chỉ có 4 dòng.
        */}
        {focusAreas.length > 0 ? (
          <div className="mt-12 rounded-lg border bg-surface p-5 sm:p-6">
            <h2 className="text-sm font-medium text-muted">
              {dict.hero.focusTitle}
            </h2>
            <dl className="mt-4 grid gap-4 sm:grid-cols-2">
              {focusAreas.map((area) => (
                <div key={area.label.en}>
                  <dt className="text-sm font-semibold">
                    {t(area.label, locale)}
                  </dt>
                  <dd className="mt-1 text-sm leading-relaxed text-muted text-pretty">
                    {t(area.detail, locale)}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        ) : null}
      </Container>
    </section>
  );
}
