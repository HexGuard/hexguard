# `@hexguard/angular-cookie-consent` Deep Dive

This page complements the npm-facing README with repo-specific implementation notes and behavior details.

## Purpose

`@hexguard/angular-cookie-consent` provides the UI layer for cookie consent in Angular applications. It builds on `@hexguard/angular-consent-manager` to render a cookie consent banner, a detailed preference center, a floating settings button, and a cookie declaration table. All consent logic is delegated to the consent-manager engine — this package is purely presentational with content projection slots for customization.

## Feature Matrix

| Capability                        | Status    | Notes                                                      |
| --------------------------------- | --------- | ---------------------------------------------------------- |
| Cookie consent banner             | Available | Positions: bottom, top, center. Content slots for title, message, actions |
| Preference center                 | Available | Modes: modal, drawer, inline. Category toggles with purpose details |
| Floating settings button          | Available | Positions: bottom-left, bottom-right. Opens preference center |
| Cookie declaration table          | Available | Filterable columns: Name, Domain, Party, Purpose, Category, Duration, Type |
| `*hexConsent` directive           | Available | Structural directive with else-template support              |
| `hexConsent` pipe                 | Available | `pure: false` pipe for template-level consent checks         |
| CSS custom property theming       | Available | 10+ variables for full visual customization                  |
| Accept/Reject visual parity       | Available | Buttons styled with equal font, color, padding, and weight   |
| Content projection slots          | Available | `slot=title`, `slot=message`, `slot=actions`, `slot=header`, `slot=footer` |
| SSR-safe rendering                | Available | Components render only in browser context                    |

## Public API Map

| Export                              | Kind       | Role                                                    |
| ----------------------------------- | ---------- | ------------------------------------------------------- |
| `CookieConsentBannerComponent`      | Component  | First-layer cookie notice                                |
| `ConsentPreferenceCenterComponent`  | Component  | Granular preference panel                                |
| `ConsentFloatingButtonComponent`    | Component  | Persistent access button                                 |
| `CookieDeclarationComponent`        | Component  | Auto-generated cookie listing table                      |
| `CookieDeclarationEntry`            | Type       | `{ name, domain, party, purpose, category, duration, type, ... }` |
| `ConsentDirective`                  | Directive  | `*hexConsent="'analytics'"` structural directive        |
| `ConsentPipe`                       | Pipe       | `('analytics' \| hexConsent)` template pipe             |

## Behavior Details

### Banner Visibility

The `<hex-cookie-consent-banner>` component uses the consent manager's `status()` signal to determine visibility:

- **Visible** when `status() === 'unknown'` (first visit) or `isExpired() === true`
- **Hidden** when `status() === 'granted'` or `status() === 'denied'`

After a consent decision, the banner hides automatically. The floating button provides persistent access.

### Preference Center Modes

The preference center supports three display modes:

| Mode     | Description                                           | Use case                              |
| -------- | ----------------------------------------------------- | ------------------------------------- |
| `modal`  | Centered overlay with backdrop, blocks page interaction | First-time customization              |
| `drawer` | Slides in from the right side                         | Returning user preference changes     |
| `inline` | Renders in-flow within the page layout                | Integrated settings page              |

The `open` property uses Angular's `model()` for two-way binding: `[(open)]="showPreferences"`.

### Content Projection

All components support content projection for custom labels and layouts:

```html
<hex-cookie-consent-banner position="bottom">
  <p slot="title">We respect your privacy</p>
  <p slot="message">Choose which cookies to allow.</p>
  <div slot="actions">
    <button class="my-btn" (click)="acceptAll()">Allow All</button>
    <button class="my-btn" (click)="rejectAll()">Only Essential</button>
  </div>
</hex-cookie-consent-banner>
```

### Directive Lifecycle

The `*hexConsent` structural directive uses Angular's `effect()` to react to consent state changes. When the consent state changes:

1. The directive reads the new category state from the consent manager
2. If the category is granted, it creates/keeps the embedded view
3. If the category is denied, it clears the view and shows the else-template (if provided)

## Edge Cases

| Scenario                             | Behavior                                                   |
| ------------------------------------ | ---------------------------------------------------------- |
| Banner open + consent already given  | Banner does not render (visible signal is false)           |
| Preference center toggles rapidly    | Each toggle is synchronous; no race conditions              |
| Customize button without PC handler  | `customize` event emitted; no default action                |
| Directive with unknown category      | `isCategoryGranted()` returns false; else template shown    |
| Cookie declaration with empty array  | "No cookies match the selected filter" message displayed     |
| Floating button before decision      | Button always visible; clicking opens preference center     |
| Preference center inline + no open   | Inline mode ignores `open` — always renders                 |

## Styling

All components use CSS custom properties for theming. Import the defaults:

```css
@import '@hexguard/angular-cookie-consent/src/lib/styles/_default.css';
```

Or in `angular.json`:

```json
"styles": ["node_modules/@hexguard/angular-cookie-consent/src/lib/styles/_default.css"]
```

## Test Coverage

Covered scenarios:

- Banner visibility based on consent status
- Accept All / Reject All button handlers
- Customize button emits event
- Preference center toggles reflect category state
- Necessary category toggle is disabled
- Cookie declaration renders entries and supports filtering
- Directive conditionally renders based on category
- Pipe returns correct value for granted/denied categories

## Related Resources

- [Package README](../../angular/packages/angular-cookie-consent/README.md)
- [Package Catalog](../README.md)
- [Source Code](../../angular/packages/angular-cookie-consent/src/)
- [Consent Manager Engine](../../angular/packages/angular-consent-manager/README.md)

---

## Assessment: Potential Improvements

| Area | Suggestion | Priority |
| ---- | ---------- | -------- |
| Components | Add animation support (enter/leave transitions) | Future |
| Components | Add bottom-sheet mode for mobile | Future |
| Testing | Add Playwright E2E tests for banner interaction | Future |
| Directive | Add support for multiple categories (OR/AND logic) | Future |

---

## API Review Findings

Review date: 2026-06-30. Findings are observational.

### Observations

| Dimension                 | Finding | Severity |
| ------------------------- | ------- | -------- |
| Public API Design         | Clean component surface with content projection for customization. | praise |
| Public API Design         | Two-way binding via `model()` for preference center `open` state. | praise |
| Implementation Quality    | Components use `OnPush` change detection with computed signals. | praise |
| Implementation Quality    | Directive uses `effect()` for reactive consent state observation. | praise |
| Documentation             | README with installation, quickstart, features table, API reference, CSS variables. | praise |
| Demo Integration          | Feature folder, demo page, registry entry, routes, snippet entry, catalog entry all present. | praise |
| Cross-package Consistency | Builds as dependency of consent-manager. Integrated into build chains. | praise |
