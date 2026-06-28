/**
 * Public API for `@hexguard/angular-table-state`.
 *
 * The package provides:
 * - `injectTableState()` — unified table state handle composing sort, pagination, selection, and filters.
 */
export { injectTableState } from './lib/table-state';
export type {
  TableStateHandle,
  TableStateOptions,
  SortDirection,
  SortState,
} from './lib/types';
