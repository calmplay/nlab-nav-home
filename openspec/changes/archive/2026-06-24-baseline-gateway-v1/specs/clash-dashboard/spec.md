## ADDED Requirements

### Requirement: Provide machine-specific Clash entries

The dashboard SHALL provide machine buttons for configured Clash machines.

#### Scenario: User scans Clash machines

- **Given** the dashboard is rendered
- **When** the user views the Clash tile
- **Then** the user SHALL see one button per configured machine

### Requirement: Validate Clash secret before opening the dashboard

The system SHALL validate a Clash secret before saving it and opening the dashboard.

#### Scenario: User enters a valid secret

- **Given** the user selects a Clash machine
- **And** enters a valid secret
- **When** validation succeeds
- **Then** the secret MAY be stored in browser localStorage for that machine
- **And** the system SHALL open the Clash dashboard for the selected machine

#### Scenario: User enters an invalid secret

- **Given** the user selects a Clash machine
- **And** enters an invalid secret
- **When** validation fails
- **Then** the system SHALL show an error
- **And** SHALL NOT save the invalid secret
- **And** SHALL NOT open the dashboard

### Requirement: Keep Clash secret out of URLs

The system SHALL NOT place Clash secrets in URL query strings, URL hashes, or committed files.

#### Scenario: Dashboard opens after validation

- **Given** a secret has been validated
- **When** the system opens `/clash/#/proxies`
- **Then** the URL SHALL NOT contain the secret
