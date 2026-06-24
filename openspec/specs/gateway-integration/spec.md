# gateway-integration Specification

## Purpose

Gateway integration defines how NLab services are exposed through the 0-machine nginx gateway on port `1104`.

## Requirements

### Requirement: Preserve the 1104 unified entry

The system SHALL expose the dashboard through the nginx gateway on port `1104`.

#### Scenario: User opens the public gateway

- **Given** nginx is running on the 0-machine
- **When** the user opens `http://nuist.cfushn.com:1104/`
- **Then** nginx SHALL serve the built dashboard from `/home/cy/docker_vol/nginx/html/lab-nav/`

### Requirement: Keep source and deployment separated

The project SHALL use local source development and static deployment.

#### Scenario: Developer deploys the frontend

- **Given** the source is in `~/nlab/nlab-nav-home`
- **When** the developer runs `npm run deploy:static`
- **Then** the project SHALL build `dist/`
- **And** sync only build artifacts to the server static directory
- **And** SHALL NOT require server-side Node.js development files

### Requirement: Use reverse proxy only for compatible services

The gateway SHALL use `/svc/<service>/` only for services verified to work behind a sub-path reverse proxy.

#### Scenario: Service supports sub-path proxying

- **Given** the service supports sub-path configuration or safe prefix rewriting
- **When** the service is integrated
- **Then** nginx MAY expose it at `/svc/<service>/`
- **And** the service-specific configuration SHALL be documented

### Requirement: Use jump redirects for incompatible services

The gateway SHALL use `/jump/<service>/` redirects when sub-path reverse proxying is unstable, unsupported, or high-risk.

#### Scenario: Service is incompatible with sub-path proxying

- **Given** a service has absolute paths, WebSocket constraints, strict Host handling, hardware-console behavior, or browser-only failures
- **When** the service is added to the dashboard
- **Then** the gateway SHALL provide a `/jump/<service>/` redirect to the stable legacy entry
- **And** the decision SHALL be documented as a deliberate fallback

### Requirement: Protect existing services during gateway changes

Gateway changes SHALL preserve existing ports and old service entry points.

#### Scenario: New location is added

- **Given** a new nginx location is needed
- **When** production nginx config is changed
- **Then** the operator SHALL back up the existing config
- **And** run `docker exec nginx nginx -t`
- **And** reload nginx only after validation passes
- **And** avoid modifying unrelated locations

### Requirement: Keep sensitive server files out of Git

The repository SHALL NOT store production nginx config, service secrets, Docker Compose production files, or server backup files.

#### Scenario: Developer prepares a commit

- **Given** local changes are ready
- **When** the developer reviews `git status`
- **Then** no production secrets or server-only files SHALL be staged

