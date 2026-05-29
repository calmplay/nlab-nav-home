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
| Grafana | P1 | 中 | 待接入 |
| Router | P2 | 中 | 待接入 |
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

---

## 降级为 /jump/ 的服务

| 服务 | 原因 |
|------|------|
| Clash | 旧网关依赖 cookie + WebSocket + API 动态路由，暂不迁移 |
| Syncthing | 不支持子路径部署，WebSocket + 绝对路径资源 |
