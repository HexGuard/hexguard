---
id: feature-angular-policy-attestation
type: feature
status: proposed
created: 2026-06-27
package: '@hexguard/angular-policy-attestation'
---

# @hexguard/angular-policy-attestation

## Summary

Headless policy and terms acceptance state — track which users accepted which policy versions, re-prompt on updates, and maintain audit-friendly acceptance history. For terms of service, privacy policies, EULAs, and compliance attestations.

## Goals

- Policy version tracking with acceptance state
- Re-prompt when policy version changes
- Acceptance audit trail (who, when, what version, IP)
- Bulk policy acceptance (e.g., during onboarding)
- Mandatory vs. optional policy distinction
- Acceptance expiry (e.g., annual re-acceptance)
- Integration with auth state (accepted on login)

## Non-Goals

- No policy content rendering
- No policy version authoring (server-side)
- No e-signature capture

## Proposed Public API

```typescript
export function injectPolicyAttestation(config: {
  endpoint: string;
}): {
  readonly policies: Signal<Policy[]>;
  readonly pendingAcceptance: Signal<Policy[]>;
  readonly hasPending: Signal<boolean>;
  readonly acceptanceHistory: Signal<AcceptanceRecord[]>;
  readonly isSubmitting: Signal<boolean>;
  accept(policyId: string): Promise<void>;
  acceptAll(): Promise<void>;
  getStatus(policyId: string): Signal<'accepted' | 'pending' | 'expired' | 'not-applicable'>;
};

export interface Policy {
  id: string;
  type: 'terms' | 'privacy' | 'eula' | 'cookies' | 'custom';
  name: string;
  version: number;
  isMandatory: boolean;
  expiresAfterDays?: number;
  acceptedAt?: Date;
  acceptedVersion?: number;
}

export interface AcceptanceRecord {
  policyId: string;
  version: number;
  acceptedAt: Date;
  ipAddress?: string;
  userAgent?: string;
}
```

## Implementation Plan
1. Scaffold `angular/packages/angular-policy-attestation/`.
2. Implement policy list, acceptance, history, re-prompt detection with signals.
3. Add mandatory gating and expiry handling.
4. Add tests. Register in workspace.
