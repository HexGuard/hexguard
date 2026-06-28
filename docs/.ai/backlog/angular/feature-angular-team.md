---
id: feature-angular-team
type: feature
status: proposed
created: 2026-06-27
package: '@hexguard/angular-team'
---

# @hexguard/angular-team

## Summary

Headless team/organization management â€” member list, invite flow, role assignment, seat tracking. Every B2B SaaS app needs team management; this provides multi-tenant team state.


## Goals

- Provide reactive, signal-based headless state for Angular applications
- Dependency-free at runtime beyond Angular core and tslib
- SSR-safe with TransferState awareness where applicable


## Non-Goals

- No rendered UI components — headless state, signals, and services only
- No browser globals or window-dependent code without SSR guard
- No backend API calls (consumer provides data/endpoints)

## Proposed Public API

```typescript
export function injectTeam(config: { endpoint: string }): {
  readonly members: Signal<TeamMember[]>;
  readonly pendingInvites: Signal<PendingInvite[]>;
  readonly seats: Signal<{ used: number; total: number }>;
  readonly currentUserRole: Signal<'owner' | 'admin' | 'member'>;
  readonly isLoading/error: Signal<boolean>;
  invite(email: string, role: string): Promise<void>;
  removeMember(id: string): Promise<void>;
  changeRole(id: string, role: string): Promise<void>;
  resendInvite/inviteId/cancelInvite(inviteId: string): Promise<void>;
};

export interface TeamMember { id: string; name: string; email: string; role: string; avatar?: string; joinedAt: Date; }
export interface PendingInvite { id: string; email: string; role: string; invitedAt: Date; }
```

## Implementation Plan
1. Scaffold `angular/packages/angular-team/`.
2. Implement member list, invite flow, role management with signals.
3. Add tests. Register in workspace.
