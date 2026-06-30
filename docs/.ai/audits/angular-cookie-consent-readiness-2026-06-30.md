# Readiness Audit: @hexguard/angular-cookie-consent

**Date**: 2026-06-30
**Version**: 0.1.0

## Summary

Overall: **8/9** criteria passed.
High priority: 1 item | Medium: 1 | Low: 1

## Checklist

| Category               | Rating | Key Issues                                                                                                                    |
| ---------------------- | ------ | ----------------------------------------------------------------------------------------------------------------------------- |
| API Design             | ✅     | Narrow public-api.ts with 4 components, 1 directive, 1 pipe, 1 type                                                           |
| Implementation Quality | ✅     | OnPush change detection, signal-based state reading, content projection slots, CSS custom property theming                    |
| Tests                  | ❌     | No test files exist — needs component rendering tests and directive/pipe unit tests                                           |
| Documentation          | ✅     | README with installation/quickstart/features/API/variables tables; deep-dive doc with behavior/edge-cases                     |
| Demo Integration       | ✅     | Feature folder, demo page (imports live cookie-consent components), demo-registry entry, routes, snippet entry, catalog entry |
| Package Metadata       | ✅     | name, version, description, keywords, publishConfig.access, license, correct peerDep on consent-manager                       |
| Build Output           | ✅     | `build:lib:cookie-consent` succeeds (builds consent-manager first), `verify:package` produces valid tarball                   |
| Release Workflow       | ✅     | `.github/workflows/release-angular-cookie-consent.yml` exists with correct tag pattern                                        |
| Performance            | ✅     | OnPush components, effect-based directive, computed snapshot JSON                                                             |

## Improvement Plan

### High Priority

1. **Add component and directive tests** → `angular/packages/angular-cookie-consent/src/lib/components/**/*.spec.ts`, `angular/packages/angular-cookie-consent/src/lib/directives/consent.directive.spec.ts`, `angular/packages/angular-cookie-consent/src/lib/pipes/consent.pipe.spec.ts` → description: Create test files covering:
   - Banner renders when consent status is 'unknown', hidden when 'granted'
   - Accept All button calls `acceptAll()`, Reject All calls `rejectAll()`
   - Customize button emits `customize` event
   - Preference center toggles reflect category state (necessary locked, others toggleable)
   - Floating button shows after first consent decision
   - Cookie declaration renders entries and supports category filtering
   - `*hexConsent` directive conditionally renders content based on category state
   - `hexConsent` pipe returns correct boolean for granted/denied categories
     Use `TestBed.createComponent()` with mocked `consent-manager` facade. → verify: `pnpm test:lib:cookie-consent`

### Medium Priority

2. **Add Playwright E2E test** → `angular/playwright/tests/` → description: Add a Playwright test that navigates to the cookie-consent demo page, verifies the banner is visible, clicks Accept All, and verifies the banner hides and the floating button appears. Also test the preference center and cookie declaration. → verify: `pnpm test:e2e`

### Low Priority

3. **Add CSS variable documentation for all customization points** → `angular/packages/angular-cookie-consent/README.md` → description: The README has a CSS variable table but could benefit from a visual customization guide with before/after examples showing how to theme the banner for brand matching. → verify: manual review
