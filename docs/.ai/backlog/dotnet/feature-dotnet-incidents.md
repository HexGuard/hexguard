---
id: feature-dotnet-incidents
type: feature
status: proposed
created: 2026-06-28
package: 'HexGuard.Incidents'
---

# HexGuard.Incidents

## Summary

Incident management backend for .NET — declare, track, resolve, and postmortem incidents. For SRE and IT operations teams.

## Goals

- Incident declaration with severity and affected services
- Incident lifecycle management (open → acknowledged → investigating → mitigated → resolved → postmortem)
- Timeline of actions and status updates
- Role assignment (commander, communications, investigator)
- Postmortem creation with root cause analysis and action items
- Incident metrics (MTTA, MTTR, severity distribution)
- Related incident linking
- SLA tracking with breach detection
- Stakeholder notification integration

## Non-Goals

- No alerting or monitoring integration
- No on-call scheduling
- No chat/communication integration

## Proposed Public API

```csharp
public interface IIncidentService
{
    Task<Incident> DeclareAsync(DeclareIncidentRequest request, CancellationToken ct = default);
    Task<Incident?> GetIncidentAsync(string incidentId, CancellationToken ct = default);
    Task<IReadOnlyList<Incident>> QueryIncidentsAsync(IncidentQuery query, CancellationToken ct = default);
    Task<Incident> UpdateStatusAsync(string incidentId, IncidentStatus status, string message, CancellationToken ct = default);
    Task<Incident> ResolveAsync(string incidentId, string resolution, CancellationToken ct = default);
    // Timeline
    Task<TimelineEntry> AddTimelineEntryAsync(string incidentId, CreateTimelineEntryRequest request, CancellationToken ct = default);
    Task<IReadOnlyList<TimelineEntry>> GetTimelineAsync(string incidentId, CancellationToken ct = default);
    // Roles
    Task AssignRoleAsync(string incidentId, IncidentRole role, string userId, CancellationToken ct = default);
    // Postmortem
    Task<Postmortem> CreatePostmortemAsync(CreatePostmortemRequest request, CancellationToken ct = default);
    Task<Postmortem?> GetPostmortemAsync(string postmortemId, CancellationToken ct = default);
    Task<Postmortem> AddActionItemAsync(string postmortemId, ActionItem item, CancellationToken ct = default);
    Task CompleteActionItemAsync(string postmortemId, string itemId, CancellationToken ct = default);
    // Metrics
    Task<IncidentMetrics> GetMetricsAsync(DateTimeOffset from, DateTimeOffset to, CancellationToken ct = default);
}

public sealed record DeclareIncidentRequest(
    string Title,
    IncidentSeverity Severity,
    IReadOnlyList<string> AffectedServices,
    string? CommanderId = null,
    string? Description = null
);

public enum IncidentSeverity { Critical, Major, Minor, Trivial }
public enum IncidentStatus { Open, Acknowledged, Investigating, Mitigated, Resolved, Postmortem }

public sealed record IncidentMetrics(
    int TotalIncidents,
    int OpenIncidents,
    double MttaMinutes,
    double MttrMinutes,
    IReadOnlyDictionary<IncidentSeverity, int> BySeverity
);
```

## Implementation Plan
1. Create `dotnet/src/HexGuard.Incidents/` with `.csproj`.
2. Implement incident lifecycle, timeline, role assignment, postmortem, metrics.
3. Add SLA tracking and notification hooks.
4. Add xunit tests. Register in `HexGuard.slnx`.
