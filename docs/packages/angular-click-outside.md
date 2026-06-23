# @hexguard/angular-click-outside — Deep Package Notes

Click-outside detection for Angular: signal-based injectable and directive for detecting clicks outside a referenced element to dismiss dropdowns, modals, and popovers.

## Problem

Every Angular app with dropdowns, modals, or popovers needs to detect clicks outside those elements to dismiss them. Teams rebuild the same `pointerdown` event listener pattern:

- Checking if the click target is outside the element via `Node.contains()`
- Adding capture-phase listeners for early detection
- Excluding specific child elements (e.g., the toggle button that opened the dropdown)
- Cleaning up listeners on destroy

**`@hexguard/angular-click-outside`** standardizes this into two surfaces: an injectable for programmatic use and a directive for template use.

## Design

### Two Surfaces

**`injectClickOutside(elementRef, options?)`** — For programmatic use in components or services:

```ts
const outside = injectClickOutside(panelRef, {
  enabled: isOpen,
  exclude: ['.toggle-button'],
});
effect(() => {
  if (outside.clickOutside()) close();
});
```

**`[hexguardClickOutside]` directive** — For template use:

```html
<div (hexguardClickOutside)="close()" [hexguardClickOutsideEnabled]="isOpen()">
  Click outside to dismiss
</div>
```

### Detection Mechanism

The package uses a **capture-phase `pointerdown` event listener** on `document`. This ensures the outside-click is detected before it reaches any target element, and works reliably across all modern browsers.

1. When a `pointerdown` event fires, the handler checks if the target is outside the referenced element via `Node.contains()`.
2. If outside, it checks against any configured `exclude` selectors using `Element.closest()`.
3. If no exclusion matches, the signal emits the event (injectable) or the output fires (directive).

### Exclusions

The `exclude` option accepts CSS selectors. This is useful for:

- **Toggle buttons** that open a dropdown — clicking the toggle should not also trigger the outside-close
- **Nested popovers** within a modal — closing the outer modal should not be triggered by the inner popover
- **Custom scrollbars or overlays** that should not count as "outside"

```ts
const outside = injectClickOutside(panelRef, {
  exclude: ['#toggle-btn', '.popover-content'],
});
```

### Enable/Disable

The `enabled` signal lets you temporarily suspend detection. For example, during a close animation:

```ts
const isAnimating = signal(false);

const outside = injectClickOutside(panelRef, {
  enabled: computed(() => isOpen() && !isAnimating()),
});
```

## Lifecycle

- The capture-phase `pointerdown` listener is added on creation and removed via `DestroyRef.onDestroy()`.
- The directive uses Angular's built-in lifecycle through the `injectClickOutside` injectable under the hood.

---

## Assessment: Potential Improvements

| Area        | Suggestion                                                                                                          | Priority |
| ----------- | ------------------------------------------------------------------------------------------------------------------- | -------- |
| API         | Consider adding a `(hexguardClickOutsideEnabled)` output for parent notification of enable state changes            | Low      |
| API         | Consider supporting `ElementRef` directly (not wrapped in `Signal`) for simpler directive usage                     | Low      |
| Edge Cases  | No test for `enabled` signal toggling during an active open state                                                   | Low      |
| Edge Cases  | No test for multiple excluded selectors                                                                             | Low      |
| Performance | Capture-phase listener fires on every pointer event — consider a passive approach using focus/blur where applicable | Low      |

## API Surface

### `injectClickOutside(elementRef, options?)`

**Parameters:**

- `elementRef: Signal<ElementRef | undefined>` — Element to detect outside clicks for.
- `options.enabled?: Signal<boolean>` — When false, detection is paused (default: `signal(true)`).
- `options.exclude?: string[]` — CSS selectors for excluded elements.

**Returns:** `ClickOutsideHandle` with `clickOutside: Signal<PointerEvent | null>`

### `HexguardClickOutsideDirective`

| Selector                        | Type   | Description                                    |
| ------------------------------- | ------ | ---------------------------------------------- |
| `[hexguardClickOutside]`        | Output | Emits `PointerEvent` when click occurs outside |
| `[hexguardClickOutsideEnabled]` | Input  | Boolean signal/primitive to enable/disable     |

## Behavior Notes

- Uses capture phase (`{ capture: true }`) for reliable detection before the event reaches any target.
- The `clickOutside` signal value resets to `null` each detection cycle — it fires once per outside click.
- Excluded selectors are checked via `Element.closest()` so deeply nested exclusions work.
- When `enabled` is `false`, all pointer events are ignored regardless of target.
- When the `elementRef` signal produces `undefined`, detection is paused until a valid element is provided.

## Code Examples

### Toggle enabled during animation

```typescript
@Component({ ... })
class ModalComponent {
  readonly panelRef = viewChild.required<ElementRef>('panel');
  readonly isOpen = signal(false);
  readonly isAnimating = signal(false);

  readonly clickOutside = injectClickOutside(this.panelRef, {
    enabled: computed(() => this.isOpen() && !this.isAnimating()),
    exclude: ['.modal-backdrop'],
  });

  effect(() => {
    if (this.clickOutside.clickOutside()) {
      this.close();
    }
  });

  async close(): Promise<void> {
    this.isAnimating.set(true);
    // Close animation runs — click outside is temporarily disabled
    await animateClose();
    this.isOpen.set(false);
    this.isAnimating.set(false);
  }
}
```

### Directive usage with dynamic enabled state

```html
<div (hexguardClickOutside)="close()" [hexguardClickOutsideEnabled]="dropdownOpen()">
  <button (click)="toggle()">Options</button>
  @if (dropdownOpen()) {
  <div class="dropdown">
    <button (click)="doAction('edit')">Edit</button>
    <button (click)="doAction('delete')">Delete</button>
  </div>
  }
</div>
```

## Related Resources

- [Package README](../../angular/packages/angular-click-outside/README.md)
- [Package Catalog](../README.md)
- [Demo Routes](../../angular/apps/demo-angular/src/app/features/packages/angular/angular-click-outside/)
- [Source Code](../../angular/packages/angular-click-outside/src/)

---

## API Review Findings

Review date: 2026-06-22. Findings are observational.

### Observations

| Dimension              | Finding                                                                                                                             | Severity |
| ---------------------- | ----------------------------------------------------------------------------------------------------------------------------------- | -------- |
| Public API Design      | Dual surface: `injectClickOutside()` (programmatic) + `HexguardClickOutsideDirective` (template). Covers both use cases.            | praise   |
| Public API Design      | Directive naming: `[hexguardClickOutside]` output + `[hexguardClickOutsideEnabled]` input — consistent `Hexguard` prefix.           | praise   |
| Implementation Quality | Capture-phase `pointerdown` listener for reliable detection before event reaches target. `Element.closest()` for exclude selectors. | praise   |
| Test Coverage          | Inside/outside, disabled state, exclude selectors, undefined element — well tested.                                                 | praise   |
| Test Coverage          | Directive test only verifies existence (`toBeTruthy()`) — does not test that clicking outside fires the output event.               | moderate |
| Documentation          | JSDoc `@example` in `injectClickOutside()` references `outside.clickOutside()` but the handle returns `{ clickOutside: Signal }`.   | minor    |
