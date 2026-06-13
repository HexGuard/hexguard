---
id: feature-angular-live-data
type: feature
status: proposed
created: 2026-06-13
package: '@hexguard/angular-live-data'
---

# Angular Live Data Package

## Summary

Design `@hexguard/angular-live-data` as a package for standardizing visibility-aware polling,
refresh cadence, stale indicators, and refresh controls for dashboards and operational views.

The repeated problem is that apps rebuild their own polling loops, pause-on-hidden behavior,
refresh buttons, and stale-data indicators for every dashboard or queue screen.

## Goals

- Standardize live-data refresh behavior for Angular screens.
- Support polling, manual refresh, stale markers, and pause-on-hidden semantics.
- Compose with async-state rather than replacing it.
- Keep the first version transport-agnostic.

## Non-Goals

- A general cache or query library.
- WebSocket streaming abstractions in the first version.
- Replacing HTTP dedupe or resource-debug tooling.

## Decisions

- Prefer refresh orchestration over transport ownership.
- Keep visibility and cadence behavior explicit.
- Treat stale indicators and refresh state as first-class outputs.

## Implementation Plan

1. Define the refresh lifecycle contract and stale-state semantics.
2. Implement cadence, pause-on-hidden, and manual refresh orchestration.
3. Compose with async-state for value/error rendering.
4. Add backoff or retry policy only if it stays small and explicit.
5. Add tests and demos for dashboard, queue, and KPI-card workflows.

## Validation

- Unit tests for cadence, pause, and stale-state behavior.
- Demo coverage for dashboard and operational refresh flows.
- Manual checks for visibility changes and navigation cleanup.

## Follow-Ups

- Revisit streaming or push-based data as a separate concern if polling proves too narrow.
- Compare overlap with HTTP dedupe once both contracts are clearer.
