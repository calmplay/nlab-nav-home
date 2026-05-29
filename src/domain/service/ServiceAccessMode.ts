/**
 * 服务访问方式。
 *
 * - reverse-proxy:     nginx 路径反向代理（如 /svc/router/）
 * - redirect:           通过 /jump/ 路径跳转（nginx 302）
 * - legacy-entry:       保留旧端口入口（不通过 1104 代理）
 * - external-link:      纯外链（不在本 nginx 体系内）
 * - planned:            规划中，尚未接入
 * - not-integrated:     明确暂不接入
 */
export const SERVICE_ACCESS_MODES = [
  "reverse-proxy",
  "redirect",
  "legacy-entry",
  "external-link",
  "planned",
  "not-integrated",
] as const;

export type ServiceAccessMode = (typeof SERVICE_ACCESS_MODES)[number];

/** 每种访问方式对应的按钮文案 */
export const ACCESS_MODE_LABELS: Record<ServiceAccessMode, string> = {
  "reverse-proxy": "通过导航访问",
  redirect: "通过导航跳转",
  "legacy-entry": "前往旧入口",
  "external-link": "打开链接",
  planned: "后续接入",
  "not-integrated": "暂不可用",
};
