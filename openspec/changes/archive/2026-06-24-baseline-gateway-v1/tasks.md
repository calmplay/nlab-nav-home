# Baseline Gateway V1 Tasks

## Documentation Backfill

- [x] Create OpenSpec project context.
- [x] Document navigation dashboard baseline behavior.
- [x] Document gateway integration baseline behavior.
- [x] Document Clash dashboard baseline behavior.
- [x] Capture proposal, design, and tasks for the historical baseline.
- [x] Store the historical change under `openspec/changes/archive/`.

## Already Implemented Product Work

- [x] Build Vite + TypeScript + plain CSS dashboard.
- [x] Deploy dashboard through nginx port `1104`.
- [x] Preserve old service entry points.
- [x] Enable Prometheus through `/svc/prometheus/`.
- [x] Enable Grafana through `/svc/grafana/`.
- [x] Keep Router as `/jump/router/`.
- [x] Keep iLO as `/jump/ilo/`.
- [x] Keep Syncthing as `/jump/syncthing-*`.
- [x] Migrate Clash dashboard static assets into this project.
- [x] Keep Clash secrets out of URL query and hash.
- [x] Add project docs for goals, operations, service integration notes, and acceptance.

## Verification

- [x] Baseline specs represent the current shipped system.
- [x] No production secret or production config is recorded.
- [x] Future changes can be proposed as OpenSpec deltas.

