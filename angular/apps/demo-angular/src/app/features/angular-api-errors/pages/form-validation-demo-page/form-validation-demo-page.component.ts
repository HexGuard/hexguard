import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { apiFormErrors } from '@hexguard/angular-api-errors';

import { DemoInspectorPanelComponent } from '../../../../shared/components/demo-inspector-panel.component';
import { DemoNavigationStripComponent } from '../../../../shared/components/demo-navigation-strip.component';
import { DemoPageLayoutComponent } from '../../../../shared/components/demo-page-layout.component';
import { FORM_VALIDATION_DEMO } from '../../../../demo-registry';
import type { DemoPageEntry } from '../../../../demo-registry';
import {
  EMPTY_PRODUCT,
  VALID_CATEGORIES,
  simulateValidation,
  type ProductFormPayload,
} from '../../data/api-errors-demo.data';

@Component({
  standalone: true,
  selector: 'demo-form-validation-page',
  imports: [
    ReactiveFormsModule,
    DemoInspectorPanelComponent,
    DemoNavigationStripComponent,
    DemoPageLayoutComponent,
  ],
  templateUrl: './form-validation-demo-page.component.html',
  styleUrls: ['./form-validation-demo-page.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormValidationDemoPageComponent {
  readonly demoEntry: DemoPageEntry = FORM_VALIDATION_DEMO;
  readonly validCategories = VALID_CATEGORIES;

  readonly form = new FormGroup({
    name: new FormControl('', { nonNullable: true }),
    price: new FormControl(0, { nonNullable: true }),
    category: new FormControl('', { nonNullable: true }),
    sku: new FormControl('', { nonNullable: true }),
  });

  readonly tags = signal<string[]>([]);
  readonly apiErrorState = signal<readonly { field: string; code: string; message: string }[]>([]);

  readonly snapshotJson = computed(() => {
    const errors = this.apiErrorState();
    return JSON.stringify(
      {
        formValue: this.form.value,
        tags: this.tags(),
        isValid: errors.length === 0,
        errors: errors.length > 0 ? errors : undefined,
      },
      null,
      2,
    );
  });

  getFieldError(field: string): string {
    const errors = this.form.get(field)?.errors;
    if (!errors) return '';
    const values = Object.values(errors);
    return values.length > 0 ? String(values[0]) : '';
  }

  onSubmit(): void {
    this.apiErrorState.set([]);

    const payload: ProductFormPayload = {
      name: this.form.value.name ?? '',
      price: this.form.value.price ?? 0,
      category: this.form.value.category ?? '',
      sku: this.form.value.sku ?? '',
      tags: this.tags(),
    };

    // Simulate a backend validation call
    const result = simulateValidation(payload);

    // Map errors onto the form, collect page-level errors
    const pageErrors = apiFormErrors(this.form, result);
    this.apiErrorState.set(pageErrors);
  }

  resetForm(): void {
    this.form.reset(EMPTY_PRODUCT);
    this.tags.set([]);
    this.apiErrorState.set([]);
  }

  addTag(tag: string): void {
    const trimmed = tag.trim();
    if (trimmed.length > 0) {
      this.tags.update((current) => [...current, trimmed]);
    }
  }

  removeTag(index: number): void {
    this.tags.update((current) => current.filter((_, i) => i !== index));
  }
}
