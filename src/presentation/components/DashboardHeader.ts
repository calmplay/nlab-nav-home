import { DASHBOARD_TILES } from "../../infrastructure/dashboard/dashboardCatalog";

/**
 * 顶部标题栏 —— 标题 + 副标题 + 统计。
 */
export function createDashboardHeader(): HTMLElement {
  const header = document.createElement("header");
  header.className = "dashboard-header";

  // 左侧
  const left = document.createElement("div");
  left.className = "header-left";

  const h1 = document.createElement("h1");
  h1.className = "header-title";
  h1.textContent = "NLab 服务导航";
  left.appendChild(h1);

  const p = document.createElement("p");
  p.className = "header-subtitle";
  p.textContent = "统一入口 · 内部服务 · 本地维护";
  left.appendChild(p);

  header.appendChild(left);

  // 右侧统计
  const right = document.createElement("div");
  right.className = "header-stats";
  const stats = computeDashboardStats();
  right.appendChild(createEnvironmentBadge());
  right.appendChild(createStat(`${stats.entries}`, "entries"));
  right.appendChild(createDivider());
  right.appendChild(createStat(`${stats.gatewayTiles}`, "gateway tiles", "stat--ready"));
  header.appendChild(right);

  return header;
}

function createEnvironmentBadge(): HTMLElement {
  const badge = document.createElement("span");
  badge.className = "env-badge";

  const port = window.location.port;
  if (port === "1105") {
    badge.classList.add("env-badge--stable");
    badge.textContent = "1105 gateway";
    badge.title = "当前唯一的实验室服务导航入口";
  } else if (port === "") {
    badge.classList.add("env-badge--stable");
    badge.textContent = "gateway";
    badge.title = "生产网关入口";
  } else {
    badge.textContent = `${port} local`;
    badge.title = "本地或临时预览环境";
  }

  return badge;
}

function createStat(value: string, label: string, extraClass?: string): HTMLElement {
  const stat = document.createElement("span");
  stat.className = extraClass ? `stat ${extraClass}` : "stat";

  const strong = document.createElement("strong");
  strong.className = "stat-num";
  strong.textContent = value;
  stat.appendChild(strong);

  stat.append(" ", label);
  return stat;
}

function createDivider(): HTMLElement {
  const divider = document.createElement("span");
  divider.className = "stat-divider";
  return divider;
}

function computeDashboardStats(): { entries: number; gatewayTiles: number } {
  let entries = 0;
  let gatewayTiles = 0;

  for (const tile of DASHBOARD_TILES) {
    if (tile.id !== "plan") {
      gatewayTiles += 1;
    }

    if (tile.machines) {
      entries += tile.machines.length;
    } else if (tile.subTiles) {
      entries += tile.subTiles.length;
    } else if (tile.primaryAction?.enabled) {
      entries += 1;
    }
  }

  return { entries, gatewayTiles };
}
