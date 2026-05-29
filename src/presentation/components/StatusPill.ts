import type { TileStatus } from "../../infrastructure/dashboard/dashboardCatalog";

const LABELS: Record<TileStatus, string> = {
  ready: "就绪",
  planned: "计划接入",
  jump: "跳转可用",
};

export function createStatusPill(status: TileStatus): HTMLElement {
  const pill = document.createElement("span");
  pill.className = `status-pill status-pill--${status}`;
  pill.textContent = LABELS[status];
  return pill;
}
