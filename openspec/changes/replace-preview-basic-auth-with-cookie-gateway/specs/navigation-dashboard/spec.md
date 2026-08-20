## MODIFIED Requirements

### Requirement: Provide service-oriented tiles

The dashboard SHALL group primary services into stable tiles and SHALL expose concise operational context for each primary tile. The Grafana tile SHALL expose the known GPU monitoring dashboard shortcut when its URL is configured, and MAY render an embedded Grafana preview when an authenticated embed source is configured.

#### Scenario: User scans available service groups

- **Given** the dashboard is rendered
- **Then** it SHALL include tiles for Grafana, Clash, remote/network services, Prometheus, and service planning/status notes
- **And** each tile SHALL expose its primary service purpose in concise text
- **And** each primary service tile SHALL show compact operational facts such as entry mode, authentication expectation, or fallback rationale

#### Scenario: User opens GPU monitoring

- **Given** the Grafana tile is rendered
- **When** the user activates `GPU 总览`
- **Then** the current page SHALL navigate to the configured Grafana GPU monitoring dashboard path

#### Scenario: Grafana embedded preview is configured

- **Given** the Grafana tile has an authenticated embed source
- **When** the dashboard renders after preview gateway login
- **Then** the Grafana tile SHALL render the embedded preview in the tile body
- **And** the existing Grafana navigation actions SHALL remain available

### Requirement: Keep dashboard content data-driven

The dashboard SHALL read tile labels, actions, machine buttons, plan items, operational facts, and optional embedded preview configuration from typed catalog data.

#### Scenario: Developer adds operational context to a service tile

- **Given** a service tile needs an explanatory fact
- **When** the developer updates `dashboardCatalog.ts`
- **Then** the rendering components SHALL display the fact without service-specific markup

#### Scenario: Header service counts are displayed

- **Given** the dashboard catalog changes
- **When** the header renders
- **Then** service counts SHALL be derived from catalog data instead of hard-coded literals

#### Scenario: Developer configures embedded preview content

- **Given** a tile needs embedded preview content
- **When** the developer updates typed catalog data with an embed source
- **Then** the rendering component SHALL display the embedded preview without service-specific markup

### Requirement: Open Clash actions through gateway-authenticated access

Clash machine actions in the preview dashboard SHALL use the gateway-authenticated Clash path without asking the user to enter or store a Clash API secret in frontend code or localStorage.

#### Scenario: Authenticated user opens a Clash machine

- **Given** the user has passed the preview gateway login
- **When** the user activates a Clash machine button
- **Then** the frontend SHALL set the selected machine cookie
- **And** the frontend SHALL open `/clash/#/proxies`
- **And** the frontend SHALL NOT prompt for a Clash secret
- **And** the frontend SHALL NOT store a Clash secret in localStorage
