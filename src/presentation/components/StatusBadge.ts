import type { ServiceStatus } from "../../domain/service/Service";

/**
 * 服务在线状态小圆点。
 * - online   → 绿色
 * - degraded → 橙色
 * - unknown  → 灰色
 */
export function createStatusBadge(status: ServiceStatus): HTMLElement {
  const dot = document.createElement("span");
  dot.className = `status-badge ${status}`;
  dot.title =
    status === "online"
      ? "在线"
      : status === "degraded"
        ? "降级"
        : "状态未知";
  return dot;
}
