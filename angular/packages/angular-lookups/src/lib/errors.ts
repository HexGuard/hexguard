/** Raised when a lookup catalog payload violates the documented contract. */
export class LookupCatalogValidationError extends Error {
  readonly errors: readonly string[];

  constructor(errors: readonly string[]) {
    super(
      errors.length === 0
        ? 'Lookup catalog validation failed.'
        : `Lookup catalog validation failed: ${errors.join(' ')}`,
    );

    this.name = 'LookupCatalogValidationError';
    this.errors = errors;
  }
}
