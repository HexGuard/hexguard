---
id: feature-dotnet-secure-headers
type: feature
status: proposed
created: 2026-06-25
package: HexGuard.SecureHeaders
---

# HexGuard.SecureHeaders

## Summary

Security headers middleware for ASP.NET Core — configure Content-Security-Policy, HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, and Permissions-Policy in a single call. Production APIs must send these headers for security compliance (OWASP, PCI-DSS, GDPR), yet every project configures them ad-hoc in `Program.cs` with hard-coded strings and inconsistent coverage.

**Competition check:** `NetEscapades.AspNetCore.SecurityHeaders` (1.5M+ downloads) is the main competitor — well-established but has grown complex with per-endpoint headers, reporting, and nonce support. **HexGuard.SecureHeaders targets a narrower, simpler API** with opinionated secure defaults and one-call setup for the 90% case.

## Why Wide Adoption

Security headers are mandatory for production web APIs and SPAs. CSP mitigates XSS, HSTS enforces HTTPS, X-Frame-Options prevents clickjacking, Permissions-Policy restricts browser feature access. Penetration testing always flags missing security headers. Every ASP.NET Core API needs this.

## Goals

1. Provide `UseSecureHeaders()` middleware that sets all standard security headers.
2. Provide `SecureHeadersOptions` class with typed properties for each header.
3. Provide sensible secure defaults (CSP: `default-src 'self'`, HSTS: 1 year+subdomains, etc.).
4. Support separate development defaults (relaxed CSP for hot-reload).
5. Support per-endpoint header overrides.
6. Pure middleware — no JS interop, no external dependencies.

## Non-Goals

- No CSP violation reporting (use `report-uri`/`report-to` directly if needed).
- No nonce generation for inline scripts (consumer configures CSP if needed).
- No HPKP (deprecated standard).

## Proposed Public API

```csharp
// ── Options ───────────────────────────────────────────────

public sealed class SecureHeadersOptions
{
    public ContentSecurityPolicyOptions? ContentSecurityPolicy { get; set; }
    public HstsOptions? StrictTransportSecurity { get; set; }
    public XFrameOptions? XFrameOptions { get; set; }
    public bool XContentTypeOptions { get; set; } = true;     // nosniff
    public ReferrerPolicy? ReferrerPolicy { get; set; }
    public string? PermissionsPolicy { get; set; }
    public bool XssProtection { get; set; } = true;           // 0 (deprecated but expected)
    public string? CrossOriginOpenerPolicy { get; set; }
    public string? CrossOriginEmbedderPolicy { get; set; }
    public string? CrossOriginResourcePolicy { get; set; }
}

public sealed class ContentSecurityPolicyOptions
{
    public string DefaultSrc { get; set; } = "'self'";
    public string? ScriptSrc { get; set; }
    public string? StyleSrc { get; set; }
    public string? ImgSrc { get; set; }
    public string? FontSrc { get; set; }
    public string? ConnectSrc { get; set; }
    public string? FrameSrc { get; set; }
    public string? ObjectSrc { get; set; }
    public string? BaseUri { get; set; }
    public string? FormAction { get; set; }
    public string? ReportUri { get; set; }
}

public enum HstsOptions
{
    None,                        // No HSTS header
    Default,                     // max-age=31536000; includeSubDomains
    Preload,                     // + preload
}

public enum XFrameOptions { Deny, SameOrigin }
public enum ReferrerPolicy { NoReferrer, NoReferrerWhenDowngrade, Origin, OriginWhenCrossOrigin, SameOrigin, StrictOrigin, StrictOriginWhenCrossOrigin, UnsafeUrl }

// ── Middleware ─────────────────────────────────────────────

public static class SecureHeadersExtensions
{
    public static IApplicationBuilder UseSecureHeaders(
        this IApplicationBuilder app,
        Action<SecureHeadersOptions>? configure = null,
        bool isDevelopment = false);
}

// ── Usage ─────────────────────────────────────────────────

// Program.cs

// Production (strict defaults)
app.UseSecureHeaders();

// Development (relaxed CSP)
app.UseSecureHeaders(options => {
    options.ContentSecurityPolicy = new() {
        DefaultSrc = "'self'",
        ScriptSrc = "'self' 'unsafe-inline' 'unsafe-eval'",   // HMR
        StyleSrc = "'self' 'unsafe-inline'",                   // HMR
    };
}, isDevelopment: true);

// Custom
app.UseSecureHeaders(options => {
    options.StrictTransportSecurity = HstsOptions.Preload;
    options.XFrameOptions = XFrameOptions.Deny;
    options.PermissionsPolicy = "camera=(), microphone=(), geolocation=()";
});
```

## Implementation Plan

1. Create `dotnet/src/HexGuard.SecureHeaders/` with standard `.csproj` (no external dependencies).
2. Implement `SecureHeadersOptions`, all sub-config types, and secure defaults.
3. Implement `SecureHeadersMiddleware` — writes headers on response start.
4. Implement development vs production mode switching.
5. Add `InternalsVisibleTo` for test project.
6. Create test project with xUnit + `WebApplicationFactory` integration tests.
7. Register in `HexGuard.slnx`.
8. Publish as NuGet package `HexGuard.SecureHeaders`.
