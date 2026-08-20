## 1. Specify

- [x] 1.1 Create OpenSpec proposal, design, tasks, and spec deltas.
- [x] 1.2 Remove the superseded uncommitted Basic Auth change.
- [x] 1.3 Validate the new OpenSpec change strictly.

## 2. Frontend

- [x] 2.1 Add optional embedded preview config to dashboard tile data.
- [x] 2.2 Render the Grafana embedded preview in the Grafana tile.
- [x] 2.3 Change Clash machine opening to avoid frontend secret prompts and localStorage secrets.
- [x] 2.4 Update visible operational facts to describe gateway-authenticated access.
- [x] 2.5 Build the frontend and deploy only to the 1105 preview static directory.

## 3. Server Auth Gateway

- [x] 3.1 Create/update the server-local auth gateway service with signed-cookie login and IP-based temporary lockout.
- [x] 3.2 Store preview homepage verification material and cookie signing key only server-side.
- [x] 3.3 Store Grafana and Clash upstream credential headers only server-side.
- [x] 3.4 Back up the 1105 preview nginx config.
- [x] 3.5 Replace Basic Auth with `auth_request` gates for protected 1105 paths.
- [x] 3.6 Add server-side credential injection for Grafana and Clash after gateway login.
- [x] 3.7 Validate nginx and reload only after validation passes.

## 4. Verify

- [x] 4.1 Verify anonymous `1105` homepage and asset access redirect to login without serving assets.
- [x] 4.2 Verify bad credentials fail and repeated failures trigger temporary lockout behavior.
- [x] 4.3 Verify valid credentials create a long-lived `HttpOnly` cookie and open the homepage.
- [x] 4.4 Verify Grafana iframe renders through the authenticated gateway or falls back without exposing credentials.
- [x] 4.5 Verify Clash opens without a secret prompt and API calls succeed through server-side credential injection.
- [x] 4.6 Verify `/jump/` redirects require the homepage cookie before redirecting.
- [x] 4.7 Verify Router, iLO, and Prometheus retain downstream authentication or service behavior after gateway access.
- [x] 4.8 Verify `1104` remains unchanged.
- [x] 4.9 Review `git status` and repository search results to confirm no secrets or production server files are tracked.

## 5. Stabilize Grafana Iframe Preview

- [x] 5.1 Reproduce the Chrome iframe loop as a Grafana auth-token rotation `401`.
- [x] 5.2 Add a `1105`-only nginx shim for the exact Grafana token rotation endpoint after homepage cookie auth.
- [x] 5.3 Verify the rotation endpoint no longer returns `401` after homepage login.
- [x] 5.4 Verify anonymous rotation requests still require homepage login.
- [x] 5.5 Re-run nginx validation and OpenSpec validation.

## 6. Adjust Embedded Grafana Content

- [x] 6.1 Identify the `Server Resource Overview` panel ID from the target Grafana dashboard.
- [x] 6.2 Change the Grafana iframe source to the Node Exporter `Server Resource Overview` d-solo panel.
- [x] 6.3 Build and deploy the updated preview frontend to `1105`.
- [x] 6.4 Verify the new d-solo URL returns a panel response after homepage login.

## 7. Align Grafana Read-only Identity

- [x] 7.1 Verify the Grafana `read-only` account accepts the preview homepage password.
- [x] 7.2 Update the server-local Grafana upstream credential include to use `read-only`.
- [x] 7.3 Reload nginx after validation.
- [x] 7.4 Verify `1105` Grafana gateway requests report the `read-only` user.
