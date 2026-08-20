# 项目交接背景

本文档给下一位协作者、未来的自己，或新的 AI coding agent 快速接手 `nlab-nav-home` 使用。它不是 README 的替代品，而是把项目背景、决策原因、当前状态和继续工作的边界集中放在一起。

## 背景来源

- 共享对话: https://chatgpt.com/share/6a3bb26d-82d0-83ec-913e-eeabdb674956
- 本仓库提交历史: `git log --oneline --decorate --graph --all`
- 现有项目文档:
  - `docs/PROJECT_GOALS.md`
  - `docs/FRONTEND_BASELINE.md`
  - `docs/SERVICE_INTEGRATION_NOTES.md`
  - `docs/SERVICE_MATRIX.md`
  - `docs/ACCEPTANCE_V1.md`
  - `docs/OPERATIONS.md`
  - `CLAUDE.md` / `AGENTS.md`

共享对话标题是「Nginx 服务整合与导航页」。核心脉络是：用户希望把 0 号机现有 nginx 体系整理成实验室统一入口，尽量只通过路由器暴露的 `1104` 端口访问所有内部服务；现有服务必须保留，新增导航页和必要 nginx 配置时不能破坏旧入口。

## 一句话定位

`nlab-nav-home` 是 NLab 实验室服务总导航。它是一个 Vite + TypeScript + 原生 DOM + 纯 CSS 的静态前端，部署到 0 号机 nginx 的静态目录，通过 1104 正式入口和 1105 预览入口访问 Prometheus、Grafana、Clash、Router、iLO 等服务。

## 用户目标与偏好

用户前端经验较少，希望一边做一边学，适合用费曼式方式解释：先讲清楚“这段代码在现实里解决什么问题”，再讲语法和实现细节。

执行偏好：

- 不要大而泛地自由发挥，要把任务拆小。
- 每次涉及服务器、nginx、Docker、部署前，要先说明会影响什么。
- 对 Claude Code 或其他 agent 的任务指令要非常具体，包含停止点、验证标准和回滚方式。
- 不要把前端、nginx、Docker、服务配置混在一个大任务里同时改。
- 不能接触、记录、输出任何密码、secret、token、私钥。

## 当前架构

技术栈固定：

- Vite 6
- TypeScript 5.7 strict
- 原生 DOM，使用 `document.createElement`
- 纯 CSS
- 不引入 React / Vue / Tailwind / UI 框架 / 路由库 / 状态管理库

源码结构遵循轻量 DDD / Clean Architecture-lite：

```text
presentation -> application -> domain
infrastructure -> domain
app -> presentation / infrastructure / application
```

但当前首页已经从早期“服务 section 卡片列表”演进为 macOS / iOS 风格 Bento dashboard。实际首页主要由这些文件驱动：

- `src/presentation/pages/HomePage.ts`: 首页入口
- `src/presentation/components/DashboardGrid.ts`: Bento 网格
- `src/presentation/components/DashboardTile.ts`: tile 渲染
- `src/infrastructure/dashboard/dashboardCatalog.ts`: 首页 tile 数据源
- `src/features/clash/*`: Clash 机器按钮、secret 验证、跳转到内置 Clash dashboard

旧的 `src/infrastructure/service/serviceCatalog.ts` 仍保留服务清单，主要用于服务元数据和文档一致性，不是当前 Bento 首页唯一数据源。

## 部署模型

固定流程：

```bash
cd ~/nlab/nlab-nav-home
npm run build
npm run deploy:static
```

部署路径：

- 本地源码: `~/nlab/nlab-nav-home`
- 构建产物: `dist/`
- 服务器静态目录: `/home/cy/docker_vol/nginx/html/lab-nav/`
- 对外入口: `http://nuist.cfushn.com:1104/`

服务器只放 `dist/`，不维护 `src/`、`.git/`、`node_modules/`。

## 服务接入原则

优先通过 `/svc/<name>/` 子路径反向代理。若服务不适合子路径反代，则降级为 `/jump/<name>/` 302 跳转。降级不是失败，而是稳定性优先的明确选择。

当前服务状态：

| 服务 | 当前入口 | 方式 | 状态 |
|---|---|---|---|
| 首页 | `/` | 静态 SPA | 已上线 |
| Prometheus | `/svc/prometheus/` | 反向代理 | 已接入，Basic Auth |
| Grafana | `/svc/grafana/` | 反向代理 | 已接入 |
| Clash | `/clash/` | 本项目托管静态 dashboard + API 代理 | 已接入 |
| Router | `/jump/router/` | 302 跳转 | 已降级 |
| iLO | `/jump/ilo/` | 302 跳转 | 已降级 |
| Syncthing | — | 无入口 | 已弃用，文件夹内容保留 |

重要历史判断：

