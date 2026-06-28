---
id: feature-angular-portal
type: feature
status: proposed
created: 2026-06-26
package: '@hexguard/angular-portal'
---

# @hexguard/angular-portal

## Summary

Headless portal/teleport state for Angular â€” programmatically move DOM content to another location in the DOM tree (e.g., modals, tooltips, popovers to `<body>`). Angular CDK Portal is powerful but complex; this is a simpler signal-based wrapper.

**Competition check:** Angular CDK Portal covers this but with overhead. No simple signal-based alternative exists.


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
export function injectPortal(): {
  readonly isAttached: Signal<boolean>;
  attach(): void;
  detach(): void;
  toggle(): void;
};

@Component({
  selector: '[hexPortalOutlet]',
  standalone: true,
  template: '<ng-container #portalContainer></ng-container>',
})
class PortalOutletComponent {
  readonly content = viewChild.required('portalContainer', { read: ViewContainerRef });
}
// Usage: <div hexPortalOutlet></div>
// The portal's content is moved here when attach() is called.
```

## Implementation Plan

1. Scaffold `angular/packages/angular-portal/`.
2. Implement `injectPortal()` using `ViewContainerRef` + `createEmbeddedView`.
3. Implement `PortalOutletComponent`.
4. Add tests.
5. Register in workspace.
