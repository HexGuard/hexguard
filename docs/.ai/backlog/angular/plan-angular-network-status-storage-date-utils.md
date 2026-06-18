---
id: plan-three-angular-packages
type: feature
status: planned
created: 2026-06-18
packages:
  - '@hexguard/angular-network-status'
  - '@hexguard/angular-storage'
  - '@hexguard/angular-date-utils'
---

# Implementation Plan: Three Angular Packages

This plan covers end-to-end implementation of three independent Angular packages following the [new-package-workflow](../../../.github/instructions/new-package-workflow.instructions.md).

**Execution order**: `angular-date-utils` → `angular-network-status` → `angular-storage` (simplest to most complex). They can also run in parallel since none depend on each other.

---

## Phase 0: Scaffold (Each Package)

For each package, repeat these steps:

### 0.A — angular.json Registration

Add a project entry under `"projects"` with `projectType: "library"`, `@angular/build:ng-packagr` build, `@angular/build:unit-test` test, `prefix: "hexguard"`. Place alphabetically.

| Package | Angular project name | Alpha position |
|---------|---------------------|----------------|
| date-utils | `angular-date-utils` | Between `angular-debounce` and `angular-error-boundary` |
| network-status | `angular-network-status` | Between `angular-notifications` and `angular-optimistic-state` |
| storage | `angular-storage` | Between `angular-selection-state` and `angular-url-state` |

### 0.B — Package Files

Create each under `angular/packages/angular-{name}/`:

- **`package.json`**: name `@hexguard/angular-{name}`, version `0.1.0`, peerDeps `@angular/core` ^22.0.0 (+ `@angular/common` if needed), publishConfig public, sideEffects false.
- **`ng-package.json`**: entryFile `src/public-api.ts`, assets `["LICENSE"]`.
- **`tsconfig.lib.json`**: extends `../../tsconfig.json`, outDir `../../out-tsc/lib`, declaration true.
- **`tsconfig.lib.prod.json`**: extends `./tsconfig.lib.json`, compilationMode partial.
- **`tsconfig.spec.json`**: extends `../../tsconfig.json`, types `["vitest/globals"]`.
- **`CHANGELOG.md`**: initial `## 0.1.0` with `- Initial release.` bullets.
- **`LICENSE`**: copy from `angular-debounce/LICENSE`.
- **`README.md`**: install, quickstart, features table, demo routes, scope boundaries.
- **`src/public-api.ts`**: barrel export.
- **`src/lib/`**: implementation files.

### 0.C — tsconfig.json Path Mapping

Add to `angular/tsconfig.json`:
```json
"@hexguard/angular-{name}": ["./packages/angular-{name}/src/public-api.ts"],
```

---

## Phase 1: Implementation

### 1.A — `@hexguard/angular-date-utils` (pure functions)

**Files to create**:

| File | Content |
|------|---------|
| `src/lib/date-range.ts` | `DateRange` class — immutable model with start/end, isValid, durationDays, contains(), overlaps(), preset factories (last7Days, last30Days, thisMonth, lastMonth, next30Days, custom) |
| `src/lib/relative-time.ts` | Pure functions: `relativeTime(date, locale?)`, `shortRelativeTime(date, locale?)`, `exactRelativeTime(date, locale?)` using `Intl.RelativeTimeFormat` |
| `src/lib/compact-format.ts` | Pure functions: `compactDate(date, locale?)` (shows year only when diff year), `compactDateTime(date, locale?)` |
| `src/lib/business-days.ts` | Pure functions: `isWeekend(date)`, `addBusinessDays(date, days)`, `businessDaysBetween(start, end)` |
| `src/lib/duration.ts` | Pure functions: `durationBetween(start, end)` returns `Duration`, `formatDuration(duration)`, `ageInYears(birthDate)` |
| `src/lib/date-utils.ts` | `injectDateUtils()` — wires `LOCALE_ID`, returns object with all functions |
| `src/lib/types.ts` | `Duration` interface: `{ days, hours, minutes, seconds? }` |

