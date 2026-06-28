---
id: feature-angular-admin
type: feature
status: proposed
created: 2026-06-26
package: '@hexguard/angular-admin'
---

# @hexguard/angular-admin

## Summary

Admin panel shell state â€” sidebar (expand/collapse, active item), tabs (open/close/reorder), breadcrumbs, notifications badge. **Saves 1-2 weeks per project.**


## Goals

- Provide reactive, signal-based headless state for Angular applications
- Dependency-free at runtime beyond Angular core and tslib
- SSR-safe with TransferState awareness where applicable


## Non-Goals

- No rendered UI components — headless state, signals, and services only
- No browser globals or window-dependent code without SSR guard
- No backend API calls (consumer provides data/endpoints)

## Proposed Public API

```typescript
export function injectAdminShell(config: {
  navigation: NavItem[];
  userMenu?: UserMenuItem[];
  appName?: string;
}): {
  readonly sidebarCollapsed: Signal<boolean>;
  readonly sidebarExpandedItems: Signal<Set<string>>;
  readonly activeNavItem: Signal<string | null>;
  readonly openTabs: Signal<TabState[]>;
  readonly activeTab: Signal<string | null>;
  readonly breadcrumbs: Signal<Breadcrumb[]>;
  readonly notificationCount: Signal<number>;
  toggleSidebar(): void;
  toggleNavItem(id: string): void;
  openTab(tab: TabState): void;
  closeTab(id: string): void;
  reorderTabs(from: number, to: number): void;
};
```

## Implementation Plan

1. Scaffold `angular/packages/angular-admin/`.
2. Implement sidebar, header, tabs state.
3. Integrate with page-context and notifications.
4. Add tests.
5. Register in workspace.
