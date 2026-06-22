# @hexguard/angular-click-outside

Click-outside detection for Angular: signal-based injectable and directive for detecting clicks outside a referenced element to dismiss dropdowns, modals, and popovers.

**[Deep package notes](docs/packages/angular-click-outside.md)** · **[Demo](/packages/angular-click-outside/demo)**

---

## Installation

```bash
pnpm add @hexguard/angular-click-outside
```

## Quickstart

### Directive (template)

```typescript
import { HexguardClickOutsideDirective } from '@hexguard/angular-click-outside';

@Component({
  standalone: true,
  imports: [HexguardClickOutsideDirective],
  template: `
    <div (hexguardClickOutside)="close()" [hexguardClickOutsideEnabled]="isOpen()">
      <p>Click outside to close.</p>
    </div>
  `,
})
class DropdownComponent {
  readonly isOpen = signal(true);
  close() {
    this.isOpen.set(false);
  }
}
```

### Injectable (programmatic)

```typescript
import { injectClickOutside } from '@hexguard/angular-click-outside';

@Component({...})
class PanelComponent {
  readonly target = viewChild.required<ElementRef>('panel');
  private readonly outside = injectClickOutside(this.target, {
    enabled: this.isOpen,
    exclude: ['.ignore-clicks'],
  });

  constructor() {
    effect(() => { if (this.outside()) this.close(); });
  }
}
```

## Use Cases

### Dropdown auto-close

```html
<div (hexguardClickOutside)="menuOpen.set(false)" [hexguardClickOutsideEnabled]="menuOpen()">
  <button (click)="menuOpen.set(!menuOpen())">Toggle</button>
  @if (menuOpen()) {
  <div class="dropdown">...</div>
  }
</div>
```

### Exclude nested popovers

```typescript
injectClickOutside(this.panelRef, {
  exclude: ['.popover-content', '.tooltip-inner'],
});
```

## API

### `injectClickOutside(elementRef, options?)`

| Param             | Type                              | Default        | Description                           |
| ----------------- | --------------------------------- | -------------- | ------------------------------------- |
| `elementRef`      | `Signal<ElementRef \| undefined>` | required       | Element to detect outside clicks for  |
| `options.enabled` | `Signal<boolean>`                 | `signal(true)` | Pauses detection when `false`         |
| `options.exclude` | `string[]`                        | `[]`           | CSS selectors for elements to ignore  |
| Returns           | `Signal<PointerEvent \| null>`    |                | The event on outside click, or `null` |

### `HexguardClickOutsideDirective`

| Binding                         | Type   | Description                           |
| ------------------------------- | ------ | ------------------------------------- |
| `(hexguardClickOutside)`        | Output | Emits `PointerEvent` on outside click |
| `[hexguardClickOutsideEnabled]` | Input  | Optional signal to toggle detection   |

## Scope Boundaries

| Concern                                          | Status                           |
| ------------------------------------------------ | -------------------------------- |
| Click-outside detection (directive + injectable) | ✅                               |
| Enable/disable toggle                            | ✅                               |
| CSS selector exclusions                          | ✅                               |
| Dropdown or modal components                     | ❌ (headless — compose your own) |
| Focus management or focus trapping               | ❌                               |

## Demo

Visit `/packages/angular-click-outside/demo` for dropdown and modal click-outside demos.
