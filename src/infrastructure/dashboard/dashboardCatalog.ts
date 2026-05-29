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

/** 机器按钮（用于 Clash / Syncthing 组） */
export interface MachineButton {
  readonly label: string;
  readonly href: string;
  readonly hint?: string;
}

/** 接入计划条目 */
export interface PlanItem {
  readonly name: string;
  readonly target: string;
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
export type TileStatus = "ready" | "planned" | "jump";

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
    primaryAction: {
      label: "Grafana 首页",
      href: "/svc/grafana/",
      enabled: true,
      hint: "通过 1104 统一入口访问",
    },
    actions: [
      { label: "Grafana 首页", href: "/svc/grafana/", enabled: true },
      { label: "GPU 总览", href: "", enabled: false, hint: "待配置" },
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
    primaryAction: {
      label: "打开总入口",
      href: "/jump/clash/",
      enabled: true,
    },
    machines: [
      { label: "dx0", href: "/jump/clash/", hint: "进入旧网关后选择 dx0" },
      { label: "dx1", href: "/jump/clash/", hint: "进入旧网关后选择 dx1" },
      { label: "dx2", href: "/jump/clash/", hint: "进入旧网关后选择 dx2" },
      { label: "dx3", href: "/jump/clash/", hint: "进入旧网关后选择 dx3" },
      { label: "dx4", href: "/jump/clash/", hint: "进入旧网关后选择 dx4" },
      { label: "dx8", href: "/jump/clash/", hint: "进入旧网关后选择 dx8" },
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
        status: "planned",
        href: "",
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
    primaryAction: {
      label: "打开查询",
      href: "/svc/prometheus/",
      enabled: true,
      hint: "通过 1104 统一入口访问，需 Basic Auth",
    },
  },

  // ══════════════════════════════════════════════════════
  // 5. Syncthing — group（6 列 × 1 行）
  // ══════════════════════════════════════════════════════
  {
    id: "syncthing",
    title: "Syncthing 文件同步",
    subtitle: "多机器同步状态与配置入口",
    variant: "group",
    accent: "green",
    status: "jump",
    machines: [
      { label: "dx0", href: "/jump/syncthing-0/" },
      { label: "dx1", href: "/jump/syncthing-1/" },
      { label: "dx2", href: "/jump/syncthing-2/" },
      { label: "dx3", href: "/jump/syncthing-3/" },
      { label: "dx8", href: "/jump/syncthing-8/" },
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
    planItems: [
      { name: "Prometheus 已接入", target: "/svc/prometheus/" },
      { name: "Grafana 已接入", target: "/svc/grafana/" },
      { name: "Router 已降级跳转", target: "/jump/router/" },
      { name: "iLO", target: "/svc/ilo/" },
    ],
  },
] as const;
