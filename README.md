# HexGuard

HexGuard publishes small, production-grade guardrails for Angular and .NET applications. This
repository is the monorepo hub for published packages, demo apps, release automation, and the AI
workflow docs that keep future package work consistent.

## Package Hub

| Package                                 | Status      | Summary                                                                                      | Docs                                                                                                      |
| --------------------------------------- | ----------- | -------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| `@hexguard/angular-url-state`           | Available   | Type-safe, signal-first synchronization between Angular state and URL query params.          | [Package README](packages/angular-url-state/README.md), [Deep Dive](docs/packages/angular-url-state.md)   |
| `@hexguard/angular-query-form`          | In Progress | Reactive Forms binding on top of URL state for filter-heavy search pages and recovery flows. | [Package README](packages/angular-query-form/README.md), [Deep Dive](docs/packages/angular-query-form.md) |
| `@hexguard/angular-submit-lock`         | Planned     | Prevent duplicate submissions while exposing explicit async busy state.                      | [Brief](docs/packages/README.md#package-angular-submit-lock)                                              |
| `@hexguard/angular-api-errors`          | Planned     | Normalize backend validation and problem-details payloads into Angular-friendly error state. | [Brief](docs/packages/README.md#package-angular-api-errors)                                               |
| `@hexguard/angular-table-state`         | Planned     | Reusable sorting, filtering, selection, and pagination orchestration for data tables.        | [Brief](docs/packages/README.md#package-angular-table-state)                                              |
| `@hexguard/angular-preferences`         | Planned     | Lightweight user preferences for dashboard defaults and admin surfaces.                      | [Brief](docs/packages/README.md#package-angular-preferences)                                              |
| `@hexguard/angular-dirty-state`         | Planned     | Unsaved-change guards and dirty-state helpers for Angular flows.                             | [Brief](docs/packages/README.md#package-angular-dirty-state)                                              |
| `@hexguard/angular-http-dedupe`         | Planned     | Request de-duplication helpers for Angular HTTP and resource-style data fetching.            | [Brief](docs/packages/README.md#package-angular-http-dedupe)                                              |
| `@hexguard/angular-http-resource-debug` | Planned     | Debug tooling around Angular HTTP resource usage and request lifecycles.                     | [Brief](docs/packages/README.md#package-angular-http-resource-debug)                                      |
| `HexGuard.ProblemDetails`               | Planned     | .NET helpers for creating and mapping RFC 9457 problem-details responses.                    | [Brief](docs/packages/README.md#package-problemdetails)                                                   |
| `HexGuard.Webhooks`                     | Planned     | .NET webhook verification and event processing primitives.                                   | [Brief](docs/packages/README.md#package-webhooks)                                                         |
| `HexGuard.Pagination`                   | Planned     | .NET pagination contracts and response helpers for APIs.                                     | [Brief](docs/packages/README.md#package-pagination)                                                       |

## Documentation

- [Docs Index](docs/README.md)
- [Package Catalog](docs/packages/README.md)
- [Run the Demo](docs/demo/README.md)
- [AI Workflow](docs/ai/README.md)
- [Contributing](CONTRIBUTING.md)
- [Security](SECURITY.md)

## Local Development

```bash
pnpm install
pnpm lint
pnpm test:ci
pnpm test:e2e
pnpm build
pnpm start
```

Repository layout:

- `packages/angular-url-state`: publishable Angular library
- `apps/demo-angular`: docs-grade demo and Playwright target
- `docs/`: package guides, demo runbook, AI workflow docs
- `.github/workflows/`: CI and release automation

## License

MIT. See `LICENSE`.
