# 服务矩阵

| # | 服务 | 首页显示 | 1104 入口 | 接入方式 | 旧入口 | 状态 | 说明 |
|---|------|---------|----------|---------|-------|------|------|
| 1 | 首页导航 | 首页本身 | `/` | 静态 SPA | — | 就绪 | — |
| 2 | Grafana 监控 | Grafana hero tile | `/svc/grafana/` | 反代 | `:13000` | 就绪 | GF_SERVER_ROOT_URL + SERVE_FROM_SUB_PATH |
| 3 | Prometheus | Prometheus tile | `/svc/prometheus/` | 反代 | `:19090` | 就绪 | --web.external-url + route-prefix |
| 4 | Clash dx0 | Clash group tile | `/clash/#/proxies` | API 代理 | `:17900` | 就绪 | cookie clash_machine=0 |
| 5 | Clash dx1 | Clash group tile | `/clash/#/proxies` | API 代理 | `:17900` | 就绪 | cookie clash_machine=1 |
| 6 | Clash dx2 | Clash group tile | `/clash/#/proxies` | API 代理 | `:17900` | 就绪 | cookie clash_machine=2 |
| 7 | Clash dx3 | Clash group tile | `/clash/#/proxies` | API 代理 | `:17900` | 就绪 | cookie clash_machine=3 |
| 8 | Clash dx4 | Clash group tile | `/clash/#/proxies` | API 代理 | `:17900` | 后端异常 | 后端 Clash API 502 |
| 9 | Clash dx8 | Clash group tile | `/clash/#/proxies` | API 代理 | `:17900` | 就绪 | cookie clash_machine=8 |
| 10 | Router | Remote sub-tile | `/jump/router/` | 302跳转 | `:50000` | 就地降级 | 页面 JS 子路径不兼容 |
| 11 | iLO | Remote sub-tile | `/jump/ilo/` | 302跳转 | `:50009` | 就地降级 | HTTPS/WebSocket 子路径风险 |
| 12 | Syncthing dx0 | Syncthing group tile | `/jump/syncthing-0/` | 302跳转 | `:50500` | 就地降级 | 不支持子路径 |
| 13 | Syncthing dx1 | Syncthing group tile | `/jump/syncthing-1/` | 302跳转 | `:50501` | 就地降级 | 不支持子路径 |
| 14 | Syncthing dx2 | Syncthing group tile | `/jump/syncthing-2/` | 302跳转 | `:50502` | 就地降级 | 不支持子路径 |
| 15 | Syncthing dx3 | Syncthing group tile | `/jump/syncthing-3/` | 302跳转 | `:50503` | 就地降级 | 不支持子路径 |
| 16 | Syncthing dx8 | Syncthing group tile | `/jump/syncthing-8/` | 302跳转 | `:50508` | 就地降级 | 不支持子路径 |
