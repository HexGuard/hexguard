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

## Proposed Public API

```ts
import { injectPageContext, type PageContext, type PageAction } from '@hexguard/angular-page-context';

@Component({ ... })
export class MyComponent {
  private readonly page = injectPageContext();

  constructor() {
    this.page.set({
      title: 'Order Details',
      breadcrumbs: [{ label: 'Orders', route: '/orders' }, { label: 'Order #42' }],
      tabs: [{ id: 'details', label: 'Details' }, { id: 'history', label: 'History' }],
      actions: [
        { id: 'edit', label: 'Edit', icon: 'pencil', route: '/orders/42/edit' },
        { id: 'delete', label: 'Delete', icon: 'trash', confirm: 'Delete this order?' },
      ],
    });
  }

  // Derived signals
  readonly title = this.page.title;               // Signal<string>
  readonly breadcrumbs = this.page.breadcrumbs;    // Signal<Breadcrumb[]>
  readonly activeTab = this.page.activeTab;        // Signal<string>
  readonly actions = this.page.actions;            // Signal<PageAction[]>
}
```

## Implementation Plan

### Phase 0: Foundation

1. Scaffold `angular/packages/angular-page-context/`.
2. Add build/test scripts.

### Phase 1: Core Implementation

3. Define `PageContext`, `Breadcrumb`, `PageAction`, `PageTab` types.
4. Implement `injectPageContext()` with signals for title, breadcrumbs, tabs, actions, activeTab.
5. Implement `set()` method that updates all context fields at once.
6. Implement `activeTab` signal — set via `setActiveTab(id)`.
7. Add unit tests for: context update, partial update, active tab switching, empty state, permission-gated actions.

### Phase 2: Demo & Docs

8. Add demo route showing dashboard shell, breadcrumb nav, tab switching, action visibility.
9. Add Playwright coverage.
10. Write docs, update README.

### Phase 3: Release

11. Add verify script, release workflow.
12. Run validation gate.

## Validation

- `pnpm test:lib:page-context`.
- `pnpm test:e2e`.

## Validation

- Unit tests for page-context composition.
- Demo coverage for shell metadata and action visibility.
- Manual checks across route transitions.

## Follow-Ups

- Revisit whether reusable shell components belong here or in a separate app-shell package.
- Compare overlap with command-palette and permissions once those contracts exist.
