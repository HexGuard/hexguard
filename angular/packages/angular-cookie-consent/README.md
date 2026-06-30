# @hexguard/angular-cookie-consent

Cookie consent UI layer for Angular — banner, preference center, floating button, cookie declaration table, structural directive, and pipe. Depends on `@hexguard/angular-consent-manager`.

**[Deep package notes](https://github.com/HexGuard/hexguard/blob/main/docs/packages/angular-cookie-consent.md)** ·
**[Demo routes](#demo-routes)** ·
**[Installation](#installation)**

## Installation

```bash
pnpm add @hexguard/angular-cookie-consent
```

Requires `@hexguard/angular-consent-manager` to be configured in your app config.

## Quickstart

```typescript
import { CookieConsentBannerComponent, ConsentPreferenceCenterComponent } from '@hexguard/angular-cookie-consent';

@Component({
  imports: [CookieConsentBannerComponent, ConsentPreferenceCenterComponent],
  template: `
    <hex-cookie-consent-banner
      position="bottom"
      (customize)="showPrefs.set(true)"
    />
    @if (showPrefs()) {
      <hex-consent-preference-center
        mode="modal"
        [(open)]="showPrefs"
      />
    }
  `,
})
class AppComponent {
  readonly showPrefs = signal(false);
}
```

### Template directive usage

```html
<!-- Only render when analytics is consented -->
<div *hexConsent="'analytics'">
  <img src="analytics-pixel.png" />
</div>

<!-- With fallback template -->
<ng-template #denied>
  <p>Analytics is disabled.</p>
</ng-template>
<div *hexConsent="'analytics'; else denied">
  Analytics content
</div>
```

### Pipe usage

```html
@if (('analytics' | hexConsent)) {
  <script src="analytics.js"></script>
}
```

## Features

| Component / Feature               | Status | Notes                                                    |
| --------------------------------- | ------ | -------------------------------------------------------- |
| `<hex-cookie-consent-banner>`     | ✅     | Positions: bottom, top, center. Content slots for title/message/actions |
| `<hex-consent-preference-center>` | ✅     | Modes: modal, drawer, inline. Category toggles + purpose details |
| `<hex-consent-floating-btn>`      | ✅     | Positions: bottom-left, bottom-right. Opens preference center |
| `<hex-cookie-declaration>`        | ✅     | Filterable table: Name, Domain, Party, Purpose, Category, Duration, Type |
| `*hexConsent` directive           | ✅     | Structural directive with else-template support           |
| `hexConsent` pipe                 | ✅     | `pure: false` pipe for template-level consent checks      |
| CSS custom property theming       | ✅     | 10+ variables for full visual customization               |
| Legal parity (Accept/Reject)      | ✅     | Accept All and Reject All have equal visual weight        |

## Demo routes

| Route                                       | Description                                          |
| ------------------------------------------- | ---------------------------------------------------- |
| `/packages/angular-cookie-consent`          | Package hub page with catalog overview               |
| `/packages/angular-cookie-consent/demo`     | Live banner, preference center, cookie declaration   |

## Public API

| Export                              | Kind       | Description                                  |
| ----------------------------------- | ---------- | -------------------------------------------- |
| `CookieConsentBannerComponent`      | Component  | First-layer cookie notice banner             |
| `ConsentPreferenceCenterComponent`  | Component  | Detailed preference panel                    |
| `ConsentFloatingButtonComponent`    | Component  | Persistent "Cookie Settings" button          |
| `CookieDeclarationComponent`        | Component  | Auto-generated cookie listing table          |
| `CookieDeclarationEntry`            | Type       | Cookie entry shape for declaration           |
| `ConsentDirective`                  | Directive  | `*hexConsent` structural directive           |
| `ConsentPipe`                       | Pipe       | `hexConsent` template pipe                   |

## CSS Custom Properties

| Property                              | Default    | Description                    |
| ------------------------------------- | ---------- | ------------------------------ |
| `--hex-consent-z-index`               | `9999`     | Banner/overlay z-index         |
| `--hex-consent-banner-bg`             | `#ffffff`  | Banner background              |
| `--hex-consent-banner-text`           | `#1a1a1a`  | Banner text color              |
| `--hex-consent-banner-border`         | `#e0e0e0`  | Banner border color            |
| `--hex-consent-btn-primary-bg`        | `#0066cc`  | Accept All button background   |
| `--hex-consent-btn-primary-text`      | `#ffffff`  | Accept All button text         |
| `--hex-consent-btn-secondary-bg`      | `#f0f0f0`  | Reject All button background   |
| `--hex-consent-btn-secondary-text`    | `#333333`  | Reject All button text         |
| `--hex-consent-toggle-active`         | `#0066cc`  | Toggle switch active color     |
| `--hex-consent-toggle-inactive`       | `#cccccc`  | Toggle switch inactive color   |
| `--hex-consent-overlay-bg`            | `rgba(0,0,0,0.5)` | Modal overlay background |
| `--hex-consent-floating-btn-bg`       | `#f8f8f8`  | Floating button background     |
| `--hex-consent-floating-btn-text`     | `#333333`  | Floating button text           |

## What It Owns

- Cookie consent UI components with content projection slots
- Template-level consent gating via directive and pipe
- Full visual customization via CSS custom properties
- Legal compliance: equal visual weight for Accept All and Reject All

## What It Does Not Own

- No consent logic — delegates entirely to `@hexguard/angular-consent-manager`
- No server-side rendering of banner state (banner renders client-side after hydration)
