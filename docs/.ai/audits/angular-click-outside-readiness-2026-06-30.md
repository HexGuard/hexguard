# Readiness Assessment: @hexguard/angular-click-outside

**Audit Date:** 2026-06-30
**Version:** 0.1.0
**Scope:** Angular package

| Category               | Rating | Notes                                                                                                                                                                         |
| ---------------------- | ------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| API Design             | ✅     | Narrow `public-api.ts` — 3 exports (injectable, directive, observable) + 2 types. `injectClickOutside()` with clear `enabled`/`exclude` options. JSDoc on all public exports. |
| Implementation Quality | ✅     | Signal-first: `clickOutside: Signal<PointerEvent                                                                                                                              | null>`. Capture-phase `pointerdown`for reliable detection.`DestroyRef`cleanup. CSS selector exclusions via`Element.closest()`. |
| Tests                  | ✅     | 11 tests across injectable + directive: initial null, outside click detection, enabled/exclude options, cleanup on destroy, directive integration.                            |
| Documentation          | ✅     | README with install/quickstart/API; deep-doc at `docs/packages/angular-click-outside.md` with design decisions and scope boundaries.                                          |
| Demo Integration       | ✅     | Hub page, demo page with directive + injectable playgrounds, routes, snippet entry, `DemoPackageEntry` in registry.                                                           |
| Package Metadata       | ✅     | `name`, `version`, `description`, `keywords`, `peerDependencies: @angular/core ^22.0.0`, `publishConfig.access: public`, `sideEffects: false`, MIT license.                   |
| Build Output           | ✅     | `pnpm build:lib:click-outside` passes. `pnpm verify:package:click-outside` produces valid tarball with README, LICENSE, ESM, DTS.                                             |
| Release Workflow       | ✅     | `.github/workflows/release-angular-click-outside.yml` with tag pattern `angular-click-outside-v*`, npm publish, GitHub release.                                               |
| Performance            | ✅     | Single capture-phase listener. Simple `contains()` check. No allocations in hot path.                                                                                         |

**Overall: ✅ Pass** — All 9 categories rated pass.

### Improvement Suggestions (low priority)

- Consider adding a `[hexguardClickOutside]` attribute selector (currently uses element selector — fine for v0.1)
- Observable helper `fromClickOutsideEvent()` exists but lacks tests — add in v0.2
