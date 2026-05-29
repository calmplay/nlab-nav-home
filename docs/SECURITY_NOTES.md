# 安全约束

## 禁止项

- 禁止 secret 进入 URL query/hash。
- 禁止 secret 写入 Git。
- 禁止 secret 写入 docs。
- 禁止 secret 写入 console。
- 禁止真实密码、token、私钥提交到任何仓库位置。

## Clash Secret 处理

- secret 只存在浏览器 localStorage（key: `nlab.clash.secret.dxN`）。
- API 请求使用 `Authorization: Bearer <secret>` header。
- 打开前有预检验证（fetch /version）。
- 错误 secret 不保存。
- "重置当前" 仅清除当前机器。

## 其他服务凭据

- Prometheus：Basic Auth，凭据不由本项目保存。
- Grafana：登录凭据不由本项目保存。
- Router / iLO：凭据不由本项目保存。
- 若历史对话或日志中曾出现密码，建议轮换相关凭据。

## 禁止提交到 Git

- 生产 nginx 配置
- 备份文件（/home/cy/backup/）
- Docker compose（docker-compose.yml）
- Prometheus web.yml / prometheus.yml
- Grafana 数据库（grafana.db）
- 任何含真实密码、token、secret、private key 的文件
