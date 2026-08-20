/**
 * Dashboard 布局配置 —— 定义 Bento 仪表盘中每个 tile 的内容和行为。
 *
 * 安全提醒：此文件不含 secret / token / 密码 / 内网 IP，可提交 GitHub。
 */

/** 单个操作按钮 */
export interface DashboardAction {
  readonly label: string;
  readonly href: string;
  readonly enabled: boolean;
  readonly hint?: string;
}

export type MachineButtonKind = "clash" | "syncthing";

/** 机器按钮（用于 Clash / Syncthing 组） */
export interface MachineButton {
  readonly kind: MachineButtonKind;
  readonly label: string;
  readonly href: string;
  readonly enabled?: boolean;
  readonly hint?: string;
  readonly onClick?: () => void;
}

/** 接入计划条目 */
export interface PlanItem {
  readonly name: string;
  readonly target: string;
}

/** 运维上下文事实：短标签 + 可选说明 */
export interface DashboardOpsFact {
  readonly label: string;
  readonly detail?: string;
}

/** 嵌入式预览面板（例如 Grafana d-solo panel） */
export interface EmbeddedPanel {
  readonly title: string;
  readonly src: string;
  readonly fallbackText: string;
}

/** 子 tile（用于 Remote stack） */
export interface SubTile {
  readonly title: string;
  readonly subtitle: string;
  readonly status: TileStatus;
  readonly href: string;
}

export type TileVariant = "hero" | "group" | "stack" | "tool" | "plan";
export type TileAccent = "blue" | "green" | "orange" | "gray";
export type TileStatus = "ready" | "planned" | "jump" | "deprecated";

export interface DashboardTileConfig {
  readonly id: string;
  readonly title: string;
  readonly subtitle: string;
  readonly variant: TileVariant;
  readonly accent: TileAccent;
  readonly status: TileStatus;
  /** 主操作按钮 */
  readonly primaryAction?: DashboardAction;
  /** 快捷操作列表（hero tile 内部按钮 / plan 列表项 / 机器按钮） */
  readonly actions?: readonly DashboardAction[];
  /** 机器按钮组（group tile 专用） */
  readonly machines?: readonly MachineButton[];
  /** 子 tile（stack tile 专用） */
  readonly subTiles?: readonly SubTile[];
  /** 接入计划列表（plan tile 专用） */
  readonly planItems?: readonly PlanItem[];
  /** 运维上下文提示（展示为紧凑 chip） */
  readonly opsFacts?: readonly DashboardOpsFact[];
  /** 嵌入式预览面板 */
  readonly embeddedPanel?: EmbeddedPanel;
}

