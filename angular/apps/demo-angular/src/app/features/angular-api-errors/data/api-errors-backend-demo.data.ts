import { signal } from '@angular/core';

import type { ApiError } from '@hexguard/angular-api-errors';

export const VALIDATION_API_BASE_URL = 'http://127.0.0.1:5074';

export interface ProductPayload {
  name: string;
  price: number;
  category: string;
  sku: string;
  tags: string[];
}

/**
 * Valid categories recognized by the .NET SampleApi validation endpoint.
 */
export const VALID_CATEGORIES = [
  'Electronics',
  'Clothing',
  'Home',
  'Books',
  'Sports',
] as const;

export const EMPTY_PRODUCT: ProductPayload = {
  name: '',
  price: 0,
  category: '',
  sku: '',
  tags: [],
};

/** Simulated validation — reproduces the same rules as the .NET SampleApi. */
export function simulateBackendValidation(payload: ProductPayload): {
  errors: ApiError[];
  isValid: boolean;
  traceId: string;
} {
  const errors: ApiError[] = [];

  const name = payload.name.trim();
  if (name.length === 0) {
    errors.push({ field: 'name', code: 'Required', message: 'Product name is required.', isFieldError: true });
  } else if (name.length > 100) {
    errors.push({ field: 'name', code: 'MaxLength', message: 'Product name must not exceed 100 characters.', isFieldError: true });
  }

  if (payload.price <= 0) {
    errors.push({ field: 'price', code: 'OutOfRange', message: 'Price must be greater than zero.', isFieldError: true });
  } else if (payload.price > 100_000) {
    errors.push({ field: 'price', code: 'OutOfRange', message: 'Price must not exceed 100,000.', isFieldError: true });
  }

  const category = payload.category.trim();
  if (category.length === 0) {
    errors.push({ field: 'category', code: 'Required', message: 'Category is required.', isFieldError: true });
  } else if (!VALID_CATEGORIES.includes(category as typeof VALID_CATEGORIES[number])) {
    errors.push({ field: 'category', code: 'InvalidFormat', message: `'${category}' is not a recognized category.`, isFieldError: true });
  }

  const sku = payload.sku.trim();
  if (sku.length > 0) {
    const skuPattern = /^[A-Z]{3}-\d{6}$/;
    if (!skuPattern.test(sku)) {
      errors.push({ field: 'sku', code: 'InvalidFormat', message: 'SKU must match the pattern XXX-999999.', isFieldError: true });
    }
  }

  if (payload.tags.length > 5) {
    errors.push({ field: 'tags', code: 'MaxLength', message: 'At most 5 tags are allowed.', isFieldError: true });
  }

  return {
    errors,
    isValid: errors.length === 0,
    traceId: 'sim-' + Date.now().toString(36),
  };
}

/**
 * Repository for calling the live .NET SampleApi validation endpoint.
 */
export class ValidationApiRepository {
  readonly loadCount = signal(0);
  readonly apiBaseUrl = signal(VALIDATION_API_BASE_URL);
  readonly lastRequestUrl = signal<string | null>(null);
  readonly lastResponseStatus = signal<number | null>(null);

  reset(): void {
    this.loadCount.set(0);
    this.apiBaseUrl.set(VALIDATION_API_BASE_URL);
    this.lastRequestUrl.set(null);
    this.lastResponseStatus.set(null);
  }

  /** POSTs a product payload to the .NET SampleApi validate endpoint and returns the parsed Problem Details. */
  async validate(payload: ProductPayload): Promise<{
    errors: ApiError[];
    isValid: boolean;
    traceId?: string;
    status: number;
  }> {
    this.loadCount.update((c) => c + 1);
    const url = `${this.apiBaseUrl()}/api/validation-contracts/validate`;
    this.lastRequestUrl.set(url);

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(payload),
    });

    this.lastResponseStatus.set(response.status);

    if (response.status === 200) {
      return { errors: [], isValid: true, status: 200 };
    }

    const body = (await response.json()) as Record<string, unknown>;

    const rawErrors = body['errors'];
    const errors: ApiError[] = [];

    if (Array.isArray(rawErrors)) {
      for (const raw of rawErrors) {
        if (
          typeof raw === 'object' &&
          raw !== null &&
          typeof (raw as Record<string, unknown>)['field'] === 'string' &&
          typeof (raw as Record<string, unknown>)['code'] === 'string' &&
          typeof (raw as Record<string, unknown>)['message'] === 'string'
        ) {
          const r = raw as Record<string, unknown>;
          errors.push({
            field: r['field'] as string,
            code: r['code'] as string,
            message: r['message'] as string,
            isFieldError: (r['field'] as string).length > 0,
          });
        }
      }
    }

    return {
      errors,
      isValid: errors.length === 0,
      traceId: (body['traceId'] as string | undefined) ?? undefined,
      status: response.status,
    };
  }
}

export const VALIDATION_API_REPOSITORY = new ValidationApiRepository();
