## Context

The dashboard currently presents six Bento tiles and stable actions. It has enough visual structure, but not enough operational explanation.

The lab services have different access semantics:

- Prometheus and Grafana are `/svc/` reverse proxies.
- Router, iLO, and Syncthing are `/jump/` redirects because sub-path proxying is unsuitable or risky.
- Clash uses an embedded static dashboard and requires a per-machine secret that must stay out of URLs.

The user asked to preview the next iteration on `1105` without replacing the current `1104` version.

## Goals / Non-Goals

**Goals:**

- Make the dashboard explain entry mode and login/compatibility expectations at a glance.
- Keep the enhancement frontend-only.
- Keep the existing visual direction; enrich, do not redesign.
- Make `1105` clearly identifiable as preview.
- Deploy preview artifacts separately from the stable `1104` artifacts.

**Non-Goals:**

- No live health checking.
- No new backend service.
- No production secret handling changes.
- No nginx changes to the existing `1104` server block except reading it for reference if needed.
- No replacement of the current stable deployment.

## Decisions

### Add typed operational facts to dashboard catalog

Each dashboard tile will optionally carry a short list of `opsFacts`. These are static, sanitized labels with optional detail text. Rendering remains data-driven.

Example labels:

- `svc reverse proxy`
- `jump fallback`
- `Basic Auth`
- `local secret`
- `cert warning`

### Render facts as compact chips

The UI should fit the current Bento layout. Facts will render as small chips under the tile header, wrapping only when needed.

### Make header stats data-derived

The current header uses hard-coded `10 services`. With dx5 additions and future service changes, this should come from `dashboardCatalog.ts`.

### Detect preview mode from browser port

The header will show a preview label when `window.location.port === "1105"`. This avoids maintaining a separate code branch just for preview deployment.

### Deploy preview to a separate directory

The preview build should be copied to a separate server directory such as:

```text
/home/cy/docker_vol/nginx/html/lab-nav-preview/
```

The stable directory remains:

```text
/home/cy/docker_vol/nginx/html/lab-nav/
```

## Risks / Trade-offs

### More text could crowd the dashboard

Mitigation:

- Use short chips.
- Keep details in `title` attributes.
- Avoid long paragraphs inside tiles.

### `1105` nginx config may not exist yet

Mitigation:

- Add a separate server block or location on the server.
- Run `nginx -t` before reload.
- Do not touch the existing `1104` static root.

### Static facts can become stale

Mitigation:

- Keep facts close to `dashboardCatalog.ts`, where entry links already live.
- Future service changes must update catalog and OpenSpec together.

