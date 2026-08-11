import type { Experience } from "./types";

/** Sắp xếp mới nhất lên đầu. `end: null` nghĩa là đang làm. */
export const experiences: Experience[] = [
  {
    company: "Antsomi",
    role: { en: "System Engineer", vi: "System Engineer" },
    // CV chỉ ghi "2024 – Present", không có tháng — để năm không thì hiển thị "2024".
    start: "2024",
    end: null,
    location: { en: "Ho Chi Minh City, Vietnam", vi: "TP. Hồ Chí Minh, Việt Nam" },
    domain: {
      en: "Marketing technology — customer data platform for personalized marketing",
      vi: "Marketing technology — nền tảng dữ liệu khách hàng cho marketing cá nhân hoá",
    },
    stack: [
      "AWS",
      "GCP",
      "Linux",
      "Docker",
      "PostgreSQL",
      "Authentik",
      "Netbird",
      "HAProxy",
      "Uptime Kuma",
    ],
    highlights: {
      en: [
        "Build and operate internal infrastructure services covering authentication, VPN access, workflow automation, monitoring, backups, and cloud security research.",
        "Deploy Docker-based services with attention to high availability, recovery, operational visibility, and secure access control.",
        "Work with infrastructure, data, and business teams to cut manual operations and improve the reliability of internal services.",
      ],
      vi: [
        "Xây dựng và vận hành các service hạ tầng nội bộ: authentication, truy cập VPN, tự động hoá workflow, monitoring, backup và nghiên cứu bảo mật cloud.",
        "Triển khai service trên Docker với trọng tâm là high availability, khả năng phục hồi, khả năng quan sát vận hành và kiểm soát truy cập an toàn.",
        "Phối hợp với các nhóm hạ tầng, dữ liệu và kinh doanh để giảm thao tác thủ công và tăng độ tin cậy của service nội bộ.",
      ],
    },
  },
];
