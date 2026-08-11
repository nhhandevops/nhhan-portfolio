import type { Certification, Education } from "./types";

export const education: Education[] = [
  {
    school: "VNUHCM — University of Science",
    degree: {
      en: "Bachelor of Information Technology",
      vi: "Cử nhân Công nghệ Thông tin",
    },
    // Chỉ có năm, không có tháng — hiển thị "2019 — 2023".
    start: "2019",
    end: "2023",
    location: {
      en: "Ho Chi Minh City, Vietnam",
      vi: "TP. Hồ Chí Minh, Việt Nam",
    },
  },
];

export const certifications: Certification[] = [
  {
    name: "AWS Certified Solutions Architect",
    issuer: "Amazon Web Services",
    date: "2024-08",
  },
  {
    name: "IELTS Academic 6.0",
    issuer: "British Council / IDP",
    date: "2022",
  },
];
