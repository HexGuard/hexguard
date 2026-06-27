---
id: feature-dotnet-claims
type: feature
status: proposed
created: 2026-06-27
package: 'HexGuard.Claims'
---

# HexGuard.Claims

## Summary

Claims transformation and authorization helpers for ASP.NET Core — enrich claims, define policy builders, and provide typed claim accessors. Reduces boilerplate in every authenticated app.

## Goals

- Claims transformation pipeline (add/remove/remap claims after authentication)
- Typed claim accessors (strongly-typed instead of magic strings)
- Fluent policy builder (combine roles, claims, scopes with AND/OR)
- Tenant-aware claim enrichment
- Permission-to-claim mapping
- Claims-based authorization handlers for common patterns

## Non-Goals

- No authentication provider (works with any auth scheme)
- No identity management
- No token issuance

## Proposed Public API

```csharp
// Typed claim access
public static class ClaimAccessors
{
    public static string? GetUserId(this ClaimsPrincipal principal);
    public static string? GetTenantId(this ClaimsPrincipal principal);
    public static string? GetEmail(this ClaimsPrincipal principal);
    public static IReadOnlyList<string> GetRoles(this ClaimsPrincipal principal);
    public static IReadOnlyList<string> GetPermissions(this ClaimsPrincipal principal);
}

// Fluent policy builder
public static class PolicyBuilderExtensions
{
    public static AuthorizationPolicyBuilder RequireAllClaims(this AuthorizationPolicyBuilder builder, params string[] claimTypes);
    public static AuthorizationPolicyBuilder RequireAnyClaim(this AuthorizationPolicyBuilder builder, params string[] claimTypes);
    public static AuthorizationPolicyBuilder RequireTenant(this AuthorizationPolicyBuilder builder, string tenantId);
}

// Claims transformation
public interface IClaimsTransformation
{
    Task<ClaimsPrincipal> TransformAsync(ClaimsPrincipal principal);
}

// Registration
public static IServiceCollection AddHexGuardClaims(this IServiceCollection services,
    Action<ClaimsOptions> configure);
```

## Implementation Plan

1. Create `dotnet/src/HexGuard.Claims/` with `.csproj`.
2. Implement typed accessors, policy builder extensions, transformation pipeline.
3. Add xunit tests.
4. Register in `HexGuard.slnx`.
