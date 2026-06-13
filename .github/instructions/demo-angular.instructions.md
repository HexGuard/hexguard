---
description: 'Use when editing the demo Angular app in angular/apps/demo-angular/src. Covers docs-grade examples, stable Playwright selectors, and URL-state demonstration requirements.'
applyTo: 'angular/apps/demo-angular/src/**'
---

# Demo Angular App

- Treat the demo as product documentation and as an end-to-end test fixture.
- Prefer realistic workflows that show shareable URLs, snapshot state, and browser history behavior.
- Add or preserve `data-testid` attributes for interactive controls that Playwright depends on.
- When routes or interactive flows change, update `angular/playwright/tests/demo-angular.spec.ts` and `docs/demo/README.md`.
- Validate demo changes with `pnpm test:app`, `pnpm test:e2e`, and `pnpm build:demo`.
