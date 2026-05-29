import type { ClashMachine } from "../domain/ClashMachine";

/** 全部实验室 Clash 机器（不含 secret） */
export const CLASH_MACHINES: readonly ClashMachine[] = [
  { id: "dx0", label: "dx0", apiPort: 17800 },
  { id: "dx1", label: "dx1", apiPort: 17801 },
  { id: "dx2", label: "dx2", apiPort: 17802 },
  { id: "dx3", label: "dx3", apiPort: 17803 },
  { id: "dx4", label: "dx4", apiPort: 17804 },
  { id: "dx8", label: "dx8", apiPort: 17808 },
];

export function getMachineById(id: string): ClashMachine | undefined {
  return CLASH_MACHINES.find((m) => m.id === id);
}
