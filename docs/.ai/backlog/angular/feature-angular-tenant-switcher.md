---
id: feature-angular-tenant-switcher
type: feature
status: proposed
created: 2026-06-27
package: '@hexguard/angular-tenant-switcher'
---

# @hexguard/angular-tenant-switcher

## Summary

Headless tenant switching state â€” tenant list, active tenant, last-used persistence, switch/redirect. Every multi-tenant B2B SaaS app needs a tenant switcher.


## Goals

- Provide reactive, signal-based headless state for Angular applications
- Dependency-free at runtime beyond Angular core and tslib
- SSR-safe with TransferState awareness where applicable


## Non-Goals

- No rendered UI components — headless state, signals, and services only
- No browser globals or window-dependent code without SSR guard
- No backend API calls (consumer provides data/endpoints)

## Proposed Public API

```typescript
export function injectTenantSwitcher(config: { endpoint: string }): {
  readonly tenants: Signal<Tenant[]>;
  readonly activeTenant: Signal<Tenant | null>;
  readonly isLoading/error: Signal<boolean>;
  switchTenant(tenantId: string): Promise<void>;
};

export interface Tenant { id: string; name: string; logo?: string; role: string; }
```

## Implementation Plan
1. Scaffold `angular/packages/angular-tenant-switcher/`.
2. Implement tenant list, switch, last-used persistence.
3. Add tests. Register in workspace.
