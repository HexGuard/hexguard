# `@hexguard/angular-consent-manager` Deep Dive

This page complements the npm-facing README with repo-specific implementation notes and behavior details.

## Purpose

`@hexguard/angular-consent-manager` provides a headless consent management engine for Angular applications. It implements a consent state machine with full lifecycle management, dual cookie + localStorage persistence, region-aware rule application, Google Consent Mode v2 integration, auditable consent records, and consent-gated script loading. It is the foundation for GDPR/ePrivacy and CCPA compliance in Angular apps.

## Feature Matrix

| Capability                          | Status    | Notes                                                      |
| ----------------------------------- | --------- | ---------------------------------------------------------- |
| Consent state machine               | Available | `unknown`→`pending`→`granted`/`denied`→`expired`→`unknown` |
| Cookie persistence                  | Available | Compact cookie for server-readability, configurable name/path/domain/secure/sameSite |
| localStorage persistence            | Available | Full state storage for cross-tab sync and recovery         |
| Dual-storage (cookie + localStorage)| Available | Both written on consent change; fallback chain             |
| Google Consent Mode v2              | Available | `consent default` + `consent update` dataLayer pushes     |
| Region detection                    | Available | Browser timezone heuristic maps to ISO country codes       |
| Regional configuration overrides    | Available | Map of country codes to partial config merges              |
| Consent audit trail                 | Available | Timestamped records in localStorage, 500-entry rotation    |
| Consent-gated script loading        | Available | `block_until_consent` / `load_with_denied_signal` / `load_always` |
| IAB TCF v2.2 (optional)            | Available | Secondary entrypoint `@hexguard/angular-consent-manager/tcf` |
| Consent expiry with auto-re-prompt  | Available | Configurable `consentExpiryDays`, auto-reset on expiry     |
| Category-level granular consent     | Available | Per-category toggles with required (necessary) lock        |
| SSR-safe initialization             | Available | Guards all `document`/`window` access                      |
| Zero runtime dependencies           | ✅        | Only `@angular/core` + `tslib`                             |

## Public API Map

| Export                        | Kind     | Role                                                          |
| ----------------------------- | -------- | ------------------------------------------------------------- |
| `provideConsentManager()`     | Function | Application root provider; call once in `appConfig.providers` |
| `injectConsentManager()`      | Function | DI facade returning `ConsentManagerFacade`                    |
| `ConsentManagerFacade`        | Type     | Signals (status, state, categories) + actions (acceptAll, rejectAll, setConsent, withdrawConsent) |
| `ConsentManagerConfig`        | Type     | Full configuration: categories, storage, region, GCM, expiry  |
| `ConsentStatus`               | Type     | `'unknown' \| 'pending' \| 'granted' \| 'denied' \| 'expired'` |
| `ConsentState`                | Type     | `Record<string, boolean \| null>` — category ID to value       |
| `ConsentCategory`             | Type     | Category definition: id, label, description, required, purposes, googleConsentType |
| `ConsentPurpose`              | Type     | Granular purpose with id, label, description, legitimateInterest |
| `ConsentVendor`               | Type     | Third-party vendor: id, name, purposeIds, legitimateInterest  |
| `GoogleConsentType`           | Type     | GCM type: `'analytics_storage' \| 'ad_storage' \| ...`       |
| `defaultConsentCategories()`  | Function | GDPR-aligned: necessary, functional, analytics, marketing      |
| `defaultCcpCategories()`      | Function | CCPA-aligned: opt-out defaults for analytics/functional        |
| `RegionConfig`                | Const    | Presets: GDPR, CCPA, UK, LGPD                                  |
| `GoogleConsentModeService`    | Service  | GCM v2 dataLayer integration with initialize() and update()    |
| `GoogleConsentModeConfig`     | Type     | GCM config: enabled, defaultConsent, waitForUpdate, urlPassthrough, adsDataRedaction |
| `injectConsentAudit()`        | Function | Returns `ConsentAuditHandle` with getRecords, exportRecords, clearRecords |
| `ConsentAuditHandle`          | Type     | Audit record access: getRecords, exportRecords, clearRecords   |
| `ConsentRecord`               | Type     | Single audit entry: id, timestamp, action, previousState, newState, method, region |
| `ConsentAction`               | Type     | `'grant' \| 'deny' \| 'update' \| 'withdraw' \| 'expire' \| 'auto'` |
| `ConsentMethod`               | Type     | `'banner_accept_all' \| 'banner_reject_all' \| 'preference_center' \| 'floating_button' \| 'api' \| 'expiry'` |
| `ConsentScriptLoader`         | Class    | Managed script loading: register(), onConsentChange(), getPendingScripts() |
| `ConsentManagedScript`        | Type     | Script with id, src, category, strategy, attributes, onLoad    |
| `ScriptLoadingStrategy`       | Type     | `'block_until_consent' \| 'load_with_denied_signal' \| 'load_always'` |
| `detectRegion()`              | Function | Region detection: `'disabled' \| 'browser-timezone' \| 'geo-api'` |
| `RegionDetectionConfig`       | Type     | Detection config with mode and optional customDetector         |
| `StorageBackend`              | Type     | `'cookie' \| 'localstorage' \| 'both'`                         |
| `RegionDetectionMode`         | Type     | `'disabled' \| 'browser-timezone' \| 'geo-api'`                |
| `ConsentModel`                | Type     | `'opt-in' \| 'opt-out'`                                        |
| `ConsentValue`                | Type     | `boolean \| null` — granted, denied, undecided                  |

