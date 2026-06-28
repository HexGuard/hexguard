# @hexguard/angular-clipboard — Deep Package Notes

Headless clipboard interaction state: copy, paste, permission handling, execCommand fallback, and in-memory history with signal-based primitives.

## Problem

Every app needs copy-to-clipboard buttons, but `navigator.clipboard.writeText()` fails in non-HTTPS contexts, `document.execCommand('copy')` is the fallback, and `navigator.clipboard.readText()` requires user permission. Teams rebuild the same pattern: try the modern API, catch the error, fall back to execCommand, show success/error feedback, and track a recent-copies list.

**`@hexguard/angular-clipboard`** standardizes this into one injectable contract with signal-based feedback.

## API

- `copy(text)` → `Promise<boolean>` — Write text to clipboard, return success. Falls back to `execCommand`.
- `paste()` → `Promise<string | null>` — Read text from clipboard, return null on failure or denial.
- `lastCopied: Signal<string | null>` — Last successfully copied text.
- `lastPasted: Signal<string | null>` — Last successfully pasted text.
- `history: Signal<readonly string[]>` — In-memory copy history (most recent first).
- `isCopying: Signal<boolean>` — Whether a copy operation is in progress.
- `copyError: Signal<string | null>` — Last copy error message.
- `permissionState: Signal<PermissionState>` — Current clipboard permission state.
- `clearHistory()` — Clear the in-memory copy history.

---

## Assessment: Potential Improvements

| Area | Suggestion | Priority |
|------|-----------|----------|
| API | Consider adding a `copyDirective` for declarative `[copy]` binding | Low |
| API | Consider adding HTML/image clipboard support in v0.2 | Low |
| API | Consider adding `clipboardchange` event monitoring for external changes | Low |
| Tests | Missing test: `paste()` returns null when `clipboard-read` permission is denied | Low |
| Tests | Consider adding integration tests with real browser clipboard API | Medium |

## Code Examples

### Copy text to clipboard

```typescript
import { injectClipboard } from '@hexguard/angular-clipboard';

@Component({ ... })
class ShareLinkComponent {
  readonly clip = injectClipboard();
  link = 'https://example.com/share/abc123';

  async onCopyLink(): Promise<void> {
    const ok = await this.clip.copy(this.link);
    if (ok) {
      this.notify.success('Link copied!');
    }
  }
}
// Template:
// <input [(ngModel)]="link" />
// <button (click)="onCopyLink()" [disabled]="clip.isCopying()">
//   {{ clip.isCopying() ? 'Copying...' : 'Copy' }}
// </button>
// @if (clip.lastCopied()) { <span>Copied!</span> }
```

### Paste from clipboard

```typescript
@Component({ ... })
class ImportComponent {
  readonly clip = injectClipboard();
  importedText = '';

  async onPaste(): Promise<void> {
    const text = await this.clip.paste();
    if (text !== null) {
      this.importedText = text;
      this.parseImport(text);
    } else {
      this.notify.error('Could not read clipboard');
    }
  }
}
```

### Display copy history

```typescript
@Component({ ... })
class ClipboardHistoryComponent {
  readonly clip = injectClipboard({ historySize: 20 });
  // clip.history() returns the last 20 copied items, most recent first.
  // Template: @for (item of clip.history(); track item) { <li>{{ item }}</li> }
}
```

## Related Resources

- [Package README](../../angular/packages/angular-clipboard/README.md)
- [Package Catalog](../README.md)
- [Demo Routes](../../angular/apps/demo-angular/src/app/features/packages/angular/angular-clipboard/)
- [Source Code](../../angular/packages/angular-clipboard/src/)

---

## API Review Findings

Review date: 2026-06-28. Findings are observational.

### Observations

| Dimension | Finding | Severity |
|-----------|---------|----------|
| Public API Design | Minimal surface: 1 function (`injectClipboard`), 2 types. Clean copy/paste/history contract with signal-based feedback. | praise |
| Implementation Quality | Async clipboard API with execCommand fallback. Permission state query with live listener. History ring with configurable size. Cleanup via DestroyRef. | praise |
| Implementation Quality | SSR-safe: guards on `typeof navigator`. | praise |
| Test Coverage | 10 tests covering copy success/failure, history management, paste with/without clipboard API, clearHistory, history size cap, permission state. | praise |
| Demo Integration | Interactive demo with text input, copy/paste buttons, history display, error/success feedback, and inspector panel. | praise |
