import type { ClashMachine } from "../domain/ClashMachine";
import { BrowserClashSecretStore } from "../infrastructure/BrowserClashSecretStore";
import { createClashSecretModal } from "../presentation/ClashSecretModal";

/**
 * 打开 Clash Dashboard（通过 External Controller 机制）。
 *
 * 流程：
 * 1. 从 localStorage 查找机器 secret
 * 2. 如无 secret → 弹密码框
 * 3. 写入 externalControllers / externalControllerIndex → SPA 自动连接
 * 4. 设 clash_machine cookie → nginx 路由 API
 * 5. 新标签页打开 /clash/#/proxies
 *
 * 安全：
 * - secret 不进 URL，只存 localStorage
 * - 不设 clash_secret cookie
 * - 不打开 17900
 */
export class OpenClashDashboardUseCase {
  execute(machine: ClashMachine): void {
    const saved = BrowserClashSecretStore.get(machine.id);
    if (saved) {
      this.openDashboard(machine, saved);
      return;
    }

    const modal = createClashSecretModal(
      machine.label,
      (secret) => {
        BrowserClashSecretStore.set(machine.id, secret);
        modal.remove();
        this.openDashboard(machine, secret);
      },
      () => modal.remove(),
    );

    document.body.appendChild(modal);
  }

  private openDashboard(machine: ClashMachine, secret: string): void {
    // 设 cookie → nginx 根据 clash_machine 路由 API 到对应机器
    const machineNum = machine.id.replace("dx", "");
    document.cookie = `clash_machine=${machineNum};path=/;max-age=86400;SameSite=Lax`;

    // 写入 External Controller 配置 → Clash SPA 自动连接
    const proto = window.location.protocol;
    const port = window.location.port || (proto === "https:" ? "443" : "80");
    localStorage.setItem(
      "externalControllers",
      JSON.stringify([
        {
          hostname: window.location.hostname,
          port,
          secret,
          protocol: proto,
        },
      ]),
    );
    localStorage.setItem("externalControllerIndex", "0");

    window.open("/clash/#/proxies", "_blank", "noopener,noreferrer");
  }
}
