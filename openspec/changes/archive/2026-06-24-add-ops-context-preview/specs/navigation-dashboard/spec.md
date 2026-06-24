## MODIFIED Requirements

### Requirement: Render the Bento dashboard as the first screen

The system SHALL render a macOS / iOS inspired Bento dashboard on the homepage and SHALL identify whether the user is viewing the stable gateway or a preview gateway when that can be inferred from the browser port.

#### Scenario: User opens the stable homepage

- **Given** the user opens `http://nuist.cfushn.com:1104/`
- **When** the frontend bundle loads successfully
- **Then** the page SHALL show the NLab service dashboard without requiring an additional landing page
- **And** the dashboard SHALL prioritize service access over marketing copy
- **And** the header SHALL identify the page as the stable 1104 gateway

#### Scenario: User opens the preview homepage

- **Given** the user opens `http://nuist.cfushn.com:1105/`
- **When** the frontend bundle loads successfully
- **Then** the page SHALL show the NLab service dashboard without requiring an additional landing page
- **And** the header SHALL identify the page as a 1105 preview

### Requirement: Provide service-oriented tiles

The dashboard SHALL group primary services into stable tiles and SHALL expose concise operational context for each primary tile.

#### Scenario: User scans available service groups

- **Given** the dashboard is rendered
- **Then** it SHALL include tiles for Grafana, Clash, remote/network services, Prometheus, Syncthing, and service planning/status notes
- **And** each tile SHALL expose its primary service purpose in concise text
- **And** each primary service tile SHALL show compact operational facts such as entry mode, authentication expectation, or fallback rationale

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

