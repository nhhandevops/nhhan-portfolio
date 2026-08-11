import { Section } from "@/components/ui/section";
import { TagList } from "@/components/ui/tag";
import { skillGroups } from "@/data/skills";
import { t, type Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";

export function SkillsSection({
  locale,
  dict,
}: {
  locale: Locale;
  dict: Dictionary;
}) {
  return (
    <Section id="skills" title={dict.skills.title}>
      <dl className="space-y-6">
        {skillGroups.map((group) => (
          <div
            key={group.name.en}
            className="grid gap-2 sm:grid-cols-[10rem_1fr] sm:gap-6"
          >
            <dt className="text-sm font-medium text-muted">
              {t(group.name, locale)}
            </dt>
            <dd>
              <TagList items={group.items} />
            </dd>
          </div>
        ))}
      </dl>
    </Section>
  );
}
