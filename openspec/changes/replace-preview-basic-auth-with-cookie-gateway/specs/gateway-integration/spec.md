## ADDED Requirements

### Requirement: Protect the 1105 preview gateway with cookie authentication

The gateway SHALL protect the `1105` preview homepage, preview static assets, preview Clash UI, preview Clash API paths, and preview jump redirects with a server-side cookie authentication gateway instead of browser Basic Auth.

#### Scenario: Anonymous user opens the preview homepage

- **Given** nginx is running on the 0-machine
- **When** a user opens `http://nuist.cfushn.com:1105/` without a valid preview login cookie
- **Then** nginx SHALL redirect the user to the preview login page
- **And** nginx SHALL NOT serve the preview dashboard HTML or frontend assets

#### Scenario: User logs in successfully

- **Given** the user submits the configured preview homepage account
- **When** the auth gateway verifies the credentials
- **Then** it SHALL issue a long-lived `HttpOnly` login cookie
- **And** it SHALL redirect the user back to the requested preview path

#### Scenario: User enters repeated bad credentials

- **Given** a client IP repeatedly submits bad preview login credentials
- **When** the configured failed-attempt threshold is reached
- **Then** the auth gateway SHALL temporarily reject further login attempts from that IP
- **And** it SHALL NOT permanently ban the IP

#### Scenario: Anonymous user opens protected direct paths

- **Given** nginx is running on the 0-machine
- **When** a user opens a `1105` preview asset, `/clash/` path, Clash API path, `/jump/` path, or protected preview `/svc/` shortcut without a valid login cookie
- **Then** nginx SHALL redirect the user to the preview login page
- **And** the direct path SHALL NOT bypass the preview gateway login barrier

#### Scenario: User opens the stable homepage

- **Given** nginx is running on the 0-machine
- **When** a user opens `http://nuist.cfushn.com:1104/`
- **Then** nginx SHALL preserve the stable gateway behavior
- **And** the `1105` cookie auth gateway SHALL NOT alter the `1104` server block

### Requirement: Keep preview service credentials server-side

The gateway SHALL keep preview homepage credentials, cookie signing keys, Grafana upstream credentials, and Clash upstream credentials server-local. These secrets MUST NOT be exposed in frontend source, localStorage, URL query strings, OpenSpec files, or Git.

#### Scenario: Authenticated user opens Grafana preview content

- **Given** the user has a valid preview login cookie
- **When** the user opens Grafana preview iframe content through the `1105` gateway
- **Then** nginx SHALL inject the server-local Grafana `read-only` credential upstream
- **And** the browser SHALL NOT receive the Grafana password or upstream `Authorization` value

#### Scenario: Authenticated user opens Clash content

- **Given** the user has a valid preview login cookie
- **When** the user opens the Clash UI or Clash API through the `1105` gateway
- **Then** nginx SHALL inject the server-local Clash credential upstream
- **And** the browser SHALL NOT receive the Clash password or upstream `Authorization` value

#### Scenario: Developer prepares repository changes

- **Given** the preview cookie gateway has been implemented
- **When** the developer reviews repository changes before commit
- **Then** no plaintext password, password hash, cookie signing key, upstream credential header, production nginx config, or server backup file SHALL be staged
