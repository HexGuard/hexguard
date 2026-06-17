---
id: feature-api-versioning-cross-stack
type: feature
status: proposed
created: 2026-06-17
package: 'HexGuard.ApiVersioning + @hexguard/angular-api-versioning'
---

# API Versioning Cross-Stack Package Pair

## Summary

Design a coordinated `.NET + Angular` package pair (`HexGuard.ApiVersioning` + `@hexguard/angular-api-versioning`) for standardized API version negotiation, `Sunset` and `Deprecation` header conventions, version compatibility contracts, and client-side deprecation awareness.

The repeated problem is that evolving REST APIs need to communicate version changes to clients — deprecate old versions, announce sunset dates, guide consumers to new endpoints — yet every API builds its own versioning scheme, header conventions, and deprecation communication differently. The Angular client has no standard way to detect that an endpoint is deprecated or that it should migrate to a newer version.

## Goals

- Define a shared API version model and deprecation-header conventions following IETF HTTP guidelines.
- Provide a .NET package (`HexGuard.ApiVersioning`) for version-negotiation middleware, `Sunset`/`Deprecation` header attachment, and version-compatibility helpers.
- Provide an Angular package (`@hexguard/angular-api-versioning`) for intercepting deprecation headers, displaying in-app deprecation warnings, and tracking endpoint version usage.
- Support URL-based (`/api/v1/orders`) and header-based (`Accept: application/vnd.hexguard.v2+json`) versioning.
- Integrate with ASP.NET Core's built-in API versioning (Asp.Versioning.Http) rather than replacing it.

## Non-Goals

- Replacing Asp.Versioning.Http — this package adds header conventions on top.
- Client-side API version migration logic — the Angular side warns, doesn't auto-migrate.
- Version diff or changelog generation.
- Breaking-change detection or compatibility testing.

## Decisions

- Use `Sunset` and `Deprecation` response headers following RFC 8594 and the IETF HTTP deprecation header draft.
- The Angular side uses an `HttpInterceptor` to read deprecation headers from API responses.
- Deprecation warnings are stored in-memory and exposed as signals the app can display (e.g., a banner: "API v1 will be retired on 2026-12-31").
- Build on top of Asp.Versioning.Http for core version resolution and route matching.

## Proposed Public API

### .NET

```csharp
// Middleware / conventions
app.UseHexGuardApiVersioning(options =>
{
    // Attach Deprecation and Sunset headers automatically based on version metadata
    options.DeclareVersion(1, new VersionMetadata
    {
        Deprecated = true,
        SunsetDate = new DateOnly(2026, 12, 31),
        MigrationUrl = "/api/v2/orders",
        DeprecationDate = new DateOnly(2026, 6, 1),
    });
    options.DeclareVersion(2, new VersionMetadata
    {
        Deprecated = false,
    });
});

// Per-endpoint metadata
[ApiVersion(1)]
[Deprecated(Sunset = "2026-12-31", Migration = "/api/v2/orders")]
[ApiExplorerSettings(GroupName = "v1")]
public class OrdersV1Controller : ControllerBase { }
```

### Angular

```ts
import { provideApiVersioning, injectApiVersionWarnings } from '@hexguard/angular-api-versioning';

// Provide the interceptor
export const appProviders = [
  provideHttpClient(withInterceptors([apiVersioningInterceptor])),
  provideApiVersioning(),
];

// In a component
const warnings = injectApiVersionWarnings();
warnings.activeWarnings(); // Signal<ApiVersionWarning[]>
// → [{ version: 1, sunset: '2026-12-31', message: 'API v1 will be retired on Dec 31, 2026', migrationUrl: '/api/v2/orders' }]
```

## Implementation Plan

### Phase 0: .NET — HexGuard.ApiVersioning

1. Scaffold project + test project.
2. Define `VersionMetadata` record and `ApiVersioningOptions`.
3. Implement middleware that attaches `Deprecation` and `Sunset` headers based on resolved API version.
4. Implement `[Deprecated]` attribute for controllers and endpoints.
5. Add integration tests via `WebApplicationFactory`.

### Phase 1: Angular — @hexguard/angular-api-versioning

6. Scaffold the Angular library.
7. Implement `apiVersioningInterceptor` — reads `Deprecation` and `Sunset` headers from HTTP responses, stores warnings.
8. Implement `injectApiVersionWarnings()` with signals for active warnings and a `dismiss(id)` method.
9. Add unit tests for: header parsing, multiple version warnings, dismissal, cleanup.

### Phase 2: Demo & Docs

10. Add a demo route with a mock "API v1 deprecation banner".
11. Add Playwright coverage.
12. Write deep-dive docs.
13. Update READMEs.

### Phase 3: Release

14. Add build/test/verify scripts.
15. Add release workflows.
16. Run full validation gates.

## Validation

- `pnpm dotnet:test` — .NET tests.
- `pnpm test:lib:api-versioning` — Angular tests.
- `pnpm build:lib` — builds.
- `pnpm test:e2e` — Playwright.

## Follow-Ups

- Revisit client-side version-pinning (store preferred version in localStorage) as a companion package.
- Evaluate automatic routing to migration URL when a deprecated endpoint is called.
