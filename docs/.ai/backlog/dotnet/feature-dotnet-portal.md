---
id: feature-dotnet-portal
type: feature
status: proposed
created: 2026-06-27
package: HexGuard.Portal
---

# HexGuard.Portal

## Summary

Customer portal API — self-service endpoints, account management, support integration. Pairs with `@hexguard/angular-portal`.

## Proposed Public API

```csharp
builder.Services.AddPortal(options => {
    options.Sections = ["dashboard", "account", "billing", "support", "docs"];
    options.RequireAuthentication = true;
});
app.MapPortalApi("/api/portal");
// Auto: GET /dashboard, /account, /billing, /support, /docs
```

## Implementation Plan
1. Create `dotnet/src/HexGuard.Portal/`.
2. Implement portal section routing, auth integration.
3. Add tests. Register in `HexGuard.slnx`. Publish as NuGet.
