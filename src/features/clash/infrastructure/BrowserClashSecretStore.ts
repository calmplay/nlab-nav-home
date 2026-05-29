import type { MachineId } from "../domain/ClashMachine";

const PREFIX = "nlab.clash.secret.";

function key(machine: MachineId): string {
  return PREFIX + machine;
}

export const BrowserClashSecretStore = {
  get(machine: MachineId): string | null {
    try {
      return localStorage.getItem(key(machine));
    } catch {
      return null;
    }
  },

  set(machine: MachineId, secret: string): void {
    try {
      localStorage.setItem(key(machine), secret);
    } catch {
      // localStorage 不可用，静默降级
    }
  },

  remove(machine: MachineId): void {
    try {
      localStorage.removeItem(key(machine));
    } catch {
      // ignore
    }
  },

  /** 清除全部机器 secret */
  clearAll(): void {
    for (const m of ["dx0", "dx1", "dx2", "dx3", "dx4", "dx8"] as MachineId[]) {
      this.remove(m);
    }
  },
};
