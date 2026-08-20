import type { MachineButton } from "../../infrastructure/dashboard/dashboardCatalog";
import { OpenClashDashboardUseCase } from "../../features/clash/application/OpenClashDashboardUseCase";
import { getMachineById } from "../../features/clash/infrastructure/clashMachines";

const clashUseCase = new OpenClashDashboardUseCase();

/**
 * 机器按钮组。
 *
 * - kind === "clash"     → OpenClashDashboardUseCase（externalControllers 机制）
 * - disabled              → 灰色不可点击
 * - kind === "syncthing" → href 当前页跳转
 * - onClick              → 自定义回调
 */
export function createMachineButtonGroup(
  machines: readonly MachineButton[],
): HTMLElement {
  const group = document.createElement("div");
  group.className = "machine-group";

  for (const m of machines) {
    const btn = document.createElement("button");
    btn.className = "machine-btn";
    btn.textContent = m.label;
    if (m.hint) btn.title = m.hint;

    if (m.enabled === false) {
      btn.disabled = true;
      btn.setAttribute("aria-disabled", "true");
      group.appendChild(btn);
      continue;
    }

    if (m.onClick) {
      btn.addEventListener("click", m.onClick);
    } else if (m.kind === "clash") {
      const machine = getMachineById(m.label);
      if (machine) {
        btn.addEventListener("click", () => clashUseCase.execute(machine));
      }
    } else {
      btn.addEventListener("click", () => {
        window.location.href = m.href;
      });
    }

    group.appendChild(btn);
  }

  return group;
}
