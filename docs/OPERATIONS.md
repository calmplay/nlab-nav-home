# 日常运维

## 开发

```bash
cd ~/nlab/nlab-nav-home
npm install
npm run dev          # 本地热更新 http://localhost:5173
npm run build        # 类型检查 + 生产构建
npm run check        # 仅检查不部署
```

## 部署

```bash
npm run deploy:static   # 构建 + rsync dist/ → 0号机
```

说明：
- 本地开发，本地构建。
- 服务器只放 `dist/` 构建产物。
- 服务器路径：`/home/cy/docker_vol/nginx/html/lab-nav/`
- 不在服务器上维护源码。
- nginx 配置变更不在此仓库内，通过服务器直接管理。

## 验证

```bash
curl -I http://nuist.cfushn.com:1104/
curl -I http://nuist.cfushn.com:1104/clash/
curl -I http://nuist.cfushn.com:1104/svc/prometheus/
curl -I http://nuist.cfushn.com:1104/svc/grafana/login
curl -I http://nuist.cfushn.com:1104/jump/router/
curl -I http://nuist.cfushn.com:1104/jump/ilo/
```

## 回滚

1. 前端回滚：`git checkout <commit>` → `npm run build` → `npm run deploy:static`
2. nginx 配置回滚：使用服务器 `/home/cy/backup/` 下对应阶段备份
3. 不在此仓库中保存真实 nginx 生产配置
