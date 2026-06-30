import { Directive, EmbeddedViewRef, Input, OnDestroy, TemplateRef, ViewContainerRef } from '@angular/core';
import type { AbstractControl, ValidationErrors } from '@angular/forms';

/**
 * Structural directive that shows content only when the given form control is
 * touched and invalid. The control's `ValidationErrors` are exposed via the
 * implicit context, so you can reference specific errors in the template.
 *
 * Subscribes to the control's `statusChanges` and `valueChanges` so the view
 * updates automatically when the validation state changes.
 *
 * @example
 * ```html
 * <!-- Simple: show block when control has errors and was touched -->
 * <p *showFormError="form.get('name')">Name is required.</p>
 *
 * <!-- With error context -->
 * <p *showFormError="form.get('email'); let err">
 *   Email error: {{ err?.required ? 'Required' : 'Invalid format' }}
 * </p>
 * ```
 */
@Directive({
  selector: '[showFormError]',
  standalone: true,
})
export class ShowFormErrorDirective implements OnDestroy {
  private embeddedViewRef: EmbeddedViewRef<{ $implicit: ValidationErrors | null }> | null = null;
  private control: AbstractControl | null | undefined = null;
  private subs: (() => void)[] = [];

  constructor(
    private readonly templateRef: TemplateRef<{ $implicit: ValidationErrors | null }>,
    private readonly viewContainerRef: ViewContainerRef,
  ) {}

  @Input()
  set showFormError(control: AbstractControl | null | undefined) {
    this.cleanup();
    this.control = control;

    if (control) {
      const onChange = () => this.updateView();
      const sub1 = control.valueChanges.subscribe({ next: onChange });
      const sub2 = control.statusChanges.subscribe({ next: onChange });
      this.subs = [() => sub1.unsubscribe(), () => sub2.unsubscribe()];
    }

    this.updateView();
  }

  private updateView(): void {
    const ctrl = this.control;
    const isInvalid = ctrl ? ctrl.touched && ctrl.invalid : false;

    if (isInvalid && !this.embeddedViewRef) {
      this.embeddedViewRef = this.viewContainerRef.createEmbeddedView(this.templateRef, {
        $implicit: ctrl!.errors,
      });
    } else if (!isInvalid && this.embeddedViewRef) {
      this.viewContainerRef.clear();
      this.embeddedViewRef = null;
    } else if (isInvalid && this.embeddedViewRef) {
      this.embeddedViewRef.context.$implicit = ctrl!.errors;
      this.embeddedViewRef.markForCheck();
    }
  }

  private cleanup(): void {
    for (const unsub of this.subs) unsub();
    this.subs = [];
  }

  ngOnDestroy(): void {
    this.cleanup();
  }
}
