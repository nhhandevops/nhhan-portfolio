import type { Localized } from "@/i18n/config";

export type Profile = {
  /** Tên hiển thị. Không dịch. */
  name: string;
  /** Chức danh ngắn. Giữ nguyên tiếng Anh ở cả hai bản — recruiter tìm theo từ này. */
  headline: Localized;
  /** Đoạn giới thiệu 3–4 câu cho phần đầu trang. */
  summary: Localized;
  location: Localized;
  /** Email công khai. Để chuỗi rỗng nếu không muốn hiện. */
  email: string;
  /**
   * Số điện thoại công khai. Để `null` nếu không muốn hiện.
   * `display` là dạng hiển thị, `tel` là dạng E.164 cho link bấm-gọi
   * (dùng +84 để recruiter ở nước ngoài gọi được).
   */
  phone: { display: string; tel: string } | null;
  /** Ảnh đại diện trong public/, ví dụ "/avatar.jpg". Để null nếu chưa có. */
  avatar: string | null;
  links: {
    github?: string;
    linkedin?: string;
    website?: string;
  };
  /**
   * Đường dẫn file CV trong public/. Dùng BẢN ĐÃ XOÁ số điện thoại / địa chỉ nhà,
   * vì file trong public/ ai cũng tải được và Google index được cả nội dung PDF.
   * Để null nếu chưa muốn cho tải.
   */
  cv: Localized<string | null>;
};

/** Định hướng chuyên môn — hiện ở đầu trang, ngay dưới đoạn giới thiệu. */
export type FocusArea = {
  label: Localized;
  detail: Localized;
};

export type Experience = {
  company: string;
  role: Localized;
  /** "YYYY-MM" hoặc chỉ "YYYY" nếu CV không ghi tháng. */
  start: string;
  /** Cùng định dạng, hoặc null nếu đang làm. */
  end: string | null;
  location?: Localized;
  /** Lĩnh vực của công ty — giúp người đọc hiểu bối cảnh hệ thống. */
  domain?: Localized;
  /** Tên công nghệ giữ nguyên, không dịch. */
  stack: string[];
  highlights: Localized<string[]>;
  companyUrl?: string;
};

export type SkillGroup = {
  name: Localized;
  items: string[];
};

export type ProjectStatus = "active" | "maintained" | "completed";

export type Project = {
  name: string;
  description: Localized;
  /** Vai trò của bạn trong dự án. Bỏ qua nếu là dự án cá nhân. */
  role?: Localized;
  stack: string[];
  highlights?: Localized<string[]>;
  status: ProjectStatus;
  period?: Localized;
  links?: {
    demo?: string;
    repo?: string;
  };
  /**
   * Ảnh minh hoạ hệ thống — cách duy nhất để khoe công việc không có public repo.
   * Đặt file vào `public/projects/`, `src` là đường dẫn từ gốc, ví dụ
   * "/projects/netbird-dashboard.png".
   *
   * ⚠️ CHE HẾT DỮ LIỆU NHẠY CẢM TRƯỚC KHI ĐƯA LÊN: tên khách hàng, email nhân viên,
   * hostname/IP nội bộ, token, số liệu kinh doanh. Ảnh trong `public/` là URL công
   * khai và Google index được — xoá khỏi trang sau đó cũng không gỡ được bản đã bị
   * thu thập. Nếu không chắc công ty cho phép, dùng sơ đồ kiến trúc tự vẽ thay vì
   * ảnh chụp màn hình thật.
   */
  cover?: {
    src: string;
    alt: Localized;
  };
};

export type Education = {
  school: string;
  /** Không bắt buộc: nhiều CV không ghi tên bằng cụ thể. */
  degree?: Localized;
  /** "YYYY-MM" hoặc "YYYY". Bỏ trống thì không hiện mốc thời gian. */
  start?: string;
  end?: string | null;
  location?: Localized;
  note?: Localized;
};

export type Certification = {
  name: string;
  /** "YYYY-MM" hoặc "YYYY". */
  date: string;
  issuer?: string;
  /** Link tới trang xác thực chứng chỉ, nếu có. */
  url?: string;
};