**Key design decisions**:
- All formatting functions are pure (input → output) for tree-shaking and testability.
- `injectDateUtils()` is a thin DI wrapper that captures `LOCALE_ID` and delegates to pure functions.
- `DateRange` is a plain TypeScript class (not a service) — no DI needed, can be used anywhere.
- No Angular-specific APIs in the pure functions — they're framework-agnostic.
- Locale defaults to browser default when `LOCALE_ID` is `'en-US'`.

### 1.B — `@hexguard/angular-network-status` (browser API wrapper)

**Files to create**:

| File | Content |
|------|---------|
| `src/lib/network-status.ts` | `injectNetworkStatus(options?)` — factory function using `DestroyRef` for cleanup |
| `src/lib/types.ts` | `NetworkStatusOptions` (onlineDebounceMs, backOnlineSignalDurationMs), `NetworkStatus` return type, `EffectiveConnectionType` type |

**Implementation details**:
```typescript
function injectNetworkStatus(options?: NetworkStatusOptions): NetworkStatus {
  const opts = { onlineDebounceMs: 1000, backOnlineSignalDurationMs: 3000, ...options };
  const destroyRef = inject(DestroyRef);

  const online = signal(navigator.onLine);
  const connectionType = signal<EffectiveConnectionType>('unknown');
  const recentlyBackOnline = signal(false);
  let onlineTimer: ReturnType<typeof setTimeout> | null = null;
  let backOnlineTimer: ReturnType<typeof setTimeout> | null = null;
  let pendingResolve: (() => void) | null = null;

  // Online/offline listeners
  const onOnline = () => {
    // Debounce: only transition after quiet period
    if (onlineTimer) clearTimeout(onlineTimer);
    onlineTimer = setTimeout(() => {
      online.set(true);
      recentlyBackOnline.set(true);
      backOnlineTimer = setTimeout(() => recentlyBackOnline.set(false), opts.backOnlineSignalDurationMs);
      pendingResolve?.();
      pendingResolve = null;
    }, opts.onlineDebounceMs);
  };
  const onOffline = () => {
    if (onlineTimer) clearTimeout(onlineTimer);
    online.set(false);
    recentlyBackOnline.set(false);
  };

  window.addEventListener('online', onOnline);
  window.addEventListener('offline', onOffline);

  // Connection type (Chromium)
  const conn = (navigator as any).connection;
  if (conn) {
    const updateType = () => connectionType.set(conn.effectiveType ?? 'unknown');
    updateType();
    conn.addEventListener('change', updateType);
    destroyRef.onDestroy(() => conn.removeEventListener('change', updateType));
  }

  destroyRef.onDestroy(() => {
    window.removeEventListener('online', onOnline);
    window.removeEventListener('offline', onOffline);
    if (onlineTimer) clearTimeout(onlineTimer);
    if (backOnlineTimer) clearTimeout(backOnlineTimer);
  });

  return {
    online: online.asReadonly(),
    connectionType: connectionType.asReadonly(),
    recentlyBackOnline: recentlyBackOnline.asReadonly(),
    whenBackOnline: () => online() ? Promise.resolve() : new Promise(r => { pendingResolve = r; }),
  };
}
```

**Key design decisions**:
- Function-based (not class-based) — follows `injectSelectionState()` pattern.
- Uses `DestroyRef` for cleanup (Angular 16+).
- `whenBackOnline()` returns a promise that resolves on the next online transition.
- Debounce prevents flapping when connectivity rapidly toggles.

### 1.C — `@hexguard/angular-storage` (signal-backed storage)

**Files to create**:

| File | Content |
|------|---------|
| `src/lib/storage.ts` | `injectStorage<T>(key, options)` — factory using `DestroyRef` for cleanup |
| `src/lib/types.ts` | `StorageOptions<T>`, `TypedStorage<T>`, `StorageMeta` type |

