# @hexguard/angular-page-context — Deep Package Notes

Page-level metadata for Angular: standardized titles, breadcrumbs, tabs, and contextual actions with signal-based state and route-scoped lifecycle.

## Problem

Larger Angular apps typically invent their own page-shell contracts — a `PageService` here, a `Title` service there, breadcrumbs passed through route data, actions managed by a separate store. These contracts drift between feature areas, making it hard to build a consistent shell or add new layout features.

**`@hexguard/angular-page-context`** standardizes this into one injectable contract: set page metadata once, read it from anywhere in the component tree.

## API

- `set(context)` — Update title, breadcrumbs, tabs, and actions simultaneously
- `title: Signal<string>` — The current page title
- `breadcrumbs: Signal<readonly Breadcrumb[]>` — The current breadcrumb trail
- `activeTab: Signal<string>` — The currently active tab ID
- `actions: Signal<readonly PageAction[]>` — The current set of contextual page actions
- `setActiveTab(id)` — Switch the active tab by ID

---

## Assessment: Potential Improvements

| Area  | Suggestion                                                                                          | Priority |
| ----- | --------------------------------------------------------------------------------------------------- | -------- |
| API   | Consider adding a `partialUpdate()` method that merges with existing context instead of replacing   | Low      |
| API   | Consider adding a `reset()` method that clears all fields at once (currently done via `set({})`)    | Low      |
| API   | Consider composing with route data — auto-set title from route config when no explicit title is set | Medium   |
| Tests | Missing test: updating actions does not affect title                                                | Low      |
| Tests | Missing test: setting tabs with empty array when tabs already exist                                 | Low      |

## Code Examples

### Set dashboard context

```typescript
import { injectPageContext } from '@hexguard/angular-page-context';

@Component({ ... })
class DashboardComponent {
  private readonly page = injectPageContext();

  constructor() {
    this.page.set({
      title: 'Dashboard',
      breadcrumbs: [{ label: 'Home', route: '/' }, { label: 'Dashboard' }],
      tabs: [{ id: 'overview', label: 'Overview' }, { id: 'analytics', label: 'Analytics' }],
      actions: [{ id: 'refresh', label: 'Refresh', icon: 'refresh' }],
    });
  }
}
// Template uses page.title(), page.breadcrumbs(), etc.
// Shell component reads these signals to render the page chrome.
```

### Switch active tab

```typescript
@Component({ ... })
class DashboardComponent {
  private readonly page = injectPageContext();

  // User clicks a tab
  onTabChange(tabId: string): void {
    this.page.setActiveTab(tabId);
  }
}
// The active tab signal updates reactively.
// The shell component reading page.activeTab() re-renders.
```

## Related Resources

- [Package README](../../angular/packages/angular-page-context/README.md)
- [Package Catalog](../README.md)
- [Demo Routes](../../angular/apps/demo-angular/src/app/features/packages/angular/angular-page-context/)
- [Source Code](../../angular/packages/angular-page-context/src/)

---

## API Review Findings

Review date: 2026-06-23. Findings are observational.

### Observations

| Dimension              | Finding                                                                                                                             | Severity |
| ---------------------- | ----------------------------------------------------------------------------------------------------------------------------------- | -------- |
| Public API Design      | Minimal surface: 1 function (`injectPageContext`), 4 types. Clean `set()` / signal-read contract.                                   | praise   |
| Implementation Quality | Atomic `set()` updates all fields simultaneously. Auto-activates first tab when no active tab. Route-scoped cleanup via DestroyRef. | praise   |
| Implementation Quality | Actions and breadcrumbs remain independent — updating one does not affect the other.                                                | praise   |
| Test Coverage          | 9 tests covering defaults, title/breadcrumbs/tabs/actions setting, active tab switching, partial updates.                           | praise   |
| Demo Integration       | Interactive demo with preset contexts (Dashboard, Orders) and inspector panel showing all signal values.                            | praise   |
