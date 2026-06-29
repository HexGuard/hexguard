# HexGuard

HexGuard publishes small, production-grade guardrails for Angular and .NET applications. This
repository is the monorepo hub for published packages, demo apps, release automation, and the AI
workflow docs that keep future package work consistent.

## Package Discovery

The detailed package and roadmap catalog now lives in [docs/packages/README.md](docs/packages/README.md)
and is generated from the same source metadata that drives the Angular demo website.

### Compatibility Matrix

| Package                              | Version | Angular | Peer dependencies                                                                                        | Status    |
| ------------------------------------ | ------- | ------- | -------------------------------------------------------------------------------------------------------- | --------- |
| `@hexguard/angular-url-state`        | 0.1.0   | ^22.0.0 | `@angular/common`, `@angular/core`, `@angular/router`                                                    | Available |
| `@hexguard/angular-async-state`      | 0.1.0   | ^22.0.0 | `@angular/common`, `@angular/core`, `rxjs`                                                               | Available |
| `@hexguard/angular-query-form`       | 0.1.0   | ^22.0.0 | `@angular/common`, `@angular/core`, `@angular/forms`, `@angular/router`, `@hexguard/angular-url-state`   | Available |
| `@hexguard/angular-optimistic-state` | 0.1.0   | ^22.0.0 | `@angular/common`, `@angular/core`, `rxjs`                                                               | Available |
| `@hexguard/angular-permissions`      | 0.1.0   | ^22.0.0 | `@angular/common`, `@angular/core`, `@angular/router`                                                    | Available |
| `@hexguard/angular-lookups`          | 0.1.0   | ^22.0.0 | `@angular/common`, `@angular/core`, `@hexguard/angular-async-state`                                      | Available |
| `@hexguard/angular-async-state`      | 0.1.0   | ^22.0.0 | `@angular/common`, `@angular/core`, `rxjs`                                                               | Available |
| `@hexguard/angular-query-form`       | 0.1.0   | ^22.0.0 | `@angular/common`, `@angular/core`, `@angular/forms`, `@angular/router`, `@hexguard/angular-url-state`   | Available |
| `@hexguard/angular-optimistic-state` | 0.1.0   | ^22.0.0 | `@angular/common`, `@angular/core`, `rxjs`                                                               | Available |
| `@hexguard/angular-permissions`      | 0.1.0   | ^22.0.0 | `@angular/common`, `@angular/core`, `@angular/router`                                                    | Available |
| `@hexguard/angular-lookups`          | 0.1.0   | ^22.0.0 | `@angular/common`, `@angular/core`, `@hexguard/angular-async-state`                                      | Available |
| `@hexguard/angular-api-errors`       | 0.1.0   | ^22.0.0 | `@angular/common`, `@angular/core`, `@angular/forms`                                                     | Available |
| `@hexguard/angular-debounce`         | 0.1.0   | ^22.0.0 | `@angular/common`, `@angular/core`                                                                       | Available |
| `@hexguard/angular-breakpoint-observer` | 0.1.0 | ^22.0.0 | `@angular/common`, `@angular/core`                                                                      | Available |
| `@hexguard/angular-visibility`       | 0.1.0   | ^22.0.0 | `@angular/common`, `@angular/core`                                                                       | Available |
| `@hexguard/angular-navigation-pending` | 0.1.0 | ^22.0.0 | `@angular/common`, `@angular/core`, `@angular/router`                                                  | Available |
| `@hexguard/angular-click-outside`    | 0.1.0   | ^22.0.0 | `@angular/common`, `@angular/core`                                                                       | Available |
| `@hexguard/angular-clipboard`        | 0.1.0   | ^22.0.0 | `@angular/common`, `@angular/core`                                                                       | Available |
| `@hexguard/angular-theme`            | 0.1.0   | ^22.0.0 | `@angular/common`, `@angular/core`                                                                       | Available |
| `@hexguard/angular-undo`             | 0.1.0   | ^22.0.0 | `@angular/common`, `@angular/core`                                                                       | Available |
| `@hexguard/angular-pagination`       | 0.1.0   | ^22.0.0 | `@angular/common`, `@angular/core`, `@angular/router`                                                    | Available |
| `@hexguard/angular-form-drafts`      | 0.1.0   | ^22.0.0 | `@angular/common`, `@angular/core`                                                                       | Available |
| `@hexguard/angular-file-picker`      | 0.1.0   | ^22.0.0 | `@angular/common`, `@angular/core`                                                                       | Available |
| `@hexguard/angular-confirmation`     | 0.1.0   | ^22.0.0 | `@angular/common`, `@angular/core`                                                                       | Available |
| `@hexguard/angular-live-data`        | 0.1.0   | ^22.0.0 | `@angular/common`, `@angular/core`                                                                       | Available |
| `@hexguard/angular-notifications`    | 0.1.0   | ^22.0.0 | `@angular/common`, `@angular/core`                                                                       | Available |
| `@hexguard/angular-error-boundary`   | 0.1.0   | ^22.0.0 | `@angular/common`, `@angular/core`                                                                       | Available |
| `@hexguard/angular-date-utils`       | 0.1.0   | ^22.0.0 | `@angular/common`, `@angular/core`                                                                       | Available |
| `@hexguard/angular-network-status`   | 0.1.0   | ^22.0.0 | `@angular/common`, `@angular/core`                                                                       | Available |
| `@hexguard/angular-storage`          | 0.1.0   | ^22.0.0 | `@angular/common`, `@angular/core`                                                                       | Available |
| `@hexguard/angular-feature-flags`    | 0.1.0   | ^22.0.0 | `@angular/common`, `@angular/core`, `@angular/router`                                                    | Available |
| `@hexguard/angular-selection-state`  | 0.1.0   | ^22.0.0 | `@angular/common`, `@angular/core`                                                                       | Available |
| `@hexguard/angular-bulk-operations`  | 0.1.0   | ^22.0.0 | `@angular/common`, `@angular/core`, `@hexguard/angular-async-state`, `@hexguard/angular-selection-state` | Available |
| `@hexguard/angular-route-memory`     | 0.1.0   | ^22.0.0 | `@angular/common`, `@angular/core`, `@angular/router`                                                    | Available |
| `@hexguard/angular-page-context`     | 0.1.0   | ^22.0.0 | `@angular/common`, `@angular/core`, `@angular/router`                                                    | Available |
| `@hexguard/angular-scroll-state`     | 0.1.0   | ^22.0.0 | `@angular/common`, `@angular/core`                                                                       | Available |
| `@hexguard/angular-wizard-state`     | 0.1.0   | ^22.0.0 | `@angular/common`, `@angular/core`                                                                       | Available |
| `@hexguard/angular-command-palette`  | 0.1.0   | ^22.0.0 | `@angular/common`, `@angular/core`                                                                       | Available |
| `@hexguard/angular-dirty-state`      | 0.1.0   | ^22.0.0 | `@angular/common`, `@angular/core`, `@angular/router`                                                    | Available |
| `@hexguard/angular-table-state`      | 0.1.0   | ^22.0.0 | `@angular/common`, `@angular/core`, `@angular/router`                                                    | Available |
| `@hexguard/angular-signal-persist`   | 0.1.0   | ^22.0.0 | `@angular/common`, `@angular/core`                                                                       | Available |
| `@hexguard/angular-signal-utils`     | 0.1.0   | ^22.0.0 | `@angular/common`, `@angular/core`                                                                       | Available |
| `@hexguard/angular-preferences`      | 0.1.0   | ^22.0.0 | `@angular/common`, `@angular/core`, `@hexguard/angular-storage`                                          | Available |
| `@hexguard/angular-http-dedupe`      | 0.1.0   | ^22.0.0 | `@angular/common`, `@angular/core`                                                                       | Available |

