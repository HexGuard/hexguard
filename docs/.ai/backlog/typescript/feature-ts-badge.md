---
id: feature-ts-badge
type: feature
status: proposed
created: 2026-06-28
package: '@hexguard/ts-badge'
---

# @hexguard/ts-badge

## Summary

Zero-dependency badge and achievement evaluation utilities â€” condition checking, progress calculation, level curves, and leaderboard sorting. For gamification engines.


## Goals

- Provide zero-dependency, tree-shakeable pure functions
- Full TypeScript generics with strict type safety
- Compatible with browser and Node.js runtimes

## Non-Goals

- No runtime dependencies
- No framework-specific integrations
- No server-side or platform-specific features

## Proposed Public API

```typescript
// Badge conditions
export function evaluateCondition(condition: BadgeCondition, context: Record<string, unknown>): boolean;

export type BadgeCondition =
  | { type: 'count'; field: string; operator: 'gte' | 'gt' | 'eq'; value: number }
  | { type: 'streak'; field: string; minDays: number }
  | { type: 'and'; conditions: BadgeCondition[] }
  | { type: 'or'; conditions: BadgeCondition[] }
  | { type: 'not'; condition: BadgeCondition }
  | { type: 'range'; field: string; min: number; max: number };

// Progress calculation
export function calculateProgress(current: number, target: number): { percent: number; remaining: number };
export function calculateCompositeProgress(tasks: { current: number; target: number; weight: number }[]): number;

// Level curves
export function calculateLevel(xp: number, curve?: LevelCurve): LevelInfo;
export type LevelCurve = 'linear' | 'quadratic' | 'exponential' | { custom: (xp: number) => number };
export function xpForLevel(level: number, curve?: LevelCurve): number;
export interface LevelInfo { level: number; title?: string; currentXp: number; nextLevelXp: number; progress: number; }

// Leaderboards
export function sortLeaderboard(entries: LeaderboardEntry[], sortBy?: 'score' | 'level'): LeaderboardEntryWithRank[];
export function getUserRank(entries: LeaderboardEntry[], userId: string): number | null;
export interface LeaderboardEntry { userId: string; userName: string; score: number; avatar?: string; }
export interface LeaderboardEntryWithRank extends LeaderboardEntry { rank: number; change: number; }

// Streaks
export function calculateStreak(activityDates: Date[], options?: StreakOptions): StreakResult;
export interface StreakOptions { period?: 'daily' | 'weekly'; maxGapDays?: number; }
export interface StreakResult { current: number; longest: number; lastActivityDate: Date | null; isActive: boolean; }

// Rarity
export function getRarityColor(rarity: string): string;
export function getRarityMultiplier(rarity: string): number;
// common=1.0, rare=1.5, epic=2.0, legendary=3.0
```

## Implementation Plan
1. Create `ts/packages/ts-badge/` with zero dependencies.
2. Implement condition evaluation, progress, level curves, leaderboards, streaks.
3. Add tests for all condition types and edge cases.
4. Publish to npm.
