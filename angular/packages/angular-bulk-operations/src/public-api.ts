/**
 * Public API for `@hexguard/angular-bulk-operations`.
 *
 * The package provides typed bulk-operation request/response contracts,
 * an injectable service with progress tracking, and a facade that
 * composes with `@hexguard/angular-selection-state` signals.
 */
export type {
  BulkOperationError,
  BulkOperationRequest,
  BulkOperationResponse,
  BulkOperationResult,
  BulkOperationStatus,
} from './lib/types';

export { BulkOperationService } from './lib/bulk-operation.service';
export type { BulkOperationConfig } from './lib/bulk-operation.service';

export { provideBulkOperation } from './lib/bulk-operation-providers';

export { injectBulkOperation } from './lib/inject-bulk-operation';
export type { BulkOperationFacade } from './lib/inject-bulk-operation';

export { selectedItemsToBulkRequest } from './lib/selection-helpers';
