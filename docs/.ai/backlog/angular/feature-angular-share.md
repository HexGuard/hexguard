---
id: feature-angular-share
type: feature
status: proposed
created: 2026-06-26
package: '@hexguard/angular-share'
---

# @hexguard/angular-share

## Summary

Web Share API wrapper for Angular — share text, URLs, and files using the native OS share dialog. Simple `share()` with support detection and result tracking.

**Competition check:** No Angular Web Share API wrapper exists.

## Proposed Public API

```typescript
export function injectShare(): {
  readonly isSupported: Signal<boolean>;
  share(data: ShareData): Promise<{ success: boolean; error?: string }>;
  readonly lastResult: Signal<ShareResult | null>;
};

export interface ShareResult { success: boolean; error?: string; timestamp: Date; }
```

## Implementation Plan

1. Scaffold `angular/packages/angular-share/`.
2. Wrap `navigator.share()` with support detection and result tracking.
3. Add tests.
4. Register in workspace.
