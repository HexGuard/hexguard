# @hexguard/angular-consent-manager

Headless consent management engine for Angular — state machine, storage, region detection, Google Consent Mode v2, audit trail, and consent-driven script loading for GDPR/ePrivacy/CCPA compliance.

**[Deep package notes](https://github.com/HexGuard/hexguard/blob/main/docs/packages/angular-consent-manager.md)** ·
**[Demo routes](#demo-routes)** ·
**[Installation](#installation)**

## Installation

```bash
pnpm add @hexguard/angular-consent-manager
```

## Quickstart

```typescript
import { provideConsentManager, defaultConsentCategories } from '@hexguard/angular-consent-manager';

// app.config.ts
export const appConfig: ApplicationConfig = {
  providers: [
    provideConsentManager({
      categories: defaultConsentCategories(),
      googleConsentMode: { enabled: true },
      consentExpiryDays: 365,
    }),
  ],
};
```

```typescript
import { injectConsentManager } from '@hexguard/angular-consent-manager';

@Component({ ... })
class BannerComponent {
  private readonly consent = injectConsentManager();

  readonly visible = computed(() =>
    this.consent.status() === 'unknown' || this.consent.isExpired()
  );

  onAcceptAll(): void { this.consent.acceptAll(); }
  onRejectAll(): void { this.consent.rejectAll(); }
}
```

## Features

| Feature                             | Status | Notes                                                    |
| ----------------------------------- | ------ | -------------------------------------------------------- |
| Consent state machine               | ✅     | `unknown` → `pending` → `granted`/`denied` → `expired`  |
| Configurable categories             | ✅     | GDPR default + CCPA opt-out variant                      |
| Cookie + localStorage storage       | ✅     | Dual-storage for server-readability + full state         |
| Google Consent Mode v2              | ✅     | `default` + `update` dataLayer pushes, configurable      |
| Region detection                    | ✅     | Browser timezone heuristic, overridable                  |
| Regional configuration overrides    | ✅     | Different rules per ISO country code                     |
| Consent audit trail                 | ✅     | Timestamped records, 500-entry rotation, exportable      |
| Consent-gated script loading        | ✅     | `block_until_consent` / `load_always` strategies         |
| IAB TCF v2.2 (optional)             | ✅     | Secondary entrypoint `@hexguard/angular-consent-manager/tcf` |
| Consent expiry                      | ✅     | Configurable duration, auto-re-prompt on expiry          |
| `withdrawConsent()`                 | ✅     | Reset non-necessary categories to undecided              |
| SSR safe                            | ✅     | Graceful degradation when `document` unavailable         |
| Zero runtime dependencies           | ✅     | Only `@angular/core` + `tslib`                           |

## Demo routes

| Route                                       | Description                                          |
| ------------------------------------------- | ---------------------------------------------------- |
| `/packages/angular-consent-manager`         | Package hub page with catalog overview               |
| `/packages/angular-consent-manager/demo`    | Consent state machine, actions, audit trail viewer   |

## Public API

| Export                          | Kind     | Description                                              |
| ------------------------------- | -------- | -------------------------------------------------------- |
| `provideConsentManager(config)` | Function | Root provider — call once in `appConfig.providers`       |
| `injectConsentManager()`        | Function | DI facade returning `ConsentManagerFacade`               |
| `ConsentManagerFacade`          | Type     | Signals + actions for consent state                      |
| `ConsentManagerConfig`          | Type     | Full configuration schema                                |
| `ConsentStatus`                 | Type     | `'unknown'` `'pending'` `'granted'` `'denied'` `'expired'` |
| `ConsentState`                  | Type     | `Record<string, boolean \| null>`                        |
| `ConsentCategory`               | Type     | Category definition with purposes                        |
| `ConsentPurpose`                | Type     | Granular purpose within a category                       |
| `ConsentVendor`                 | Type     | Third-party vendor definition                            |
| `GoogleConsentType`             | Type     | GCM type for a category                                  |
| `defaultConsentCategories()`    | Function | GDPR-aligned 4-category set                              |
| `defaultCcpCategories()`        | Function | CCPA-aligned opt-out set                                 |
| `RegionConfig`                  | Const    | Preset configs for GDPR, CCPA, UK, LGPD regions          |
| `GoogleConsentModeService`      | Service  | GCM v2 dataLayer integration                             |
| `injectConsentAudit()`          | Function | Returns `ConsentAuditHandle` for record access           |
| `ConsentScriptLoader`           | Class    | Consent-gated script loading manager                     |
| `detectRegion(config)`          | Function | Region detection utility                                 |

## What It Owns

- Consent state machine with full lifecycle
- Cookie and localStorage persistence with cross-tab sync
- Google Consent Mode v2 default/update signal propagation
- Region-aware rule application (GDPR opt-in, CCPA opt-out, etc.)
- Timestamped audit trail for GDPR Art. 7(1) compliance
- Consent-gated third-party script loading

## What It Does Not Own

- No UI components — use `@hexguard/angular-cookie-consent` for banner/preference center
- No cookie scanning or auto-detection (consumer provides cookie declarations)
- No server-side consent sync (consumer's responsibility)
- No age verification/child consent gate
- No full IAB TCF CMP registration (basic TC string generation only)