All packages are licensed under MIT and published with `publishConfig: { access: "public" }`.

### Angular Packages

Current public Angular package entry points with README and changelog:

- [@hexguard/angular-url-state](angular/packages/angular-url-state/README.md) — [changelog](angular/packages/angular-url-state/CHANGELOG.md)
- [@hexguard/angular-async-state](angular/packages/angular-async-state/README.md) — [changelog](angular/packages/angular-async-state/CHANGELOG.md)
- [@hexguard/angular-lookups](angular/packages/angular-lookups/README.md) — [changelog](angular/packages/angular-lookups/CHANGELOG.md)
- [@hexguard/angular-optimistic-state](angular/packages/angular-optimistic-state/README.md) — [changelog](angular/packages/angular-optimistic-state/CHANGELOG.md)
- [@hexguard/angular-query-form](angular/packages/angular-query-form/README.md) — [changelog](angular/packages/angular-query-form/CHANGELOG.md)
- [@hexguard/angular-permissions](angular/packages/angular-permissions/README.md) — [changelog](angular/packages/angular-permissions/CHANGELOG.md)
- [@hexguard/angular-api-errors](angular/packages/angular-api-errors/README.md) — [changelog](angular/packages/angular-api-errors/CHANGELOG.md)
- [@hexguard/angular-debounce](angular/packages/angular-debounce/README.md) — [changelog](angular/packages/angular-debounce/CHANGELOG.md)
- [@hexguard/angular-breakpoint-observer](angular/packages/angular-breakpoint-observer/README.md) — [changelog](angular/packages/angular-breakpoint-observer/CHANGELOG.md)
- [@hexguard/angular-visibility](angular/packages/angular-visibility/README.md) — [changelog](angular/packages/angular-visibility/CHANGELOG.md)
- [@hexguard/angular-navigation-pending](angular/packages/angular-navigation-pending/README.md) — [changelog](angular/packages/angular-navigation-pending/CHANGELOG.md)
- [@hexguard/angular-click-outside](angular/packages/angular-click-outside/README.md) — [changelog](angular/packages/angular-click-outside/CHANGELOG.md)
- [@hexguard/angular-clipboard](angular/packages/angular-clipboard/README.md) — [changelog](angular/packages/angular-clipboard/CHANGELOG.md)
- [@hexguard/angular-theme](angular/packages/angular-theme/README.md) — [changelog](angular/packages/angular-theme/CHANGELOG.md)
- [@hexguard/angular-undo](angular/packages/angular-undo/README.md) — [changelog](angular/packages/angular-undo/CHANGELOG.md)
- [@hexguard/angular-pagination](angular/packages/angular-pagination/README.md) — [changelog](angular/packages/angular-pagination/CHANGELOG.md)
- [@hexguard/angular-form-drafts](angular/packages/angular-form-drafts/README.md) — [changelog](angular/packages/angular-form-drafts/CHANGELOG.md)
- [@hexguard/angular-file-picker](angular/packages/angular-file-picker/README.md) — [changelog](angular/packages/angular-file-picker/CHANGELOG.md)
- [@hexguard/angular-confirmation](angular/packages/angular-confirmation/README.md) — [changelog](angular/packages/angular-confirmation/CHANGELOG.md)
- [@hexguard/angular-live-data](angular/packages/angular-live-data/README.md) — [changelog](angular/packages/angular-live-data/CHANGELOG.md)
- [@hexguard/angular-notifications](angular/packages/angular-notifications/README.md) — [changelog](angular/packages/angular-notifications/CHANGELOG.md)
- [@hexguard/angular-error-boundary](angular/packages/angular-error-boundary/README.md) — [changelog](angular/packages/angular-error-boundary/CHANGELOG.md)
- [@hexguard/angular-date-utils](angular/packages/angular-date-utils/README.md) — [changelog](angular/packages/angular-date-utils/CHANGELOG.md)
- [@hexguard/angular-network-status](angular/packages/angular-network-status/README.md) — [changelog](angular/packages/angular-network-status/CHANGELOG.md)
- [@hexguard/angular-storage](angular/packages/angular-storage/README.md) — [changelog](angular/packages/angular-storage/CHANGELOG.md)
- [@hexguard/angular-feature-flags](angular/packages/angular-feature-flags/README.md) — [changelog](angular/packages/angular-feature-flags/CHANGELOG.md)
- [@hexguard/angular-selection-state](angular/packages/angular-selection-state/README.md) — [changelog](angular/packages/angular-selection-state/CHANGELOG.md)
- [@hexguard/angular-bulk-operations](angular/packages/angular-bulk-operations/README.md) — [changelog](angular/packages/angular-bulk-operations/CHANGELOG.md)
- [@hexguard/angular-route-memory](angular/packages/angular-route-memory/README.md) — [changelog](angular/packages/angular-route-memory/CHANGELOG.md)
- [@hexguard/angular-page-context](angular/packages/angular-page-context/README.md) — [changelog](angular/packages/angular-page-context/CHANGELOG.md)
- [@hexguard/angular-scroll-state](angular/packages/angular-scroll-state/README.md) — [changelog](angular/packages/angular-scroll-state/CHANGELOG.md)
- [@hexguard/angular-wizard-state](angular/packages/angular-wizard-state/README.md) — [changelog](angular/packages/angular-wizard-state/CHANGELOG.md)
- [@hexguard/angular-command-palette](angular/packages/angular-command-palette/README.md) — [changelog](angular/packages/angular-command-palette/CHANGELOG.md)
- [@hexguard/angular-dirty-state](angular/packages/angular-dirty-state/README.md) — [changelog](angular/packages/angular-dirty-state/CHANGELOG.md)
- [@hexguard/angular-table-state](angular/packages/angular-table-state/README.md) — [changelog](angular/packages/angular-table-state/CHANGELOG.md)
- [@hexguard/angular-signal-persist](angular/packages/angular-signal-persist/README.md) — [changelog](angular/packages/angular-signal-persist/CHANGELOG.md)
- [@hexguard/angular-signal-utils](angular/packages/angular-signal-utils/README.md) — [changelog](angular/packages/angular-signal-utils/CHANGELOG.md)
- [@hexguard/angular-preferences](angular/packages/angular-preferences/README.md) — [changelog](angular/packages/angular-preferences/CHANGELOG.md)
- [@hexguard/angular-http-dedupe](angular/packages/angular-http-dedupe/README.md) — [changelog](angular/packages/angular-http-dedupe/CHANGELOG.md)

