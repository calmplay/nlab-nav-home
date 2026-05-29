import type { ClashMachine } from "../domain/ClashMachine";

export type ValidationResult =
  | { kind: "ok" }
  | { kind: "unauthorized" }
  | { kind: "unavailable"; message: string }
  | { kind: "network-error"; message: string };

/**
 * 验证 Clash secret 是否有效。
 * 通过 fetch /version 并带 Authorization header 来判断。
 * 验证期间设 clash_machine cookie 让 nginx 路由到对应机器。
 */
export class ValidateClashSecretUseCase {
  async execute(
    machine: ClashMachine,
    candidateSecret: string,
  ): Promise<ValidationResult> {
    // 先设 cookie → nginx 路由 API 到对应机器
    const machineNum = machine.id.replace("dx", "");
    document.cookie = `clash_machine=${machineNum};path=/;max-age=86400;SameSite=Lax`;

    try {
      const resp = await fetch("/version", {
        method: "GET",
        headers: { Authorization: `Bearer ${candidateSecret}` },
        cache: "no-store",
      });

      if (resp.ok) {
        return { kind: "ok" };
      }
      if (resp.status === 401 || resp.status === 403) {
        return { kind: "unauthorized" };
      }
      if (resp.status === 502 || resp.status === 504) {
        return {
          kind: "unavailable",
          message: "该机器 Clash API 当前不可用（502）",
        };
      }
      return {
        kind: "unavailable",
        message: `服务器返回异常: ${resp.status}`,
      };
    } catch {
      return { kind: "network-error", message: "网络或代理异常，无法验证" };
    }
  }
}
