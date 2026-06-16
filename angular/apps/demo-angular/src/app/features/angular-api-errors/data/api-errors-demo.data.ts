import type { ApiValidationResult } from '@hexguard/angular-api-errors';

/** Simulated product payload for the form validation demo. */
export interface ProductFormPayload {
  name: string;
  price: number;
  category: string;
  sku: string;
  tags: string[];
}

/** Valid categories for the product form demo. */
export const VALID_CATEGORIES = ['Electronics', 'Clothing', 'Home', 'Books', 'Sports'] as const;

/**
 * Simulates a backend validation call against the shared contract.
 * Returns an ApiValidationResult matching the .NET validation endpoint shape.
 *
 * In the demo, this replaces a live HTTP call to the sample API at
 * /api/validation-contracts/validate so the Angular demo works without
 * the .NET backend running.
 */
export function simulateValidation(payload: ProductFormPayload): ApiValidationResult {
  const errors: Array<{ field: string; code: string; message: string; isFieldError: boolean }> = [];

  // Name validation
  const name = payload.name.trim();
  if (name.length === 0) {
    errors.push({
      field: 'name',
      code: 'Required',
      message: 'Product name is required.',
      isFieldError: true,
    });
  } else if (name.length > 100) {
    errors.push({
      field: 'name',
      code: 'MaxLength',
      message: 'Product name must not exceed 100 characters.',
      isFieldError: true,
    });
  }

  // Price validation
  if (payload.price <= 0) {
    errors.push({
      field: 'price',
      code: 'OutOfRange',
      message: 'Price must be greater than zero.',
      isFieldError: true,
    });
  } else if (payload.price > 100_000) {
    errors.push({
      field: 'price',
      code: 'OutOfRange',
      message: 'Price must not exceed 100,000.',
      isFieldError: true,
    });
  }

  // Category validation
  const category = payload.category.trim();
  if (category.length === 0) {
    errors.push({
      field: 'category',
      code: 'Required',
      message: 'Category is required.',
      isFieldError: true,
    });
  } else if (!VALID_CATEGORIES.includes(category as (typeof VALID_CATEGORIES)[number])) {
    errors.push({
      field: 'category',
      code: 'InvalidFormat',
      message: `'${category}' is not a recognized category.`,
      isFieldError: true,
    });
  }

  // SKU validation (pattern: XXX-999999)
  const sku = payload.sku.trim();
  if (sku.length > 0) {
    const skuPattern = /^[A-Z]{3}-\d{6}$/;
    if (!skuPattern.test(sku)) {
      errors.push({
        field: 'sku',
        code: 'InvalidFormat',
        message: 'SKU must match the pattern XXX-999999.',
        isFieldError: true,
      });
    }
  }

  // Tags validation
  if (payload.tags.length > 5) {
    errors.push({
      field: 'tags',
      code: 'MaxLength',
      message: 'At most 5 tags are allowed.',
      isFieldError: true,
    });
  }

  return {
    errors,
    isValid: errors.length === 0,
    traceId: 'sim-' + Date.now().toString(36),
  };
}

/** Default empty form payload for initial state. */
export const EMPTY_PRODUCT: ProductFormPayload = {
  name: '',
  price: 0,
  category: '',
  sku: '',
  tags: [],
};
