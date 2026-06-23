/**
 * Public API for `@hexguard/angular-page-context`.
 *
 * The package provides a single injectable — `injectPageContext()` — for
 * managing page-level metadata such as titles, breadcrumbs, tabs, and
 * contextual actions via signals.
 */
export { injectPageContext } from './lib/page-context';
export type { PageContextHandle, PageContext, Breadcrumb, PageAction, PageTab } from './lib/types';
