import type { ClashMachine } from "../domain/ClashMachine";
import { BrowserClashSecretStore } from "../infrastructure/BrowserClashSecretStore";
import { createClashSecretModal } from "../presentation/ClashSecretModal";

/**
 * 打开 Clash Dashboard。
 *
 * 稳定方案：通过旧 17900 Gateway 访问，不把 secret 放进 URL。
 *
 * 流程：
 * 1. 从 localStorage 查找机器 secret
 * 2. 如有 secret → 设 cookie（供旧 Gateway 读取）→ 新标签页打开旧网关
 * 3. 如无 secret → 弹密码框 → 保存到 localStorage → 设 cookie → 打开旧网关
 *
 * 安全：
 * - secret 只存 localStorage 和 cookie（SameSite=Lax），不进 URL
 * - 旧 Gateway 在 17900 端口处理 dashboard 渲染和 API 代理
 */
export class OpenClashDashboardUseCase {
  execute(machine: ClashMachine): void {
    const saved = BrowserClashSecretStore.get(machine.id);
    if (saved) {
      this.goToGateway(machine, saved);
      return;
    }

    const modal = createClashSecretModal(
      machine.label,
      (secret) => {
        BrowserClashSecretStore.set(machine.id, secret);
        modal.remove();
        this.goToGateway(machine, secret);
      },
      () => modal.remove(),
    );

    document.body.appendChild(modal);
  }

  private goToGateway(machine: ClashMachine, secret: string): void {
    const machineNum = machine.id.replace("dx", "");
    // 设 cookie 供旧 Gateway（17900端口）读取，SameSite=Lax 确保安全
    document.cookie = `clash_machine=${machineNum};path=/;max-age=86400;SameSite=Lax`;
    document.cookie = `clash_secret=${encodeURIComponent(secret)};path=/;max-age=86400;SameSite=Lax`;
    // 打开旧 Gateway，预选机器。secret 通过 cookie 传递，不进入 URL
    window.open(
      `http://nuist.cfushn.com:17900/?machine=${machineNum}`,
      "_blank",
      "noopener,noreferrer",
    );
  }
}
