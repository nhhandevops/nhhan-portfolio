import { Section } from "@/components/ui/section";
import { profile } from "@/data/profile";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";

type ContactLink = { label: string; href: string };

export function ContactSection({ dict }: { locale: Locale; dict: Dictionary }) {
  const links: ContactLink[] = [];

  if (profile.links.github) {
    links.push({ label: "GitHub", href: profile.links.github });
  }
  if (profile.links.linkedin) {
    links.push({ label: "LinkedIn", href: profile.links.linkedin });
  }
  if (profile.links.website) {
    links.push({ label: "Website", href: profile.links.website });
  }

  return (
    <Section
      id="contact"
      title={dict.contact.title}
      subtitle={dict.contact.subtitle}
    >
      <dl className="space-y-4 text-sm">
        {profile.email ? (
          <div className="flex flex-wrap items-baseline gap-x-4">
            <dt className="w-20 shrink-0 text-muted">
              {dict.contact.emailLabel}
            </dt>
            <dd>
              <a
                href={`mailto:${profile.email}`}
                className="font-medium text-accent break-all hover:underline"
              >
                {profile.email}
              </a>
            </dd>
          </div>
        ) : null}

        {profile.phone ? (
          <div className="flex flex-wrap items-baseline gap-x-4">
            <dt className="w-20 shrink-0 text-muted">
              {dict.contact.phoneLabel}
            </dt>
            <dd>
              {/* Link E.164 để gọi được cả từ nước ngoài; hiển thị dạng nội địa. */}
              <a
                href={`tel:${profile.phone.tel}`}
                className="font-medium text-accent hover:underline"
              >
                {profile.phone.display}
              </a>
            </dd>
          </div>
        ) : null}

        {links.map((link) => (
          <div key={link.label} className="flex flex-wrap items-baseline gap-x-4">
            <dt className="w-20 shrink-0 text-muted">{link.label}</dt>
            <dd>
              <a
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-accent break-all hover:underline"
              >
                {link.href.replace(/^https?:\/\//, "")}
              </a>
            </dd>
          </div>
        ))}
      </dl>
    </Section>
  );
}
