---
id: feature-incidents-cross-stack
type: feature
status: proposed
created: 2026-06-28
package: 'HexGuard.Incidents + @hexguard/angular-incidents'
---

# Incident Management Cross-Stack Pair

## Summary

Server-side incident management engine + client-side incident dashboard and postmortem tools.

### .NET (`HexGuard.Incidents`)
Incident declaration, lifecycle management, timeline tracking, role assignment, postmortem with root cause and action items, metrics (MTTA/MTTR), SLA breach detection, stakeholder notifications.

### Angular (`@hexguard/angular-incidents`)
Active incident list, severity filtering, incident detail with timeline, role assignment UI state, status updates, postmortem creation and action item tracking, metrics dashboard data, incident linking.

### Integration Contract
```typescript
interface IncidentEndpoints {
  'POST /api/incidents': { body: DeclareIncidentRequest; response: Incident };
  'GET /api/incidents': { params: IncidentQuery; response: Incident[] };
  'GET /api/incidents/{id}': { response: Incident };
  'PUT /api/incidents/{id}/status': { body: { status: IncidentStatus; message: string }; response: Incident };
  'PUT /api/incidents/{id}/resolve': { body: { resolution: string }; response: Incident };
  'POST /api/incidents/{id}/timeline': { body: CreateTimelineEntryRequest; response: TimelineEntry };
  'GET /api/incidents/{id}/timeline': { response: TimelineEntry[] };
  'PUT /api/incidents/{id}/roles': { body: { role: IncidentRole; userId: string }; response: void };
  'POST /api/incidents/{id}/postmortem': { body: CreatePostmortemRequest; response: Postmortem };
  'GET /api/incidents/{id}/postmortem': { response: Postmortem };
  'GET /api/incidents/metrics': { params: { from: string; to: string }; response: IncidentMetrics };
}
```
