import type { SkillGroup } from "./types";

/**
 * Nguồn: mục "Core Skills" trong CV.
 * "Google Cloud" đã gộp vào "GCP" cho khỏi trùng.
 * IELTS chuyển sang src/data/certifications.ts, đúng chỗ hơn.
 */
export const skillGroups: SkillGroup[] = [
  {
    name: { en: "Cloud & Infrastructure", vi: "Cloud & Hạ tầng" },
    items: [
      "AWS",
      "GCP",
      "Cloudflare",
      "Linux",
      "Docker",
      "High Availability Architecture",
      "Backup Automation",
    ],
  },
  {
    name: { en: "Kubernetes & Delivery", vi: "Kubernetes & CI/CD" },
    items: [
      "Kubernetes",
      "EKS",
      "GKE",
      "KEDA",
      "Karpenter",
      "ArgoCD",
      "Jenkins",
      "GitLab CI",
      "AWS CodePipeline",
      "Harbor",
    ],
  },
  {
    name: { en: "Monitoring & Observability", vi: "Monitoring & Observability" },
    items: [
      "Prometheus",
      "Grafana",
      "Zabbix",
      "Uptime Kuma",
      "Health checks",
      "Alerting",
      "Operational logs",
    ],
  },
  {
    name: { en: "Networking & Security", vi: "Mạng & Bảo mật" },
    items: [
      "Netbird",
      "VPN Architecture",
      "Authentik",
      "Google OAuth2",
      "Nginx Proxy Manager",
      "HAProxy",
      "Security Groups",
      "NACLs",
      "GuardDuty",
      "Security Hub",
      "Detective",
    ],
  },
  {
    name: { en: "Data & Messaging", vi: "Dữ liệu & Messaging" },
    items: [
      "PostgreSQL",
      "Redis",
      "NocoDB",
      "Kafka",
      "RabbitMQ",
      "Trino",
      "StarRocks",
      "Elasticsearch",
      "Kibana",
    ],
  },
  {
    name: { en: "AI & Automation", vi: "AI & Tự động hoá" },
    items: ["Flowise", "n8n", "Google AI Studio", "Codex", "Claude", "MCP"],
  },
];
