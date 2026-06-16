/**
 * Common validation error codes used across HexGuard API error contracts.
 * Mirrors the .NET `HexGuard.ValidationContracts.ValidationErrorCode` constants.
 */
export const ApiErrorCode = {
  /** A required field was missing or empty. */
  Required: 'Required',
  /** The value does not match the expected format (email, phone, pattern, etc.). */
  InvalidFormat: 'InvalidFormat',
  /** The value is outside the allowed range (min, max, length, etc.). */
  OutOfRange: 'OutOfRange',
  /** A duplicate value was detected where uniqueness is required. */
  Duplicate: 'Duplicate',
  /** The value does not match a related field (password confirmation, etc.). */
  Mismatch: 'Mismatch',
  /** The referenced entity does not exist. */
  NotFound: 'NotFound',
  /** The value is already in use or conflicts with existing data. */
  Conflict: 'Conflict',
  /** The value exceeds the maximum allowed length. */
  MaxLength: 'MaxLength',
  /** The value is shorter than the minimum allowed length. */
  MinLength: 'MinLength',
  /** The value contains prohibited characters or content. */
  ProhibitedValue: 'ProhibitedValue',
  /** A business rule validation failed. */
  BusinessRule: 'BusinessRule',
} as const;

export type ApiErrorCode = (typeof ApiErrorCode)[keyof typeof ApiErrorCode];
