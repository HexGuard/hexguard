import { Provider, Signal, forwardRef, signal, type WritableSignal } from '@angular/core';
import { NG_VALUE_ACCESSOR, type ControlValueAccessor } from '@angular/forms';

/**
 * Handle returned by `createControlValueAccessor`.
 *
 * Provides signal-based value/touched/disabled state and the standard
 * `ControlValueAccessor` callbacks. Use `provideValueAccessor(componentClass)`
 * to generate the `NG_VALUE_ACCESSOR` provider array for your component.
 */
export interface ControlValueAccessorHandle<T> {
  /** Read-only signal tracking the current value from Angular forms. */
  readonly value: Signal<T>;
  /** Whether the control has been touched (blurred). */
  readonly touched: Signal<boolean>;
  /** Whether the control is disabled. */
  readonly disabled: Signal<boolean>;

  /** Provider array for `NG_VALUE_ACCESSOR`. Pass your component class to register it. */
  provideValueAccessor(componentClass: object): Provider[];

  /** Call when the control's value changes (e.g., on input). */
  onChange(value: T): void;
  /** Call when the control is touched (e.g., on blur). */
  onTouched(): void;
}

/**
 * Creates a composable `ControlValueAccessor` helper that eliminates
 * boilerplate from custom form controls.
 *
 * The component provides itself as `NG_VALUE_ACCESSOR` (standard pattern)
 * but delegates `writeValue`, `registerOnChange`, `registerOnTouched`, and
 * `setDisabledState` to this helper.
 *
 * @example
 * ```typescript
 * @Component({
 *   selector: 'app-my-input',
 *   standalone: true,
 *   template: `<input [value]="cva.value()" (input)="cva.onChange($any($event.target).value)" (blur)="cva.onTouched()" />`,
 *   providers: [...cva.provideValueAccessor(MyInput)],
 * })
 * class MyInput implements ControlValueAccessor {
 *   protected readonly cva = createControlValueAccessor<string>('');
 *
 *   writeValue(v: string): void { this.cva.onChange(v); }
 *   registerOnChange(fn: any): void { this._onChange = fn; }
 *   registerOnTouched(fn: any): void { this._onTouched = fn; }
 *   setDisabledState(d: boolean): void { this.cva['_setDisabled'](d); } // or just track disabled
 * }
 * ```
 *
 * Wait — even that's still boilerplate. The real savings come when you use
 * a **host directive** approach. See `ControlValueAccessorDirective` for the
 * zero-boilerplate pattern.
 */

// ─── Approach 1: Composable helper (component calls into it) ───

/**
 * Creates a composable `ControlValueAccessor` delegate.
 *
 * Returns signal-backed `value`, `touched`, `disabled` state. The component
 * provides itself as `NG_VALUE_ACCESSOR` and delegates the CVA methods to
 * this handle's callbacks.
 *
 * @example
 * ```typescript
 * @Component({
 *   selector: 'app-rating',
 *   standalone: true,
 *   providers: [provideControlValueAccessor(RatingComponent)],
 *   template: `...`,
 * })
 * class RatingComponent implements ControlValueAccessor {
 *   readonly cva = createControlValueAccessor(0);
 *   readonly value = this.cva.value;
 *   readonly disabled = this.cva.disabled;
 *
 *   writeValue(v: number): void { this.cva.writeValue(v); }
 *   registerOnChange(fn: any): void { this.cva.registerOnChange(fn); }
 *   registerOnTouched(fn: any): void { this.cva.registerOnTouched(fn); }
 *   setDisabledState(d: boolean): void { this.cva.setDisabledState(d); }
 * }
 * ```
 */
export function createControlValueAccessor<T>(initialValue: T): {
  /** Read-only signal tracking the current value. */
  readonly value: Signal<T>;
  /** Whether the control has been touched. */
  readonly touched: Signal<boolean>;
  /** Whether the control is disabled. */
  readonly disabled: Signal<boolean>;

  /** Delegates: call from `writeValue()`. */
  writeValue(value: T): void;
  /** Delegates: call from `registerOnChange()`. */
  registerOnChange(fn: (value: T) => void): void;
  /** Delegates: call from `registerOnTouched()`. */
  registerOnTouched(fn: () => void): void;
  /** Delegates: call from `setDisabledState()`. */
  setDisabledState(isDisabled: boolean): void;

  /** Call on every user input. Updates the signal AND notifies Angular forms. */
  onChange(value: T): void;
  /** Call on blur. Marks touched and notifies Angular forms. */
  onTouched(): void;
} {
  const valueSignal = signal<T>(initialValue);
  const touchedSignal = signal(false);
  const disabledSignal = signal(false);

  let onChangeFn: ((value: T) => void) | null = null;
  let onTouchedFn: (() => void) | null = null;

  return {
    value: valueSignal.asReadonly(),
    touched: touchedSignal.asReadonly(),
    disabled: disabledSignal.asReadonly(),

    writeValue(value: T): void {
      valueSignal.set(value);
    },

    registerOnChange(fn: (value: T) => void): void {
      onChangeFn = fn;
    },

    registerOnTouched(fn: () => void): void {
      onTouchedFn = fn;
    },

    setDisabledState(isDisabled: boolean): void {
      disabledSignal.set(isDisabled);
    },

    onChange(value: T): void {
      valueSignal.set(value);
      onChangeFn?.(value);
    },

    onTouched(): void {
      touchedSignal.set(true);
      onTouchedFn?.();
    },
  };
}

// ─── Approach 2: Provider factory for the standard component-implements-CVA pattern ───

/**
 * Creates a `NG_VALUE_ACCESSOR` provider array for a component that directly
 * implements `ControlValueAccessor`.
 *
 * Use this when your component implements the CVA interface directly (the
 * standard approach) to eliminate the manual provider array and `forwardRef`.
 *
 * @example
 * ```typescript
 * @Component({
 *   selector: 'app-star-rating',
 *   standalone: true,
 *   providers: [provideControlValueAccessor(StarRatingComponent)],
 *   template: `...`,
 * })
 * class StarRatingComponent implements ControlValueAccessor {
 *   // ... standard CVA implementation
 * }
 * ```
 */
export function provideControlValueAccessor(componentClass: object): Provider[] {
  return [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => componentClass), multi: true },
  ];
}

