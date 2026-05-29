import type { DashboardTileConfig } from "../../infrastructure/dashboard/dashboardCatalog";
import { createStatusPill } from "./StatusPill";
import { createQuickActionButton } from "./QuickActionButton";
import { createMachineButtonGroup } from "./MachineButtonGroup";
import { createPlanList } from "./PlanList";

/**
 * 通用 Bento tile 容器。
 * 根据 variant 渲染不同内部结构：hero / group / stack / tool / plan。
 */
export function createDashboardTile(config: DashboardTileConfig): HTMLElement {
  const tile = document.createElement("section");
  tile.className = `tile tile--${config.variant} tile--${config.accent} tile-${config.id}`;

  // ── 头部：标题 + 副标题 + 状态 ──
  const head = document.createElement("div");
  head.className = "tile-head";

  const headLeft = document.createElement("div");
  headLeft.className = "tile-head-left";

  const title = document.createElement("h2");
  title.className = "tile-title";
  title.textContent = config.title;
  headLeft.appendChild(title);

  const subtitle = document.createElement("p");
  subtitle.className = "tile-subtitle";
  subtitle.textContent = config.subtitle;
  headLeft.appendChild(subtitle);

  head.appendChild(headLeft);
  head.appendChild(createStatusPill(config.status));
  tile.appendChild(head);

  // ── 主体：按 variant 渲染 ──
  switch (config.variant) {
    case "hero":
      tile.appendChild(buildHeroBody(config));
      break;
    case "group":
      tile.appendChild(buildGroupBody(config));
      break;
    case "stack":
      tile.appendChild(buildStackBody(config));
      break;
    case "tool":
      tile.appendChild(buildToolBody(config));
      break;
    case "plan":
      tile.appendChild(buildPlanBody(config));
      break;
  }

  return tile;
}

/** Hero tile：大卡片 + 快捷操作列表 + 主按钮 */
function buildHeroBody(config: DashboardTileConfig): HTMLElement {
  const body = document.createElement("div");
  body.className = "tile-body tile-body--hero";

  // 快捷操作区域
  if (config.actions && config.actions.length > 0) {
    const quickActions = document.createElement("div");
    quickActions.className = "tile-quick-actions";

    for (const action of config.actions) {
      quickActions.appendChild(createQuickActionButton(action));
    }

    body.appendChild(quickActions);
  }

  // 主按钮
  if (config.primaryAction) {
    const primary = createQuickActionButton(config.primaryAction);
    primary.classList.add("qa-btn--primary");
    body.appendChild(primary);
  }

  // 装饰圆环
  const ring = document.createElement("div");
  ring.className = "tile-deco-ring";
  body.appendChild(ring);

  return body;
}

/** Group tile：主按钮 + 机器按钮组 */
function buildGroupBody(config: DashboardTileConfig): HTMLElement {
  const body = document.createElement("div");
  body.className = "tile-body tile-body--group";

  if (config.machines && config.machines.length > 0) {
    body.appendChild(createMachineButtonGroup(config.machines));
  }

  if (config.primaryAction) {
    const primary = createQuickActionButton(config.primaryAction);
    primary.classList.add("qa-btn--primary");
    body.appendChild(primary);
  }

  return body;
}

/** Stack tile：子 tile 列表（Router + iLO） */
function buildStackBody(config: DashboardTileConfig): HTMLElement {
  const body = document.createElement("div");
  body.className = "tile-body tile-body--stack";

  if (config.subTiles) {
    for (const sub of config.subTiles) {
      const subTile = document.createElement("div");
      subTile.className = "sub-tile";

      const info = document.createElement("div");
      info.className = "sub-tile-info";

      const name = document.createElement("span");
      name.className = "sub-tile-name";
      name.textContent = sub.title;
      info.appendChild(name);

      const desc = document.createElement("span");
      desc.className = "sub-tile-desc";
      desc.textContent = sub.subtitle;
      info.appendChild(desc);

      subTile.appendChild(info);
      subTile.appendChild(createStatusPill(sub.status));
      body.appendChild(subTile);
    }
  }

  return body;
}

/** Tool tile：简短信息 + 主按钮 */
function buildToolBody(config: DashboardTileConfig): HTMLElement {
  const body = document.createElement("div");
  body.className = "tile-body tile-body--tool";

  if (config.primaryAction) {
    const primary = createQuickActionButton(config.primaryAction);
    primary.classList.add("qa-btn--primary");
    body.appendChild(primary);
  }

  return body;
}

/** Plan tile：接入计划列表 */
function buildPlanBody(config: DashboardTileConfig): HTMLElement {
  const body = document.createElement("div");
  body.className = "tile-body tile-body--plan";

  if (config.planItems && config.planItems.length > 0) {
    body.appendChild(createPlanList(config.planItems));
  }

  return body;
}
