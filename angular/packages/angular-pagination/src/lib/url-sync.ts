import { effect, type Signal } from '@angular/core';

import type { PaginationHandle } from './types';

/**
 * Minimal UrlState interface consumed by the sync adapter.
 * Consumers pass an object matching this shape from
 * `@hexguard/angular-url-state`.
 */
export interface UrlStateLike {
  readonly keys: Signal<Record<string, string | undefined>>;
  patch(values: Record<string, string | undefined>): void;
}

/**
 * Configuration for binding pagination state to URL query parameters.
 */
export interface PaginationUrlSyncConfig {
  /**
   * The `UrlState` handle from `@hexguard/angular-url-state`.
   * Required – the consumer must inject and pass it explicitly.
   */
  urlState: UrlStateLike;

  /**
   * Query parameter name for the page number.
   * @default 'p'
   */
  paramPage?: string;

  /**
   * Query parameter name for the page size.
   * @default 'size'
   */
  paramSize?: string;
}

/**
 * Binds pagination state to URL query parameters.
 *
 * The consumer must pass a `UrlState` handle from `@hexguard/angular-url-state`.
 *
 * @example
 * ```ts
 * const urlState = inject(UrlState);
 * const pag = injectPagination();
 * withPaginationUrlSync(pag, { urlState, paramPage: 'p', paramSize: 'size' });
 * ```
 */
export function withPaginationUrlSync(
  pag: Pick<PaginationHandle, 'page' | 'pageSize' | 'goToPage' | 'setPageSize'>,
  config: PaginationUrlSyncConfig,
): void {
  const paramPage = config?.paramPage ?? 'p';
  const paramSize = config?.paramSize ?? 'size';
  const urlState = config.urlState;

  // Sync state → URL: when page/pageSize change, update URL params
  effect(() => {
    const page = pag.page();
    const size = pag.pageSize();
    urlState.patch({
      [paramPage]: page > 1 ? String(page) : undefined,
      [paramSize]: size !== 20 ? String(size) : undefined,
    });
  });

  // Sync URL → state: observe URL keys and restore on external changes
  effect(() => {
    const keys = urlState.keys();
    const urlPage = keys[paramPage];
    const urlSize = keys[paramSize];

    if (urlPage !== undefined) {
      const parsed = Number(urlPage);
      if (!isNaN(parsed) && parsed > 0) {
        pag.goToPage(parsed);
      }
    } else {
      pag.goToPage(1);
    }

    if (urlSize !== undefined) {
      const parsed = Number(urlSize);
      if (!isNaN(parsed) && parsed > 0) {
        pag.setPageSize(parsed);
      }
    }
  });
}
