# nlab-nav-home OpenSpec Project

## Purpose

`nlab-nav-home` provides the unified web entry for NLab internal services through the 0-machine nginx gateway on port `1105`.

The project turns scattered service ports and legacy entry points into a stable dashboard that users can open at:

```text
http://nuist.cfushn.com:1105/
```

## Product Principles

1. Preserve only legacy entry points still required by a 1105 path.
2. Use public gateway port `1105` for user-facing access.
3. Use `/svc/<service>/` reverse proxy only when the service is compatible with sub-path deployment.
4. Use `/jump/<service>/` redirect when reverse proxy is unstable or high-risk.
5. Treat fallback to `/jump/` as a valid product decision, not a failure.
6. Keep the homepage useful as an operations entry, not only a link collection.
7. Explain changes in a way suitable for a backend-oriented developer learning frontend work.

## Technical Constraints

- Vite 6 + TypeScript 5.7.
- TypeScript strict mode.
- Native DOM rendering with `document.createElement`.
- Plain CSS with project-owned class names and CSS variables.
- No React, Vue, Svelte, Tailwind, UI frameworks, router libraries, or state management libraries.
- Source code lives on the MacBook at `~/nlab/nlab-nav-home`.
- The server receives only `dist/` build artifacts.

## Architecture Constraints

The source follows DDD-lite / Clean Architecture-lite:

```text
presentation -> application -> domain
infrastructure -> domain
app -> presentation / infrastructure / application
```

- `domain` defines entities, value types, union types, and repository interfaces.
- `application` contains use cases.
- `infrastructure` contains static catalogs and concrete integrations.
- `presentation` renders DOM and owns CSS-driven UI behavior.
- `app/bootstrap.ts` is the composition root.

For the current Bento dashboard, `src/infrastructure/dashboard/dashboardCatalog.ts` is the primary homepage data source.

## Security Constraints

The repository MUST NOT contain:

- Secret, token, password, private key, cookie, or API credential.
- Production nginx configuration.
- Docker Compose production files.
- Prometheus `web.yml` or Basic Auth hashes.
- Grafana database, production config, or credentials.
- Server backup files.

`nginx.example.conf` is a sanitized example and MUST NOT be treated as the production source of truth.

Clash secrets MUST NOT be placed in URL query strings or URL hashes.

## OpenSpec Workflow

All future behavior changes SHOULD use a change folder:

```text
openspec/changes/<verb-led-change-id>/
├── proposal.md
├── design.md
├── tasks.md
└── specs/
    └── <capability>/
        └── spec.md
```

Change IDs SHOULD be short, verb-led, and specific, for example:

- `add-service-health-snapshot`
- `add-dx5-service-entries`
- `enable-grafana-deep-links`

No code should be changed for a new feature before the proposal, design, tasks, and spec deltas are written and reviewed.
