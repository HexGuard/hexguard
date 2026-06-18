# @hexguard/angular-bulk-operations

Bulk-action service and facade for Angular with HTTP 207 partial-success support, progress tracking, and selection-state composition.

**[Deep package notes](https://github.com/HexGuard/hexguard/blob/main/docs/packages/angular-bulk-operations.md)** ·
**[Demo routes](#demo-routes)** ·
**[Installation](#installation)**

## Installation

```bash
pnpm add @hexguard/angular-bulk-operations @hexguard/angular-selection-state
```

## Quickstart

```ts
import { provideBulkOperation, injectBulkOperation, selectedItemsToBulkRequest } from '@hexguard/angular-bulk-operations';
import { injectSelectionState } from '@hexguard/angular-selection-state';

@Component({
  ...,
  providers: [
    provideBulkOperation<OrderItem, void>({
      executeFn: async (request) => {
        const res = await fetch('/api/bulk-operations/delete', {
          method: 'POST',
          body: JSON.stringify(request),
        });
        return res.json();
      },
    }),
  ],
})
export class MyBulkActionComponent {
  readonly selection = injectSelectionState<string>();
  readonly itemsMap = computed<Record<string, OrderItem>>(() => { ... });

  readonly op = injectBulkOperation<OrderItem, void>();

  async runDelete() {
    const request = selectedItemsToBulkRequest(
      this.selection.selected,
      this.itemsMap()
    );
    await this.op.execute(request);
  }

  async retry() {
    await this.op.retryFailed((failed) => ({
      items: failed.map(r => r.item),
    }));
  }
}
```

## Features

| Feature                                    | Status | Notes                                             |
| ------------------------------------------ | ------ | ------------------------------------------------- |
| Generic service with typed contracts       | ✅     | TItem, TResult, TPayload                          |
| `results`, `summary`, `inProgress` signals | ✅     | Per-item + aggregate state                        |
| `error` signal                             | ✅     | Top-level error capture                           |
| `execute()`                                | ✅     | Runs operation with lifecycle                     |
| `clearResults()`                           | ✅     | Resets to idle state                              |
| `retryFailed()`                            | ✅     | Re-executes only failed items                     |
| `selectedItemsToBulkRequest()`             | ✅     | Composes with `@hexguard/angular-selection-state` |
| HTTP 207 partial-success                   | ✅     | Per-item success/failure tracking                 |
| `provideBulkOperation()`                   | ✅     | DI provider factory                               |

## Demo routes

| Route                                    | Description                                                    |
| ---------------------------------------- | -------------------------------------------------------------- |
| `/packages/angular-bulk-operations`      | Package overview                                               |
| `/packages/angular-bulk-operations/demo` | Bulk delete and approve with partial-failure display and retry |

## What It Owns

- Generic bulk-action execution with progress tracking
- Per-item result and aggregate summary signals
- Retry-failed-items flow
- Selection-state composition via `selectedItemsToBulkRequest()`

## What It Does Not Own

- Data table or admin-panel UI components
- Long-running operation polling (see `@hexguard/angular-async-state`)
- Distributed transaction guarantees or rollback
- File uploads
