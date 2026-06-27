---
id: feature-dotnet-team
type: feature
status: proposed
created: 2026-06-27
package: HexGuard.Team
---

# HexGuard.Team

## Summary

Team/organization management engine — org model, member roles, invite tokens, seat enforcement, member activity tracking. Pairs with `@hexguard/angular-team`.

## Proposed Public API

```csharp
public interface ITeamService
{
    Task<IReadOnlyList<TeamMember>> GetMembersAsync(string tenantId, CancellationToken ct);
    Task<TeamMember> InviteAsync(string tenantId, string email, string role, CancellationToken ct);
    Task RemoveMemberAsync(string tenantId, string memberId, CancellationToken ct);
    Task ChangeRoleAsync(string tenantId, string memberId, string role, CancellationToken ct);
    Task<SeatInfo> GetSeatsAsync(string tenantId, CancellationToken ct);
}

builder.Services.AddTeamManagement();
app.MapTeamEndpoints("/api/team");
```

## Implementation Plan
1. Create `dotnet/src/HexGuard.Team/`.
2. Implement member CRUD, invite token flow, role enforcement, seat tracking.
3. Add auto-endpoints. Add tests. Register in `HexGuard.slnx`. Publish as NuGet.
