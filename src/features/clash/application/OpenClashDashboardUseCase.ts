import type { ClashMachine } from "../domain/ClashMachine";
import { BrowserClashSecretStore } from "../infrastructure/BrowserClashSecretStore";
import { createClashSecretModal } from "../presentation/ClashSecretModal";
import { ValidateClashSecretUseCase } from "./ValidateClashSecretUseCase";

const validator = new ValidateClashSecretUseCase();

/**
 * 打开 Clash Dashboard（含 secret 预检验证）。
 *
 * 流程：
 * 1. localStorage 有已存 secret → 先验证有效性
 * 2. 有效 → 设 externalControllers → 打开 /clash/#/proxies
 * 3. 失效 → 清除旧 secret → 弹 modal
 * 4. modal 输入 → 验证 → 通过才保存并打开
 */
export class OpenClashDashboardUseCase {
  async execute(machine: ClashMachine): Promise<void> {
    const saved = BrowserClashSecretStore.get(machine.id);
    if (saved) {
      const result = await validator.execute(machine, saved);
      if (result.kind === "ok") {
        this.openDashboard(machine, saved);
        return;
      }
      // 旧 secret 失效，清除后弹 modal
      BrowserClashSecretStore.remove(machine.id);
      if (result.kind === "unauthorized") {
        this.showModal(
          machine,
          "已保存的 secret 已失效，请重新输入",
        );
      } else {
        this.showModal(machine, result.message);
      }
      return;
    }

    this.showModal(machine);
  }

  private showModal(machine: ClashMachine, error?: string): void {
    const modal = createClashSecretModal(
      machine.label,
      async (secret) => {
        modal.setLoading(true);
        const result = await validator.execute(machine, secret);
        if (result.kind === "ok") {
          BrowserClashSecretStore.set(machine.id, secret);
          modal.remove();
          this.openDashboard(machine, secret);
        } else if (result.kind === "unauthorized") {
          modal.showError("secret 无效，请检查后重试");
          modal.setLoading(false);
        } else {
          modal.showError(result.message);
          modal.setLoading(false);
        }
      },
      () => modal.remove(),
      error,
    );

  }

  private openDashboard(machine: ClashMachine, secret: string): void {
    const machineNum = machine.id.replace("dx", "");
    document.cookie = `clash_machine=${machineNum};path=/;max-age=86400;SameSite=Lax`;

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
