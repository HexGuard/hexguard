import { Directive, ElementRef, Input, OnChanges, SimpleChanges } from '@angular/core';
import type { VariantDefinition } from './define-variants';

/**
 * Directive that auto-applies variant CSS classes and ARIA attributes
 * to the host element based on `@Input()` bindings.
 *
 * Each variant group becomes an `@Input()` on the directive — e.g.
 * `hexguardVariantSize`, `hexguardVariantColor`, `hexguardVariantState`.
 *
 * @example
 * ```html
 * <button
 *   [hexguardVariants]="ButtonVariants"
 *   hexguardVariantSize="lg"
 *   hexguardVariantColor="outline"
 *   hexguardVariantState="loading"
 * >Click me</button>
 * <!-- Auto-sets: class="btn-lg btn-outline btn-loading" aria-busy="true" -->
 * ```
 */
@Directive({
  standalone: true,
  selector: '[hexguardVariants]',
})
export class HexguardVariantsDirective implements OnChanges {
  @Input({ required: true }) hexguardVariants!: VariantDefinition;

  // Dynamic inputs — one per variant group, set by consumer in template
  @Input('hexguardVariantSize') size?: string;
  @Input('hexguardVariantColor') color?: string;
  @Input('hexguardVariantState') state?: string;
  @Input('hexguardVariantStyle') style?: string;
  @Input('hexguardVariantShape') shape?: string;
  @Input('hexguardVariantTheme') theme?: string;
  @Input('hexguardVariantType') type?: string;
  @Input('hexguardVariantMode') mode?: string;

  private readonly el: HTMLElement;

  constructor(elementRef: ElementRef<HTMLElement>) {
    this.el = elementRef.nativeElement;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.hexguardVariants) return;

    const def = this.hexguardVariants;
    const classes: string[] = [];
    const ariaAttrs: Record<string, string> = {};

    // Resolve each group from the bound @Input() or default
    for (const groupName of Object.keys(def.groups)) {
      const inputValue = (this as Record<string, unknown>)[groupName] as string | undefined;
      const value = inputValue ?? def.defaults[groupName];
      if (!value) continue;

      const cssClass = def.groups[groupName]?.[value];
      if (cssClass) classes.push(cssClass);

      // ARIA
      const ariaKey = `${groupName}.${value}`;
      const ariaMap = def.aria[ariaKey];
      if (ariaMap) Object.assign(ariaAttrs, ariaMap);
    }

    // Compound variants
    for (const compound of def.compounds) {
      const allMatch = Object.entries(compound.conditions).every(([g, v]) => {
        const inputValue = (this as Record<string, unknown>)[g] as string | undefined;
        return (inputValue ?? def.defaults[g]) === v;
      });
      if (allMatch) classes.push(compound.class);
    }

    // Apply
    this.el.className = classes.join(' ');

    // Set ARIA
    for (const [attr, val] of Object.entries(ariaAttrs)) {
      this.el.setAttribute(attr, val);
    }
  }
}
