---
id: feature-angular-deploy
type: feature
status: proposed
created: 2026-06-26
package: '@hexguard/angular-deploy'
---

# @hexguard/angular-deploy

## Summary

Deployment/build awareness — version, commit hash, build time, environment name as signals. Headless state only — consumers render their own environment indicators.

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

// Usage — consumer renders their own banner:
// @if (buildInfo.isStaging()) {
//   <div class="env-banner staging">STAGING</div>
// }
```
}
```

## Implementation Plan

1. Scaffold `angular/packages/angular-deploy/`.
2. Implement `injectBuildInfo()` from build-time constants.
3. Implement banner component.
4. Add tests.
5. Register in workspace.
