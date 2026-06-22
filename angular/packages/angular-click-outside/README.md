# @hexguard/angular-click-outside

Click-outside detection for Angular: signal-based injectable and directive for detecting clicks outside a referenced element to dismiss dropdowns, modals, and popovers.

**[Deep package notes](https://github.com/HexGuard/hexguard/blob/main/docs/packages/angular-click-outside.md)** ·
**[Demo routes](#demo-routes)** ·
**[Installation](#installation)**

## Installation

```bash
pnpm add @hexguard/angular-click-outside
# No RxJS dependency required
```

## Quickstart

### Directive (template usage)

```ts
import { HexguardClickOutsideDirective } from '@hexguard/angular-click-outside';

@Component({
  standalone: true,
  imports: [HexguardClickOutsideDirective],
  template: `
    <div (hexguardClickOutside)="close()" [hexguardClickOutsideEnabled]="isOpen()">
      <p>Click outside this box to trigger close.</p>
    </div>
  `,
})
export class MyComponent {
  readonly isOpen = signal(true);
  close() { this.isOpen.set(false); }
}
```

### Injectable (programmatic usage)

```ts
import { injectClickOutside } from '@hexguard/angular-click-outside';

@Component({ ... })
export class MyComponent {
  readonly target = viewChild.required<ElementRef>('panel');

  private readonly outside = injectClickOutside(this.target, {
    enabled: this.isOpen,
    exclude: ['.ignore-clicks'],
  });

  constructor() {
    effect(() => {
      if (this.outside()) this.close();
    });
  }
}
```

## Features

| Feature                         | Status | Notes                                              |
| ------------------------------- | ------ | -------------------------------------------------- |
| Directive for template usage    | ✅     | `(hexguardClickOutside)` output                    |
| Injectable for programmatic use | ✅     | `injectClickOutside()` returns `Signal<PointerEvent>` |
| Enable/disable toggle           | ✅     | Via `enabled` signal or `[hexguardClickOutsideEnabled]` |
| CSS selector exclusions         | ✅     | Ignore clicks on specific nested elements          |
| Automatic cleanup               | ✅     | Via Angular `DestroyRef`                           |
| Zero extra dependencies         | ✅     | Only `@angular/core` + `tslib`                     |

## Demo routes

| Route                                                    | Description                                                   |
| -------------------------------------------------------- | ------------------------------------------------------------- |
| `/packages/angular-click-outside`                        | Click Outside package overview                                 |
| `/packages/angular-click-outside/demo`                   | Dropdown and modal click-outside demos                         |

## What It Owns

- One injectable for programmatic click-outside detection
- One directive for template-based click-outside
- Configurable enabled state and CSS selector exclusions
- Automatic `DestroyRef` cleanup

## What It Does Not Own

- Dropdown or modal components — headless detection only
- Focus management or focus trapping — see `angular-focus-trap`
- Scroll locking or body scroll prevention

## API Reference

### `injectClickOutside(elementRef, options?)`

Returns a `Signal<PointerEvent | null>` — the event when a click occurs outside the element, or `null` when no outside click.

**Parameters:**

- `elementRef: Signal<ElementRef | undefined>` — Element to detect outside clicks for.
- `options.enabled?: Signal<boolean>` — When false, detection is paused (default: `signal(true)`).
- `options.exclude?: string[]` — CSS selectors for elements to exclude from outside detection.

### `HexguardClickOutsideDirective`

| Selector | Type | Description |
|----------|------|-------------|
| `[hexguardClickOutside]` | Output | Emits `PointerEvent` when click occurs outside the host element |
| `[hexguardClickOutsideEnabled]` | Input | Optional boolean signal to enable/disable detection |

```html
<div (hexguardClickOutside)="onClickOutside($event)" [hexguardClickOutsideEnabled]="isActive()">
```
