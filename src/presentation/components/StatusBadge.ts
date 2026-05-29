import type { ServiceStatus } from "../../domain/service/Service";

const STATUS_LABELS: Record<ServiceStatus, string> = {
  online: "在线",
  degraded: "降级",
  unknown: "状态未知",
};

/**
 * 服务在线状态圆点。
 * online → 绿色 / degraded → 橙色 / unknown → 灰色
 */
export function createStatusDot(status: ServiceStatus): HTMLElement {
  const dot = document.createElement("span");
  dot.className = `status-dot ${status}`;
  dot.title = STATUS_LABELS[status];
  return dot;
}
