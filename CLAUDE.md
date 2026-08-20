# nlab-nav-home — 项目工作说明

## 项目定位

NLab 实验室课题组服务总导航主页。通过 0 号机 nginx 的 1105 端口提供唯一 Web 入口，一站式访问课题组当前内部服务（Prometheus、Grafana、Router、iLO、Clash 等）。

GitHub: https://github.com/calmplay/nlab-nav-home

## 技术栈（不许变更）

- **Vite 6** + **TypeScript 5.7**（strict 模式，禁止 `any`）
- **纯 CSS**（CSS 变量 + BEM 风格类名）
- **原生 DOM**（`document.createElement`，禁止 `innerHTML` 拼接不可控内容）
- **禁止**引入 React / Vue / Svelte / Tailwind / Ant Design / Element Plus / shadcn/ui 等任何 UI 框架
- **禁止**引入路由库、状态管理库

## 架构约束

DDD-lite / Clean Architecture-lite 分层，依赖方向：

```
presentation → application → domain
infrastructure → domain
app → presentation / infrastructure / application
```

- **domain**：只定义实体类型、联合类型、仓库接口。不依赖 DOM / CSS / nginx / 浏览器跳转
- **application**：用例（UseCase class）。不直接操作 DOM
- **infrastructure**：具体数据源和仓库实现
- **presentation**：纯函数组件（`function createXxx(args): HTMLElement`）
- **app**：`bootstrap.ts` 是唯一组合根（Composition Root），依赖注入在此完成
- **main.ts**：只加载 CSS + 调用 bootstrap
- `src/shared/`：只放通用工具（`url.ts`、`assertNever.ts`），不放业务逻辑

所有服务卡片数据必须有明确 TypeScript 类型。分类、访问方式、风险等级用联合类型 + `assertNever()` 穷尽检查。

## 开发与部署工作流

```
MacBook (~/nlab/nlab-nav-home)  ← 唯一源码位置
  │  npm run dev / build
  ▼
dist/                            ← 构建产物（.gitignore）
  │  rsync (scripts/deploy-static.sh)
  ▼
0号机 /home/cy/docker_vol/nginx/html/lab-nav-preview/   ← 服务器只收 dist
  │  nginx 读取 (Docker nginx:1.22.1, host 网络模式)
  ▼
http://nuist.cfushn.com:1105/    ← 唯一入口
```

```bash
npm run dev           # 本地开发 http://localhost:5173
npm run build         # tsc + vite build → dist/
npm run check         # 仅检查不部署
npm run deploy:static # 构建 + rsync dist/ → 0号机
```

## 服务器信息（仅开发部署需要）

SSH 连接 0 号机：
```bash
ssh -p 11040 -i ~/.ssh/id_ed25519 cy@nuist.cfushn.com
```

Nginx 运行在 Docker 容器 `nginx`（nginx:1.22.1，host 网络模式），配置文件挂载：
- 主配置：`/home/cy/docker_vol/nginx/conf/nginx.conf`
- Server blocks：`/home/cy/docker_vol/nginx/conf/conf.d/`
- 静态文件：`/home/cy/docker_vol/nginx/html/`（本项目的 dist 部署到其下的 `lab-nav-preview/` 子目录）
- 日志：`/home/cy/docker_vol/nginx/log/`

本项目 nginx 配置文件：`/home/cy/docker_vol/nginx/conf/conf.d/nlab-nav-preview.conf`（1105 端口 server block）

重载 nginx：`docker exec nginx nginx -t && docker exec nginx nginx -s reload`

## 安全约束（CRITICAL）

- **禁止** secret / token / 密码 / 私钥 / 内网敏感配置进入 Git
- **禁止** secret 进入 URL query 或 hash
- Clash secret 仅存浏览器 localStorage（key: `nlab.clash.secret.dxN`），通过 `Authorization: Bearer` header 传递
- 生产 nginx 配置、Docker compose、Prometheus web.yml、Grafana 数据库等**绝不入仓**
- 仓库中 `nginx.example.conf` 是脱敏示例，不是生产配置
- 真实 nginx 配置在服务器维护，git commit 提交到 GitHub 的必须是脱敏版本

## 修改 nginx 配置的规则

1. 先备份：`cp /home/cy/docker_vol/nginx/conf/conf.d/nlab-nav.conf /home/cy/backup/nlab-nav-$(date +%Y%m%d-%H%M%S)/`
2. 修改后先 `docker exec nginx nginx -t`
3. 只有 nginx -t 通过才允许 `docker exec nginx nginx -s reload`
4. 只新增 location / server，不改已有配置
5. 不改其他 conf.d 文件

## 当前服务入口

| 服务 | 入口 | 方式 |
|------|------|------|
| 首页导航 | `/` | 静态 SPA |
| Prometheus | `/svc/prometheus/` | 反向代理 |
| Grafana | `/svc/grafana/` | 反向代理 |
| Clash dashboard | `/clash/` | 静态 SPA + API 代理 |
| Router | `/jump/router/` | 302 跳转 |
| iLO | `/jump/ilo/` | 302 跳转 |

## 提交约定

- 用户说"提交"时：自动生成 commit message → `git commit` → `git push`
- 提交前先 `git add` 指定文件（不使用 `git add -A`）
- 提交前 `git status` 确认没有不该提交的文件（secret、cookie、nginx 生产配置等）

## 禁止 import 残留

删除文件时必须确认没有其他文件仍在 import 它，否则 `tsc` 编译报错。
