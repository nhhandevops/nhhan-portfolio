import Image from "next/image";

import { Section } from "@/components/ui/section";
import { Tag, TagList } from "@/components/ui/tag";
import { projects } from "@/data/projects";
import { t, type Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";

export function ProjectsSection({
  locale,
  dict,
}: {
  locale: Locale;
  dict: Dictionary;
}) {
  return (
    <Section
      id="projects"
      title={dict.projects.title}
      subtitle={dict.projects.subtitle}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        {projects.map((project) => (
          <article
            key={project.name}
            className="flex flex-col overflow-hidden rounded-lg border bg-surface"
          >
            {project.cover ? (
              // aspect-video + fill: card cùng hàng luôn cao bằng nhau dù ảnh gốc
              // khác tỉ lệ, và không bị nhảy layout khi ảnh tải xong.
              <div className="relative aspect-video w-full border-b bg-background">
                <Image
                  src={project.cover.src}
                  alt={t(project.cover.alt, locale)}
                  fill
                  sizes="(min-width: 640px) 50vw, 100vw"
                  className="object-cover"
                />
              </div>
            ) : null}

            <div className="flex flex-1 flex-col p-5">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-base font-semibold">{project.name}</h3>
                <Tag emphasis>{dict.projects.status[project.status]}</Tag>
              </div>

              {project.period ? (
                <p className="mt-1 text-xs text-muted tabular-nums">
                  {t(project.period, locale)}
                </p>
              ) : null}

              <p className="mt-3 text-sm leading-relaxed text-pretty">
                {t(project.description, locale)}
              </p>

              {project.role ? (
                <p className="mt-2 text-sm text-muted">
                  {t(project.role, locale)}
                </p>
              ) : null}

              {project.highlights ? (
                <ul className="mt-3 space-y-1.5 text-sm leading-relaxed">
                  {t(project.highlights, locale).map((highlight) => (
                    <li key={highlight} className="flex gap-2.5">
                      <span
                        aria-hidden="true"
                        className="mt-2 size-1 shrink-0 rounded-full bg-muted"
                      />
                      <span className="text-pretty">{highlight}</span>
                    </li>
                  ))}
                </ul>
              ) : null}

              {/* mt-auto đẩy chân card xuống đáy để các card cùng hàng thẳng nhau. */}
              <div className="mt-auto pt-4">
                <TagList items={project.stack} />

                {project.links?.demo || project.links?.repo ? (
                  <div className="mt-3 flex flex-wrap gap-4 text-sm font-medium">
                    {project.links.demo ? (
                      <a
                        href={project.links.demo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-accent hover:underline"
                      >
                        {dict.projects.liveDemo}
                      </a>
                    ) : null}
                    {project.links.repo ? (
                      <a
                        href={project.links.repo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-accent hover:underline"
                      >
                        {dict.projects.sourceCode}
                      </a>
                    ) : null}
                  </div>
                ) : null}
              </div>
            </div>
          </article>
        ))}
      </div>
    </Section>
  );
}
