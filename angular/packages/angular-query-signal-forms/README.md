# @hexguard/angular-query-signal-forms

**URL-state adapter for Angular Signal Forms.** Bind typed query parameters to signal form models through `@hexguard/angular-url-state` with sync modes, reset-on-change rules, and commit/revert.

---

## Installation

```bash
pnpm add @hexguard/angular-query-signal-forms
```

Requires `@hexguard/angular-url-state` as a peer dependency.

## Quickstart

```typescript
import { querySignalForm, stringParam, numberParam, enumParam } from '@hexguard/angular-query-signal-forms';

const query = querySignalForm({
  search: stringParam(''),
  page: numberParam(1),
  status: enumParam(['all', 'open', 'closed'] as const, 'all'),
}, {
  history: 'replace',
  resetKeysOnChange: { search: ['page'], status: ['page'] },
});

query.patch({ search: 'priority', page: 1 });
query.snapshot(); // { search: 'priority', page: 1, status: 'all' }
query.reset();
```

## API

### `querySignalForm(schema, options?)`

| Option | Type | Description |
|--------|------|-------------|
| `syncMode` | `'live' \| 'manual'` | Write through immediately or stage changes |
| `resetKeysOnChange` | `Record<string, string[]>` | Reset dependent keys when source changes |
| `writeDelayMs` | `number` | Debounce writes (default 0) |

| Member | Type | Description |
|--------|------|-------------|
| `urlState` | `UrlState<TSchema>` | Underlying URL-state handle |
| `hasPendingChanges` | `Signal<boolean>` | Uncommitted changes in manual mode |
| `snapshot()` | `TSchema` | Current state |
| `patch(value)` | — | Update values with reset-on-change |
| `reset()` | — | Reset to defaults |
| `commit()` | — | Stage → URL (manual mode) |
| `revert()` | — | Discard staged changes (manual mode) |

## Scope Boundaries

| Concern | Status |
|---------|--------|
| Typed query params via url-state | ✅ |
| live/manual sync modes | ✅ |
| resetKeysOnChange rules | ✅ |
| commit/revert in manual mode | ✅ |
| Re-exports all url-state codecs | ✅ |
| `@angular/forms/signals` `form()` integration | ❌ (pending Signal Forms stabilization) |

## Demo

Visit `/packages/angular-query-signal-forms/demo` to test query signal form workflows.
