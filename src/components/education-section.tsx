import { Section } from "@/components/ui/section";
import { certifications, education } from "@/data/education";
import { t, type Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { formatMonth, formatPeriod } from "@/lib/format";

export function EducationSection({
  locale,
  dict,
}: {
  locale: Locale;
  dict: Dictionary;
}) {
  return (
    <Section id="education" title={dict.education.title}>
      <ul className="space-y-6">
        {education.map((item) => (
          <li key={item.school}>
            <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
              <h3 className="text-base font-semibold">{item.school}</h3>
              {/* CV có thể không ghi năm học — bỏ trống thì không hiện mốc nào. */}
              {item.start ? (
                <p className="text-sm text-muted tabular-nums">
                  {formatPeriod(
                    item.start,
                    item.end ?? null,
                    locale,
                    dict.experience.present,
                  )}
                </p>
              ) : null}
            </div>

            {item.degree ? (
              <p className="mt-1 text-sm">{t(item.degree, locale)}</p>
            ) : null}

            {item.location ? (
              <p className="mt-1 text-sm text-muted">
                {t(item.location, locale)}
              </p>
            ) : null}

            {item.note ? (
              <p className="mt-1 text-sm text-muted text-pretty">
                {t(item.note, locale)}
              </p>
            ) : null}
          </li>
        ))}
      </ul>

      {certifications.length > 0 ? (
        <div className="mt-10 border-t pt-8">
          <h3 className="text-sm font-medium text-muted">
            {dict.education.certifications}
          </h3>
          <ul className="mt-4 space-y-3">
            {certifications.map((cert) => (
              <li
                key={cert.name}
                className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1"
              >
                <p className="text-sm">
                  {cert.url ? (
                    <a
                      href={cert.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-accent hover:underline"
                    >
                      {cert.name}
                    </a>
                  ) : (
                    <span className="font-medium">{cert.name}</span>
                  )}
                  {cert.issuer ? (
                    <span className="text-muted"> · {cert.issuer}</span>
                  ) : null}
                </p>
                <p className="text-sm text-muted tabular-nums">
                  {formatMonth(cert.date, locale)}
                </p>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </Section>
  );
}
