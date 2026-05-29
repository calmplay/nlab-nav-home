import type { MachineButton } from "../../infrastructure/dashboard/dashboardCatalog";
import { OpenClashDashboardUseCase } from "../../features/clash/application/OpenClashDashboardUseCase";
import { getMachineById } from "../../features/clash/infrastructure/clashMachines";

const clashUseCase = new OpenClashDashboardUseCase();

/**
 * 机器按钮组。
 *
 * - Clash 机器（dx0~dx8）：onClick 触发密码弹窗 + 直达流程
 * - Syncthing 机器：href 新标签页打开
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

    if (m.onClick) {
      btn.addEventListener("click", m.onClick);
    } else {
      // Clash 机器 → 直达流程
      const machine = getMachineById(m.label);
      if (machine) {
        btn.addEventListener("click", () => clashUseCase.execute(machine));
      } else {
        // Syncthing → href 跳转
        btn.addEventListener("click", () => {
          window.open(m.href, "_blank", "noopener,noreferrer");
        });
      }
    }

    group.appendChild(btn);
  }

  return group;
}
