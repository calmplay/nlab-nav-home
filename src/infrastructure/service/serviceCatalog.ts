import { ServiceId } from "../../domain/service/ServiceId";
import type { Service } from "../../domain/service/Service";

/**
 * 实验室服务清单 —— 集中维护所有服务的元数据。
 *
 * 修改规则：
 * - 新增服务：在下方数组中追加一条
 * - 修改服务信息：直接编辑对应条目
 * - 删除服务：移除条目即可
 *
 * 接入状态说明：
 * - redirect:       已通过 /jump/<name>/ nginx 302 跳转接入
 * - planned:        规划中，待第四阶段 /svc/ 反向代理验证后接入
 * - not-integrated: 明确暂不接入
 *
 * 安全提醒：此文件不包含 secret、token、密码，
 * 可以安全提交到 public GitHub 仓库。
 */
export const SERVICE_CATALOG: readonly Service[] = [
  // ═══════════════════════════════════════════════════════════
  // 网络与路由
  // ═══════════════════════════════════════════════════════════
  {
    id: ServiceId("router"),
    name: "华为路由器管理",
    shortName: "Router",
    description: "实验室主路由器 Web 管理界面，用于端口映射、DHCP、静态路由等配置",
    category: "network",
    priority: 1,
    accessMode: "planned",
    href: "",
    status: "online",
    risk: "medium",
    tags: ["路由器", "网络", "华为"],
    notes: "已通过 50000 端口提供 nginx 反代，待第四阶段接入 /svc/router/。需验证 proxy_redirect 兼容性",
  },

  // ═══════════════════════════════════════════════════════════
  // 监控与指标
  // ═══════════════════════════════════════════════════════════
  {
    id: ServiceId("grafana"),
    name: "Grafana 监控面板",
    shortName: "Grafana",
    description: "GPU 温度/功耗/使用率 + 节点 CPU/内存/磁盘监控",
    category: "monitoring",
    priority: 1,
    accessMode: "planned",
    href: "",
    status: "online",
    risk: "medium",
    tags: ["监控", "GPU", "Grafana"],
    notes: "运行在 dx0:3000 (Docker)。待第四阶段接入 /svc/grafana/，需配置 Grafana root_url",
  },
  {
    id: ServiceId("prometheus"),
    name: "Prometheus 时序数据库",
    shortName: "Prometheus",
    description: "直接查询原始时序指标，Grafana 面板的后端数据源",
    category: "monitoring",
    priority: 2,
    accessMode: "planned",
    href: "",
    status: "online",
    risk: "medium",
    tags: ["监控", "时序库", "Prometheus"],
    notes: "运行在 dx0:9090 (Docker)。待第四阶段接入 /svc/prometheus/，需配置 --web.route-prefix",
  },

  // ═══════════════════════════════════════════════════════════
  // 文件同步
  // ═══════════════════════════════════════════════════════════
  {
    id: ServiceId("syncthing-0"),
    name: "Syncthing · dx0",
    shortName: "Sync dx0",
    description: "0 号机文件同步状态与配置",
    category: "sync",
    priority: 1,
    accessMode: "redirect",
    href: "/jump/syncthing-0/",
    status: "online",
    risk: "high",
    tags: ["同步", "Syncthing", "dx0"],
    notes: "通过 /jump/ 跳转到原 50500 端口。Syncthing 不支持子路径，无法做 /svc/ 反代",
  },
  {
    id: ServiceId("syncthing-1"),
    name: "Syncthing · dx1",
    shortName: "Sync dx1",
    description: "1 号机文件同步状态与配置",
    category: "sync",
    priority: 2,
    accessMode: "redirect",
    href: "/jump/syncthing-1/",
    status: "online",
    risk: "high",
    tags: ["同步", "Syncthing", "dx1"],
    notes: "通过 /jump/ 跳转到原 50501 端口",
  },
  {
    id: ServiceId("syncthing-2"),
    name: "Syncthing · dx2",
    shortName: "Sync dx2",
    description: "2 号机文件同步状态与配置",
    category: "sync",
    priority: 3,
    accessMode: "redirect",
    href: "/jump/syncthing-2/",
    status: "online",
    risk: "high",
    tags: ["同步", "Syncthing", "dx2"],
    notes: "通过 /jump/ 跳转到原 50502 端口",
  },
  {
    id: ServiceId("syncthing-3"),
    name: "Syncthing · dx3",
    shortName: "Sync dx3",
    description: "3 号机文件同步状态与配置",
    category: "sync",
    priority: 4,
    accessMode: "redirect",
    href: "/jump/syncthing-3/",
    status: "online",
    risk: "high",
    tags: ["同步", "Syncthing", "dx3"],
    notes: "通过 /jump/ 跳转到原 50503 端口",
  },
  {
    id: ServiceId("syncthing-8"),
    name: "Syncthing · dx8",
    shortName: "Sync dx8",
    description: "8 号机文件同步状态与配置",
    category: "sync",
    priority: 5,
    accessMode: "redirect",
    href: "/jump/syncthing-8/",
    status: "online",
    risk: "high",
    tags: ["同步", "Syncthing", "dx8"],
    notes: "通过 /jump/ 跳转到原 50508 端口",
  },

  // ═══════════════════════════════════════════════════════════
  // 远程管理
  // ═══════════════════════════════════════════════════════════
  {
    id: ServiceId("ilo"),
    name: "HPE iLO 5 远程管理",
    shortName: "iLO",
    description: "dx8 HPE 服务器硬件级远程管理：电源控制、虚拟控制台、故障日志",
    category: "remote-management",
    priority: 1,
    accessMode: "planned",
    href: "",
    status: "online",
    risk: "high",
    tags: ["iLO", "HPE", "硬件", "远程控制台"],
    notes: "已通过 50009 端口提供 SSL 反代。待第四阶段验证 /svc/ilo/ 的 SSL + WebSocket 兼容性",
  },

  // ═══════════════════════════════════════════════════════════
  // 代理与网关
  // ═══════════════════════════════════════════════════════════
  {
    id: ServiceId("clash-gateway"),
    name: "Clash 代理管理",
    shortName: "Clash",
    description: "多服务器 Clash 代理 Dashboard：切换机器、查看代理规则与连接",
    category: "proxy",
    priority: 1,
    accessMode: "redirect",
    href: "/jump/clash/",
    status: "online",
    risk: "medium",
    tags: ["Clash", "代理", "Dashboard"],
    notes: "通过 /jump/clash/ nginx 302 跳转到旧 17900 网关。后续评估迁移到新导航页",
  },
];
