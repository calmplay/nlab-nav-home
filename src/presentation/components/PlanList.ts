import type { PlanItem } from "../../infrastructure/dashboard/dashboardCatalog";

/**
 * 接入计划列表。
 */
export function createPlanList(items: readonly PlanItem[]): HTMLElement {
  const list = document.createElement("ul");
  list.className = "plan-list";

  for (const item of items) {
    const li = document.createElement("li");
    li.className = "plan-item";

    const name = document.createElement("span");
    name.className = "plan-item-name";
    name.textContent = item.name;
    li.appendChild(name);

    const target = document.createElement("code");
    target.className = "plan-item-target";
    target.textContent = item.target;
    li.appendChild(target);

    list.appendChild(li);
  }

  return list;
}