### .NET Packages

- [HexGuard.ReferenceData](dotnet/src/HexGuard.ReferenceData/README.md)
- [HexGuard.ProblemDetails](dotnet/src/HexGuard.ProblemDetails/README.md)
- [HexGuard.ValidationContracts](dotnet/src/HexGuard.ValidationContracts/README.md)
- [HexGuard.FeatureFlags](dotnet/src/HexGuard.FeatureFlags/README.md)
- [HexGuard.BulkOperations](dotnet/src/HexGuard.BulkOperations/README.md)
- [HexGuard.Capabilities](dotnet/src/HexGuard.Capabilities/README.md)

### Deep Dive Documentation

- [Full Package Catalog](docs/packages/README.md)
- [`@hexguard/angular-url-state` Deep Dive](docs/packages/angular-url-state.md)
- [`@hexguard/angular-query-form` Deep Dive](docs/packages/angular-query-form.md)
- [`@hexguard/angular-async-state` Deep Dive](docs/packages/angular-async-state.md)
- [`@hexguard/angular-lookups` Deep Dive](docs/packages/angular-lookups.md)
- [`@hexguard/angular-optimistic-state` Deep Dive](docs/packages/angular-optimistic-state.md)
- [`@hexguard/angular-permissions` Deep Dive](docs/packages/angular-permissions.md)
- [`@hexguard/angular-api-errors` Deep Dive](docs/packages/angular-api-errors.md)
- [`@hexguard/angular-debounce` Deep Dive](docs/packages/angular-debounce.md)
- [`@hexguard/angular-breakpoint-observer` Deep Dive](docs/packages/angular-breakpoint-observer.md)
- [`@hexguard/angular-visibility` Deep Dive](docs/packages/angular-visibility.md)
- [`@hexguard/angular-navigation-pending` Deep Dive](docs/packages/angular-navigation-pending.md)
- [`@hexguard/angular-click-outside` Deep Dive](docs/packages/angular-click-outside.md)
- [`@hexguard/angular-clipboard` Deep Dive](docs/packages/angular-clipboard.md)
- [`@hexguard/angular-theme` Deep Dive](docs/packages/angular-theme.md)
- [`@hexguard/angular-undo` Deep Dive](docs/packages/angular-undo.md)
- [`@hexguard/angular-pagination` Deep Dive](docs/packages/angular-pagination.md)
- [`@hexguard/angular-form-drafts` Deep Dive](docs/packages/angular-form-drafts.md)
- [`@hexguard/angular-file-picker` Deep Dive](docs/packages/angular-file-picker.md)
- [`@hexguard/angular-confirmation` Deep Dive](docs/packages/angular-confirmation.md)
- [`@hexguard/angular-live-data` Deep Dive](docs/packages/angular-live-data.md)
- [`@hexguard/angular-notifications` Deep Dive](docs/packages/angular-notifications.md)
- [`@hexguard/angular-error-boundary` Deep Dive](docs/packages/angular-error-boundary.md)
- [`@hexguard/angular-date-utils` Deep Dive](docs/packages/angular-date-utils.md)
- [`@hexguard/angular-network-status` Deep Dive](docs/packages/angular-network-status.md)
- [`@hexguard/angular-storage` Deep Dive](docs/packages/angular-storage.md)
- [`@hexguard/angular-feature-flags` Deep Dive](docs/packages/angular-feature-flags.md)
- [`@hexguard/angular-selection-state` Deep Dive](docs/packages/angular-selection-state.md)
- [`@hexguard/angular-bulk-operations` Deep Dive](docs/packages/angular-bulk-operations.md)
- [`@hexguard/angular-route-memory` Deep Dive](docs/packages/angular-route-memory.md)
- [`@hexguard/angular-page-context` Deep Dive](docs/packages/angular-page-context.md)
- [`@hexguard/angular-scroll-state` Deep Dive](docs/packages/angular-scroll-state.md)
- [`@hexguard/angular-wizard-state` Deep Dive](docs/packages/angular-wizard-state.md)
- [`@hexguard/angular-command-palette` Deep Dive](docs/packages/angular-command-palette.md)
- [`@hexguard/angular-dirty-state` Deep Dive](docs/packages/angular-dirty-state.md)
- [`@hexguard/angular-table-state` Deep Dive](docs/packages/angular-table-state.md)
- [`@hexguard/angular-signal-persist` Deep Dive](docs/packages/angular-signal-persist.md)
- [`@hexguard/angular-signal-utils` Deep Dive](docs/packages/angular-signal-utils.md)
- [`@hexguard/angular-preferences` Deep Dive](docs/packages/angular-preferences.md)
- [`@hexguard/angular-http-dedupe` Deep Dive](docs/packages/angular-http-dedupe.md)
- [`HexGuard.Capabilities` Deep Dive](docs/packages/hexguard-capabilities.md)

