import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { apiFormErrors } from '@hexguard/angular-api-errors';

import { DemoInspectorPanelComponent } from '../../../../shared/components/demo-inspector-panel.component';
import { DemoNavigationStripComponent } from '../../../../shared/components/demo-navigation-strip.component';
import { DemoPageLayoutComponent } from '../../../../shared/components/demo-page-layout.component';
import { ANGULAR_API_ERRORS_BACKEND_DEMO } from '../../../../demo-registry';
import type { DemoPageEntry } from '../../../../demo-registry';
import {
  VALID_CATEGORIES,
  EMPTY_PRODUCT,
  simulateBackendValidation,
  VALIDATION_API_REPOSITORY,
  VALIDATION_API_BASE_URL,
  type ProductPayload,
} from '../../data/api-errors-backend-demo.data';

@Component({
  standalone: true,
  selector: 'demo-api-errors-backend-page',
  imports: [
    ReactiveFormsModule,
    DemoInspectorPanelComponent,
    DemoNavigationStripComponent,
    DemoPageLayoutComponent,
  ],
  templateUrl: './api-errors-backend-demo-page.component.html',
  styleUrls: ['./api-errors-backend-demo-page.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ApiErrorsBackendDemoPageComponent {
  readonly demoEntry: DemoPageEntry = ANGULAR_API_ERRORS_BACKEND_DEMO;
  readonly validCategories = VALID_CATEGORIES;
  readonly apiBaseUrl = VALIDATION_API_BASE_URL;

  readonly form = new FormGroup({
    name: new FormControl('', { nonNullable: true }),
    price: new FormControl(0, { nonNullable: true }),
    category: new FormControl('', { nonNullable: true }),
    sku: new FormControl('', { nonNullable: true }),
  });

  readonly tags = signal<string[]>([]);
  readonly useLiveApi = signal(false);
  readonly isSubmitting = signal(false);
  readonly lastUrl = signal<string | null>(null);
  readonly errorMessage = signal<string | null>(null);
  readonly pageErrors = signal<readonly { field: string; code: string; message: string }[]>([]);
  readonly rawResponse = signal<Record<string, unknown> | null>(null);

  readonly statusText = computed(() => {
    if (this.isSubmitting()) return 'Validating\u2026';
    if (this.errorMessage()) return 'Error';
    if (this.lastUrl()) return 'Last: API call succeeded';
    return 'Idle';
  });

  readonly snapshotJson = computed(() =>
    JSON.stringify(
      {
        mode: this.useLiveApi() ? 'live .NET API' : 'simulated (browser)',
        lastUrl: this.lastUrl(),
        formValue: this.form.value,
        tags: this.tags(),
        errors: this.pageErrors().length > 0 ? this.pageErrors() : undefined,
        rawResponse: this.rawResponse(),
      },
      null,
      2,
    ),
  );

  fieldError(field: string): string {
    const errors = this.form.get(field)?.errors;
    if (!errors) return '';
    const values = Object.values(errors);
    return values.length > 0 ? String(values[0]) : '';
  }

  async onSubmit(): Promise<void> {
    this.isSubmitting.set(true);
    this.errorMessage.set(null);
    this.pageErrors.set([]);
    this.lastUrl.set(null);
    this.rawResponse.set(null);

    const payload: ProductPayload = {
      name: this.form.value.name ?? '',
      price: this.form.value.price ?? 0,
      category: this.form.value.category ?? '',
      sku: this.form.value.sku ?? '',
      tags: this.tags(),
    };

    try {
      if (this.useLiveApi()) {
        const result = await VALIDATION_API_REPOSITORY.validate(payload);
        this.lastUrl.set(VALIDATION_API_REPOSITORY.lastRequestUrl());
        const apiResult = {
          errors: result.errors,
          isValid: result.isValid,
          traceId: result.traceId,
        };
        const pageErrs = apiFormErrors(this.form, apiResult);
        this.pageErrors.set(pageErrs);
        this.rawResponse.set({
          status: result.status,
          errors: result.errors,
          isValid: result.isValid,
        });
      } else {
        const result = simulateBackendValidation(payload);
        const pageErrs = apiFormErrors(this.form, result);
        this.pageErrors.set(pageErrs);
        this.rawResponse.set({
          errors: result.errors,
          isValid: result.isValid,
          traceId: result.traceId,
        });
      }
    } catch (err) {
      this.errorMessage.set(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      this.isSubmitting.set(false);
    }
  }

  resetForm(): void {
    this.form.reset(EMPTY_PRODUCT);
    this.tags.set([]);
    this.pageErrors.set([]);
    this.errorMessage.set(null);
    this.lastUrl.set(null);
    this.rawResponse.set(null);
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
