---
id: feature-angular-page-context
type: feature
status: proposed
created: 2026-06-13
package: '@hexguard/angular-page-context'
---

# Angular Page Context Package

## Summary

Design `@hexguard/angular-page-context` as a package for standardizing page-level metadata such as
titles, breadcrumbs, tabs, contextual actions, and route-scoped page chrome.

The repeated problem is that larger Angular apps often invent their own page-shell contracts, and
those contracts drift between feature areas.

## Goals

- Standardize page-level context metadata in Angular apps.
- Support titles, breadcrumbs, route-aware actions, and contextual tabs from a reusable contract.
- Keep the core API headless so apps can render different shells.
- Compose with permissions and feature flags for action visibility.

## Non-Goals

- Shipping a full design system or shell UI.
- Replacing Angular router configuration.
- Owning every navigation concern in the app.

## Decisions

- Prefer a headless page-context model.
- Keep rendering adapters optional.
- Treat page actions and metadata as route-scoped state rather than global mutable UI config.

## Implementation Plan

1. Define the page-context contract for titles, breadcrumbs, tabs, and actions.
2. Implement route-scoped providers or helpers for setting and reading page context.
3. Add permission and feature-flag composition points for action visibility.
4. Add tests and demos for dashboard, details, and edit pages.
5. Keep shell rendering optional in v0.1.

## Validation

- Unit tests for page-context composition.
- Demo coverage for shell metadata and action visibility.
- Manual checks across route transitions.

## Follow-Ups

- Revisit whether reusable shell components belong here or in a separate app-shell package.
- Compare overlap with command-palette and permissions once those contracts exist.