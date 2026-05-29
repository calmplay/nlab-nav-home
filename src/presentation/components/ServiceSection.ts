import type { ServiceGroup } from "../../application/service/GroupServicesUseCase";
import type { ResolvedAction } from "../../application/service/ResolveServiceActionUseCase";
import { CATEGORY_LABELS } from "../../domain/service/ServiceCategory";
import { createServiceCard } from "./ServiceCard";

/**
 * 分类区域组件。
 * 渲染一个分类标题 + 该分类下的所有服务卡片。
 */
export function createServiceSection(
  group: ServiceGroup,
  actions: Map<string, ResolvedAction>,
): HTMLElement {
  const section = document.createElement("section");
  section.className = "service-section";

  // ── 分类标题行 ──
  const header = document.createElement("div");
  header.className = "section-header";

  const title = document.createElement("h2");
  title.textContent = CATEGORY_LABELS[group.category];
  header.appendChild(title);

  const count = document.createElement("span");
  count.className = "section-count";
  count.textContent = `${group.services.length}`;
  header.appendChild(count);

  section.appendChild(header);

  // ── 卡片网格 ──
  const cards = document.createElement("div");
  cards.className = "service-cards";

  for (const service of group.services) {
    const action = actions.get(service.id);
    if (!action) continue;

    const card = createServiceCard(service, action);

    // 绑定点击跳转行为
    bindCardClick(card, service, action);
    cards.appendChild(card);
  }

  section.appendChild(cards);
  return section;
}

/** 为卡片绑定点击跳转行为 */
function bindCardClick(
  card: HTMLElement,
  service: { href: string },
  action: ResolvedAction,
): void {
  const btn = card.querySelector(".card-action") as HTMLButtonElement | null;
  if (!btn || action.behavior === "none") return;

  btn.addEventListener("click", () => {
    if (action.behavior === "new-tab") {
      window.open(service.href, "_blank", "noopener");
    } else {
      window.location.href = service.href;
    }
  });
}
