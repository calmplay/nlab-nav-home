/**
 * 服务唯一标识符 —— 使用 branded string 防止与普通字符串混用。
 * 例如：'clash-gateway'、'router'、'ilo'。
 */
export type ServiceId = string & { readonly __brand: "ServiceId" };

export function ServiceId(value: string): ServiceId {
  return value as ServiceId;
}
