## 1. Specify

- [x] 1.1 Create OpenSpec proposal for operational context preview.
- [x] 1.2 Add navigation-dashboard spec delta.
- [x] 1.3 Validate OpenSpec change strictly.

## 2. Implement Frontend

- [x] 2.1 Extend dashboard catalog types with operational fact metadata.
- [x] 2.2 Add operational facts for Grafana, Clash, Remote, Prometheus, Syncthing, and Plan tiles.
- [x] 2.3 Render fact chips in dashboard tiles.
- [x] 2.4 Make header stats data-derived.
- [x] 2.5 Add header environment label for `1105` preview.
- [x] 2.6 Update CSS for fact chips and header label.

## 3. Verify

- [x] 3.1 Run `openspec validate add-ops-context-preview --strict`.
- [x] 3.2 Run `npm run build`.
- [x] 3.3 Inspect generated output or preview page for layout regressions.

## 4. Deploy Preview

- [x] 4.1 Build production assets locally.
- [x] 4.2 Sync `dist/` to a separate preview directory on 0-machine.
- [x] 4.3 Configure nginx port `1105` to serve the preview directory without changing the 1104 static root.
- [x] 4.4 Run nginx config test and reload only if valid.
- [x] 4.5 Verify `http://nuist.cfushn.com:1105/`.
