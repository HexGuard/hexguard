/** Error thrown when a query-form schema key has no matching top-level form control. */
export class QueryFormControlMissingError extends Error {
  override readonly name = 'QueryFormControlMissingError';

  constructor(readonly key: string) {
    super(
      `queryForm expected a top-level Reactive Forms control named "${key}" because it is declared in the URL-state schema.`,
    );
  }
}

/** Error thrown when managedKeys references a key outside the schema or duplicates one. */
export class QueryFormManagedKeyError extends Error {
  override readonly name = 'QueryFormManagedKeyError';

  constructor(
    readonly key: string,
    message = `queryForm managedKeys references "${key}", but it is not in the schema.`,
  ) {
    super(message);
  }
}

/** Error thrown when reset-on-change options reference a key outside the schema. */
export class QueryFormResetKeyError extends Error {
  override readonly name = 'QueryFormResetKeyError';

  constructor(
    readonly key: string,
    message = `queryForm resetKeysOnChange references "${key}", but it is not in the schema.`,
  ) {
    super(message);
  }
}
