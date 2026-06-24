## Why

Backfill the OpenSpec record for the already-implemented `gateway-v1` product baseline.

The project was developed through conversation-first iteration. That produced a working dashboard and gateway integration, but the OpenSpec baseline was missing.

Future changes should be spec-driven. To make that possible, the current shipped behavior needs to become the source of truth before additional features are proposed.

## What Changes

- Document the current 1104 unified service dashboard.
- Document the current gateway integration strategy.
- Document the current Clash dashboard secret handling model.
- Capture the current deployment and safety constraints.
- Establish current source-of-truth specs under `openspec/specs/`.
- Archive this historical baseline change after validation.

## Capabilities

### New Capabilities

- `navigation-dashboard`: Homepage Bento dashboard behavior and data-driven tile model.
- `gateway-integration`: 1104 gateway deployment, `/svc/` reverse proxy, and `/jump/` fallback behavior.
- `clash-dashboard`: Machine-specific Clash dashboard entry and secret handling.

### Modified Capabilities

- None. This is a baseline backfill.

## Impact

- Adds OpenSpec documentation under `openspec/`.
- Does not change frontend code, nginx production config, Docker Compose, or deployed service behavior.
- Does not capture secrets, passwords, tokens, or production config.