**Implementation details**:
```typescript
function injectStorage<T>(key: string, options: StorageOptions<T>): TypedStorage<T> {
  const {
    defaultValue,
    version = 1,
    ttlMs,
    storage: storageType = 'local',
  } = options;

  const destroyRef = inject(DestroyRef);
  const storageApi = storageType === 'local' ? localStorage : sessionStorage;

  // Try to read initial value
  let initialValue: T = defaultValue;
  let initialMeta: StorageMeta = 'missing';
  try {
    const raw = storageApi.getItem(key);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed._v !== undefined && parsed._v !== version) {
        initialMeta = 'versionMismatch';
      } else if (ttlMs && parsed._ts && Date.now() - parsed._ts > ttlMs) {
        initialMeta = 'expired';
      } else {
        initialValue = parsed._value ?? defaultValue;
        initialMeta = 'stored';
      }
    }
  } catch { /* ignore — use default */ }

  const value = signal<T>(initialValue);
  const meta = signal<StorageMeta>(initialMeta);

  // Helper to persist
  function persist(newValue: T) {
    const envelope: Record<string, unknown> = { _value: newValue, _v: version };
    if (ttlMs) envelope._ts = Date.now();
    try {
      storageApi.setItem(key, JSON.stringify(envelope));
      value.set(newValue);
      meta.set('stored');
    } catch { /* storage full or unavailable */
      value.set(newValue);
      meta.set('missing');
    }
  }

  // Cross-tab sync
  const onStorage = (e: StorageEvent) => {
    if (e.key !== key || e.storageArea !== storageApi) return;
    if (e.newValue === null) {
      value.set(defaultValue);
      meta.set('missing');
    } else {
      try {
        const parsed = JSON.parse(e.newValue);
        value.set(parsed._value ?? defaultValue);
        meta.set('stored');
      } catch { /* ignore */ }
    }
  };
  window.addEventListener('storage', onStorage);
  destroyRef.onDestroy(() => window.removeEventListener('storage', onStorage));

  return {
    value: value.asReadonly(),
    meta: meta.asReadonly(),
    set: persist,
    patch: (partial) => persist({ ...value(), ...partial }),
    clear: () => {
      try { storageApi.removeItem(key); } catch { /* ignore */ }
      value.set(defaultValue);
      meta.set('missing');
    },
  };
}
```

**Key design decisions**:
- Function-based (not class-based).
- Uses JSON envelope with `_value`, `_v` (version), `_ts` (timestamp) metadata.
- Cross-tab sync via `window.addEventListener('storage', ...)`.
- Graceful fallback when localStorage is unavailable.
- `patch()` performs shallow merge for object types.

---

## Phase 2: Tests

### Unit Tests

| Package | Test scenarios | Est. count |
|---------|---------------|------------|
| `angular-date-utils` | relativeTime edge cases (past/future/now/same-day), short/exact variants, compactDate year-aware, compactDateTime, isWeekend, addBusinessDays (weekend skip, no-op), businessDaysBetween, durationBetween, formatDuration, ageInYears, DateRange validation/containment/overlap/presets, injectDateUtils locale wiring, invalid date handling | ~35 |
| `angular-network-status` | online→offline→online transitions, debounce window, flapping prevention, connectionType changes, recentlyBackOnline timing, whenBackOnline resolve, cleanup on destroy, browser API unavailability | ~15 |
| `angular-storage` | set/get/clear round-trip, JSON envelope parsing, TTL expiry, version mismatch, cross-tab storage event handling, localStorage unavailable fallback, patch shallow merge, concurrent mutations, cleanup on destroy, malformed JSON recovery | ~18 |

Run: `pnpm test:lib:{name}`

---

## Phase 3: Build Scripts

### Update `angular/package.json`

For each package, add:

```json
"build:lib:{name}": "ng build angular-{name}",
"test:lib:{name}": "ng test angular-{name}",
"verify:package:{name}": "node -e \"require('node:fs').mkdirSync('.artifacts', { recursive: true });\" && pnpm --dir dist/angular-{name} pack --pack-destination ../../.artifacts"
```

Then integrate into chains:
- `build:lib` — append `&& ng build angular-{name}`
- `test:lib` — append `&& pnpm test:lib:{name}`
- `test:ci` — append `&& ng test angular-{name} --watch=false`
- `verify:package` — append `&& pnpm verify:package:{name}`
- `lint` — append the package source glob

### Add root proxy scripts in `package.json`

```json
"build:lib:{name}": "pnpm angular:build:lib:{name}",
"test:lib:{name}": "pnpm angular:test:lib:{name}",
"verify:package:{name}": "pnpm angular:verify:package:{name}"
```

