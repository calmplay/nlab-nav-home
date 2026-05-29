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
    accessMode: "reverse-proxy",
    href: "/svc/router/",
    status: "online",
    risk: "medium",
    tags: ["路由器", "网络", "华为"],
    notes: "已做 proxy_redirect，绝对路径资源可能仍需验证",
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
    accessMode: "reverse-proxy",
    href: "/svc/grafana/",
    status: "online",
    risk: "medium",
    tags: ["监控", "GPU", "Grafana"],
    notes: "Grafana 支持 root_url 配置，将此值设为 /svc/grafana/ 即可正常工作",
  },
  {
    id: ServiceId("prometheus"),
    name: "Prometheus 时序数据库",
    shortName: "Prometheus",
    description: "直接查询原始时序指标，Grafana 面板的后端数据源",
    category: "monitoring",
    priority: 2,
    accessMode: "reverse-proxy",
    href: "/svc/prometheus/",
    status: "online",
    risk: "medium",
    tags: ["监控", "时序库", "Prometheus"],
    notes: "Prometheus 支持 --web.route-prefix=/svc/prometheus/ 参数",
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
    accessMode: "legacy-entry",
    href: "http://nuist.cfushn.com:50500/",
    status: "online",
    risk: "high",
    tags: ["同步", "Syncthing", "dx0"],
    notes: "Syncthing 不支持子路径部署，第一版保留原端口访问",
  },
  {
    id: ServiceId("syncthing-1"),
    name: "Syncthing · dx1",
    shortName: "Sync dx1",
    description: "1 号机文件同步状态与配置",
    category: "sync",
    priority: 2,
    accessMode: "legacy-entry",
    href: "http://nuist.cfushn.com:50501/",
    status: "online",
    risk: "high",
    tags: ["同步", "Syncthing", "dx1"],
    notes: "Syncthing 不支持子路径部署，第一版保留原端口访问",
  },
  {
    id: ServiceId("syncthing-2"),
    name: "Syncthing · dx2",
    shortName: "Sync dx2",
    description: "2 号机文件同步状态与配置",
    category: "sync",
    priority: 3,
    accessMode: "legacy-entry",
    href: "http://nuist.cfushn.com:50502/",
    status: "online",
    risk: "high",
    tags: ["同步", "Syncthing", "dx2"],
    notes: "Syncthing 不支持子路径部署，第一版保留原端口访问",
  },
  {
    id: ServiceId("syncthing-3"),
    name: "Syncthing · dx3",
    shortName: "Sync dx3",
    description: "3 号机文件同步状态与配置",
    category: "sync",
    priority: 4,
    accessMode: "legacy-entry",
    href: "http://nuist.cfushn.com:50503/",
    status: "online",
    risk: "high",
    tags: ["同步", "Syncthing", "dx3"],
    notes: "Syncthing 不支持子路径部署，第一版保留原端口访问",
  },
  {
    id: ServiceId("syncthing-8"),
    name: "Syncthing · dx8",
    shortName: "Sync dx8",
    description: "8 号机文件同步状态与配置",
    category: "sync",
    priority: 5,
    accessMode: "legacy-entry",
    href: "http://nuist.cfushn.com:50508/",
    status: "online",
    risk: "high",
    tags: ["同步", "Syncthing", "dx8"],
    notes: "Syncthing 不支持子路径部署，第一版保留原端口访问",
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
    accessMode: "reverse-proxy",
    href: "/svc/ilo/",
    status: "online",
    risk: "high",
    tags: ["iLO", "HPE", "硬件", "远程控制台"],
    notes: "SSL + WebSocket，远程控制台需验证子路径兼容性",
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
    accessMode: "legacy-entry",
    href: "http://nuist.cfushn.com:17900/",
    status: "online",
    risk: "medium",
    tags: ["Clash", "代理", "Dashboard"],
    notes: "旧网关依赖 cookie + WebSocket + API 动态路由，第一版保留跳转",
  },
];
