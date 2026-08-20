import type { ClashMachine } from "../domain/ClashMachine";

/** 全部实验室 Clash 机器（不含 secret） */
export const CLASH_MACHINES: readonly ClashMachine[] = [
  { id: "dx0", label: "dx0" },
  { id: "dx1", label: "dx1" },
  { id: "dx2", label: "dx2" },
  { id: "dx3", label: "dx3" },
  { id: "dx4", label: "dx4" },
  { id: "dx5", label: "dx5" },
  { id: "dx8", label: "dx8" },
];

export function getMachineById(id: string): ClashMachine | undefined {
  return CLASH_MACHINES.find((m) => m.id === id);
}
