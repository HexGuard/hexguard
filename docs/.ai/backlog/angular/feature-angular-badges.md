---
id: feature-angular-badges
type: feature
status: proposed
created: 2026-06-28
package: '@hexguard/angular-badges'
---

# @hexguard/angular-badges

## Summary

Headless gamification state — badges, achievements, points, levels, leaderboards, and progress tracking. For community platforms, learning systems, fitness apps, and employee engagement.

## Goals

- Badge/achievement definition with unlock conditions
- User badge collection and progress tracking
- Points system with earning rules
- Level progression with XP thresholds
- Leaderboard with rankings (global, by group, by period)
- Achievement notifications (new badge, level up, rank change)
- Streak tracking (daily login, weekly activity)
- Reward redemption state

## Non-Goals

- No rendered badge/achievement UI
- No reward fulfillment
- No real-time collaboration

## Proposed Public API

```typescript
export function injectBadges(config: {
  endpoint: string;
}): {
  // Badges
  readonly allBadges: Signal<Badge[]>;
  readonly userBadges: Signal<UserBadge[]>;
  readonly recentUnlocks: Signal<UserBadge[]>;
  readonly progress: Signal<BadgeProgress[]>;
  readonly isLoading: Signal<boolean>;
  // Points & Levels
  readonly points: Signal<number>;
  readonly level: Signal<Level>;
  readonly xpProgress: Signal<{ current: number; next: number; percent: number }>;
  // Leaderboards
  readonly leaderboard: Signal<LeaderboardEntry[]>;
  readonly userRank: Signal<number>;
  readonly leaderboardType: Signal<'global' | 'group' | 'weekly' | 'monthly'>;
  setLeaderboardType(type: 'global' | 'group' | 'weekly' | 'monthly'): void;
  // Streaks
  readonly streaks: Signal<Streak[]>;
  // Rewards
  readonly availableRewards: Signal<Reward[]>;
  readonly redeemedRewards: Signal<RedeemedReward[]>;
  redeem(rewardId: string): Promise<void>;
};

export interface Badge { id: string; name: string; description: string; icon: string; category: string; rarity: 'common' | 'rare' | 'epic' | 'legendary'; condition: string; }
export interface UserBadge { badgeId: string; badgeName: string; icon: string; earnedAt: Date; timesEarned: number; }
export interface BadgeProgress { badgeId: string; badgeName: string; current: number; target: number; percent: number; }
export interface Level { number: number; title: string; xpRequired: number; }
export interface LeaderboardEntry { rank: number; userId: string; userName: string; avatar?: string; score: number; change: number; }
export interface Streak { type: string; current: number; longest: number; lastActivity: Date; }
export interface Reward { id: string; name: string; description: string; pointCost: number; isAvailable: boolean; }
```

## Implementation Plan
1. Scaffold `angular/packages/angular-badges/`.
2. Implement badge collection, points/levels, leaderboards, streaks with signals.
3. Add reward redemption and achievement notifications.
4. Add tests. Register in workspace.
