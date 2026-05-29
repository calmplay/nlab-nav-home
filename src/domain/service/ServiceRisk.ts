/** 子路径反代风险等级 */
export const SERVICE_RISK_LEVELS = ["low", "medium", "high", "unknown"] as const;

export type ServiceRisk = (typeof SERVICE_RISK_LEVELS)[number];

export const RISK_LABELS: Record<ServiceRisk, string> = {
  low: "低风险",
  medium: "中风险",
  high: "高风险",
  unknown: "待验证",
};

export const RISK_DESCRIPTIONS: Record<ServiceRisk, string> = {
  low: "已验证可通过子路径反向代理",
  medium: "需确认子路径兼容性",
  high: "已知子路径不兼容，或涉及 WebSocket / 登录回调",
  unknown: "尚未验证",
};
