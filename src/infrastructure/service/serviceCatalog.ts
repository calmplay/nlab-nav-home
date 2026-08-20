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
 * - reverse-proxy:  已通过 1105 的 /svc/ 路径接入
 * - redirect:       已通过 1105 的 /jump/<name>/ nginx 302 跳转接入
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
    priority: 4,
    accessMode: "redirect",
    href: "/jump/router/",
    status: "online",
    risk: "medium",
    tags: ["路由器", "网络", "华为"],
    notes: "1105 网关保留跳转；旧 50000 反代仍为实际承载入口。",
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
    priority: 2,
    accessMode: "reverse-proxy",
    href: "/svc/grafana/",
    status: "online",
    risk: "medium",
    tags: ["监控", "GPU", "Grafana"],
    notes: "经 1105 的 /svc/grafana/ 子路径反向代理访问。",
  },
  {
    id: ServiceId("prometheus"),
    name: "Prometheus 时序数据库",
    shortName: "Prometheus",
    description: "直接查询原始时序指标，Grafana 面板的后端数据源",
    category: "monitoring",
    priority: 3,
    accessMode: "reverse-proxy",
    href: "/svc/prometheus/",
    status: "online",
    risk: "medium",
    tags: ["监控", "时序库", "Prometheus"],
    notes: "经 1105 的 /svc/prometheus/ 子路径反向代理访问。",
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
    priority: 5,
    accessMode: "redirect",
    href: "/jump/ilo/",
    status: "online",
    risk: "high",
    tags: ["iLO", "HPE", "硬件", "远程控制台"],
    notes: "1105 网关保留跳转；旧 50009 SSL 反代仍为实际承载入口。",
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
    accessMode: "reverse-proxy",
    href: "/clash/#/proxies",
    status: "online",
    risk: "medium",
    tags: ["Clash", "代理", "Dashboard"],
    notes: "1105 托管 Dashboard，并由网关按机器 cookie 路由 Clash API。",
  },
];
