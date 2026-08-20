# nlab-nav-home 首轮验收报告

> 历史记录：本报告反映首轮验收时的状态；Syncthing 已于 2026-08-20 停用，相关导航跳转已撤除。

## 验收结论

首轮基础功能完成。10 项服务全部通过 1104 统一入口可访问。

## 验收范围

| 功能 | 验收状态 |
|------|---------|
| 1104 总导航首页 (Bento Dashboard) | 通过 |
| Prometheus `/svc/prometheus/` | 通过（Basic Auth） |
| Grafana `/svc/grafana/` | 通过 |
| Router `/jump/router/` | 通过（跳转旧入口） |
| iLO `/jump/ilo/` | 通过（跳转旧入口） |
| Clash `/clash/` | 通过（迁入 nlab-nav-home） |
| Syncthing `/jump/syncthing-*` | 通过（跳转旧入口） |
| 本地开发 + dist 同步部署 | 通过 |
| GitHub public 仓库维护 | 通过 |
| macOS / iOS 风格 Bento dashboard | 通过 |

## 关键结论

- 现有服务和旧端口全部保留。
- 1104 成为统一入口。
- Prometheus 和 Grafana 使用 `/svc/` 反代。
- Router 和 iLO 由于设备页面复杂性采用 `/jump/` 稳定跳转。
- Clash 旧 17900 保留，但新主流程不再依赖 17900 页面。
- Clash dashboard 静态资源已迁入 `nlab-nav-home/public/clash`。
- Clash secret 不进入 URL，使用 localStorage 保存，通过 Authorization header 访问 API。
- Clash secret 打开前有预检验证（fetch /version）。
- Clash "重置当前" 仅清除当前机器 secret。

## 已知限制

- dx4 Clash API 后端不稳定（502），与 1104 前端无关。
- Grafana 具体 dashboard 快捷 URL 待后续配置深链接。
- iLO 由于 HTTPS + WebSocket + 远程控制台复杂性，永久保持 `/jump/` 跳转。

## 人工验证项

- 1104 首页可用。
- Prometheus 可打开并登录。
- Grafana 可打开并登录。
- Router jump 可跳转到 home。
- iLO jump 可打开旧入口。
- Clash dx 按钮可进入 1104 下迁移后的 dashboard。
- Clash 错误 secret 不保存。
- Clash 重置当前只清理当前机器。
- 页面低高度和窄屏响应式基本满意。