/** 6 个 Bento tile 的完整布局配置 */
export const DASHBOARD_TILES: readonly DashboardTileConfig[] = [
  // ══════════════════════════════════════════════════════
  // 1. Grafana — hero（最大模块，6 列 × 2 行）
  // ══════════════════════════════════════════════════════
  {
    id: "grafana",
    title: "Grafana 监控中心",
    subtitle: "GPU、节点、磁盘与实验室资源总览",
    variant: "hero",
    accent: "blue",
    status: "jump",
    opsFacts: [
      { label: "svc reverse proxy", detail: "通过 /svc/grafana/ 子路径反向代理访问" },
      { label: "gateway cookie", detail: "1105 预览登录后由网关代持只读凭据" },
      { label: "root_url configured", detail: "服务端已配置子路径 root_url" },
    ],
    embeddedPanel: {
      title: "Server Resource Overview",
      src: "/svc/grafana/d-solo/StarsL-JOB-node/07b3d0c?var-interval=3m&orgId=1&from=now-30m&to=now&timezone=browser&var-origin_prometheus=&var-job=node_exporters&var-name=dx0-4090d-48gx4&var-instance=dx0:9100&var-total=7&var-device=$__all&var-maxmount=%2Fmhd%2Fhome&var-show_name=dx0-4090d-48gx4&panelId=198&theme=light",
      fallbackText: "如果预览不可用，请打开完整 Grafana 资源总览页面。",
    },
    primaryAction: {
      label: "Grafana 首页",
      href: "/svc/grafana/",
      enabled: true,
      hint: "通过 1104 统一入口访问",
    },
    actions: [
      { label: "Grafana 首页", href: "/svc/grafana/", enabled: true },
      {
        label: "GPU 总览",
        href: "/svc/grafana/d/Oxed_c6Wz2/9b2185c?orgId=1&from=now-15m&to=now&timezone=browser&var-instance=dx0:9400&var-gpu=$__all",
        enabled: true,
        hint: "打开 GPU 监控总览",
      },
      { label: "节点资源", href: "", enabled: false, hint: "待配置" },
      { label: "磁盘容量", href: "", enabled: false, hint: "待配置" },
      { label: "目录用量", href: "", enabled: false, hint: "待配置" },
    ],
  },

  // ══════════════════════════════════════════════════════
  // 2. Clash — group（4 列 × 1 行）
  // ══════════════════════════════════════════════════════
  {
    id: "clash",
    title: "Clash 代理组",
    subtitle: "多机器代理面板与 API 网关",
    variant: "group",
    accent: "blue",
    status: "jump",
    opsFacts: [
      { label: "embedded dashboard", detail: "静态 dashboard 已迁入 1104 体系" },
      { label: "gateway cookie", detail: "先通过主页登录，再进入 Clash 面板" },
      { label: "server-side secret", detail: "Clash API secret 由网关注入，不进入浏览器" },
      { label: "API proxy", detail: "通过机器 cookie 选择后端 Clash API" },
    ],
    machines: [
      { kind: "clash", label: "dx0", href: "", hint: "主页登录后直达 dx0 管理页" },
      { kind: "clash", label: "dx1", href: "", hint: "主页登录后直达 dx1 管理页" },
      { kind: "clash", label: "dx2", href: "", hint: "主页登录后直达 dx2 管理页" },
      { kind: "clash", label: "dx3", href: "", hint: "主页登录后直达 dx3 管理页" },
      { kind: "clash", label: "dx4", href: "", hint: "主页登录后直达 dx4 管理页" },
      { kind: "clash", label: "dx5", href: "", hint: "主页登录后直达 dx5 管理页" },
      { kind: "clash", label: "dx8", href: "", hint: "主页登录后直达 dx8 管理页" },
    ],
  },

  // ══════════════════════════════════════════════════════
  // 3. Remote — stack（2 列 × 2 行）
  // ══════════════════════════════════════════════════════
  {
    id: "remote",
    title: "远程与网络",
    subtitle: "路由器管理 · iLO 远程控制",
    variant: "stack",
    accent: "gray",
    status: "jump",
    opsFacts: [
      { label: "jump fallback", detail: "Router / iLO 均保留稳定旧入口" },
      { label: "cert warning", detail: "iLO 可能出现自签名证书提示" },
      { label: "sub-path risk", detail: "硬件设备页面不强行做子路径反代" },
    ],
    subTiles: [
      {
        title: "Router",
        subtitle: "路由器管理",
        status: "jump",
        href: "/jump/router/",
      },
      {
        title: "iLO",
        subtitle: "远程管理",
        status: "jump",
        href: "/jump/ilo/",
      },
    ],
  },

  // ══════════════════════════════════════════════════════
  // 4. Prometheus — tool（4 列 × 1 行）
  // ══════════════════════════════════════════════════════
  {
    id: "prometheus",
    title: "Prometheus",
    subtitle: "原始时序指标查询",
    variant: "tool",
    accent: "orange",
    status: "jump",
    opsFacts: [
      { label: "svc reverse proxy", detail: "通过 /svc/prometheus/ 子路径反向代理访问" },
      { label: "Basic Auth", detail: "Prometheus 保留现有 Basic Auth" },
      { label: "query tool", detail: "适合直接查询原始指标" },
    ],
    primaryAction: {
      label: "打开查询",
      href: "/svc/prometheus/",
      enabled: true,
      hint: "通过 1104 统一入口访问，需 Basic Auth",
    },
  },

  // ══════════════════════════════════════════════════════
  // 5. Syncthing — group（已弃用，仅保留停用状态）
  // ══════════════════════════════════════════════════════
  {
    id: "syncthing",
    title: "Syncthing 文件同步",
    subtitle: "服务已停用；原同步文件夹内容已保留",
    variant: "group",
    accent: "gray",
    status: "deprecated",
    opsFacts: [
      { label: "服务已卸载", detail: "所有服务器的 Syncthing 服务均已停用并卸载" },
      { label: "数据已保留", detail: "未删除任何原同步文件夹内容" },
    ],
    machines: [
      { kind: "syncthing", label: "dx0", href: "", enabled: false },
      { kind: "syncthing", label: "dx1", href: "", enabled: false },
      { kind: "syncthing", label: "dx2", href: "", enabled: false },
      { kind: "syncthing", label: "dx3", href: "", enabled: false },
      { kind: "syncthing", label: "dx5", href: "", enabled: false },
      { kind: "syncthing", label: "dx8", href: "", enabled: false },
    ],
  },

  // ══════════════════════════════════════════════════════
  // 6. Plan — plan（6 列 × 1 行）
  // ══════════════════════════════════════════════════════
  {
    id: "plan",
    title: "下一步接入计划",
    subtitle: "待验证与配置的服务",
    variant: "plan",
    accent: "gray",
    status: "planned",
    opsFacts: [
      { label: "gateway-v1 baseline", detail: "当前版本已固定为 OpenSpec 基线" },
      { label: "1105 preview", detail: "后续增强先在 1105 验证，不覆盖 1104" },
    ],
    planItems: [
      { name: "Prometheus 已接入", target: "/svc/prometheus/" },
      { name: "Grafana 已接入", target: "/svc/grafana/" },
      { name: "Router 已降级跳转", target: "/jump/router/" },
      { name: "iLO 已降级跳转", target: "/jump/ilo/" },
    ],
  },
] as const;
