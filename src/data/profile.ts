import type { FocusArea, Profile } from "./types";

export const profile: Profile = {
  name: "Nguyễn Hữu Hoàng An",

  headline: {
    en: "Site Reliability Engineer / System Engineer",
    vi: "Site Reliability Engineer / System Engineer",
  },

  summary: {
    en: "System Engineer focused on cloud infrastructure, Linux systems, Docker-based platforms, and reliability engineering. I deploy and operate internal production services across AWS, GCP, and hybrid/on-prem environments — authentication, VPN connectivity, high-availability application stacks, monitoring, backup automation, and security alerting. Currently going deeper on Kubernetes and cloud-native operations, with hands-on EKS/GKE lab work using KEDA and Karpenter, and CI/CD across Jenkins, GitLab CI, AWS CodePipeline, and ArgoCD.",
    vi: "System Engineer tập trung vào hạ tầng cloud, hệ thống Linux, nền tảng chạy trên Docker và reliability engineering. Mình triển khai và vận hành các service nội bộ trên môi trường AWS, GCP và hybrid/on-prem — gồm authentication, kết nối VPN, application stack high-availability, monitoring, tự động hoá backup và cảnh báo bảo mật. Hiện đang đào sâu Kubernetes và vận hành cloud-native, với thực nghiệm EKS/GKE dùng KEDA và Karpenter, cùng CI/CD qua Jenkins, GitLab CI, AWS CodePipeline và ArgoCD.",
  },

  location: {
    en: "Ho Chi Minh City, Vietnam",
    vi: "TP. Hồ Chí Minh, Việt Nam",
  },

  email: "nguyenhuuhoangan2504@gmail.com",

  // Công khai theo yêu cầu của chủ trang (xác nhận 2026-08-11).
  phone: { display: "0907 683 363", tel: "+84907683363" },

  /*
   * Ảnh 340×340 — BẮT BUỘC phải vuông và cắt sát khuôn mặt.
   * hero.tsx render bằng `rounded-full object-cover`, tức trình duyệt cắt ô vuông ở
   * CHÍNH GIỮA ảnh. Thả ảnh chân dung dọc từ điện thoại vào là ô giữa rơi xuống ngực,
   * khung tròn 96px sẽ không thấy mặt. Đổi ảnh thì cắt vuông quanh mặt trước.
   *
   * Nhớ xoá EXIF trước khi đưa vào public/ — thư mục này là URL công khai, Google
   * index được, gỡ sau không thu hồi được bản đã bị lấy về. Cũng đừng để lọt người
   * lạ nhận diện được ở hậu cảnh.
   */
  avatar: "/avatar.jpg",

  links: {
    github: "https://github.com/nhhandevops",
    linkedin: "https://www.linkedin.com/in/nhhan/",
  },

  /*
   * Chỉ có một bản CV tiếng Anh nên cả hai ngôn ngữ cùng trỏ về nó.
   * Có bản tiếng Việt thì đặt vào public/cv/cv-vi.pdf rồi đổi dòng `vi`.
   *
   * Lưu ý: file này chứa số điện thoại — đã được đồng ý công khai (2026-08-11).
   * Google index được cả nội dung bên trong PDF, không chỉ tên file.
   */
  cv: {
    en: "/cv/cv-en.pdf",
    vi: "/cv/cv-en.pdf",
  },
};

/** Nguồn: mục "Selected Technical Focus" trong CV. */
export const focusAreas: FocusArea[] = [
  {
    label: { en: "Reliability", vi: "Độ tin cậy" },
    detail: {
      en: "Health checks, backup automation, alerting, operational logging, and stateless service design.",
      vi: "Health check, tự động hoá backup, cảnh báo, log vận hành và thiết kế service stateless.",
    },
  },
  {
    label: { en: "Cloud-native", vi: "Cloud-native" },
    detail: {
      en: "Docker, Kubernetes labs, autoscaling concepts, CI/CD, ArgoCD, and container registry workflows.",
      vi: "Docker, thực nghiệm Kubernetes, autoscaling, CI/CD, ArgoCD và quy trình container registry.",
    },
  },
  {
    label: { en: "Security", vi: "Bảo mật" },
    detail: {
      en: "Identity integration, VPN access control, cloud security services, and audit-friendly user management.",
      vi: "Tích hợp định danh, kiểm soát truy cập VPN, dịch vụ bảo mật cloud và quản lý người dùng dễ audit.",
    },
  },
  {
    label: { en: "Startup readiness", vi: "Phù hợp môi trường startup" },
    detail: {
      en: "Comfortable learning quickly, owning operational problems, and improving systems with limited process overhead.",
      vi: "Học nhanh, tự chịu trách nhiệm với sự cố vận hành, cải thiện hệ thống mà không cần nhiều quy trình.",
    },
  },
];
