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
| Router | P2 | 中 | **测试中** |
| iLO | P3 | 高 | 待接入 |

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

### Router（测试中，等待浏览器验证）

- **接入尝试日期**: 2026-05-29
- **接入方式**: /svc/router/ 反向代理（试接入）
- **修改内容**: nlab-nav.conf 新增 location `/svc/router/` → `proxy_pass http://192.168.101.1/`，含 proxy_redirect 和 cookie_path
- **nginx location**:
  ```nginx
  location /svc/router/ {
      proxy_pass http://192.168.101.1/;
      proxy_set_header Host 192.168.101.1;
      proxy_redirect http://192.168.101.1/ /svc/router/;
      proxy_redirect / /svc/router/;
      proxy_cookie_path / /svc/router/;
  }
  ```
- **curl 验证**: GET `/svc/router/` → 200，返回路由器 HTML（与旧 50000 端口内容一致）
- **状态**: 等待用户浏览器验证 CSS/JS/登录是否正常。如异常则降级为 /jump/router/

---

## 降级为 /jump/ 的服务

| 服务 | 原因 |
|------|------|
| Clash | 旧网关依赖 cookie + WebSocket + API 动态路由，暂不迁移 |
| Syncthing | 不支持子路径部署，WebSocket + 绝对路径资源 |
