import type { Project } from "./types";

/**
 * Các hệ thống nội bộ tại Antsomi — không có public repo nên không xuất hiện ở
 * section GitHub. Đây chính là phần "dự án đã và đang làm, vẫn tiếp tục giám sát".
 *
 * Thêm dự án mới = thêm một object vào mảng này rồi push. Không cần sửa component.
 */

const ownedRole = {
  en: "Design, deployment, and operations",
  vi: "Thiết kế, triển khai và vận hành",
};

const since2024 = { en: "2024 — present", vi: "2024 — nay" };

export const projects: Project[] = [
  {
    name: "Centralized Authentication with Google Workspace",
    description: {
      en: "Single sign-on layer for Antsomi's internal apps, built on Authentik and Google OAuth2 so the Infrastructure team stops creating accounts by hand.",
      vi: "Lớp đăng nhập tập trung cho các ứng dụng nội bộ của Antsomi, dựng trên Authentik và Google OAuth2 để nhóm Hạ tầng không phải tạo tài khoản thủ công nữa.",
    },
    role: ownedRole,
    stack: [
      "Docker",
      "Authentik",
      "Google Cloud",
      "Google OAuth2",
      "Nginx Proxy Manager",
      "PostgreSQL",
    ],
    status: "maintained",
    period: since2024,
    highlights: {
      en: [
        "Implemented centralized authentication with Authentik and Google OAuth2 to manage user access across internal apps and services.",
        "Integrated Google Workspace identities, removing repetitive user creation and simplifying access management for the Infrastructure team.",
        "Added daily backups, health checks, operational logging, and Google Chat alerts for authentication and authorization events.",
        "Improved visibility into user management and service health through clearer activity logging and notification workflows.",
      ],
      vi: [
        "Triển khai xác thực tập trung bằng Authentik và Google OAuth2 để quản lý quyền truy cập của người dùng trên toàn bộ ứng dụng nội bộ.",
        "Tích hợp danh tính Google Workspace, loại bỏ việc tạo tài khoản lặp đi lặp lại và đơn giản hoá quản lý truy cập cho nhóm Hạ tầng.",
        "Bổ sung backup hằng ngày, health check, log vận hành và cảnh báo qua Google Chat cho các sự kiện xác thực và phân quyền.",
        "Tăng khả năng quan sát tình trạng người dùng và service nhờ log hoạt động rõ ràng hơn và luồng thông báo tự động.",
      ],
    },
  },
  {
    name: "VPN Infrastructure with Netbird",
    description: {
      en: "A VPN platform connecting users to internal resources across local networks, data centers, AWS, and GCP-like environments — managed through a UI instead of hand-edited configs.",
      vi: "Nền tảng VPN kết nối người dùng tới tài nguyên nội bộ trải trên mạng nội bộ, data center, AWS và các môi trường tương tự GCP — quản lý qua giao diện thay vì sửa config bằng tay.",
    },
    role: ownedRole,
    stack: ["Docker", "Netbird", "Authentik", "Uptime Kuma", "PostgreSQL"],
    status: "maintained",
    period: since2024,
    highlights: {
      en: [
        "Built a manageable VPN platform with Netbird linking users and internal resources across local networks, data centers, AWS, and GCP-like environments.",
        "Integrated Authentik so users authenticate before reaching any VPN-protected resource.",
        "Implemented monitoring, automated backup lifecycle scripts, and Uptime Kuma checks for VPN-related services.",
        "Gave the Infrastructure team a UI-driven workflow that is easier to understand and maintain than manual configuration.",
      ],
      vi: [
        "Dựng nền tảng VPN quản lý được bằng Netbird, nối người dùng với tài nguyên nội bộ trải trên mạng nội bộ, data center, AWS và môi trường tương tự GCP.",
        "Tích hợp Authentik để người dùng phải xác thực trước khi chạm tới bất kỳ tài nguyên nào sau VPN.",
        "Triển khai monitoring, script tự động hoá vòng đời backup và health check bằng Uptime Kuma cho các service liên quan tới VPN.",
        "Đưa nhóm Hạ tầng sang quy trình vận hành qua giao diện, dễ hiểu và dễ bảo trì hơn so với cấu hình thủ công.",
      ],
    },
  },
  {
    name: "High-Availability Workflow Platform",
    description: {
      en: "n8n and Flowise deployed as a stateless stack behind HAProxy, letting data and analytics teams schedule workflows and run AI-assisted automation without waiting on engineering.",
      vi: "n8n và Flowise triển khai dạng stateless sau HAProxy, giúp nhóm dữ liệu và phân tích tự lên lịch workflow và chạy tự động hoá có AI hỗ trợ mà không phải chờ đội kỹ thuật.",
    },
    role: ownedRole,
    stack: [
      "Docker",
      "Docker Compose",
      "n8n",
      "Flowise",
      "HAProxy",
      "Authentik",
      "PostgreSQL",
    ],
    status: "maintained",
    period: since2024,
    highlights: {
      en: [
        "Deployed n8n and Flowise using a stateless Docker Compose architecture behind HAProxy.",
        "Separated application containers from persistent PostgreSQL and data layers to allow horizontal scaling and safer recovery.",
        "Integrated Authentik authentication and Netbird access controls for internal workflow services.",
        "Added database backup strategies and service-health monitoring to keep the platform dependable.",
        "Supported data and analytics teams with workflow scheduling, faster campaign and report execution, and AI-assisted automation.",
      ],
      vi: [
        "Triển khai n8n và Flowise theo kiến trúc Docker Compose stateless, đặt sau HAProxy.",
        "Tách container ứng dụng khỏi tầng PostgreSQL và dữ liệu bền vững để mở rộng ngang được và phục hồi an toàn hơn.",
        "Tích hợp xác thực Authentik và kiểm soát truy cập Netbird cho các service workflow nội bộ.",
        "Bổ sung chiến lược backup cơ sở dữ liệu và giám sát tình trạng service để nền tảng chạy ổn định.",
        "Hỗ trợ nhóm dữ liệu và phân tích lên lịch workflow, chạy chiến dịch/báo cáo nhanh hơn và tự động hoá có AI hỗ trợ.",
      ],
    },
  },
  {
    name: "Cloud Security, Cost, and Kubernetes Labs",
    description: {
      en: "Ongoing research track: hardening AWS accounts, putting cost alerts in place, and building experimental EKS/GKE clusters to grow Kubernetes operations depth toward CKA.",
      vi: "Mảng nghiên cứu đang tiếp diễn: siết bảo mật tài khoản AWS, dựng cảnh báo chi phí, và xây cluster EKS/GKE thử nghiệm để đào sâu vận hành Kubernetes, hướng tới chứng chỉ CKA.",
    },
    role: ownedRole,
    stack: [
      "AWS Security Hub",
      "GuardDuty",
      "Detective",
      "AWS Config",
      "EKS",
      "GKE",
      "KEDA",
      "Karpenter",
      "Google AI Studio",
    ],
    status: "active",
    period: since2024,
    highlights: {
      en: [
        "Researched and implemented AWS security services including Security Groups, NACLs, GuardDuty, Security Hub, Detective, and AWS Config.",
        "Set up cloud notifications and account-level cost alerts across AWS and GCP accounts.",
        "Designed experimental EKS/GKE clusters with autoscaling driven by KEDA and Karpenter.",
        "Explored AWS Marketplace delivery with the team for bringing products to market.",
        "Used Google AI Studio and other AI tooling to handle support requests coming from non-engineering teams.",
      ],
      vi: [
        "Nghiên cứu và triển khai các dịch vụ bảo mật AWS: Security Groups, NACLs, GuardDuty, Security Hub, Detective và AWS Config.",
        "Thiết lập thông báo cloud và cảnh báo chi phí ở cấp tài khoản cho cả AWS lẫn GCP.",
        "Thiết kế cluster EKS/GKE thử nghiệm với autoscaling điều khiển bằng KEDA và Karpenter.",
        "Cùng nhóm tìm hiểu kênh phân phối AWS Marketplace để đưa sản phẩm ra thị trường.",
        "Dùng Google AI Studio và các công cụ AI khác để xử lý yêu cầu hỗ trợ từ các nhóm không làm kỹ thuật.",
      ],
    },
  },
];
