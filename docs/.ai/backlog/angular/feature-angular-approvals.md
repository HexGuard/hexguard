---
id: feature-angular-approvals
type: feature
status: proposed
created: 2026-06-27
package: '@hexguard/angular-approvals'
---

# @hexguard/angular-approvals

## Summary

Headless approval workflow state — pending approvals list, approval/rejection actions, comments, delegation, and history. For expense reports, purchase orders, content review, access requests, and any multi-step approval process.

## Goals

- Pending approvals inbox with filters (by type, priority, age)
- Approve/reject with optional comment
- Approval delegation (reassign to another approver)
- Approval chain/hierarchy display (who approved in what order)
- History of past approvals with audit trail
- Bulk approve/reject for efficiency
- Due-date tracking with overdue highlighting

## Non-Goals

- No rendered approval UI components
- No workflow engine (that's HexGuard.Workflow)
- No notification sending (integrates with angular-notifications)

## Proposed Public API

```typescript
export function injectApprovals(config: {
  endpoint: string;
}): {
  readonly pending: Signal<ApprovalItem[]>;
  readonly history: Signal<ApprovalItem[]>;
  readonly selected: Signal<ApprovalItem | null>;
  readonly filters: Signal<ApprovalFilters>;
  readonly counts: Signal<{ pending: number; overdue: number }>;
  readonly isLoading: Signal<boolean>;
  readonly isSubmitting: Signal<boolean>;
  approve(id: string, comment?: string): Promise<void>;
  reject(id: string, reason: string): Promise<void>;
  delegate(id: string, userId: string, note?: string): Promise<void>;
  bulkApprove(ids: string[], comment?: string): Promise<void>;
  setFilters(f: Partial<ApprovalFilters>): void;
  refresh(): Promise<void>;
};

export interface ApprovalItem {
  id: string;
  type: string;
  title: string;
  requester: { id: string; name: string };
  submittedAt: Date;
  dueDate?: Date;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'approved' | 'rejected' | 'delegated' | 'cancelled';
  chain: ApprovalStep[];
}

export interface ApprovalFilters { type?: string; priority?: string; status?: string; search?: string; }
export interface ApprovalStep { order: number; approver: { id: string; name: string }; status: string; actedAt?: Date; comment?: string; }
```

## Implementation Plan

1. Scaffold `angular/packages/angular-approvals/`.
2. Implement pending list, approve/reject, delegation, chain display with signals.
3. Add bulk operations and filtering.
4. Add tests. Register in workspace.
