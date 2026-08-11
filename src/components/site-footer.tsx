import { Container } from "@/components/ui/section";
import { profile } from "@/data/profile";
import type { Dictionary } from "@/i18n/dictionaries";

export function SiteFooter({ dict }: { dict: Dictionary }) {
  // Chạy lúc build/regenerate. Trang tự sinh lại mỗi giờ nên năm luôn đúng.
  const year = new Date().getFullYear();

  return (
    <footer className="border-t py-10">
      <Container>
        <div className="flex flex-col gap-2 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {profile.name}
          </p>
          <p>{dict.footer.builtWith}</p>
        </div>
      </Container>
    </footer>
  );
}
