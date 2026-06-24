## Context

The current shipped system already provides:

- A Bento-style homepage at `http://nuist.cfushn.com:1104/`.
- `/svc/prometheus/` reverse proxy.
- `/svc/grafana/` reverse proxy.
- `/clash/` static Clash dashboard integration.
- `/jump/router/` redirect for Router.
- `/jump/ilo/` redirect for iLO.
- `/jump/syncthing-*` redirects for Syncthing.

Earlier development was conversation-driven, so this design records the existing architecture as the OpenSpec baseline.

## Goals / Non-Goals

**Goals:**

- Capture the implemented `gateway-v1` behavior as current product truth.
- Keep future work anchored to explicit capabilities and requirements.
- Preserve security and deployment boundaries.
- Keep the codebase understandable for a backend-oriented developer learning frontend development.

**Non-Goals:**

- No code implementation.
- No visual redesign.
- No production nginx or Docker changes.
- No service credential capture.

## Decisions

The product is a static dashboard deployed behind a single nginx gateway. It avoids a backend application server and relies on:

- Static frontend build artifacts.
- Sanitized static catalogs in TypeScript.
- nginx reverse proxy for compatible services.
- nginx redirects for incompatible services.
- Browser localStorage and controlled dashboard state for Clash secrets.

### Frontend

The frontend is built with Vite and TypeScript. Rendering uses native DOM APIs and project-owned CSS.

Key files:

- `src/main.ts`: CSS imports and app startup.
- `src/app/bootstrap.ts`: composition root.
- `src/presentation/pages/HomePage.ts`: dashboard page.
- `src/presentation/components/DashboardGrid.ts`: Bento layout.
- `src/presentation/components/DashboardTile.ts`: tile rendering.
- `src/infrastructure/dashboard/dashboardCatalog.ts`: dashboard data.

### Gateway

The gateway is nginx on the 0-machine, exposed through port `1104`.

Static frontend files are deployed to:

```text
/home/cy/docker_vol/nginx/html/lab-nav/
```

The repository contains only a sanitized `nginx.example.conf`. Production nginx config remains on the server.

### Service Access Modes

`/svc/` is used for services that tolerate sub-path reverse proxy:

- Prometheus
- Grafana

`/jump/` is used for services where sub-path proxy is unstable or too risky:

- Router
- iLO
- Syncthing

Clash uses an embedded static dashboard under `/clash/` with API proxy support and secret validation.

### Static frontend deployment

The dashboard does not need a server-rendered app or frontend backend. Static deployment keeps the 0-machine simple and avoids server-side source checkout.

### Existing service ports remain alive

The gateway is an additive layer. Existing ports and legacy paths are preserved for rollback and compatibility.

### Fallback redirects are product behavior

Router, iLO, and Syncthing are not forced into brittle sub-path proxying. Redirects are documented stable paths.

### Clash secrets stay out of URLs

Secrets are entered through a modal, validated, and stored only in browser-controlled storage. The URL must never contain a secret.

## Risks / Trade-offs

### Production config leaks into Git

Mitigation:

- Keep only sanitized examples in Git.
- Review `git status` before commits.
- Never stage server backups or production config files.

### A reverse proxy breaks a complex service UI

Mitigation:

- Verify with curl and browser.
- Use `/jump/` when browser behavior fails.
- Document the fallback.

### Future agents over-expand scope

Mitigation:

- Use OpenSpec change folders.
- Explicitly list out-of-scope items.
- Require verification and rollback notes for gateway changes.
