---
id: feature-approvals-cross-stack
type: feature
status: proposed
created: 2026-06-27
package: 'HexGuard.Approvals + @hexguard/angular-approvals'
---

# Approvals Cross-Stack Package Pair

## Summary

Server-side approval workflow engine + client-side approval management dashboard.

### .NET (`HexGuard.Approvals`)
Approval chain definition (serial/parallel/consensus), submit/approve/reject/delegate actions, escalation, audit trail, EF Core persistence, notification hooks.

### Angular (`@hexguard/angular-approvals`)
Pending approvals inbox with filters, approve/reject/delegate actions, approval chain visualization state, bulk operations, history, overdue detection.

### Integration Contract
```typescript
interface ApprovalEndpoints {
  'GET /api/approvals/pending': { params: ApprovalQuery; response: ApprovalItem[] };
  'POST /api/approvals/{id}/act': { body: ApprovalActionBody; response: ApprovalItem };
  'GET /api/approvals/history': { params: HistoryQuery; response: ApprovalItem[] };
}
```
