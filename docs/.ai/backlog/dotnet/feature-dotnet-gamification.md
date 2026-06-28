---
id: feature-dotnet-gamification
type: feature
status: proposed
created: 2026-06-28
package: 'HexGuard.Gamification'
---

# HexGuard.Gamification

## Summary

Gamification engine for .NET — badges, achievements, points, levels, leaderboards, and streaks. For community platforms, learning systems, and employee engagement.

## Goals

- Badge/achievement definition with unlock conditions
- Rule engine for evaluating achievement conditions
- Points system with earning and spending rules
- Level progression with configurable XP curves
- Leaderboard generation (global, group, time-period)
- Streak tracking with configurable periods
- Reward catalog with point-cost redemption
- Event-driven achievement evaluation (on action → check conditions)

## Non-Goals

- No UI rendering
- No reward fulfillment (triggers only)
- No social features

## Proposed Public API

```csharp
public interface IGamificationService
{
    // Badges & Achievements
    Task<IReadOnlyList<Badge>> GetBadgesAsync(CancellationToken ct = default);
    Task<IReadOnlyList<UserBadge>> GetUserBadgesAsync(string userId, CancellationToken ct = default);
    Task<IReadOnlyList<BadgeProgress>> GetBadgeProgressAsync(string userId, CancellationToken ct = default);
    // Points
    Task<int> GetPointsAsync(string userId, CancellationToken ct = default);
    Task AwardPointsAsync(string userId, int amount, string reason, string? referenceId = null, CancellationToken ct = default);
    Task<IReadOnlyList<PointTransaction>> GetPointHistoryAsync(string userId, int skip = 0, int take = 50, CancellationToken ct = default);
    // Levels
    Task<UserLevel> GetLevelAsync(string userId, CancellationToken ct = default);
    // Leaderboards
    Task<IReadOnlyList<LeaderboardEntry>> GetLeaderboardAsync(LeaderboardQuery query, CancellationToken ct = default);
    Task<int> GetUserRankAsync(string userId, LeaderboardQuery query, CancellationToken ct = default);
    // Streaks
    Task<IReadOnlyList<Streak>> GetStreaksAsync(string userId, CancellationToken ct = default);
    Task RecordActivityAsync(string userId, string activityType, CancellationToken ct = default);
    // Rewards
    Task<IReadOnlyList<Reward>> GetRewardsAsync(CancellationToken ct = default);
    Task RedeemRewardAsync(string userId, string rewardId, CancellationToken ct = default);
    // Events
    Task ProcessActionAsync(string userId, string actionType, Dictionary<string, object>? metadata = null, CancellationToken ct = default);
}

public sealed record Badge(string Id, string Name, string Description, BadgeRarity Rarity, string Category, string Condition);
public enum BadgeRarity { Common, Rare, Epic, Legendary }

public sealed record UserBadge(string BadgeId, string BadgeName, string Icon, int TimesEarned, DateTimeOffset FirstEarnedAt, DateTimeOffset LastEarnedAt);

public sealed record UserLevel(int Number, string Title, int CurrentXp, int NextLevelXp, int TotalXp);

public sealed record LeaderboardQuery(string Type = "global", string? GroupId = null, string? Period = null, int Top = 100);
```

## Implementation Plan
1. Create `dotnet/src/HexGuard.Gamification/` with `.csproj`.
2. Implement badge engine, points/levels, leaderboards, streaks, rewards.
3. Add rule evaluation engine and activity processing.
4. Add xunit tests. Register in `HexGuard.slnx`.
