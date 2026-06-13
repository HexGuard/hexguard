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

- `/orders`: debounced replace-state search, status, tags, and pagination-friendly URL state with a compact default page size so `/orders?page=2` is directly demonstrable
- `/dashboard`: push-state history for tabs, date ranges, and archive toggles

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

1. Open `/orders?page=2` and confirm the page indicator, table rows, and page input hydrate from the URL.
2. Open `/orders` and confirm search, tags, and reset behavior update the URL and snapshot JSON.
3. Open `/dashboard`, switch tabs, apply a date preset, and use browser back and forward.
4. Confirm the current URL strip always reflects the visible state.

## Selector Policy

Interactive controls in the demo intentionally expose `data-testid` attributes. Treat them as part
of the repo's testing contract.
