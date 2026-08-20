# 服务矩阵

| # | 服务 | 首页显示 | 1105 路径 | 接入方式 | 旧入口 | 状态 | 说明 |
|---|------|---------|----------|---------|-------|------|------|
| 1 | 首页导航 | 首页本身 | `/` | 静态 SPA | — | 就绪 | — |
| 2 | Grafana 监控 | Grafana hero tile | `/svc/grafana/` | 反代 | `:13000` | 就绪 | GF_SERVER_ROOT_URL + SERVE_FROM_SUB_PATH |
| 3 | Prometheus | Prometheus tile | `/svc/prometheus/` | 反代 | `:19090` | 就绪 | --web.external-url + route-prefix |
| 4 | Clash dx0 | Clash group tile | `/clash/#/proxies` | API 代理 | — | 就绪 | cookie clash_machine=0 |
| 5 | Clash dx1 | Clash group tile | `/clash/#/proxies` | API 代理 | — | 就绪 | cookie clash_machine=1 |
| 6 | Clash dx2 | Clash group tile | `/clash/#/proxies` | API 代理 | — | 就绪 | cookie clash_machine=2 |
| 7 | Clash dx3 | Clash group tile | `/clash/#/proxies` | API 代理 | — | 就绪 | cookie clash_machine=3 |
| 8 | Clash dx4 | Clash group tile | `/clash/#/proxies` | API 代理 | 1105 后端 | 当前状态待按需核验 | — |
| 9 | Clash dx8 | Clash group tile | `/clash/#/proxies` | API 代理 | — | 就绪 | cookie clash_machine=8 |
| 10 | Router | Remote sub-tile | `/jump/router/` | 302跳转 | `:50000` | 就地降级 | 页面 JS 子路径不兼容 |
| 11 | iLO | Remote sub-tile | `/jump/ilo/` | 302跳转 | `:50009` | 就地降级 | HTTPS/WebSocket 子路径风险 |
| 12 | Syncthing | 保留停用状态 tile | — | 无入口 | — | 已弃用 | 已停用并卸载；同步文件夹内容保留 |
