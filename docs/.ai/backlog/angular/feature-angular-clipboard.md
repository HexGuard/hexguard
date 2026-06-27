---
id: feature-angular-clipboard
type: feature
status: proposed
created: 2026-06-27
package: '@hexguard/angular-clipboard'
---

# @hexguard/angular-clipboard

## Summary

Headless clipboard interaction state — copy, paste, read, and clipboard change monitoring. For copy-to-clipboard buttons, paste-from-clipboard handlers, and clipboard-aware features.

## Goals

- Copy text to clipboard with success/error signals
- Read text from clipboard (with permission handling)
- Monitor clipboard changes (paste events, external changes)
- Clipboard history tracking (in-memory, configurable size)
- Permission state signal (granted/denied/prompt)
- Fallback for older browsers (execCommand)

## Non-Goals

- No clipboard UI components
- No rich content (HTML, images) — text-only for now
- No server-side clipboard sync

## Proposed Public API

```typescript
export function injectClipboard(config?: {
  historySize?: number;
}): {
  readonly lastCopied: Signal<string | null>;
  readonly lastPasted: Signal<string | null>;
  readonly history: Signal<string[]>;
  readonly permissionState: Signal<'granted' | 'denied' | 'prompt' | 'unsupported'>;
  readonly isCopying: Signal<boolean>;
  readonly copyError: Signal<string | null>;
  copy(text: string): Promise<boolean>;
  paste(): Promise<string | null>;
  clearHistory(): void;
};

export function provideClipboard(config?: { historySize?: number }): {
  token: InjectionToken<ClipboardService>;
  providers: Provider[];
};
```

## Implementation Plan

1. Scaffold `angular/packages/angular-clipboard/`.
2. Implement copy, paste, permission, history with signals.
3. Add fallback for execCommand on older browsers.
4. Add tests. Register in workspace.
