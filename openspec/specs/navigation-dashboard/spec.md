# navigation-dashboard Specification

## Purpose

The navigation dashboard is the primary user interface for accessing NLab services through the 1105 gateway.
## Requirements
### Requirement: Render the Bento dashboard as the first screen

The system SHALL render a macOS / iOS inspired Bento dashboard on the 1105 homepage and identify it as the service gateway.

#### Scenario: User opens the stable homepage

- **Given** the user opens `http://nuist.cfushn.com:1105/`
- **When** the frontend bundle loads successfully
- **Then** the page SHALL show the NLab service dashboard without requiring an additional landing page
- **And** the dashboard SHALL prioritize service access over marketing copy
- **And** the header SHALL identify the page as the 1105 gateway

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

### Requirement: Open service actions predictably

Enabled dashboard service actions SHALL navigate in the current page to the configured safe entry point. Disabled actions SHALL remain visibly disabled and SHALL NOT navigate.

#### Scenario: User opens a normal service action

- **Given** a tile action has `enabled: true`
- **When** the user activates the action
- **Then** the current page SHALL navigate to the configured safe entry point
- **And** the action SHALL NOT open a new browser tab or window

#### Scenario: User opens a machine redirect action

- **Given** a Router or iLO action has a configured jump URL
- **When** the user activates the action
- **Then** the current page SHALL navigate to the configured jump URL
- **And** the action SHALL NOT open a new browser tab or window

#### Scenario: User sees an unavailable or planned action

- **Given** a tile action has `enabled: false`
- **When** the dashboard renders
- **Then** the action SHALL be visibly disabled
- **And** it SHALL NOT attempt navigation

### Requirement: Keep dashboard content data-driven

The dashboard SHALL read tile labels, actions, machine buttons, plan items, and operational facts from typed catalog data.

#### Scenario: Developer adds operational context to a service tile

- **Given** a service tile needs an explanatory fact
- **When** the developer updates `dashboardCatalog.ts`
- **Then** the rendering components SHALL display the fact without service-specific markup

#### Scenario: Header service counts are displayed

- **Given** the dashboard catalog changes
- **When** the header renders
- **Then** service counts SHALL be derived from catalog data instead of hard-coded literals

### Requirement: Preserve frontend learning clarity

The dashboard implementation SHALL remain understandable to a backend-oriented developer learning frontend development.

#### Scenario: Developer traces a visible tile

- **Given** a visible dashboard tile
- **When** the developer searches for its label in source
- **Then** the developer SHALL find the data in a catalog
- **And** SHALL be able to trace the catalog data into DOM components and CSS classes
