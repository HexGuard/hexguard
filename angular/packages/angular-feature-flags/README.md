# `@hexguard/angular-feature-flags`

**Typed feature-flag evaluation for Angular** with a pure evaluator, DI-backed facade,
structural directive, route guards, and optional backend sync service.

Part of the [HexGuard](https://github.com/HexGuard/hexguard) catalog.
Pairs with [`HexGuard.FeatureFlags`](https://github.com/HexGuard/hexguard/tree/main/dotnet/src/HexGuard.FeatureFlags) on the .NET side.

## Install

```shell
pnpm add @hexguard/angular-feature-flags
```

Peer dependencies: `@angular/core ^22.0.0`, `@angular/common ^22.0.0`, `@angular/router ^22.0.0`.

## Quick Start

```typescript
import { provideHexGuardFeatureFlags } from '@hexguard/angular-feature-flags';
import { injectFeatureFlags } from '@hexguard/angular-feature-flags';

// 1. Provide the flag catalog
const catalog = {
  flags: {
    'beta-search': {
      key: 'beta-search',
      enabled: true,
      variant: 'search-v2',
      rolloutPercentage: 100,
      targetingRules: [{ type: 'groupIn', groups: ['beta-testers'] }],
      metadata: null,
    },
  },
  contextHash: 'abc123',
};

bootstrapApplication(AppComponent, {
  providers: [provideHexGuardFeatureFlags(catalog)],
});

// 2. Use in a component
@Component({
  /* ... */
})
class MyComponent {
  private featureFlags = injectFeatureFlags();

  // One-shot check
  canSearch = this.featureFlags.isEnabled('beta-search', { userId: 'user-42' });

  // Reactive signal
  canSearch$ = this.featureFlags.isEnabledSignal('beta-search', signal({ userId: 'user-42' }));
}
```

## API Surface

### Pure Evaluator

```typescript
import { evaluateFeatureFlag } from '@hexguard/angular-feature-flags';

const result = evaluateFeatureFlag(flag, { userId: 'user-42' });
// { key: 'beta-search', enabled: true, variant: 'search-v2', matchedRule: 'groupIn', ... }
```

### Directive

```html
<ng-container *hexguardFeatureFlag="'beta-search'; context: evalCtx">
  Beta search content
</ng-container>

<ng-container *hexguardFeatureFlag="'beta-search'; context: evalCtx; else upgrade">
  Premium content
</ng-container>
<ng-template #upgrade>Upgrade to access</ng-template>
```

### Route Guards

```typescript
import { canActivateFeatureFlag, canMatchFeatureFlag } from '@hexguard/angular-feature-flags';

const routes = [
  {
    path: 'beta',
    component: BetaComponent,
    canActivate: [
      canActivateFeatureFlag({
        flagKey: 'beta-search',
        context: { userId: 'user-42' },
        redirectTo: '/upgrade',
      }),
    ],
  },
];
```

### Sync Service

```typescript
import { FeatureFlagSyncService, FEATURE_FLAG_SYNC_OPTIONS } from '@hexguard/angular-feature-flags';

providers: [
  {
    provide: FEATURE_FLAG_SYNC_OPTIONS,
    useValue: {
      baseUrl: 'https://api.example.com',
      // Optional: custom endpoint path (default: '/api/feature-flags/sync')
      syncEndpointPath: '/api/v2/feature-flags/sync',
      // Optional: custom fetch headers (e.g. auth tokens)
      fetchInit: {
        headers: { Authorization: 'Bearer ' + token },
      },
    },
  },
  FeatureFlagSyncService,
],
```

The `syncEndpointPath` option lets you customize the API route when your
backend exposes the sync endpoint at a non-default path under `baseUrl`.

The `fetchInit` option lets you pass additional `RequestInit` properties
(headers, signal, credentials, etc.) that are merged into every sync HTTP
request — useful for authentication tokens or AbortSignal integration.

## Targeting Rules

| Rule                | Description                                                   |
| ------------------- | ------------------------------------------------------------- |
| `always`            | Enabled for all users                                         |
| `never`             | Disabled for all users                                        |
| `rollout`           | Enabled for a percentage of users (deterministic FNV-1a hash) |
| `userIn`            | Enabled for specific user IDs                                 |
| `userNotIn`         | Disabled for specific user IDs                                |
| `groupIn`           | Enabled for users in specific groups                          |
| `groupNotIn`        | Disabled for users in specific groups                         |
| `attributeMatch`    | Enabled when a context attribute matches                      |
| `attributeNotMatch` | Disabled when a context attribute matches                     |

Rules are evaluated **first-match-wins** in the order they appear.

## Resources

- [Deep package notes](https://github.com/HexGuard/hexguard/blob/main/docs/packages/angular-feature-flags.md)
- [Demo app](https://github.com/HexGuard/hexguard/blob/main/docs/demo/README.md)
- [HexGuard.FeatureFlags (.NET counterpart)](https://github.com/HexGuard/hexguard/tree/main/dotnet/src/HexGuard.FeatureFlags)
