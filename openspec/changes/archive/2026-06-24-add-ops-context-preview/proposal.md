## Why

The current dashboard is already useful as a unified entry, but it still behaves mostly like a polished link board. For lab users, the next source of confusion is operational context:

- Which entries are reverse proxies and which are redirects?
- Which services require login, Basic Auth, a browser certificate warning, or a Clash secret?
- Why do Router, iLO, and Syncthing use jump redirects instead of `/svc/`?
- Is the page being viewed on the stable `1104` gateway or a preview port?

This change enriches the dashboard with concise operational context while keeping the current `1104` deployment untouched. The enhanced build will be deployed as a preview on port `1105`.

## What Changes

- Add a small environment label in the dashboard header that distinguishes stable `1104` from preview `1105`.
- Replace hard-coded header service stats with data-derived stats from the dashboard catalog.
- Add compact operational fact chips to each tile, such as `svc reverse proxy`, `Basic Auth`, `jump fallback`, `local secret`, and `certificate warning`.
- Keep all context static, sanitized, and safe to commit.
- Deploy the resulting `dist/` to a separate nginx static directory and expose it on port `1105`.

## Capabilities

### Modified Capabilities

- `navigation-dashboard`: Adds operational context display and preview environment awareness.

### New Capabilities

- None.

## Impact

- Affected code:
  - `src/infrastructure/dashboard/dashboardCatalog.ts`
  - `src/presentation/components/DashboardHeader.ts`
  - `src/presentation/components/DashboardTile.ts`
  - `src/presentation/styles/components.css`
- Affected specs:
  - `openspec/specs/navigation-dashboard/spec.md`
- Server impact:
  - Add or update a separate nginx server/listener for `1105`.
  - Sync preview build artifacts to a separate directory.
  - Do not overwrite `/home/cy/docker_vol/nginx/html/lab-nav/`.
  - Do not modify the stable `1104` root.

