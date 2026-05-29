# 服务接入记录

> 本文档记录每个服务的 /svc/ 反向代理接入过程，包括决策、配置修改、验证结果和回滚记录。

---

## 模板

### 服务名

- **接入日期**: YYYY-MM-DD
- **接入方式**: /svc/xxx/ 反向代理
- **是否需要修改服务配置**: 是 / 否
- **修改内容**:
- **nginx location**:
  ```nginx
  # 待填写
  ```
- **验证结果**:
  - `curl` 状态码:
  - 页面是否正常:
  - 子资源是否正常:
  - WebSocket 是否正常:
- **回滚记录**:

---

## 待接入服务

| 服务 | 优先级 | 难度 | 当前状态 |
|------|--------|------|---------|
| Prometheus | P0 | 低 | **已接入** |
| Grafana | P1 | 中 | **已接入** |
| Router | P2 | 中 | **已降级为 /jump/** |
| iLO | P3 | 高 | **已降级为 /jump/** |

---

## 已接入服务

### Prometheus

- **接入日期**: 2026-05-29
- **接入方式**: /svc/prometheus/ 反向代理
- **是否需要修改服务配置**: 是
- **修改内容**:
  - docker-compose.yml 中 prometheus command 新增两个参数：
    - `--web.external-url=http://nuist.cfushn.com:1104/svc/prometheus/`
    - `--web.route-prefix=/`
  - nlab-nav.conf 新增 location `/svc/prometheus/` → `proxy_pass http://127.0.0.1:9090/`（末尾带 `/` 剥前缀）
- **nginx location**:
  ```nginx
  location /svc/prometheus/ {
      proxy_pass http://127.0.0.1:9090/;
      proxy_http_version 1.1;
      proxy_set_header Host $host;
      proxy_set_header X-Real-IP $remote_addr;
      proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
      proxy_set_header X-Forwarded-Proto $scheme;
      proxy_set_header X-Forwarded-Host $host;
      proxy_set_header X-Forwarded-Port 1104;
      proxy_set_header X-Forwarded-Prefix /svc/prometheus;
      proxy_redirect off;
  }
  ```
- **验证结果**:
  - `curl http://127.0.0.1:1104/svc/prometheus/` → 401（Basic Auth，正常）
  - `curl http://127.0.0.1:1104/svc/prometheus/graph` → 401（路由正确，非 404）
  - 旧 :9090 访问不受影响
  - 1104 首页不受影响
- **注意事项**:
  - Prometheus 使用 Basic Auth，凭据在 web.yml 中配置
  - 敏感配置（密码、hash）不进入 GitHub
- **回滚方式**:
  ```bash
  # 恢复 docker-compose.yml（从备份）
  cp /home/cy/backup/nlab-nav-prometheus-<TS>/docker-compose.yml.bak /opt/monitoring/docker-compose.yml
  docker compose up -d prometheus
  # 恢复 nginx（或直接删掉 /svc/prometheus/ location）
  cp /home/cy/backup/nlab-nav-prometheus-<TS>/nlab-nav.conf.bak .../nlab-nav.conf
  docker exec nginx nginx -t && docker exec nginx nginx -s reload
  ```

### Grafana

- **接入日期**: 2026-05-29
- **接入方式**: /svc/grafana/ 反向代理
- **是否需要修改服务配置**: 是
- **修改内容**:
  - docker-compose.yml 中 grafana environment 新增两个环境变量：
    - `GF_SERVER_ROOT_URL: "http://nuist.cfushn.com:1104/svc/grafana/"`
    - `GF_SERVER_SERVE_FROM_SUB_PATH: "true"`
  - nlab-nav.conf 新增 location `/svc/grafana/` → `proxy_pass http://127.0.0.1:3000`（不带尾部斜杠，保留子路径）
- **nginx location**:
  ```nginx
  location /svc/grafana/ {
      proxy_pass http://127.0.0.1:3000;
      proxy_http_version 1.1;
      proxy_set_header Host $host;
      proxy_set_header X-Real-IP $remote_addr;
      proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
      proxy_set_header X-Forwarded-Proto $scheme;
      proxy_set_header X-Forwarded-Host $host;
      proxy_set_header X-Forwarded-Port 1104;
      proxy_set_header X-Forwarded-Prefix /svc/grafana;
      proxy_set_header Upgrade $http_upgrade;
      proxy_set_header Connection "upgrade";
      proxy_redirect off;
  }
  ```
- **验证结果**:
  - `curl http://nuist.cfushn.com:1104/svc/grafana/` → 302 → /svc/grafana/login
  - `curl http://nuist.cfushn.com:1104/svc/grafana/login` → 200
  - 旧 :3000 → 301 重定向到新 root_url（符合预期）
  - Prometheus 和 1104 首页不受影响
- **注意事项**:
  - 使用 `127.0.0.1` 测试时 Grafana 因 Host 校验可能返回异常，必须用 `nuist.cfushn.com` 域名
  - 具体 dashboard 快捷 URL 待后续配置后启用
- **回滚方式**:
  ```bash
  cp /home/cy/backup/nlab-nav-grafana-<TS>/docker-compose.yml.bak /opt/monitoring/docker-compose.yml
  docker compose up -d grafana
  cp /home/cy/backup/nlab-nav-grafana-<TS>/nlab-nav.conf.bak .../nlab-nav.conf
  docker exec nginx nginx -t && docker exec nginx nginx -s reload
  ```

### Router（已降级为 /jump/）

- **接入尝试日期**: 2026-05-29
- **最终方案**: /jump/router/ 302 → http://nuist.cfushn.com:50000/
- **降级原因**:
  - /svc/router/ curl GET 可返回路由器 HTML，但用户浏览器验证显示白板
  - F12 Console 报错: `Uncaught SyntaxError: Unexpected token '<' at strToJson(router/:57:26)`
  - 判断为路由器前端 JS 期望 JSON 却收到 HTML，由子路径下 API 路由不兼容导致
  - 不尝试 sub_filter 或全局路径劫持等高风险修复
- **当前 nginx 配置**:
  ```nginx
  location /svc/router/ { return 302 http://nuist.cfushn.com:50000/; }
  location = /jump/router/ { return 302 http://nuist.cfushn.com:50000/; }
  ```
- **验证**: /jump/router/ → 302 ✅, /svc/router/ → 302 ✅（fallback 避免白板）

---

## 降级为 /jump/ 的服务

| 服务 | 原因 |
|------|------|
| Clash | **已迁移到 TS 项目**：直达入口 + 密码模态框 + 本地 secret 存储 |
| Syncthing | 不支持子路径部署，WebSocket + 绝对路径资源 |
| Router | /svc/router/ 浏览器白板，JS 报错 `Unexpected token '<'`，降级为 /jump/ |
| iLO | HTTPS + WebSocket + 远程控制台，子路径反代风险极高，降级为 /jump/ |

### Router 跳转优化

- **日期**: 2026-05-29
- **优化内容**: /jump/router/ 和 /svc/router/ fallback 目标优化为 `http://nuist.cfushn.com:50000/html/index.html#/home`
- **效果**: 直接进入路由器 home 页面，跳过自动检测跳转

### iLO（已降级为 /jump/）

- **接入日期**: 2026-05-29
- **最终方案**: /jump/ilo/ 302 → https://nuist.cfushn.com:50009/
- **降级原因**:
  - iLO 旧入口为 HTTPS 50009，涉及自签名 SSL 证书
  - 远程控制台依赖 WebSocket，子路径下 URL 不可控
  - 硬件设备页面 Host 校验严格，子路径反代极不稳定
  - 稳定性优先，采用 /jump/ilo/ 302 跳转旧入口
- **nginx**: /jump/ilo/ 和 /svc/ilo/ fallback 均 302 → https://nuist.cfushn.com:50009/
- **注意事项**: 浏览器可能提示证书错误（自签名），点击"继续访问"即可

---

## 接入完成总结

截至 2026-05-29，全部 10 个服务均已通过 1104 统一入口可访问：

| 服务 | 接入方式 | 状态 |
|------|---------|------|
| Prometheus | /svc/prometheus/ 反代 | 已接入 |
| Grafana | /svc/grafana/ 反代 | 已接入 |
| Router | /jump/router/ 跳转 | 已降级 |
| iLO | /jump/ilo/ 跳转 | 已降级 |
| Clash | /jump/clash/ 跳转 | 保留旧入口 |
| Syncthing ×5 | /jump/syncthing-*/ 跳转 | 保留旧入口 |
