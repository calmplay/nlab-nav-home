/** Clash 机器标识 */
export type MachineId = "dx0" | "dx1" | "dx2" | "dx3" | "dx4" | "dx8";

/** 机器配置（不含 secret） */
export interface ClashMachine {
  readonly id: MachineId;
  readonly label: string;
  readonly apiPort: number;
}
