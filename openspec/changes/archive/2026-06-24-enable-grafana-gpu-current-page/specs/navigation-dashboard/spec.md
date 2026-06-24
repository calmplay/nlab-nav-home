## MODIFIED Requirements

### Requirement: Open service actions predictably

Enabled dashboard service actions SHALL navigate in the current page to the configured safe entry point. Disabled actions SHALL remain visibly disabled and SHALL NOT navigate.

#### Scenario: User opens a normal service action

- **Given** a tile action has `enabled: true`
- **When** the user activates the action
- **Then** the current page SHALL navigate to the configured safe entry point
- **And** the action SHALL NOT open a new browser tab or window

#### Scenario: User opens a machine redirect action

- **Given** a Syncthing, Router, or iLO action has a configured jump URL
- **When** the user activates the action
- **Then** the current page SHALL navigate to the configured jump URL
- **And** the action SHALL NOT open a new browser tab or window

#### Scenario: User sees an unavailable or planned action

- **Given** a tile action has `enabled: false`
- **When** the dashboard renders
- **Then** the action SHALL be visibly disabled
- **And** it SHALL NOT attempt navigation

### Requirement: Provide service-oriented tiles

The dashboard SHALL group primary services into stable tiles and SHALL expose concise operational context for each primary tile. The Grafana tile SHALL expose the known GPU monitoring dashboard shortcut when its URL is configured.

#### Scenario: User scans available service groups

- **Given** the dashboard is rendered
- **Then** it SHALL include tiles for Grafana, Clash, remote/network services, Prometheus, Syncthing, and service planning/status notes
- **And** each tile SHALL expose its primary service purpose in concise text
- **And** each primary service tile SHALL show compact operational facts such as entry mode, authentication expectation, or fallback rationale

#### Scenario: User opens GPU monitoring

- **Given** the Grafana tile is rendered
- **When** the user activates `GPU 总览`
- **Then** the current page SHALL navigate to the configured Grafana GPU monitoring dashboard path

