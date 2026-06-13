# Demo Runbook

The demo app lives in `apps/demo-angular` and exists for three reasons:

- explain the intended library usage with realistic UI flows
- give contributors a fast manual verification surface
- provide the target for Playwright end-to-end coverage

## Start the Demo

```bash
pnpm install
pnpm start
```

The default development URL is `http://localhost:4200`.

## Demo Routes

- `/packages/angular-url-state`: package overview and demo catalog
- `/packages/angular-url-state/orders`: debounced replace-state search, status, tags, and pagination-friendly URL state with a compact default page size so `/packages/angular-url-state/orders?page=2` is directly demonstrable
- `/packages/angular-url-state/dashboard`: push-state history for tabs, date ranges, and archive toggles

Legacy redirects from `/orders` and `/dashboard` are retained while the demo app moves to
package-aware routes.

## Demo Structure

The app is organized as an Angular package showcase:

- `apps/demo-angular/src/app/demo-registry.ts`: package and demo metadata used by navigation, routes, docs links, and tests
- `apps/demo-angular/src/app/features/angular-url-state/`: current package demos and package-specific fixtures
- `apps/demo-angular/src/app/shared/`: reusable layout, inspector, formatting, and URL-tracking helpers
- `apps/demo-angular/src/app/generated/demo-snippets.ts`: generated source excerpts shown in the demo inspector panels

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

The tests start the Angular demo automatically through `playwright.config.ts`.

## Manual Verification Checklist

1. Open `/packages/angular-url-state` and confirm both URL-state demos are listed.
2. Open `/packages/angular-url-state/orders?page=2` and confirm the page indicator, table rows, and page input hydrate from the URL.
3. Open `/packages/angular-url-state/orders` and confirm search, tags, and reset behavior update the URL and snapshot JSON.
4. Use the demo navigation strip to move from Orders to Dashboard, then back to the package overview.
5. Open `/packages/angular-url-state/dashboard`, switch tabs, apply a date preset, and use browser back and forward.
6. Open each demo source tab and confirm it shows a line-numbered generated `urlState()` setup from the real component source.
7. Confirm the current URL strip always reflects the visible state.

## Selector Policy

Interactive controls in the demo intentionally expose `data-testid` attributes. Treat them as part
of the repo's testing contract.