### Workspace & Workflow

- [Run the Demo](docs/demo/README.md)
- [AI Workflow](docs/.ai/README.md)
- [Contributing](CONTRIBUTING.md)
- [Security](SECURITY.md)

## Local Development

```bash
pnpm install
pnpm angular:install
pnpm dotnet:restore
pnpm lint
pnpm test:ci
pnpm test:e2e
pnpm build
pnpm start
```

For live backend integration across Angular and .NET demos, run the shared sample API in a second
terminal:

```bash
pnpm dotnet:start:demo-api
```

The API serves five endpoint groups — angular-lookups, angular-async-state, angular-optimistic-state,
angular-permissions, and hexguard-reference-data — on `http://127.0.0.1:5074`. See the
[demo runbook](docs/demo/README.md) for the full route list.

When working in the dedicated .NET space:

```bash
pnpm dotnet:restore
pnpm dotnet:build
pnpm dotnet:test
```

Repository layout:

- `angular/`: Angular workspace for libraries, demo app, Playwright coverage, and Angular-specific tooling
- `angular/packages/`: 39 publishable Angular libraries — URL state, async state, optimistic state,
  query form, permissions, lookups, API errors, debounce, breakpoint observer, visibility,
  navigation pending, click outside, clipboard, theme, undo, pagination, form drafts, file picker,
  confirmation, live data, notifications, error boundary, date utils, network status, storage,
  feature flags, selection state, bulk operations, route memory, page context, scroll state,
  wizard state, command palette, dirty state, table state, signal persist, signal utils,
  preferences, http dedupe
- `dotnet/`: dedicated .NET workspace for future libraries, tests, and sample hosts
- `dotnet/samples/`: one shared sample API with package-scoped folders and future cross-stack demos
- `angular/apps/demo-angular`: docs-grade demo and Playwright target
- `docs/`: package guides, demo runbook, AI workflow docs
- `.github/workflows/`: CI and release automation

## License

MIT. See `LICENSE`.
