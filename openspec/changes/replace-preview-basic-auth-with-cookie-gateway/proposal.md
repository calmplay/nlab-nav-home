## Why

The current `1105` preview gateway uses browser Basic Auth, which is simple but cannot provide a durable login cookie, failure-count policy, or controlled service-side single sign-on behavior. The preview gateway should move to a lightweight cookie auth gateway while keeping secrets server-local and leaving the stable `1104` gateway unchanged.

## What Changes

- Replace `1105` preview Basic Auth with a small server-side cookie login gateway.
- Change the preview login account to the requested homepage account, storing only server-local password verification material.
- Issue a long-lived `HttpOnly` cookie after successful login so the browser stays logged in until the cookie is cleared or the token expires.
- Rate-limit failed login attempts by client IP with a temporary lockout after repeated failures.
- Keep unauthenticated users from receiving homepage assets, Clash assets, jump redirects, or proxied preview service shortcuts.
- Add Grafana iframe preview back to the homepage, backed by server-side read-only Grafana credentials rather than frontend-stored credentials.
- Make Clash entry buttons open the Clash dashboard without asking for a separate secret, with nginx injecting the Clash API credential server-side after homepage login.
- Keep Router, iLO, and other non-exempt services as post-gateway redirects that use their own downstream authentication.
- Supersede the uncommitted `protect-gateway-with-basic-auth` preview change.

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- `gateway-integration`: Replaces preview Basic Auth with cookie auth, IP-based failed-login lockout, and server-side Grafana/Clash credential injection for the `1105` preview gateway.
- `navigation-dashboard`: Adds the Grafana embedded preview and changes Clash buttons to use gateway-authenticated access without a frontend secret prompt.

## Impact

- Affected frontend code:
  - Grafana tile rendering and catalog data.
  - Clash dashboard opening flow.
- Affected server-side preview configuration:
  - `1105` nginx server block.
  - Server-local auth gateway script/service.
  - Server-local credential include files.
- The stable `1104` gateway and its static root remain unchanged.
- No plaintext password, service credential, password hash, cookie signing key, or production nginx config is committed to Git.
