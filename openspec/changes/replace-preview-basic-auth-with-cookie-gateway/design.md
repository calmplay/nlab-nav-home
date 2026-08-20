## Context

The preview dashboard on port `1105` is now protected by nginx Basic Auth. That barrier prevents anonymous asset access, but it cannot provide a persistent application-style login cookie, explicit failed-attempt counting, or server-side credential injection for services such as Grafana and Clash.

The project remains a static frontend deployed to nginx. Production nginx config and service credentials stay server-local.

## Goals / Non-Goals

**Goals:**

- Protect `1105` preview homepage, assets, `/clash/`, Clash API paths, `/jump/`, and preview `/svc/` shortcuts behind a cookie login.
- Use the requested preview homepage account and keep verification material server-local.
- Keep the login cookie long-lived and `HttpOnly`.
- Track failed login attempts by client IP and temporarily lock out the IP after repeated failures.
- Render a Grafana iframe preview for users who already passed homepage login.
- Make Clash buttons open the dashboard without prompting for a separate frontend secret.
- Keep non-exempt downstream tools independent after the gateway redirect.

**Non-Goals:**

- Add SSO, OAuth, LDAP, or a user management UI.
- Make `1104` use the preview auth gateway.
- Store Grafana or Clash credentials in frontend source, localStorage, OpenSpec files, or Git.
- Change Router, iLO, or Prometheus authentication internals.

## Decisions

### Use nginx `auth_request` plus a small local auth gateway

Nginx will delegate preview auth checks to a local Python service. The service owns login form rendering, password verification, signed-cookie issuance, and failed-attempt counting. Nginx remains the only public entry point.

### Use IP-based failed-attempt tracking

Before login, the gateway has no stable user identity. The auth service will count failed attempts by client IP, using nginx-provided `X-Real-IP`. The first version uses a short rolling window and temporary lockout; it does not permanently ban addresses because campus NAT can share one public IP across multiple users.

### Keep service credentials server-side

Grafana read-only access will be provided by nginx injecting a server-local upstream `Authorization` header after the homepage cookie is valid. Clash API access will use the same pattern with a server-local Bearer header. The browser receives neither password nor token.

The Grafana upstream identity is the dedicated `read-only` account, using the same password policy as the preview homepage login but stored only in the server-local nginx include file.

### Re-add Grafana iframe as authenticated preview content

The Grafana tile will render an iframe only when an embed source is configured. The iframe source will stay under the preview gateway origin so nginx can enforce the homepage cookie before proxying to Grafana.

The embedded preview should use the Node Exporter `Server Resource Overview` table panel so the homepage summarizes lab host resource status rather than a single GPU information panel.

Grafana's frontend still calls `POST /api/user/auth-tokens/rotate`. That endpoint rotates Grafana's own session token and returns an empty JSON object on success. The preview iframe uses server-side upstream credentials instead of a browser Grafana session, so the preview nginx gateway will handle the exact `1105` sub-path rotation request after the homepage cookie check and return an empty JSON object. This must use an auth-gated location before an internal named location because nginx `return` directives can bypass the access phase. This avoids a browser-specific 401 retry loop without exposing Grafana credentials.

### Remove frontend Clash secret flow for preview access

The Clash machine buttons will set only the target machine cookie and the dashboard's external controller metadata. They will not ask for, validate, or store a Clash secret in localStorage.

## Risks / Trade-offs

- Long-lived cookies behave like a saved login on shared browsers. Mitigation: mark the cookie `HttpOnly` and provide a logout endpoint for manual clearing.
- IP-based lockout can affect multiple users behind one NAT address. Mitigation: use temporary lockout instead of permanent bans.
- Server-side credential injection makes nginx config more sensitive. Mitigation: put headers in server-local include files and never print or commit them.
- Grafana iframe behavior depends on panel IDs and Grafana sub-path compatibility. Mitigation: keep existing full-page Grafana navigation as fallback.
- Grafana token-rotation shim is specific to the preview iframe auth model. Mitigation: scope it only to `1105`, only to the exact rotation endpoint, and keep anonymous requests behind the homepage cookie gate.

## Migration Plan

1. Remove the superseded uncommitted Basic Auth OpenSpec change.
2. Add frontend support for Grafana iframe preview and no-secret Clash opening.
3. Build and deploy only to the `1105` preview static directory.
4. Create/update server-local auth gateway files and credential include files.
5. Back up the `1105` preview nginx config.
6. Replace Basic Auth directives with `auth_request` gates and service-side credential injection.
7. Validate nginx, reload only on success, then verify anonymous, failed-login, successful-login, iframe, Clash, `/jump/`, and `1104` behavior.

Rollback is to restore the backed-up `1105` preview nginx config, stop the local auth gateway if needed, and redeploy the previous preview static assets if the frontend behavior must be reverted.
