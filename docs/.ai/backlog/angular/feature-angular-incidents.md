---
id: feature-angular-incidents
type: feature
status: proposed
created: 2026-06-28
package: '@hexguard/angular-incidents'
---

# @hexguard/angular-incidents

## Summary

Headless incident management state — declare, triage, investigate, resolve, and review incidents. For SRE teams, IT operations, and service desks. Distinct from `angular-status` (status page overview).

## Goals

- Incident declaration with severity and affected services
- Incident lifecycle (open → acknowledged → investigating → mitigated → resolved → postmortem)
- Timeline of actions and updates during incident
- Role assignment (commander, communications, investigator)
- Status updates for stakeholders
- Postmortem creation with timeline, root cause, action items
- Related incident linking
- SLA tracking (time to acknowledge, time to resolve)

## Non-Goals

- No rendered incident UI
- No alert integration (receives incident data)
- No on-call scheduling

## Proposed Public API

```typescript
export function injectIncidents(config: {
  endpoint: string;
}): {
  readonly incidents: Signal<Incident[]>;
  readonly activeIncidents: Signal<Incident[]>;
  readonly selectedIncident: Signal<Incident | null>;
  readonly timeline: Signal<TimelineEntry[]>;
  readonly postmortems: Signal<Postmortem[]>;
  readonly filters: Signal<IncidentFilters>;
  readonly metrics: Signal<IncidentMetrics>;
  readonly isLoading/submitting: Signal<boolean>;
  // Declare & manage
  declare(incident: NewIncident): Promise<Incident>;
  update(id: string, changes: Partial<Incident>): Promise<void>;
  updateStatus(id: string, status: IncidentStatus, message: string): Promise<void>;
  addTimelineEntry(incidentId: string, entry: NewTimelineEntry): Promise<void>;
  assignRole(incidentId: string, role: IncidentRole, userId: string): Promise<void>;
  // Resolution
  resolve(incidentId: string, resolution: string): Promise<void>;
  linkIncidents(incidentId: string, relatedId: string): Promise<void>;
  // Postmortem
  createPostmortem(postmortem: NewPostmortem): Promise<Postmortem>;
  addActionItem(postmortemId: string, item: NewActionItem): Promise<void>;
  completeActionItem(postmortemId: string, itemId: string): Promise<void>;
  // Filters
  setFilters(f: Partial<IncidentFilters>): void;
  search(query: string): void;
};

export interface Incident {
  id: string; title: string; severity: 'critical' | 'major' | 'minor' | 'trivial';
  status: IncidentStatus; affectedServices: string[];
  commanderId?: string; communicationsId?: string; investigatorId?: string;
  createdAt: Date; acknowledgedAt?: Date; resolvedAt?: Date;
  postmortemId?: string; relatedIncidentIds: string[];
}
export type IncidentStatus = 'open' | 'acknowledged' | 'investigating' | 'mitigated' | 'resolved' | 'postmortem';

export interface TimelineEntry {
  id: string; incidentId: string; type: 'status_change' | 'update' | 'action' | 'resolution';
  message: string; userId: string; userName: string; timestamp: Date;
}

export interface Postmortem {
  id: string; incidentId: string; summary: string; timeline: PostmortemTimelineEntry[];
  rootCause: string; impact: { duration: number; affectedUsers: number; dataLoss: boolean };
  actionItems: ActionItem[]; status: 'draft' | 'published'; createdAt: Date; authorId: string;
}

export interface IncidentFilters { severity?: string; status?: string; service?: string; dateFrom?: Date; dateTo?: Date; }
export interface IncidentMetrics { totalIncidents: number; openIncidents: number; mtta: number; mttr: number; bySeverity: Record<string, number>; }
```

## Implementation Plan
1. Scaffold `angular/packages/angular-incidents/`.
2. Implement incident lifecycle, timeline, role assignment, postmortem, metrics with signals.
3. Add filters, search, related incident linking.
4. Add tests. Register in workspace.
