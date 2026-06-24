## Why

The Grafana hero tile still has disabled dashboard shortcuts. The GPU monitoring dashboard now has a concrete Grafana URL and should be exposed from the preview dashboard.

The current dashboard also opens most service actions in new tabs. The user now wants all jump/navigation buttons to use the current page instead, so the dashboard behaves more like a gateway console than a tab launcher.

## What Changes

- Enable the Grafana `GPU 总览` shortcut.
- Point it to the Grafana GPU monitoring dashboard:
  `/svc/grafana/d/Oxed_c6Wz2/9b2185c?orgId=1&from=now-15m&to=now&timezone=browser&var-instance=dx0:9400&var-gpu=$__all`
- Change enabled dashboard navigation actions from `window.open(..., "_blank")` to current-page navigation.
- Keep disabled buttons disabled.
- Publish the updated build only to the `1105` preview deployment.

## Capabilities

### Modified Capabilities

- `navigation-dashboard`: Enables Grafana GPU monitoring shortcut and changes dashboard navigation actions to current-page navigation.

### New Capabilities

- None.

## Impact

- Affected code:
  - `src/infrastructure/dashboard/dashboardCatalog.ts`
  - `src/presentation/components/QuickActionButton.ts`
  - `src/presentation/components/MachineButtonGroup.ts`
  - `src/presentation/components/DashboardTile.ts`
- Deployment:
  - Build locally.
  - Sync `dist/` to `/home/cy/docker_vol/nginx/html/lab-nav-preview/`.
  - Do not overwrite the stable `1104` static root.

