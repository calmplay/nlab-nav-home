import type { DashboardAction } from "../../infrastructure/dashboard/dashboardCatalog";

/**
 * 胶囊按钮（macOS/iOS 风格）。
 * enabled 时当前页跳转，disabled 时灰色不可点击。
 */
export function createQuickActionButton(action: DashboardAction): HTMLElement {
  const btn = document.createElement("button");
  btn.className = "qa-btn";
  btn.textContent = action.label;

  if (action.hint) {
    btn.title = action.hint;
  }

  if (action.enabled) {
    btn.addEventListener("click", () => {
      window.location.href = action.href;
    });
  } else {
    btn.disabled = true;
    btn.setAttribute("aria-disabled", "true");
  }

  return btn;
}
