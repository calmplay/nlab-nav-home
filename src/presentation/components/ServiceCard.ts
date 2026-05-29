import type { Service } from "../../domain/service/Service";
import type { ResolvedAction } from "../../application/service/ResolveServiceActionUseCase";
import { createStatusBadge } from "./StatusBadge";

/**
 * 服务卡片组件。
 * 接收一个 Service 实体和一个已解析的动作描述，渲染为一张卡片。
 */
export function createServiceCard(
  service: Service,
  action: ResolvedAction,
): HTMLElement {
  const card = document.createElement("article");
  card.className = "service-card";

  // ── 卡片头部：名称 + 状态 ──
  const header = document.createElement("div");
  header.className = "card-header";

  const title = document.createElement("h3");
  title.textContent = service.name;

  header.appendChild(title);
  header.appendChild(createStatusBadge(service.status));
  card.appendChild(header);

  // ── 描述 ──
  const desc = document.createElement("p");
  desc.className = "card-desc";
  desc.textContent = service.description;
  card.appendChild(desc);

  // ── 标签 ──
  if (service.tags.length > 0) {
    card.appendChild(createTags(service));
  }

  // ── 备注 ──
  if (service.notes) {
    const notes = document.createElement("p");
    notes.className = "card-notes";
    notes.textContent = service.notes;
    card.appendChild(notes);
  }

  // ── 底部：风险 + 操作按钮 ──
  const footer = document.createElement("div");
  footer.className = "card-footer";

  const riskEl = document.createElement("span");
  riskEl.className = "card-risk";
  riskEl.textContent = `🛡 ${action.riskLabel}`;
  riskEl.title = action.riskDescription;
  footer.appendChild(riskEl);

  const btn = createActionButton(action);
  footer.appendChild(btn);

  card.appendChild(footer);
  return card;
}

/** 创建服务标签列表 */
function createTags(service: Service): HTMLElement {
  const container = document.createElement("div");
  container.className = "card-tags";

  for (const tag of service.tags) {
    const span = document.createElement("span");
    span.className = "tag";
    span.textContent = tag;
    container.appendChild(span);
  }

  // 风险等级标签（使用特殊颜色）
  const riskTag = document.createElement("span");
  riskTag.className = `tag tag-risk-${service.risk}`;
  riskTag.textContent = actionLabelToRiskText(service.risk);
  container.appendChild(riskTag);

  return container;
}

/** 根据行为描述创建操作按钮 */
function createActionButton(action: ResolvedAction): HTMLButtonElement {
  const btn = document.createElement("button");
  btn.className = "card-action";

  if (action.behavior === "new-tab") {
    btn.classList.add("card-action--new-tab");
  }

  btn.textContent = action.label;
  btn.disabled = action.behavior === "none";
  return btn;
}

function actionLabelToRiskText(risk: Service["risk"]): string {
  switch (risk) {
    case "low":
      return "低风险";
    case "medium":
      return "中风险";
    case "high":
      return "高风险";
    case "unknown":
      return "待验证";
  }
}
