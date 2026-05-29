import type { MachineButton } from "../../infrastructure/dashboard/dashboardCatalog";

/**
 * 机器按钮组（Clash / Syncthing 内部 dx0~dx8 方块按钮）。
 * 每个按钮独立新标签页打开。
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

    btn.addEventListener("click", () => {
      window.open(m.href, "_blank", "noopener,noreferrer");
    });

    group.appendChild(btn);
  }

  return group;
}
