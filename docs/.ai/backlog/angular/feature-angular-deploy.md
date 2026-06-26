---
id: feature-angular-deploy
type: feature
status: proposed
created: 2026-06-26
package: '@hexguard/angular-deploy'
---

# @hexguard/angular-deploy

## Summary

Deployment/build awareness — version, commit hash, build time, environment name as signals. `EnvironmentBannerComponent` for staging/dev overlays.

## Proposed Public API

```typescript
export function injectBuildInfo(): {
  readonly version: Signal<string>;
  readonly commitHash: Signal<string>;
  readonly buildTime: Signal<Date | null>;
  readonly environment: Signal<string>;           // "production", "staging", "development"
  readonly isProduction: Signal<boolean>;
  readonly isStaging: Signal<boolean>;
  readonly isDevelopment: Signal<boolean>;
};

@Component({ selector: 'hex-env-banner', standalone: true })
export class EnvironmentBannerComponent {
  // Shows "STAGING" / "DEV" overlay — hidden in production
}
```

## Implementation Plan

1. Scaffold `angular/packages/angular-deploy/`.
2. Implement `injectBuildInfo()` from build-time constants.
3. Implement banner component.
4. Add tests.
5. Register in workspace.
