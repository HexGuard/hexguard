---
id: feature-dotnet-audit-trail
type: feature
status: proposed
created: 2026-06-13
updated: 2026-06-17
package: 'HexGuard.AuditTrail'
---

# .NET Audit Trail Package

## Summary

Design `HexGuard.AuditTrail` as a .NET package for standardizing audit-event capture, actor and context metadata, change summaries, and pluggable persistence for business-critical operations.

The repeated problem is that compliance, debugging, and business-intelligence requirements demand audit trails for entity changes, but every team builds the same event model (who, what, when, previous value, new value, IP address, correlation ID) with different serialization, storage, and querying patterns.

## Goals

- Define a core `AuditEvent` model with actor, action, target, change summary, timestamp, and context metadata.
- Provide `IAuditStore` abstraction with built-in in-memory store and configurable persistence.
- Provide `AuditInterceptor` for EF Core that automatically captures entity change events.
- Provide `IAuditService` for imperative audit logging from services and controllers.
- Support structured change summaries (field-level diffs for entity updates).
- Keep the package composable — storage, enrichment, and filtering are pluggable.

## Non-Goals

- Audit-log viewer or admin UI.
- Data retention or archival policies — those are storage-specific.
- Compliance certification — the package provides the data, not the audit proof.

## Decisions

- Use a flat `AuditEvent` record — no event sourcing, no event-stream replay.
- EF Core integration via `SaveChangesInterceptor` — captures before/after values automatically.
- Change summaries use a `List<PropertyChange>` model for structured diffs.
- Store interface is async-first for production database backends.

## Proposed Public API

```csharp
// Core model
public record AuditEvent(
    Guid Id,
    DateTime TimestampUtc,
    string ActorId,
    string? ActorName,
    string Action,              // "Create", "Update", "Delete", "Login", etc.
    string TargetType,
    string TargetId,
    string? Summary,
    IReadOnlyList<PropertyChange>? Changes,
    string? IpAddress,
    string? CorrelationId
);

public record PropertyChange(
    string PropertyName,
    string? OldValue,
    string? NewValue
);

// Service
public interface IAuditService
{
    Task RecordAsync(AuditEvent auditEvent, CancellationToken ct = default);
    IQueryable<AuditEvent> Query();   // for in-memory or EF-backed stores
}

// Registration
builder.Services.AddHexGuardAuditTrail(options =>
{
    options.Store = new InMemoryAuditStore();
    options.AutoCaptureEfChanges = true;  // registers EF Core interceptor
    options.ActorProvider = new HttpContextActorProvider(ctx);  // extracts user from request
});
```

## Implementation Plan

### Phase 0: Foundation

1. Scaffold project + tests.
2. Add solution file entries.

### Phase 1: Core Contracts

3. Define `AuditEvent`, `PropertyChange` records.
4. Implement `IAuditStore` and `InMemoryAuditStore`.
5. Implement `AuditService` with `RecordAsync()` and `Query()`.
6. Implement `AuditSaveChangesInterceptor` for EF Core — captures entity creates, updates, deletes with before/after values.
7. Implement `IHttpContextActorProvider` — extracts user ID, name, IP, correlation ID from `HttpContext`.
8. Implement `AddHexGuardAuditTrail()` DI extension.
9. Add unit tests for: event creation, property change capture, EF Core interceptor, actor enrichment, query filtering, store operations.

### Phase 2: Sample API & Docs

10. Add sample endpoint group to `HexGuard.SampleApi`.
11. Add integration tests.
12. Write `docs/packages/hexguard-audit-trail.md`.
13. Update README.

### Phase 3: Release

14. Add build/test entries and release workflow.
15. Run `pnpm dotnet:test` and `pnpm dotnet:build`.

## Validation

- `pnpm dotnet:test` — unit and integration tests.
- `pnpm dotnet:build` — builds.

## Follow-Ups

- Revisit structured storage backends (EF Core, MongoDB, Elasticsearch) as companion packages.
- Evaluate audit-event enrichment pipeline (add geolocation, user-agent, etc.).
- Consider integration with `HexGuard.SoftDelete` for audit-aware deletion tracking.
