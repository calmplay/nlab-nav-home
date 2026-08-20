# Changelog

## 2026-08-20 — Syncthing 退役

- 1104 与 1105 导航均将 Syncthing 标为已弃用，机器按钮灰色不可点击。
- 撤除 `/jump/syncthing-*` 入口；同步文件夹内容保留。

## v1 — 首轮统一入口 (2026-05-29)

- 初始化 nlab-nav-home（Vite + TypeScript + 纯 CSS）
- 建立 macOS / iOS 风格 Bento Dashboard（14 列 grid）
- 1104 端口首页部署
- Prometheus `/svc/prometheus/` 反向代理接入
- Grafana `/svc/grafana/` 反向代理接入
- Router `/jump/router/` 降级跳转（页面 JS 子路径不兼容）
- iLO `/jump/ilo/` 降级跳转（HTTPS + WebSocket 无法子路径反代）
- Syncthing `/jump/syncthing-*` 跳转（不支持子路径）
- Clash dashboard 静态资源迁入 public/clash/
- Clash External Controller 机制（localStorage.externalControllers）
- Clash 1104 根路径 API 代理（/proxies /configs /version 等）
- Clash secret 预检验证 + 当前机器重置
- Clash 当前页跳转（/clash/#/proxies）
- 响应式布局（窄屏竖向叠放 + 低高度滚动）
- Plan tile 内部半透明滚动条
- 首页 Grafana 蓝色装饰圆环移除
- MachineButtonGroup 基于 kind 强类型隔离 Clash/Syncthing
- 本地开发 + rsync dist 同步部署机制
- 项目文档完善（验收/服务矩阵/运维/安全/变更日志）
