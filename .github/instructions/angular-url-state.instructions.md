---
description: 'Use when editing the Angular URL state library, codecs, router synchronization, or public API in angular/packages/angular-url-state/src. Covers API stability, deterministic query serialization, invalid URL handling, and validation expectations.'
applyTo: 'angular/packages/angular-url-state/src/**/*.ts'
---

# Angular URL State Library

- Preserve the signal-first public API and avoid adding new runtime dependencies.
- Keep query serialization deterministic by schema order and preserve unmanaged query params.
- Invalid URL input must remain safe by default. If behavior changes, update codec tests and router-sync tests together.
- When public API shape changes, update `angular/packages/angular-url-state/README.md` and `docs/packages/angular-url-state.md` in the same change.
- Validate with `pnpm test:lib` and `pnpm build:lib`. Run `pnpm test:e2e` when the demo depends on the changed behavior.
