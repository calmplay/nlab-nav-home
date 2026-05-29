import type { Service } from "../../domain/service/Service";
import type { ResolvedAction } from "../../application/service/ResolveServiceActionUseCase";
import { CATEGORY_LABELS } from "../../domain/service/ServiceCategory";
import { createStatusDot } from "./StatusBadge";

/**
 * 紧凑型服务卡片（GitHub pinned repo card 风格）。
 *
 * 默认展示：名称 + 状态点 + 1~2 行描述 + 分类标签 + 操作按钮
 * hover 时通过 CSS tooltip 展示详情（访问方式 / 风险 / 备注 / 标签）。
 */
export function createServiceCard(
  service: Service,
  action: ResolvedAction,
): HTMLElement {
  const card = document.createElement("article");
  card.className = "service-card";

  // ── 顶部：名称 + 状态 ──
  const top = document.createElement("div");
  top.className = "card-top";

  const title = document.createElement("h3");
  title.className = "card-title";
  title.textContent = service.shortName;
  top.appendChild(title);
  top.appendChild(createStatusDot(service.status));
  card.appendChild(top);

  // ── 描述（最多 2 行）──
  const desc = document.createElement("p");
  desc.className = "card-desc";
  desc.textContent = service.description;
  card.appendChild(desc);

  // ── 底部：分类标签 + 按钮 ──
  const bottom = document.createElement("div");
  bottom.className = "card-bottom";

  const catTag = document.createElement("span");
  catTag.className = "card-category-tag";
  catTag.textContent = CATEGORY_LABELS[service.category];
  bottom.appendChild(catTag);

  const btn = document.createElement("button");
  btn.className = "card-action";
  btn.textContent = action.label;
  btn.disabled = action.behavior === "none";

  if (action.behavior !== "none") {
    btn.addEventListener("click", () => {
      window.open(service.href, "_blank", "noopener,noreferrer");
    });
  }

  bottom.appendChild(btn);
  card.appendChild(bottom);

  // ── hover tooltip ──
  card.appendChild(createTooltip(service, action));
  return card;
}

/** CSS tooltip：hover 时展示完整信息 */
function createTooltip(
  service: Service,
  action: ResolvedAction,
): HTMLElement {
  const tip = document.createElement("div");
  tip.className = "card-tooltip";

  // 访问方式
  tip.appendChild(tooltipRow("访问", action.label));

  // 风险
  tip.appendChild(tooltipRow("风险", `${action.riskLabel} — ${action.riskDescription}`));

  // 备注
  if (service.notes) {
    tip.appendChild(tooltipRow("说明", service.notes));
  }

  // 标签
  if (service.tags.length > 0) {
    const tagsRow = document.createElement("div");
    tagsRow.className = "tooltip-row";

    const label = document.createElement("span");
    label.className = "tooltip-label";
    label.textContent = "标签";
    tagsRow.appendChild(label);

    const tagsWrap = document.createElement("div");
    tagsWrap.className = "tooltip-tags";
    for (const tag of service.tags) {
      const t = document.createElement("span");
      t.className = "tooltip-tag";
      t.textContent = tag;
      tagsWrap.appendChild(t);
    }
    tagsRow.appendChild(tagsWrap);
    tip.appendChild(tagsRow);
  }

  return tip;
}

function tooltipRow(label: string, value: string): HTMLElement {
  const row = document.createElement("div");
  row.className = "tooltip-row";

  const lbl = document.createElement("span");
  lbl.className = "tooltip-label";
  lbl.textContent = label;
  row.appendChild(lbl);

  const val = document.createElement("span");
  val.textContent = value;
  row.appendChild(val);

  return row;
}
