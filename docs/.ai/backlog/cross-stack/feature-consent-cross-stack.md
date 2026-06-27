---
id: feature-consent-cross-stack
type: feature
status: proposed
created: 2026-06-27
package: 'HexGuard.Consent + @hexguard/angular-consent-manager'
---

# Consent Management Cross-Stack Pair

## Summary

Server-side consent recording and enforcement + client-side consent preference management.

### .NET (`HexGuard.Consent`)
Consent category definition, record grants/withdrawals, version tracking, enforcement middleware, audit trail, consent export, EF Core persistence.

### Angular (`@hexguard/angular-consent-manager`)
Consent category management, granular opt-in/opt-out, version re-prompt detection, consent history, DSAR submission flow, consent export.

### Integration Contract
```typescript
interface ConsentEndpoints {
  'GET /api/consent/status': { response: ConsentStatus };
  'PUT /api/consent': { body: ConsentDecision; response: ConsentStatus };
  'GET /api/consent/history': { response: ConsentRecord[] };
  'GET /api/consent/export': { response: ConsentExport };
  'DELETE /api/consent': { response: void }; // withdraw all
}
```
