# Demo Runbook

The demo app lives in `angular/apps/demo-angular` and exists for three reasons:

- explain the intended library usage with realistic UI flows
- give contributors a fast manual verification surface
- provide the target for Playwright end-to-end coverage

## Start the Demo

```bash
pnpm install
pnpm angular:install
pnpm start
```

The default development URL is `http://localhost:4200`.

## Demo Routes

- `/packages/angular-url-state`: package overview and demo catalog
- `/packages/angular-url-state/orders`: debounced replace-state search, status, tags, and pagination-friendly URL state with remapped keys such as `q`, `p`, `size`, and repeated `tag` values, so `/packages/angular-url-state/orders?p=2` is directly demonstrable
- `/packages/angular-url-state/dashboard`: push-state history for tabs, date ranges, and archive toggles
- `/packages/angular-query-form`: package overview and demo catalog for the Reactive Forms binding package
- `/packages/angular-query-form/orders`: manual-apply filter form where `managedKeys` keeps `page` and `pageSize` URL-owned while `resetKeysOnChange` still resets pagination when filters are committed
- `/packages/angular-query-form/recovery`: malformed-link cleanup plus push-state history replay for a query-bound incident triage form
- `/packages/angular-async-state`: package overview and demo catalog for async value and async action lifecycle primitives
- `/packages/angular-async-state/value`: async value lifecycle with first-load errors, empty results, successful reloads, and stale-data refresh failures
- `/packages/angular-async-state/action`: async action lifecycle with pending, success, failure, and duplicate-run reuse

Legacy redirects from `/orders`, `/dashboard`, `/query-form-orders`, `/query-form-recovery`,
`/async-state-value`, and `/async-state-action` are retained while the demo app uses package-aware
routes.

## Demo Structure

The app is organized as an Angular package showcase:

- `angular/apps/demo-angular/src/app/demo-registry.ts`: package and demo metadata used by navigation, routes, docs links, and tests
- `angular/apps/demo-angular/src/app/features/angular-url-state/`: URL-state package demos and fixtures
- `angular/apps/demo-angular/src/app/features/angular-query-form/`: query-form package demos and fixtures
- `angular/apps/demo-angular/src/app/features/angular-async-state/`: async-state package demos and fixtures
- `angular/apps/demo-angular/src/app/shared/`: reusable layout, inspector, formatting, and URL-tracking helpers
- `angular/apps/demo-angular/src/app/generated/demo-snippets.ts`: generated source excerpts shown in the demo inspector panels

Run `pnpm demo:snippets` after changing marked demo source snippets. The build, app tests, and
Playwright scripts run it automatically.

## Source Panels

Each demo inspector includes two tabs:

- `Live state`: the current `state.snapshot()` output
- `Source`: a generated, Prettier-formatted excerpt from the real demo component source

The source panel is intentionally contextual. API details and conceptual guidance remain in the
package README and deep docs so the app does not become a second handwritten documentation source.
Source samples are displayed in a larger line-numbered panel so examples stay readable while still
being generated from real component code.

## Demo Navigation

Each package demo page includes a reusable navigation strip with:

- a package overview link
- every demo in the current package
- an active state for the current demo

New package demos should add metadata to `demo-registry.ts` and reuse the same navigation component
instead of adding page-local next/previous links.

## Playwright

Install the browser once on a new machine:

```bash
pnpm test:e2e:install
```

Run the end-to-end suite:

```bash
pnpm test:e2e
```

The tests start the Angular demo automatically through `angular/playwright.config.ts`.

## Manual Verification Checklist

1. Open `/packages/angular-url-state` and confirm both URL-state demos are listed.
2. Open `/packages/angular-url-state/orders?p=2` and confirm the page indicator, table rows, and page input hydrate from the URL.
3. Open `/packages/angular-url-state/dashboard`, switch tabs, apply a date preset, and use browser back and forward.
4. Open `/packages/angular-query-form` and confirm both query-form demos are listed.
5. Open `/packages/angular-query-form/orders?page=2&tags=enterprise` and confirm the page input, active tag chip, summary, and current URL hydrate from the link even though `page` is not a managed form control.
6. On `/packages/angular-query-form/orders`, move to page 2, type a search term, confirm the URL stays unchanged until Apply, then click Apply and confirm page resets to 1 through `resetKeysOnChange`.
7. On `/packages/angular-query-form/orders`, stage a filter change and click Discard draft. Confirm the URL, page input, and filter controls return to the committed state.
8. Open `/packages/angular-query-form/recovery?query=api&severity=panic&page=oops&view=matrix` and confirm invalid params are removed while the form stays usable.
9. Open `/packages/angular-async-state` and confirm both async-state demos are listed.
10. Open `/packages/angular-async-state/value`, confirm the idle message renders first, load the healthy scenario, then trigger `Reload with stale error` and confirm the cards stay visible while the refresh error is shown.
11. Open `/packages/angular-async-state/action`, trigger `Simulate double submit`, and confirm the success message appears while the backend call counter stays at `1`.
12. Trigger `Force failure` on the async action demo and confirm the error template replaces the success message.
13. Use browser back and forward on the recovery demo after changing view and page.
14. Open each demo source tab and confirm it shows a line-numbered generated setup excerpt from the real component source.
15. Confirm the current URL strip always reflects the visible committed state.

## Selector Policy

Interactive controls in the demo intentionally expose `data-testid` attributes. Treat them as part
of the repo's testing contract.
