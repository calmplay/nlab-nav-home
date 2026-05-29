import type { ClashMachine } from "../domain/ClashMachine";
import { BrowserClashSecretStore } from "../infrastructure/BrowserClashSecretStore";
import { createClashSecretModal } from "../presentation/ClashSecretModal";

/**
 * 打开 Clash Dashboard 用例。
 *
 * 流程：
 * 1. 从 localStorage 查找机器 secret
 * 2. 如有 → 新标签页打开 /clash/?machine=<id>
 * 3. 如无 → 弹出密码框 → 保存 → 打开
 */
export class OpenClashDashboardUseCase {
  execute(machine: ClashMachine): void {
    const saved = BrowserClashSecretStore.get(machine.id);
    if (saved) {
      this.openDashboard(machine);
      return;
    }

    const modal = createClashSecretModal(
      machine.label,
      (secret) => {
        BrowserClashSecretStore.set(machine.id, secret);
        modal.remove();
        this.openDashboard(machine);
      },
      () => modal.remove(),
    );

    document.body.appendChild(modal);
  }

  private openDashboard(machine: ClashMachine): void {
    const secret = BrowserClashSecretStore.get(machine.id);
    const machineNum = machine.id.replace("dx", "");
    // 设 cookie 供 clash-dashboard SPA 读取（1天有效）
    document.cookie = `clash_machine=${machineNum};path=/;max-age=86400;SameSite=Lax`;
    if (secret) {
      document.cookie = `clash_secret=${encodeURIComponent(secret)};path=/;max-age=86400;SameSite=Lax`;
    }
    window.open(
      `/clash-dashboard/?machine=${machine.id}`,
      "_blank",
      "noopener,noreferrer",
    );
  }
}
