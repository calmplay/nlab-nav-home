## 1. Specify

- [x] 1.1 Create OpenSpec proposal, design, and tasks.
- [x] 1.2 Add navigation-dashboard spec delta.
- [x] 1.3 Validate OpenSpec change strictly.

## 2. Implement

- [x] 2.1 Enable Grafana `GPU 总览` action with the provided dashboard path.
- [x] 2.2 Change quick action buttons to current-page navigation.
- [x] 2.3 Change Syncthing machine buttons to current-page navigation.
- [x] 2.4 Change Router/iLO sub-tiles to current-page navigation.
- [x] 2.5 Update button comments/titles to match current-page behavior.

## 3. Verify

- [x] 3.1 Run `openspec validate enable-grafana-gpu-current-page --strict`.
- [x] 3.2 Run `npm run build`.
- [x] 3.3 Browser-check that GPU button points to the Grafana dashboard path.
- [x] 3.4 Browser-check that enabled buttons do not request new tabs.

## 4. Deploy Preview

- [x] 4.1 Sync production `dist/` to the 1105 preview directory.
- [x] 4.2 Verify `http://nuist.cfushn.com:1105/` serves the new asset.
- [x] 4.3 Verify `http://nuist.cfushn.com:1104/` still serves the previous stable asset.
