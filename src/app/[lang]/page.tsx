import { notFound } from "next/navigation";

import { ContactSection } from "@/components/contact-section";
import { EducationSection } from "@/components/education-section";
import { ExperienceSection } from "@/components/experience-section";
import { GitHubSection } from "@/components/github-section";
import { Hero } from "@/components/hero";
import { ProjectsSection } from "@/components/projects-section";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { SkillsSection } from "@/components/skills-section";
import { education } from "@/data/education";
import { experiences } from "@/data/experience";
import { projects } from "@/data/projects";
import { skillGroups } from "@/data/skills";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { getGitHubRepos } from "@/lib/github";

/**
 * Trang được prerender thành HTML tĩnh và tự sinh lại tối đa mỗi giờ.
 * Đây là cơ chế giữ cho phần GitHub luôn mới mà không cần deploy lại,
 * đồng thời người xem vẫn được phục vụ từ CDN (không tốn function invocation).
 */
export const revalidate = 3600;

export default async function HomePage({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  const dict = getDictionary(lang);
  const github = await getGitHubRepos();

  // Section GitHub tự ẩn khi chưa cấu hình username/token, nên nav phải khớp.
  const showGitHub = github.ok || github.reason === "request-failed";

  const sections = [
    experiences.length > 0 && { id: "experience", label: dict.nav.experience },
    education.length > 0 && { id: "education", label: dict.nav.education },
    skillGroups.length > 0 && { id: "skills", label: dict.nav.skills },
    projects.length > 0 && { id: "projects", label: dict.nav.projects },
    showGitHub && { id: "github", label: dict.nav.github },
    { id: "contact", label: dict.nav.contact },
  ].filter((section) => section !== false);

  return (
    <>
      <SiteHeader locale={lang} dict={dict} sections={sections} />

      {/*
        id="content" là đích của skip link trong site-header.tsx.

        tabIndex={-1} là bắt buộc, không phải cho đẹp: <main> vốn không nhận
        focus được, nên nếu thiếu nó thì ở Safari bấm skip link xong trang có
        cuộn nhưng con trỏ bàn phím vẫn kẹt lại ở header — tab tiếp là quay về
        đúng chỗ cũ. -1 nghĩa là chỉ focus bằng script/fragment, không chen thêm
        một điểm dừng vào thứ tự tab.
      */}
      <main id="content" tabIndex={-1} className="focus:outline-none">
        <Hero locale={lang} dict={dict} />

        {experiences.length > 0 ? (
          <ExperienceSection locale={lang} dict={dict} />
        ) : null}

        {education.length > 0 ? (
          <EducationSection locale={lang} dict={dict} />
        ) : null}

        {skillGroups.length > 0 ? (
          <SkillsSection locale={lang} dict={dict} />
        ) : null}

        {projects.length > 0 ? (
          <ProjectsSection locale={lang} dict={dict} />
        ) : null}

        <GitHubSection locale={lang} dict={dict} result={github} />

        <ContactSection locale={lang} dict={dict} />
      </main>

      <SiteFooter dict={dict} />
    </>
  );
}
