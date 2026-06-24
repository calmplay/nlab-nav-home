## ADDED Requirements

### Requirement: Render the Bento dashboard as the first screen

The system SHALL render a macOS / iOS inspired Bento dashboard on the homepage.

#### Scenario: User opens the homepage

- **Given** the user opens `http://nuist.cfushn.com:1104/`
- **When** the frontend bundle loads successfully
- **Then** the page SHALL show the NLab service dashboard without requiring an additional landing page
- **And** the dashboard SHALL prioritize service access over marketing copy

### Requirement: Provide service-oriented tiles

The dashboard SHALL group primary services into stable tiles.

#### Scenario: User scans available service groups

- **Given** the dashboard is rendered
- **Then** it SHALL include tiles for Grafana, Clash, remote/network services, Prometheus, Syncthing, and service planning/status notes
- **And** each tile SHALL expose its primary service purpose in concise text

### Requirement: Open service actions predictably

Enabled service actions SHALL open the intended service entry without replacing the dashboard unless the current flow intentionally moves into an embedded dashboard.

#### Scenario: User opens a normal service action

- **Given** a tile action has `enabled: true`
- **When** the user activates the action
- **Then** the system SHALL navigate to the configured safe entry point

#### Scenario: User sees an unavailable or planned action

- **Given** a tile action has `enabled: false`
- **When** the dashboard renders
- **Then** the action SHALL be visibly disabled
- **And** it SHALL NOT attempt navigation

### Requirement: Keep dashboard content data-driven

The dashboard SHALL read tile labels, actions, machine buttons, and plan items from a typed catalog.

#### Scenario: Developer adds a service button

- **Given** the service belongs on the dashboard
- **When** the developer updates `dashboardCatalog.ts`
- **Then** the rendering components SHALL pick up the data without duplicating service-specific markup