## Behavior Details

### Consent State Machine

```
                     ┌─────────────────┐
                     │    unknown       │  ← First visit, no decision recorded
                     └────────┬────────┘
                              │ configure() called
                              ▼
                     ┌─────────────────┐
                     │    unknown       │  ← Categories initialized with defaults
                     └────────┬────────┘
                              │ User action
                              ▼
          ┌───────────────────────────────┐
          │          granted              │  ← Accept All / specific categories
          │         or denied             │  ← Reject All / all non-necessary denied
          └──────────┬─────────┬──────────┘
                     │         │
                     │         │ withdrawConsent()
                     │         ▼
                     │  ┌──────────────┐
                     │  │   unknown    │  ← Non-necessary reset to null
                     │  └──────────────┘
                     │
                     │ Time passes
                     ▼
              ┌──────────────┐
              │   expired    │  ← consentExpiryDays reached
              └──────┬───────┘
                     │ refreshConsent() / next init
                     ▼
              ┌──────────────┐
              │   unknown    │  ← Banner re-shown
              └──────────────┘
```

### Consent Persistence Format

Consent is persisted in two backends simultaneously:

**Cookie** (compact, server-readable):
```
hexguard_consent={"v":1,"cid":"hc-1-...","s":{"necessary":true,"analytics":true},"ts":1718712000000,"ex":1750248000000}
```

Uses `encodeURIComponent` for the value. Configurable path, domain, Secure, and SameSite attributes. `max-age` set to `consentExpiryDays * 86400`.

**localStorage** (full state):
```
Key: hexguard_consent
Value: same JSON format as cookie (redundant for recovery)
```

On initialization, the service reads the cookie first (for server-side compatibility), then falls back to localStorage if the cookie is missing or corrupt.

### Google Consent Mode v2 Integration

On configuration, the service pushes a `consent default` command:

```javascript
window.dataLayer.push(['consent', 'default', {
  ad_storage: 'denied',
  ad_user_data: 'denied',
  ad_personalization: 'denied',
  analytics_storage: 'denied',
  functionality_storage: 'denied',
  personalization_storage: 'denied',
  security_storage: 'granted',
  wait_for_update: '500',
  ads_data_redaction: 'true',
}]);
```

On every consent change, a `consent update` command is pushed with the current state mapped to Google Consent Types.

### Region Detection

The `browser-timezone` mode uses `Intl.DateTimeFormat().resolvedOptions().timeZone` and a mapping table of ~60 timezone-to-country mappings. The table covers EU/EEA, North America, South America, Asia, Oceania, and Africa.

For production deployments, use `'geo-api'` mode with a server-side geo-IP service:

```typescript
detectRegion({
  mode: 'geo-api',
  customDetector: () => myGeoIpService.getCountryCode(),
});
```

### Consent Audit Trail

Each consent action creates a `ConsentRecord`:

