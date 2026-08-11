import { Section } from "@/components/ui/section";
import { TagList } from "@/components/ui/tag";
import { experiences } from "@/data/experience";
import { t, type Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { formatPeriod } from "@/lib/format";

export function ExperienceSection({
  locale,
  dict,
}: {
  locale: Locale;
  dict: Dictionary;
}) {
  return (
    <Section id="experience" title={dict.experience.title}>
      <ol className="space-y-10">
        {experiences.map((item) => (
          <li
            key={`${item.company}-${item.start}`}
            className="relative border-l pl-6"
          >
            {/* Chấm mốc thời gian trên đường kẻ dọc. */}
            <span
              aria-hidden="true"
              className="absolute -left-[4.5px] top-1.5 size-2 rounded-full bg-accent"
            />

            <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
              <h3 className="text-base font-semibold">
                {t(item.role, locale)}
                <span className="text-muted"> · </span>
                {item.companyUrl ? (
                  <a
                    href={item.companyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent hover:underline"
                  >
                    {item.company}
                  </a>
                ) : (
                  <span>{item.company}</span>
                )}
              </h3>
              <p className="text-sm text-muted tabular-nums">
                {formatPeriod(
                  item.start,
                  item.end,
                  locale,
                  dict.experience.present,
                )}
              </p>
            </div>

            {item.location ? (
              <p className="mt-1 text-sm text-muted">
                {t(item.location, locale)}
              </p>
            ) : null}

            {item.domain ? (
              <p className="mt-2 text-sm text-muted text-pretty">
                {t(item.domain, locale)}
              </p>
            ) : null}

            <ul className="mt-4 space-y-2 text-sm leading-relaxed">
              {t(item.highlights, locale).map((highlight) => (
                <li key={highlight} className="flex gap-2.5">
                  <span aria-hidden="true" className="mt-2 size-1 shrink-0 rounded-full bg-muted" />
                  <span className="text-pretty">{highlight}</span>
                </li>
              ))}
            </ul>

            {item.stack.length > 0 ? (
              <div className="mt-4">
                <TagList items={item.stack} />
              </div>
            ) : null}
          </li>
        ))}
      </ol>
    </Section>
  );
}