---

## Phase 4: Demo App Integration

### Selection-State Demo Pattern (for network-status & storage)

Since `angular-network-status` and `angular-storage` are single-demo packages (like `angular-selection-state`, `angular-debounce`), follow this pattern:

1. **Feature folder**: `angular/apps/demo-angular/src/app/features/angular-{name}/`
   - `angular-{name}-home-page.component.ts` — use `PackageHubPageComponent`
   - `pages/{name}-demo-page/` — use `DemoPageLayoutComponent`, `DemoStatusStripComponent`, `DemoInspectorPanelComponent`
   - `data/` — mock data as needed
   - External `.html` and `.css` files alongside the component (needed by snippet generation)

2. **Demo registry entries** in `demo-registry.ts`:
   - `ANGULAR_{NAME}_CATALOG = getGeneratedCurrentPackage('angular-{name}')`
   - `ANGULAR_{NAME}_DEMO: DemoPageEntry`
   - `ANGULAR_{NAME}_PACKAGE: DemoPackageEntry`
   - Add to `DEMO_PACKAGES` array

3. **Routes** in `app.routes.ts`:
   - `/packages/angular-{name}` → home page
   - `/packages/angular-{name}/demo` → demo page

4. **Snippet entry** in `scripts/generate-demo-snippets.mjs`

### Date-Utils Demo (pure functions, inspector-focused)

The date-utils package is pure functions — the demo should showcase all functions in a single-page reference format:

- **Relative time ticker**: Live counter showing relativeTime, shortRelativeTime, exactRelativeTime for a fixed past date, updating every second
- **Date range calculator**: Select start/end dates, see isValid, durationDays, contains, overlap
- **Business day calculator**: Input a date and number of days, see addBusinessDays result
- **Duration formatter**: Input start/end, see formatted duration
- All sections feed an inspector panel with live state JSON

### Network-Status Demo

- Online/offline indicator with color-coded badge
- Current connection type display
- "Recently back online" flash indicator
- Toggle button to simulate offline (calls the mock/simulated toggle)
- Inspector panel showing live state

### Storage Demo

- Preference editor (theme selection, sidebar toggle) persisted to localStorage
- Reload persistence indicator
- Version mismatch demo button
- Expiry demo (short 10-second TTL)
- Inspector panel showing raw JSON envelope

---

## Phase 5: Package Catalog Registration

1. **Update `scripts/package-catalog.data.mjs`**:
   - Add all 3 packages to `currentPackages` with status `"Available"`
   - Include all fields: id, packageName, status, scope, readmePath, deepDivePath, repositoryPath, summary, detail, installCommand, featureHighlights, bestFitScenarios, statusNoteParagraphs

2. **Run `pnpm catalog:sync`**

---

## Phase 6: Release Artifacts

1. **Create release workflows**:
   - `.github/workflows/release-angular-date-utils.yml`
   - `.github/workflows/release-angular-network-status.yml`
   - `.github/workflows/release-angular-storage.yml`
   - Each modeled after `release-angular-debounce.yml`, tag pattern `angular-{name}-v*`

2. **Verify each package**:
   - `pnpm verify:package:{name}` confirms tarball contains README, LICENSE, ESM, types

---

## Phase 7: Assessment Gate

For each package, run:
```bash
pnpm format:check && pnpm lint && pnpm test:ci && pnpm test:e2e && pnpm build && pnpm verify:package
```

Save audit reports to `docs/.ai/audits/angular-{name}-readiness-{YYYY-MM-DD}.md`.

---

## Summary Table

| Package | Type | Dependencies | Complexity | Est. tests | Release order |
|---------|------|-------------|------------|------------|---------------|
| `angular-date-utils` | Pure functions + DI wrapper | `@angular/core` | Low | ~35 | 1st |
| `angular-network-status` | Browser API + DestroyRef | `@angular/core` | Medium | ~15 | 2nd |
| `angular-storage` | localStorage + cross-tab + TTL | `@angular/core` | High | ~18 | 3rd |

All three are Angular-only (no .NET counterpart). Total estimated work: ~68 unit tests, 3 demo pages, 3 release workflows.
