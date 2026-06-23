# @hexguard/angular-page-context

**Page-level metadata for Angular.** Standardized titles, breadcrumbs, tabs, and contextual actions with signal-based state and route-scoped lifecycle.

**[Deep package notes](docs/packages/angular-page-context.md)** · **[Demo](/packages/angular-page-context/demo)**

---

## Problem

Larger Angular apps typically invent their own page-shell contracts — a `PageService` here, a `Title` service there, breadcrumbs passed through route data. These contracts drift between feature areas.

**`@hexguard/angular-page-context`** standardizes this into one injectable contract: `set(context)` to update title, breadcrumbs, tabs, and actions simultaneously; signals to read them reactively.

## Installation

```bash
pnpm add @hexguard/angular-page-context
```

## Quickstart

```typescript
import { injectPageContext } from '@hexguard/angular-page-context';

const page = injectPageContext();

page.set({
  title: 'Order Details',
  breadcrumbs: [{ label: 'Orders', route: '/orders' }, { label: 'Order #42' }],
  tabs: [
    { id: 'details', label: 'Details' },
    { id: 'history', label: 'History' },
  ],
  actions: [{ id: 'edit', label: 'Edit' }],
});
```

## Use Cases

### Set dashboard metadata

```typescript
@Component({ ... })
class DashboardComponent {
  private readonly page = injectPageContext();

  constructor() {
    this.page.set({
      title: 'Dashboard',
      breadcrumbs: [{ label: 'Home' }, { label: 'Dashboard' }],
      tabs: [{ id: 'overview', label: 'Overview' }, { id: 'analytics', label: 'Analytics' }],
    });
  }
}
// Shell components read page.title(), page.breadcrumbs(), page.activeTab().
```

### Switch active tab

```typescript
this.page.setActiveTab('analytics');
// The activeTab signal updates reactively.
```

## API

### `injectPageContext()`

| Member             | Type                            | Description                      |
| ------------------ | ------------------------------- | -------------------------------- |
| `title`            | `Signal<string>`                | Current page title               |
| `breadcrumbs`      | `Signal<readonly Breadcrumb[]>` | Current breadcrumb trail         |
| `activeTab`        | `Signal<string>`                | Currently active tab ID          |
| `actions`          | `Signal<readonly PageAction[]>` | Current contextual actions       |
| `set(context)`     | `(PageContext) => void`         | Update all fields simultaneously |
| `setActiveTab(id)` | `(string) => void`              | Switch active tab                |

### `PageContext`

| Field          | Type                    | Description        |
| -------------- | ----------------------- | ------------------ |
| `title?`       | `string`                | Page title         |
| `breadcrumbs?` | `readonly Breadcrumb[]` | Breadcrumb trail   |
| `tabs?`        | `readonly PageTab[]`    | Tab definitions    |
| `actions?`     | `readonly PageAction[]` | Contextual actions |

## Scope Boundaries

| Concern                                   | Status                           |
| ----------------------------------------- | -------------------------------- |
| Title, breadcrumbs, tabs, actions signals | ✅                               |
| Atomic `set()` updates                    | ✅                               |
| Active tab switching                      | ✅                               |
| Route-scoped lifecycle (auto-cleanup)     | ✅                               |
| Composing with permissions/feature flags  | ❌ (future)                      |
| Built-in shell UI components              | ❌ (headless — compose your own) |

## Demo

Visit `/packages/angular-page-context/demo` to set Dashboard and Orders contexts with inspector feedback.
