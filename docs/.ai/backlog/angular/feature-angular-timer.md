---
id: feature-angular-timer
type: feature
status: proposed
created: 2026-06-26
package: '@hexguard/angular-timer'
---

# @hexguard/angular-timer

## Summary

Timer/countdown/stopwatch state for Angular — countdown from a duration, count up (stopwatch), elapsed time tracking, with pause/resume/reset and signal-based time display. Used in OTP expiry countdowns, session timeout warnings, exam timers, rate-limit cooldown displays, and progress ETAs.

**Competition check:** No headless Angular timer/stopwatch state package exists. Third-party timer packages are minimal wrappers around `setInterval` without signal integration.

## Why Wide Adoption

Timers are everywhere in web apps: "Your session expires in 2:30", "Resend code in 45s", "Auto-refresh in 10s", quiz/exam timers, countdown to event start, rate-limit cooldown displays. Every implementation relies on the same `setInterval` + `Date.now()` boilerplate with manual cleanup.

## Goals

1. Provide `injectCountdown()` — countdown from a duration with `remaining`, `elapsed`, `isRunning`, `isExpired` signals.
2. Provide `injectStopwatch()` — count-up timer with `elapsed`, `lap()` times, `isRunning` signals.
3. Support start, pause, resume, reset, and restart operations.
4. Provide formatted time output (`mm:ss`, `hh:mm:ss`) via formatter.
5. Support `onExpire` callback for countdown expiry.
6. Auto-cleanup on destroy — no memory leaks from forgotten intervals.
7. Pure Angular — uses `NgZone` for change detection safety.

## Non-Goals

- No UI component — headless state only.
- No animation or visual timer rendering.
- No cron/schedule-based timers (use browser or server scheduling).

## Proposed Public API

```typescript
// ── Countdown ─────────────────────────────────────────────

export interface CountdownConfig {
  duration: number | Signal<number>;     // Duration in milliseconds
  interval?: number;                      // Tick interval (default: 1000ms)
  onExpire?: () => void;
  autoStart?: boolean;                   // Default: false
}

export interface CountdownState {
  readonly remaining: Signal<number>;     // Milliseconds remaining
  readonly elapsed: Signal<number>;       // Milliseconds elapsed since start
  readonly isRunning: Signal<boolean>;
  readonly isPaused: Signal<boolean>;
  readonly isExpired: Signal<boolean>;
  readonly progress: Signal<number>;      // 0–1 ratio elapsed/duration
  readonly formatted: Signal<string>;     // "mm:ss" or "hh:mm:ss"

  start(): void;
  pause(): void;
  resume(): void;
  reset(): void;
  restart(): void;
}

export function injectCountdown(config: CountdownConfig): CountdownState;

// ── Stopwatch ─────────────────────────────────────────────

export interface StopwatchState {
  readonly elapsed: Signal<number>;       // Milliseconds elapsed
  readonly isRunning: Signal<boolean>;
  readonly laps: Signal<LapTime[]>;       // Recorded lap times
  readonly formatted: Signal<string>;

  start(): void;
  pause(): void;
  resume(): void;
  reset(): void;
  lap(): void;                            // Record current lap
}

export interface LapTime {
  index: number;
  elapsed: number;
  split: number;                          // Time since last lap
  formatted: string;
}

export function injectStopwatch(): StopwatchState;

// ── Formatter ─────────────────────────────────────────────

export function formatDuration(ms: number, format?: 'mmss' | 'hhmmss' | 'auto'): string;
```

## Implementation Plan

1. Scaffold `angular/packages/angular-timer/` following the standard pattern.
2. Implement `formatDuration()` formatter.
3. Implement `injectCountdown()` with interval-based tick, NgZone.run, and DestroyRef cleanup.
4. Implement `injectStopwatch()` with lap tracking.
5. Add tests: countdown ticks, pause/resume, expiry callback, stopwatch laps, cleanup on destroy, SSR safety.
6. Create demo page.
7. Register in workspace, build scripts, and catalog.
