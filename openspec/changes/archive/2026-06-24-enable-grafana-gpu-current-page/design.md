## Context

The `1105` preview dashboard already exposes operational context and shows Grafana as the primary monitoring tile. Grafana's GPU dashboard URL is now known.

Existing button behavior is mixed:

- Quick action buttons open new tabs.
- Syncthing machine buttons open new tabs.
- Router/iLO sub-tiles open new tabs.
- Clash already navigates in the current page after secret validation.

The desired behavior is consistent current-page navigation for all enabled dashboard navigation actions.

## Goals / Non-Goals

**Goals:**

- Enable the GPU monitoring shortcut in Grafana.
- Use current-page navigation for service actions.
- Keep Clash secret validation flow unchanged except that it already lands in the current page.
- Publish only to `1105` preview.

**Non-Goals:**

- No new Grafana dashboard discovery.
- No changes to Grafana server config.
- No production nginx changes beyond static preview asset sync.
- No changes to `1104` deployment.

## Decisions

### Use relative Grafana path

The user provided the full `1105` URL. The catalog will store a relative `/svc/grafana/...` path so the same code can run correctly on the current gateway origin. On `1105`, this resolves to the requested preview URL.

### Centralize current-page navigation in click handlers

Existing DOM components can keep using `<button>` elements. Enabled click handlers will assign `window.location.href` to the target instead of calling `window.open`.

### Keep disabled shortcut behavior unchanged

Unavailable Grafana shortcuts remain disabled until concrete dashboard URLs are known.

## Risks / Trade-offs

### Users lose the old dashboard tab when leaving the page

This is intentional per user request. Browser back navigation can return to the dashboard.

### Relative paths depend on the preview nginx server carrying the same `/svc/` and `/jump/` locations

The current `1105` preview config was copied from `1104`, so these paths are expected to work. Verification must include a `/svc/grafana/` path or asset-level page check.

