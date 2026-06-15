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

- `/`: HexGuard landing page with current Angular package hubs, repo links, and selected roadmap items

### URL State Demo Routes

- `/packages/angular-url-state`: package overview and demo catalog
- `/packages/angular-url-state/orders`: debounced replace-state search, status, tags, and pagination-friendly URL state with remapped keys such as `q`, `p`, `size`, and repeated `tag` values, so `/packages/angular-url-state/orders?p=2` is directly demonstrable
- `/packages/angular-url-state/dashboard`: push-state history for tabs, date ranges, and archive toggles

### Query Form Demo Routes

- `/packages/angular-query-form`: package overview and demo catalog for the Reactive Forms binding package
- `/packages/angular-query-form/orders`: manual-apply filter form where `managedKeys` keeps `page` and `pageSize` URL-owned while `resetKeysOnChange` still resets pagination when filters are committed
- `/packages/angular-query-form/recovery`: malformed-link cleanup plus push-state history replay for a query-bound incident triage form

### Async State Demo Routes

- `/packages/angular-async-state`: package overview and demo catalog for async value, live observable, and async action lifecycle primitives
- `/packages/angular-async-state/value`: async value lifecycle with first-load errors, empty results, successful reloads, and stale-data refresh failures
- `/packages/angular-async-state/observable`: live observable lifecycle with explicit connect, reconnect, completion, and terminal error handling
- `/packages/angular-async-state/action`: async action lifecycle with pending, success, failure, and duplicate-run reuse

### Permissions Demo Routes

- `/packages/angular-permissions`: package overview and demo catalog for the permissions package
- `/packages/angular-permissions/actions`: one shared persona context drives disabled actions, hidden audit surfaces, and fallback templates through the same permission evaluator
- `/packages/angular-permissions/routing`: route matching and activation are gated through `canMatchPermissions()` and `canActivatePermissions()` with explicit denied-route redirects

Legacy redirects from `/orders`, `/dashboard`, `/query-form-orders`, `/query-form-recovery`,
`/async-state-value`, `/async-state-observable`, `/async-state-action`, `/permissions-actions`,
and `/permissions-routing` are retained while the demo app uses package-aware routes.

## Demo Structure

The app is organized as an Angular package showcase:

- `angular/apps/demo-angular/src/app/features/site-home/`: repo-facing landing page, package discovery, and roadmap highlights
- `angular/apps/demo-angular/src/app/demo-registry.ts`: package and demo metadata used by navigation, routes, docs links, and tests
- `angular/apps/demo-angular/src/app/generated/package-catalog.ts`: generated package catalog data shared with `docs/packages/README.md`
- `angular/apps/demo-angular/src/app/features/angular-url-state/`: URL-state package demos and fixtures
- `angular/apps/demo-angular/src/app/features/angular-query-form/`: query-form package demos and fixtures
- `angular/apps/demo-angular/src/app/features/angular-async-state/`: async-state package demos and fixtures
- `angular/apps/demo-angular/src/app/features/angular-permissions/`: permissions package demos and shared persona fixtures
- `angular/apps/demo-angular/src/app/shared/`: reusable layout, inspector, formatting, and URL-tracking helpers
- `angular/apps/demo-angular/src/app/generated/demo-snippets.ts`: generated source excerpts shown in the demo inspector panels

Run `pnpm demo:snippets` after changing marked demo source snippets. The build, app tests, and
Playwright scripts run it automatically.

Run `pnpm catalog:sync` after changing `scripts/package-catalog.data.mjs`. The build, app tests,
and Playwright scripts also run the catalog sync automatically before demo validation.

## Source Panels

Each demo inspector includes two primary tabs:

- `Live state`: the current `state.snapshot()` output
- `Source`: generated source pulled from the real demo component files

Inside the `Source` tab, the inspector exposes dedicated file tabs for:

- `component.ts`: the full TypeScript component file
- `template.html`: the full Angular template file
- `styles.css`: the full component stylesheet

API details and conceptual guidance still live in the package README and deep docs so the app does
not become a second handwritten documentation source. The source viewer stays generated from real
component files so the demo does not hide implementation details behind handwritten excerpts.

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

1. Open `/` and confirm the landing page shows the four current Angular packages plus roadmap cards.
2. Open `/packages/angular-url-state` and confirm both URL-state demos are listed.
3. Open `/packages/angular-url-state/orders?p=2` and confirm the page indicator, table rows, and page input hydrate from the URL.
4. Open `/packages/angular-url-state/dashboard`, switch tabs, apply a date preset, and use browser back and forward.
5. Open `/packages/angular-query-form` and confirm both query-form demos are listed.
6. Open `/packages/angular-query-form/orders?page=2&tags=enterprise` and confirm the page input, active tag chip, summary, and current URL hydrate from the link even though `page` is not a managed form control.
7. On `/packages/angular-query-form/orders`, move to page 2, type a search term, confirm the URL stays unchanged until Apply, then click Apply and confirm page resets to 1 through `resetKeysOnChange`.
8. On `/packages/angular-query-form/orders`, stage a filter change and click Discard draft. Confirm the URL, page input, and filter controls return to the committed state.
9. Open `/packages/angular-query-form/recovery?query=api&severity=panic&page=oops&view=matrix` and confirm invalid params are removed while the form stays usable.
10. Open `/packages/angular-async-state` and confirm all three async-state demos are listed.
11. Open `/packages/angular-async-state/value`, confirm the idle message renders first, load the healthy scenario, then trigger `Reload with stale error` and confirm the cards stay visible while the refresh error is shown.
12. Open `/packages/angular-async-state/observable`, connect the feed, emit a healthy snapshot, fail the feed, reconnect, and confirm the last live snapshot stays visible across terminal states until the next emission.
13. Open `/packages/angular-async-state/action`, trigger `Simulate double submit`, and confirm the success message appears while the backend call counter stays at `1`.
14. Trigger `Force failure` on the async action demo and confirm the error template replaces the success message.
15. Use browser back and forward on the recovery demo after changing view and page.
16. Open the source tab on each demo and confirm it exposes `component.ts`, `template.html`, and `styles.css` tabs generated from the real component files.
17. Open `/packages/angular-permissions` and confirm both permissions demos are listed.
18. Open `/packages/angular-permissions/actions`, switch from `Guest reviewer` to `Admin auditor`, and confirm the approve button enables, the audit panel appears, and the override fallback is replaced by the privileged panel.
19. Open `/packages/angular-permissions/routing`, switch personas, then navigate to `Finance child route` and `Audit child route`. Confirm unauthorized personas land on the denied panel while authorized personas see the protected child content.
20. Confirm the current URL strip always reflects the visible committed state.

## Selector Policy

Interactive controls in the demo intentionally expose `data-testid` attributes. Treat them as part
of the repo's testing contract.
