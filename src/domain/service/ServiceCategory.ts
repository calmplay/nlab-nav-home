/** 服务分类 */
export const SERVICE_CATEGORIES = [
  "network",
  "monitoring",
  "sync",
  "remote-management",
  "proxy",
  "system",
] as const;

export type ServiceCategory = (typeof SERVICE_CATEGORIES)[number];

/** 每个分类的中文显示名 */
export const CATEGORY_LABELS: Record<ServiceCategory, string> = {
  network: "网络与路由",
  monitoring: "监控与指标",
  sync: "文件同步",
  "remote-management": "远程管理",
  proxy: "代理与网关",
  system: "系统",
};
