import type { OptimisticMutationConflictPolicy } from '@hexguard/angular-optimistic-state';

export interface OptimisticPolicyOption {
  readonly label: string;
  readonly value: OptimisticMutationConflictPolicy;
  readonly detail: string;
}

export interface ToggleDemoFeature {
  readonly id: string;
  readonly label: string;
  readonly description: string;
  readonly enabled: boolean;
  readonly pending: boolean;
}

export interface InlineEditDraftRow {
  readonly id: string;
  readonly title: string;
  readonly owner: string;
  readonly pending: boolean;
}

export type BulkPublishStatus = 'draft' | 'published';

export interface BulkPublishRow {
  readonly id: string;
  readonly label: string;
  readonly status: BulkPublishStatus;
  readonly pending: boolean;
}

export const OPTIMISTIC_POLICY_OPTIONS: readonly OptimisticPolicyOption[] = [
  {
    label: 'Reject overlap',
    value: 'reject',
    detail:
      'A second same-target mutation fails immediately so accidental double-submit stays visible.',
  },
  {
    label: 'Queue overlap',
    value: 'queue',
    detail:
      'A second same-target mutation waits until the first settles, preserving user intent in order.',
  },
  {
    label: 'Replace overlap',
    value: 'replace',
    detail: 'The newest same-target mutation becomes the visible optimistic overlay immediately.',
  },
] as const;

const TOGGLE_DEMO_FEATURES: readonly ToggleDemoFeature[] = [
  {
    id: 'billing-alerts',
    label: 'Billing alerts',
    description: 'Regional finance leads receive the new invoicing anomaly pings.',
    enabled: false,
    pending: false,
  },
  {
    id: 'audit-export',
    label: 'Audit export',
    description: 'Exports the signed approval trail to the nightly audit bucket.',
    enabled: true,
    pending: false,
  },
  {
    id: 'priority-routing',
    label: 'Priority routing',
    description: 'Moves platinum tickets into the fast follow-up lane.',
    enabled: false,
    pending: false,
  },
] as const;

const INLINE_EDIT_DRAFT_ROWS: readonly InlineEditDraftRow[] = [
  {
    id: 'draft-101',
    title: 'reconcile approval backlog',
    owner: 'Mina Patel',
    pending: false,
  },
  {
    id: 'draft-114',
    title: 'confirm finance queue replay',
    owner: 'Jonas Meyer',
    pending: false,
  },
  {
    id: 'draft-125',
    title: 'triage stale webhooks',
    owner: 'Nadia Chen',
    pending: false,
  },
] as const;

const BULK_PUBLISH_ROWS: readonly BulkPublishRow[] = [
  {
    id: 'campaign-201',
    label: 'Renewal guide',
    status: 'draft',
    pending: false,
  },
  {
    id: 'campaign-204',
    label: 'Incident recap',
    status: 'draft',
    pending: false,
  },
  {
    id: 'campaign-219',
    label: 'Pricing update',
    status: 'published',
    pending: false,
  },
] as const;

export function createToggleDemoFeatures(): readonly ToggleDemoFeature[] {
  return TOGGLE_DEMO_FEATURES.map((feature) => ({ ...feature }));
}

export function createInlineEditDraftRows(): readonly InlineEditDraftRow[] {
  return INLINE_EDIT_DRAFT_ROWS.map((row) => ({ ...row }));
}

export function createBulkPublishRows(): readonly BulkPublishRow[] {
  return BULK_PUBLISH_ROWS.map((row) => ({ ...row }));
}