- Prometheus 支持通过 external-url / route-prefix 配合 nginx 子路径接入。
- Grafana 支持 root_url / serve_from_sub_path。
- Router 在 `/svc/router/` 下浏览器白板，控制台出现 `Unexpected token '<'`，判断为子路径 API 不兼容，改为跳转。
- iLO 涉及 HTTPS、自签名证书、WebSocket、硬件页面 Host 校验，保持跳转。
- Syncthing 已于 2026-08-20 停用并撤除 nginx 跳转入口，原同步文件夹内容保留。
- Clash secret 绝不能进入 URL。当前设计是本地 modal 输入，localStorage 保存，预检通过后写入 Clash dashboard 需要的配置并打开 `/clash/#/proxies`。

## 关键提交与标签

重要标签：

- `frontend-bento-v1`: 前端 Bento dashboard 基线。
- `pre-clash-static-migration-20260529-184640`: Clash 静态资源迁入前的保护点。
- `gateway-v1`: 首轮统一入口验收基线。

重要提交阶段：

- 初始化项目：搭建 Vite + TypeScript + 纯 CSS + DDD-lite 分层。
- 增加本地构建和 rsync 部署脚本。
- 修复 `index.html` 缺少 `<div id="app"></div>` 导致白屏的问题。
- 从暗色列表页重构为浅色 compact board。
- 进一步重构为 macOS / iOS 风格 Bento dashboard，并打 `frontend-bento-v1`。
- 分阶段接入 Prometheus、Grafana、Router、iLO。
- 迁入 Clash dashboard 静态资源，避免依赖旧 17900 页面作为新主入口。
- 增加项目目标、服务接入记录、验收和运维文档。

当前 HEAD:

```text
943456e docs: add CLAUDE.md and AGENTS.md for project context
```

## 当前未提交改动

截至本文档创建时，工作区有 5 个未提交文件，语义集中在新增 `dx5`：

```text
M nginx.example.conf
M src/features/clash/domain/ClashMachine.ts
M src/features/clash/infrastructure/clashMachines.ts
M src/infrastructure/dashboard/dashboardCatalog.ts
M src/infrastructure/service/serviceCatalog.ts
```

改动内容：

- Clash 机器列表新增 `dx5`，API 端口为 `17805`。
- Dashboard Clash tile 新增 `dx5` 按钮。

接手时必须先确认：

```bash
git status --short
git diff --check
npm run build
```

如果要提交这些改动，建议提交信息：

```text
feat: add dx5 service entries
```

## 安全边界

严禁提交：

- 生产 nginx 配置
- Docker compose 真实文件
- Prometheus `web.yml`
- Grafana 数据库或配置
- Clash secret
- 密码、token、私钥、cookie
- 服务器备份文件

仓库中的 `nginx.example.conf` 是脱敏示例，不代表生产配置完整内容。

修改 nginx 生产配置时必须：

1. 先备份。
2. 只改目标 location，不顺手改其他服务。
3. 先执行 `docker exec nginx nginx -t`。
4. 只有检查通过才 `docker exec nginx nginx -s reload`。
5. 保留旧入口，不删除旧端口。

修改 Prometheus / Grafana / Clash / Router / iLO 这类服务时，必须把“是否会重启服务、是否会影响旧入口、如何回滚”写清楚。

## 后续开发建议

短期优先级：

1. 处理当前 `dx5` 未提交改动，确认 nginx 真实配置和服务可达后提交。
2. 同步维护 `docs/SERVICE_MATRIX.md` 与实际服务状态。
3. 如果 `gateway-v1` 后又新增 dx5，补一条 `docs/CHANGELOG.md`。
4. 本地跑 `npm run build`，必要时部署并浏览器验证 1104 首页。

中期可做：

- Grafana 深链接：GPU 总览、节点资源、磁盘容量等按钮目前仍是待配置。
- Clash dx4 后端异常曾被记录为 502，若后端恢复，再更新服务矩阵。
- 继续保持 Router / iLO 为跳转方案，不要轻易重启子路径反代尝试。

不建议现在做：

- 大改前端视觉。
- 引入前端框架。
- 把 nginx 生产配置纳入 Git。
- 同时修改前端、nginx、Docker compose 和服务配置。

## 给新协作者的工作方式

开始任何任务前，先读：

```text
CLAUDE.md
AGENTS.md
docs/PROJECT_GOALS.md
docs/SERVICE_MATRIX.md
docs/SERVICE_INTEGRATION_NOTES.md
```

如果任务涉及服务接入，用这个顺序：

1. 只读审计当前服务和 nginx 配置。
2. 给出风险判断和接入方式。
3. 用户确认后再改服务器配置。
4. curl 验证。
5. 浏览器人工验证。
6. 再更新前端按钮。
7. 最后更新文档和提交。

如果任务涉及前端学习，用这个顺序解释：

1. 这个功能在页面上是什么。
2. 数据在哪个 catalog 里。
3. 哪个组件把数据变成 DOM。
4. 哪段 CSS 控制样式。
5. 改一处小地方验证结果。
