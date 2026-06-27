---
id: feature-angular-customer-portal
type: feature
status: proposed
created: 2026-06-27
package: '@hexguard/angular-customer-portal'
---

# @hexguard/angular-customer-portal

## Summary

Customer-facing portal shell state — self-service dashboard, account management, support, KB. External-facing, distinct from `angular-admin` (internal) and `angular-portal` (teleport/DOM).

## Proposed Public API

```typescript
export function injectCustomerPortal(config: { sections: PortalSection[] }): {
  readonly activeSection: Signal<string | null>;
  readonly navigation: Signal<PortalSection[]>;
  readonly unreadNotifications: Signal<number>;
  readonly isMobileMenuOpen: Signal<boolean>;
  navigateTo(sectionId: string): void;
  toggleMobileMenu(): void;
};

export interface PortalSection { id: string; label: string; icon?: string; route: string; badge?: Signal<number>; }
```

## Implementation Plan
1. Scaffold `angular/packages/angular-customer-portal/`.
2. Implement navigation, notifications, mobile menu with signals.
3. Add tests. Register in workspace.
