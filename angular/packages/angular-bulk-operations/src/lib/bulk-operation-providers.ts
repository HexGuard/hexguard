import { type Provider, InjectionToken } from '@angular/core';
import { BulkOperationService, type BulkOperationConfig } from './bulk-operation.service';

let _providedCount = 0;

/**
 * Registers a bulk operation service in the Angular DI container.
 *
 * Each call creates a **separate** service instance identified by a
 * unique `InjectionToken`, so multiple bulk operations (e.g. delete + approve)
 * can coexist in the same component.
 *
 * Pass the returned token to {@link injectBulkOperation} to retrieve
 * the correct instance.
 *
 * @example
 * ```ts
 * const DELETE_OP = provideBulkOperation({ executeFn: bulkDelete });
 * const APPROVE_OP = provideBulkOperation({ executeFn: bulkApprove });
 *
 * @Component({
 *   providers: [DELETE_OP.providers, APPROVE_OP.providers],
 * })
 * export class MyComponent {
 *   readonly deleteOp = injectBulkOperation(DELETE_OP.token);
 *   readonly approveOp = injectBulkOperation(APPROVE_OP.token);
 * }
 * ```
 */
export function provideBulkOperation<TItem, TResult, TPayload = void>(
  config: BulkOperationConfig<TItem, TResult, TPayload>,
): {
  readonly token: InjectionToken<BulkOperationService<TItem, TResult, TPayload>>;
  readonly providers: Provider[];
} {
  const token = new InjectionToken<BulkOperationService<TItem, TResult, TPayload>>(
    `BULK_OPERATION_SERVICE_${++_providedCount}`,
  );

  return {
    token,
    providers: [
      {
        provide: token,
        useFactory: () => new BulkOperationService<TItem, TResult, TPayload>(config),
      },
    ],
  };
}

