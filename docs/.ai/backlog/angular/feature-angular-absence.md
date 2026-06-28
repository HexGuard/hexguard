---
id: feature-angular-absence
type: feature
status: proposed
created: 2026-06-28
package: '@hexguard/angular-absence'
---

# @hexguard/angular-absence

## Summary

Headless leave/absence management state — request, approve, track balances, and view team calendar. For HR systems, team planning, and workforce management.

## Goals

- Leave request submission with type and dates
- Approval workflow (pending → approved/rejected by manager)
- Leave balance tracking per type (vacation, sick, personal, parental)
- Team absence calendar with conflicts
- Holiday calendar per location
- Absence policy rules (max consecutive days, notice period)
- Leave history with accrual tracking
- Half-day and partial-day support
- Attachment support (doctor's note, etc.)

## Non-Goals

- No rendered calendar UI
- No payroll integration
- No shift scheduling

## Proposed Public API

```typescript
export function injectAbsence(config: {
  endpoint: string;
  absenceTypes: AbsenceType[];
}): {
  readonly requests: Signal<AbsenceRequest[]>;
  readonly balances: Signal<AbsenceBalance[]>;
  readonly teamAbsences: Signal<TeamAbsence[]>;
  readonly teamCalendar: Signal<AbsenceCalendarDay[]>;
  readonly pendingApprovals: Signal<AbsenceRequest[]>;
  readonly selectedRequest: Signal<AbsenceRequest | null>;
  readonly isLoading/submitting: Signal<boolean>;
  // Requests
  submit(request: NewAbsenceRequest): Promise<AbsenceRequest>;
  cancel(requestId: string): Promise<void>;
  update(requestId: string, changes: Partial<AbsenceRequest>): Promise<void>;
  // Approvals
  approve(requestId: string, comment?: string): Promise<void>;
  reject(requestId: string, reason: string): Promise<void>;
  // Calendar
  readonly calendarRange: Signal<{ from: Date; to: Date }>;
  setCalendarRange(from: Date, to: Date): void;
  // Validation
  readonly conflicts: Signal<AbsenceConflict[]>;
  readonly policyViolations: Signal<PolicyViolation[]>;
};

export interface AbsenceType { id: string; name: string; isPaid: boolean; maxConsecutiveDays?: number; minNoticeDays?: number; requiresAttachment?: boolean; }
export interface AbsenceRequest { id: string; userId: string; userName: string; typeId: string; typeName: string; startDate: Date; endDate: Date; isHalfDay: boolean; halfDayPeriod?: 'am' | 'pm'; status: 'draft' | 'submitted' | 'approved' | 'rejected' | 'cancelled'; reason?: string; attachmentUrls?: string[]; submittedAt: Date; approvedBy?: string; approvedAt?: Date; }
export interface AbsenceBalance { typeId: string; typeName: string; total: number; used: number; remaining: number; unit: 'days' | 'hours'; }
export interface TeamAbsence { userId: string; userName: string; startDate: Date; endDate: Date; type: string; }
export interface AbsenceCalendarDay { date: Date; absentUsers: { userId: string; name: string }[]; isHoliday: boolean; holidayName?: string; }
export interface AbsenceConflict { type: 'team_coverage' | 'overlap'; description: string; affectedUserIds: string[]; }
export interface PolicyViolation { rule: string; message: string; }
```

## Implementation Plan
1. Scaffold `angular/packages/angular-absence/`.
2. Implement request CRUD, approval workflow, balance tracking, team calendar with signals.
3. Add conflict detection and policy validation.
4. Add tests. Register in workspace.
