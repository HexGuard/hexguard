---
id: feature-angular-pipeline
type: feature
status: proposed
created: 2026-06-28
package: '@hexguard/angular-pipeline'
---

# @hexguard/angular-pipeline

## Summary

Headless CRM pipeline state — deal stages, opportunity tracking, contact management, and activity timeline. For sales CRMs, fundraising pipelines, and deal-flow management.

## Goals

- Pipeline stages with customizable columns
- Deal/opportunity CRUD with stage progression
- Deal value tracking with weighted forecasting
- Contact management linked to deals
- Activity timeline per deal (calls, emails, meetings, notes)
- Drag-and-drop deal movement between stages
- Pipeline filtering (owner, stage, probability, close date)
- Win/loss tracking with reasons
- Sales velocity metrics signals

## Non-Goals

- No rendered pipeline board UI
- No email integration
- No lead scoring engine

## Proposed Public API

```typescript
export function injectPipeline(config: {
  endpoint: string;
  stages: PipelineStage[];
}): {
  readonly stages: Signal<PipelineStage[]>;
  readonly deals: Signal<Deal[]>;
  readonly dealsByStage: Signal<Map<string, Deal[]>>;
  readonly selectedDeal: Signal<Deal | null>;
  readonly contacts: Signal<Contact[]>;
  readonly activities: Signal<Activity[]>;
  readonly filters: Signal<PipelineFilters>;
  readonly metrics: Signal<PipelineMetrics>;
  readonly isLoading/submitting: Signal<boolean>;
  // Deal CRUD
  createDeal(deal: NewDeal): Promise<Deal>;
  updateDeal(id: string, changes: Partial<Deal>): Promise<void>;
  moveDeal(id: string, toStageId: string, position: number): Promise<void>;
  markWon(id: string, reason?: string): Promise<void>;
  markLost(id: string, reason: string): Promise<void>;
  // Contacts
  addContact(contact: NewContact): Promise<Contact>;
  linkContactToDeal(contactId: string, dealId: string): Promise<void>;
  // Activities
  logActivity(activity: NewActivity): Promise<void>;
  // Filtering
  setFilters(f: Partial<PipelineFilters>): void;
  search(query: string): void;
};

export interface PipelineStage { id: string; name: string; order: number; color?: string; probability?: number; }
export interface Deal { id: string; name: string; stageId: string; value: number; currency: string; probability: number; expectedCloseDate: Date; ownerId: string; ownerName: string; contactIds: string[]; wonAt?: Date; lostAt?: Date; lostReason?: string; }
export interface Contact { id: string; name: string; email: string; phone?: string; company?: string; title?: string; dealIds: string[]; }
export interface Activity { id: string; dealId?: string; contactId?: string; type: 'call' | 'email' | 'meeting' | 'note'; subject: string; body?: string; timestamp: Date; userId: string; }
export interface PipelineFilters { ownerId?: string; stageId?: string; minValue?: number; maxValue?: number; closeDateFrom?: Date; closeDateTo?: Date; }
export interface PipelineMetrics { totalValue: number; weightedValue: number; dealCount: number; avgDealSize: number; winRate: number; avgDaysToClose: number; }
```

## Implementation Plan
1. Scaffold `angular/packages/angular-pipeline/`.
2. Implement stages, deal CRUD, contacts, activities, metrics with signals.
3. Add drag-and-drop move, filters, win/loss tracking.
4. Add tests. Register in workspace.
