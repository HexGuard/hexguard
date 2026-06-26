---
id: feature-dotnet-auth
type: feature
status: proposed
created: 2026-06-26
package: HexGuard.Auth
---

# HexGuard.Auth

## Summary

Auth infrastructure — JWT issuance, refresh tokens, MFA, OAuth providers, pre-built auth endpoints. Pairs with `@hexguard/angular-auth-flow`.

## Proposed Public API

```csharp
builder.Services.AddHexGuardAuth(options => {
    options.JwtSecret = config["Jwt:Secret"];
    options.EnableRefreshTokens = true;
    options.EnableMfa = true;
    options.Providers.AddGoogle(clientId, clientSecret);
    options.Providers.AddGitHub(clientId, clientSecret);
});

app.MapAuthEndpoints("/api/auth");
// Auto: POST /login, /register, /refresh, /mfa/verify, /forgot-password, /reset-password
```

## Implementation Plan

1. Create `dotnet/src/HexGuard.Auth/`.
2. Implement JWT, refresh tokens, MFA, OAuth flows.
3. Implement pre-built auth endpoints.
4. Add tests.
5. Register in `HexGuard.slnx`.
6. Publish as NuGet.