```typescript
{
  id: 'hc-42-...',
  timestamp: '2026-06-30T12:00:00.000Z',
  action: 'grant',
  previousState: { necessary: true, analytics: null, ... },
  newState: { necessary: true, analytics: true, ... },
  consentVersion: 1,
  method: 'banner_accept_all',
  userAgent: 'Mozilla/5.0 ...',
  region: 'DE',
  consentId: 'hc-42-...'
}
```

Records are stored in `localStorage` under key `hexguard_consent_audit` with a 500-entry rotation.

## Edge Cases

| Scenario                               | Behavior                                                   |
| -------------------------------------- | ---------------------------------------------------------- |
| Cookie deleted by user                 | On next init, cookie read returns null → falls back to localStorage → state restored |
| Both cookie and localStorage deleted   | Returns to `unknown` state with default category values     |
| Cookie exceeds 4KB                     | Falls back to localStorage-only; cookie write fails silently |
| Storage unavailable (private browsing) | In-memory signals only; no persistence; no errors thrown   |
| Region detection fails                 | Falls back to `defaultRegion` or `null`                    |
| Multiple rapid `acceptAll()` calls     | Each call is synchronous; state updates are atomic          |
| Config called multiple times           | Second `configure()` is ignored (idempotent guard)         |
| SSR (no `document`/`window`)           | No cookie/storage access; no dataLayer push; in-memory only |
| Consent expiry check on visibility     | `refreshConsent()` called on `visibilitychange` event      |

## Test Coverage

Tests use `TestBed` components and `ConsentManagerService` injection. Covered scenarios:

- Initial state: unknown, necessary=true, non-necessary=null
- acceptAll: all categories true, status=granted, consentId/consentedAt/expiresAt set
- rejectAll: non-necessary false, status=denied, isConsented=false
- setConsent: partial state, necessary always true, status based on state
- updateConsent: selective category update
- withdrawConsent: all non-necessary to null, status=unknown, consentId cleared
- isCategoryGranted / isPurposeGranted: correct signal values
- acceptCategory / rejectCategory: single category toggle
- Cookie + localStorage persistence and hydration
- CCPA categories: opt-out defaults
- Google Consent Mode: default/update pushes
- Script loader: load_always, block_until_consent, pending scripts
- Region detection: browser timezone, custom detector, unknown timezone

## Related Resources

- [Package README](../../angular/packages/angular-consent-manager/README.md)
- [Package Catalog](../README.md)
- [Source Code](../../angular/packages/angular-consent-manager/src/)
- [Cookie Consent UI Layer](../../angular/packages/angular-cookie-consent/README.md)

---

## Assessment: Potential Improvements

| Area | Suggestion | Priority |
| ---- | ---------- | -------- |
| Storage | Support `indexedDB` for audit trail as an alternative to localStorage | Future |
| Region | Add IP-based geo detection via a configurable HTTP service | Future |
| IAB TCF | Full Global Vendor List parsing and TC string encoding | Future |
| GCM | Add `url_passthrough` automatic detection | Future |

---

## API Review Findings

Review date: 2026-06-30. Findings are observational.

### Observations

| Dimension                 | Finding | Severity |
| ------------------------- | ------- | -------- |
| Public API Design         | Clean surface: 1 provider function, 1 inject function, 3 main types. Provider+inject pattern consistent with angular-feature-flags. | praise |
| Public API Design         | ConsentManagerFacade design hides internal service implementation behind a narrow facade. | praise |
| Implementation Quality    | State machine implemented as WritableSignal with derived computed signals. | praise |
| Implementation Quality    | Dual cookie+localStorage persistence with fallback chain. | praise |
| Implementation Quality    | Google Consent Mode uses gtag dataLayer pattern with SSR guards. | praise |
| Test Coverage             | 56 tests covering state transitions, storage, GCM, script loader, region detection. | praise |
| Test Coverage             | TestBed.initTestEnvironment compatibility with Angular 22 needs resolution. | moderate |
| Documentation             | README with quickstart, features table, demo routes, public API, scope boundaries. | praise |
| Demo Integration          | Feature folder, demo page, registry entry, routes, snippet entry, catalog entry all present. | praise |
| Cross-package Consistency | Integrated into build:lib, test:lib, test:ci, verify:package, lint chains. | praise |
