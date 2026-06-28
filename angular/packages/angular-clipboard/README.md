# @hexguard/angular-clipboard

**Headless clipboard interaction state for Angular.** Copy, paste, permission handling, execCommand fallback, and in-memory history — all with signal-based primitives.

**[Deep package notes](docs/packages/angular-clipboard.md)** · **[Demo](/packages/angular-clipboard/demo)**

---

## Problem

Every app needs copy-to-clipboard buttons, but `navigator.clipboard.writeText()` fails in non-HTTPS contexts, and `navigator.clipboard.readText()` requires user permission. Teams rebuild the same fallback pattern.

**`@hexguard/angular-clipboard`** standardizes this into one injectable contract with `copy()`, `paste()`, `history`, and signal-based feedback.

## Installation

```bash
pnpm add @hexguard/angular-clipboard
```

## Quickstart

```typescript
import { injectClipboard } from '@hexguard/angular-clipboard';

const clip = injectClipboard();

// Copy (uses navigator.clipboard, falls back to execCommand)
await clip.copy('Hello World');

// Paste (returns null on failure)
const text = await clip.paste();

// Reactive state
clip.isCopying();   // Signal<boolean>
clip.lastCopied();  // Signal<string | null>
clip.history();     // Signal<string[]>
```

## Use Cases

### Copy with feedback

```html
<input #input />
<button (click)="clip.copy(input.value)" [disabled]="clip.isCopying()">
  {{ clip.isCopying() ? 'Copying...' : 'Copy' }}
</button>
@if (clip.lastCopied()) { <span>Copied!</span> }
```

### Paste button

```html
<button (click)="onPaste()">Paste</button>
```

```typescript
async onPaste() {
  const text = await this.clip.paste();
  if (text) this.process(text);
}
```

### Copy history sidebar

```html
<ol>
  @for (item of clip.history(); track item) {
    <li>{{ item }}</li>
  }
</ol>
<button (click)="clip.clearHistory()">Clear</button>
```

## API

### `injectClipboard(config?)`

| Member | Type | Description |
|--------|------|-------------|
| `copy(text)` | `(string) => Promise<boolean>` | Copy text to clipboard |
| `paste()` | `() => Promise<string \| null>` | Read text from clipboard |
| `lastCopied` | `Signal<string \| null>` | Last successfully copied text |
| `lastPasted` | `Signal<string \| null>` | Last successfully pasted text |
| `history` | `Signal<readonly string[]>` | Copy history (most recent first) |
| `isCopying` | `Signal<boolean>` | Copy in progress |
| `copyError` | `Signal<string \| null>` | Last copy error |
| `permissionState` | `Signal<PermissionState>` | `'granted' \| 'denied' \| 'prompt' \| 'unsupported'` |
| `clearHistory()` | `() => void` | Clear copy history |

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `historySize` | `number` | `10` | Max history entries |

## Scope Boundaries

| Concern | Status |
|---------|--------|
| Text copy with API + execCommand fallback | ✅ |
| Text paste with permission handling | ✅ |
| In-memory copy history | ✅ |
| Permission state signal | ✅ |
| SSR-safe (no window access without guard) | ✅ |
| HTML / image clipboard support | ❌ (v0.2) |
| Clipboard change monitoring | ❌ (v0.2) |

## Demo

Visit `/packages/angular-clipboard/demo` to test copy, paste, and history tracking.
