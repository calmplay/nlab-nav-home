import type { Service } from "../../domain/service/Service";
import type { ResolvedAction } from "../../application/service/ResolveServiceActionUseCase";
import { createServiceCard } from "./ServiceCard";

/**
 * 统一服务板 —— 4 列 grid 布局，一页展示全部服务。
 * 替代旧的 ServiceSection（分类大段列表）。
 */
export function createServiceBoard(
  services: Service[],
  actions: Map<string, ResolvedAction>,
): HTMLElement {
  const board = document.createElement("div");
  board.className = "service-board";

  for (const svc of services) {
    const action = actions.get(svc.id);
    if (!action) continue;

    board.appendChild(createServiceCard(svc, action));
  }

  return board;
}
