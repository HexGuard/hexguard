---
id: feature-auth-cross-stack
type: feature
status: proposed
created: 2026-06-26
package: 'HexGuard.Auth + @hexguard/angular-auth-flow'
---

# Auth Cross-Stack Acceleration Pair

## Summary

Server-side auth infrastructure (`HexGuard.Auth`) + client-side auth flow state (`@hexguard/angular-auth-flow`) sharing the same token, session, and user contracts. **Pre-built auth in both stacks.**

### .NET (`HexGuard.Auth`)
JWT, refresh tokens, MFA, OAuth providers, pre-built `/api/auth` endpoints.

### Angular (`@hexguard/angular-auth-flow`)
Login/register/MFA/OAuth flow state, route guards, token refresh interceptor.
