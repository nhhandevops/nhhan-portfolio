import type { Locale } from "./config";

/**
 * Chỉ chứa chữ của phần khung giao diện (nav, tiêu đề section, nút bấm).
 * Nội dung thật (kinh nghiệm, kỹ năng, project) nằm trong src/data.
 *
 * `en` là nguồn chuẩn: kiểu Dictionary suy ra từ nó, nên nếu `vi` thiếu key nào
 * thì TypeScript báo lỗi ngay khi build.
 */
const en = {
  nav: {
    // Tên của vùng <nav> cho trình đọc màn hình, không hiện ra mắt thường.
    sections: "Page sections",
    // Chỉ hiện khi người dùng bàn phím tab tới. Bấm là nhảy thẳng vào <main>.
    skipToContent: "Skip to content",
    experience: "Experience",
    education: "Education",
    skills: "Skills",
    projects: "Projects",
    github: "GitHub",
    contact: "Contact",
  },
  hero: {
    contactCta: "Get in touch",
    resumeCta: "Download CV",
    focusTitle: "Focus",
  },
  experience: {
    title: "Experience",
    present: "Present",
  },
  education: {
    title: "Education & Certifications",
    certifications: "Certifications",
  },
  skills: {
    title: "Skills",
  },
  projects: {
    title: "Selected Projects",
    subtitle: "Work I picked out, including projects not public on GitHub.",
    liveDemo: "Live demo",
    sourceCode: "Source",
    status: {
      active: "In progress",
      maintained: "Maintained",
      completed: "Completed",
    },
  },
  github: {
    title: "GitHub Activity",
    subtitle: "Pulled straight from GitHub and refreshed every hour.",
    pinned: "Pinned",
    updated: "Updated",
    stars: "stars",
    viewProfile: "View full profile on GitHub",
    unavailable:
      "Could not load repositories from GitHub right now. Please check the profile directly.",
  },
  contact: {
    title: "Contact",
    subtitle: "Open to new opportunities — feel free to reach out.",
    emailLabel: "Email",
    phoneLabel: "Phone",
  },
  footer: {
    builtWith: "Built with Next.js and Tailwind CSS.",
  },
  theme: {
    toggle: "Toggle theme",
  },
  language: {
    switch: "Switch language",
  },
};

/**
 * Không dùng `as const`: nếu để literal type thì bản `vi` sẽ bị bắt phải trùng
 * đúng từng chuỗi tiếng Anh. Ở đây chỉ cần khớp cấu trúc key.
 */
export type Dictionary = typeof en;

/** Bản tiếng Việt phải khớp đúng cấu trúc của `en`. */
const vi: Dictionary = {
  nav: {
    sections: "Điều hướng trang",
    skipToContent: "Tới nội dung chính",
    experience: "Kinh nghiệm",
    education: "Học vấn",
    skills: "Kỹ năng",
    projects: "Dự án",
    github: "GitHub",
    contact: "Liên hệ",
  },
  hero: {
    contactCta: "Liên hệ với mình",
    resumeCta: "Tải CV",
    focusTitle: "Trọng tâm",
  },
  experience: {
    title: "Kinh nghiệm",
    present: "Hiện tại",
  },
  education: {
    title: "Học vấn & Chứng chỉ",
    certifications: "Chứng chỉ",
  },
  skills: {
    title: "Kỹ năng",
  },
  projects: {
    title: "Dự án tiêu biểu",
    subtitle: "Các dự án mình chọn lọc, gồm cả dự án không công khai trên GitHub.",
    liveDemo: "Xem thử",
    sourceCode: "Mã nguồn",
    status: {
      active: "Đang làm",
      maintained: "Đang duy trì",
      completed: "Đã hoàn thành",
    },
  },
  github: {
    title: "Hoạt động GitHub",
    subtitle: "Lấy trực tiếp từ GitHub, tự cập nhật mỗi giờ.",
    pinned: "Đã ghim",
    updated: "Cập nhật",
    stars: "sao",
    viewProfile: "Xem toàn bộ trên GitHub",
    unavailable:
      "Hiện chưa tải được danh sách repository từ GitHub. Bạn có thể xem trực tiếp trên trang cá nhân.",
  },
  contact: {
    title: "Liên hệ",
    subtitle: "Mình đang sẵn sàng cho cơ hội mới — cứ nhắn cho mình nhé.",
    emailLabel: "Email",
    phoneLabel: "Điện thoại",
  },
  footer: {
    builtWith: "Xây dựng bằng Next.js và Tailwind CSS.",
  },
  theme: {
    toggle: "Đổi giao diện sáng/tối",
  },
  language: {
    switch: "Đổi ngôn ngữ",
  },
};

const dictionaries: Record<Locale, Dictionary> = { en, vi };

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}
