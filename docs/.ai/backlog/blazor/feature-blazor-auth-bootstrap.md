---
id: feature-blazor-auth-bootstrap
type: feature
status: proposed
created: 2026-06-29
package: 'HexGuard.Blazor.AuthBootstrap'
---

# HexGuard.Blazor.AuthBootstrap

## Summary

Drop-in authentication bootstrap for new Blazor projects — pre-configured auth state, login/logout flows, token management, and auth guards with a single `AddBlazorAuth()` call. Eliminates the 50+ lines of auth setup every new project repeats.

## Problem

New Blazor projects spend 1-2 days configuring authentication: registering auth state providers, wiring cascading parameters, building login/logout pages, handling token refresh, setting up route guards, and redirecting unauthenticated users. The same code appears in every project with minor provider-specific tweaks.

## Goals

- Single `AddBlazorAuth<TProvider>()` registration call
- Built-in providers: Auth0, Azure AD/Entra, Duende IdentityServer, custom JWT
- Automatic cascading auth state injection
- Pre-built login/logout/access-denied route registration
- Token refresh with automatic retry
- Auth guard attribute for page-level protection
- Claims-based policy registration helpers
- User profile signal with typed claims access

## Non-Goals

- No rendered login/logout UI components (headless state only)
- No authentication server implementation
- No user management

## Proposed Public API

```csharp
// One-call setup in Program.cs
builder.Services.AddBlazorAuth<Auth0Provider>(options =>
{
    options.Domain = builder.Configuration["Auth0:Domain"]!;
    options.ClientId = builder.Configuration["Auth0:ClientId"]!;
    options.Audience = builder.Configuration["Auth0:Audience"];
    options.LoginPath = "/login";
    options.LogoutPath = "/logout";
    options.PostLoginRedirect = "/";
});

// In component
@inject IAuthState Auth

@if (Auth.IsAuthenticated)
{
    <p>Welcome, @Auth.User.Name</p>
    var roles = Auth.Claims.GetRoles();
    var canEdit = Auth.Claims.HasPermission("documents:edit");
}

// Auth guard
[BlazorAuth] // requires authentication
[BlazorAuth("documents:edit")] // requires specific claim
public partial class DocumentsPage { }

// Provider interface
public interface IAuthProvider
{
    Task<ClaimsPrincipal> AuthenticateAsync(HttpContext context);
    Task SignInAsync(HttpContext context, string? returnUrl = null);
    Task SignOutAsync(HttpContext context);
    Task<ClaimsPrincipal> RefreshTokenAsync(ClaimsPrincipal principal);
}
```

## Implementation Plan
1. Create `dotnet/src/HexGuard.Blazor.AuthBootstrap/` with `.csproj` (RCL).
2. Implement `IAuthProvider` interface, built-in providers, `IAuthState` service.
3. Add auth guard attribute, token refresh, claims helpers.
4. Add xunit + bUnit tests. Register in `HexGuard.slnx`.
