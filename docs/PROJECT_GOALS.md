# 项目长期目标

## 总体定位

NLab 实验室课题组服务总导航系统，为课题组提供一个统一的 Web 入口来访问所有内部服务。

## 架构目标

1. **0 号机作为统一 nginx 网关**：所有外部访问通过 0 号机的 nginx 统一代理。
2. **只维护路由器 1105 端口**：外网服务优先通过路径分发；已由 1105 接管的旧 Nginx 入口予以下线。
3. **未迁移服务保留承载入口**：Router 与 iLO 在完成子路径改制前继续保留旧入口。
4. **nlab-nav-home 是统一入口前端**：Vite + TypeScript + 纯 CSS 构建，本地开发，服务器只放 dist/。

## 开发与部署

5. **前端本地开发，服务器只放 dist/ 构建产物**：MacBook 上修改源码 → `npm run build` → `npm run deploy:static` → 0 号机 nginx 静态目录。
6. **服务接入优先 /svc/ 反向代理，不稳定则 /jump/ 跳转**：对每个服务评估子路径兼容性，能做反代就做，做不了就降级为 302 跳转。
7. **Clash 由 1105 网关承载**：旧 17900 与 17800~17899 Nginx 入口已下线。
8. **Syncthing 已弃用**：服务与 nginx 跳转入口均已撤除，原同步文件夹内容保留。

## 服务接入顺序

9. **Prometheus、Grafana、Router、iLO 后续逐个评估 /svc/**：
   - Prometheus（难度低）：支持 `--web.route-prefix`
   - Grafana（难度中）：支持 `root_url` 和 `serve_from_sub_path`
   - Router（难度中）：有 proxy_redirect 但可能有绝对路径
   - iLO（难度高）：SSL + WebSocket + 严格 Host 校验

## 安全

10. **不提交 secret、token、密码、私钥、完整内网敏感配置**：GitHub public 仓库中只保留服务名称、描述、跳转路径等公开信息。真实 nginx 配置在服务器上维护。
