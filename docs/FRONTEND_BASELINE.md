# 前端基线（frontend-bento-v1）

## 当前版本

- **Git tag**: `frontend-bento-v1`
- **提交**: `eded34a` — refactor: redesign homepage as macOS bento dashboard
- **日期**: 2026-05-29

## 技术栈

- Vite 6 + TypeScript 5.7 + 纯 CSS
- 不引入任何 UI 框架（React / Vue / Tailwind 等）
- 本地开发路径: `~/nlab/nlab-nav-home`
- 部署命令: `npm run deploy:static`
- 服务器静态目录: `/home/cy/docker_vol/nginx/html/lab-nav/`

## 当前页面设计

macOS / iOS 风格 Bento Dashboard，12 列 × 3 行 CSS Grid 布局，一屏展示无需滚动。

### 6 个 Tile

| Tile | 类型 | 位置 | Accent | 状态 |
|------|------|------|--------|------|
| Grafana 监控中心 | hero | col 1/7, row 1/3 | blue | planned |
| Clash 代理组 | group | col 7/11, row 1/2 | blue | jump |
| 远程与网络 | stack | col 11/13, row 1/3 | gray | planned |
| Prometheus | tool | col 7/11, row 2/3 | orange | planned |
| Syncthing 文件同步 | group | col 1/7, row 3/4 | green | jump |
| 下一步接入计划 | plan | col 7/13, row 3/4 | gray | planned |

### 交互规则

- 所有 enabled action 统一使用 `window.open(href, "_blank", "noopener,noreferrer")` 新标签页打开。
- planned 状态按钮 disabled，灰色不可点击。
- 跳转入口（Clash / Syncthing）通过 nginx 1104 端口 `/jump/` 路径 302 重定向。

## 后续修改原则

- **前端暂时停止视觉大改**。
- 后续只在服务接入成功后更新按钮状态和 href。
- 服务从「planned」变为「ready」时：
  1. 修改 `src/infrastructure/dashboard/dashboardCatalog.ts` 中对应 tile 的 action enabled 和 status。
  2. `npm run build && npm run deploy:static`。
  3. 浏览器验证。

## 回滚

如需回滚到此基线：
```bash
git checkout frontend-bento-v1
npm run build
npm run deploy:static
```
