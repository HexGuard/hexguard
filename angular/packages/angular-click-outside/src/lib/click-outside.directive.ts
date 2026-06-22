import { Directive, effect, ElementRef, inject, input, output, signal } from '@angular/core';

import { injectClickOutside } from './click-outside';

/**
 * Directive that emits an event when a click occurs outside the host element.
 *
 * @example
 * ```html
 * <div (hexguardClickOutside)="close()" [hexguardClickOutsideEnabled]="isOpen()">
 *   Click outside to close
 * </div>
 * ```
 */
@Directive({
  selector: '[hexguardClickOutside]',
  standalone: true,
})
export class HexguardClickOutsideDirective {
  /**
   * Emits a `PointerEvent` when a click occurs outside the host element.
   */
  readonly hexguardClickOutside = output<PointerEvent>();

  /**
   * When `false`, click-outside detection is paused.
   */
  readonly hexguardClickOutsideEnabled = input(true);

  constructor() {
    const elRef = inject<ElementRef<HTMLElement>>(ElementRef);
    const elSignal = signal<ElementRef<HTMLElement> | undefined>(elRef);
    const enabledSig = signal(true);

    // Sync the input signal
    effect(() => {
      enabledSig.set(this.hexguardClickOutsideEnabled());
    });

    const handle = injectClickOutside(elSignal, {
      enabled: enabledSig,
    });

    effect(() => {
      const event = handle.clickOutside();
      if (event) {
        this.hexguardClickOutside.emit(event);
      }
    });
  }
}
