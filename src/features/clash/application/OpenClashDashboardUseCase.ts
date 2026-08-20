import type { ClashMachine } from "../domain/ClashMachine";
import { BrowserClashSecretStore } from "../infrastructure/BrowserClashSecretStore";

/**
 * 打开 Clash Dashboard。
 *
 * 1105 预览环境由网关登录保护，Clash API secret 由 nginx 在服务端注入。
 * 前端只选择机器，不再收集、验证或保存 secret。
 */
export class OpenClashDashboardUseCase {
  execute(machine: ClashMachine): void {
    BrowserClashSecretStore.clearAll();
    this.openDashboard(machine);
  }

  private openDashboard(machine: ClashMachine): void {
    const machineNum = machine.id.replace("dx", "");
    document.cookie = `clash_machine=${machineNum};path=/;max-age=315360000;SameSite=Lax`;

    const proto = window.location.protocol;
    const port = window.location.port || (proto === "https:" ? "443" : "80");
    localStorage.setItem(
      "externalControllers",
      JSON.stringify([
        {
          hostname: window.location.hostname,
          port,
          secret: "",
          protocol: proto,
        },
      ]),
    );
    localStorage.setItem("externalControllerIndex", "0");

    window.location.assign("/clash/#/proxies");
  }
}
