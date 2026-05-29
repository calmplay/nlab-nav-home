import type { Service } from "../../domain/service/Service";

export interface BoardStats {
  total: number;
  available: number;
  planned: number;
}

/**
 * 顶部统计条：服务总数 / 可用 / 规划中。
 */
export function createBoardSummary(stats: BoardStats): HTMLElement {
  const bar = document.createElement("div");
  bar.className = "board-summary";

  bar.appendChild(summaryItem("online", `${stats.available} available`));
  bar.appendChild(summaryItem("", `${stats.planned} planned`));
  bar.appendChild(summaryItem("", `${stats.total} total`));

  return bar;
}

function summaryItem(dotClass: string, text: string): HTMLElement {
  const item = document.createElement("span");
  item.className = "summary-item";

  if (dotClass) {
    const dot = document.createElement("span");
    dot.className = `summary-dot status-dot ${dotClass}`;
    item.appendChild(dot);
  }

  const label = document.createElement("span");
  label.textContent = text;
  item.appendChild(label);

  return item;
}

/** 从服务列表计算统计信息 */
export function computeStats(services: Service[]): BoardStats {
  const total = services.length;
  const planned = services.filter(
    (s) => s.accessMode === "planned",
  ).length;
  const available = total - planned;

  return { total, available, planned };
}
