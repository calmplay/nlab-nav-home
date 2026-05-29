import { DASHBOARD_TILES } from "../../infrastructure/dashboard/dashboardCatalog";
import { createDashboardTile } from "./DashboardTile";

/** 6 个 tile 的 CSS Grid 位置映射 */
const TILE_POSITIONS: Record<string, string> = {
  grafana:    "grid-column: 1 / 7; grid-row: 1 / 3;",
  clash:      "grid-column: 7 / 11; grid-row: 1 / 2;",
  remote:     "grid-column: 11 / 13; grid-row: 1 / 3;",
  prometheus: "grid-column: 7 / 11; grid-row: 2 / 3;",
  syncthing:  "grid-column: 1 / 7; grid-row: 3 / 4;",
  plan:       "grid-column: 7 / 13; grid-row: 3 / 4;",
};

/**
 * Bento 仪表盘网格 —— 按 12 列 × 3 行排版 6 个 tile。
 */
export function createDashboardGrid(): HTMLElement {
  const board = document.createElement("main");
  board.className = "dashboard-board";

  for (const config of DASHBOARD_TILES) {
    const tile = createDashboardTile(config);
    tile.setAttribute("style", TILE_POSITIONS[config.id] ?? "");
    board.appendChild(tile);
  }

  return board;
}
