import { TestBed } from '@angular/core/testing';
import { ApiErrorParser, provideHexGuardApiErrors } from './api-error-parser';

describe('ApiErrorParser', () => {
  let parser: ApiErrorParser;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHexGuardApiErrors()],
    });
    parser = TestBed.inject(ApiErrorParser);
  });

  describe('parseProblemDetails', () => {
    it('returns valid result for non-object body', () => {
      const result = parser.parseProblemDetails(null);
      expect(result.isValid).toBe(true);
      expect(result.errors.length).toBe(0);
    });

    it('parses errors from the errors extension', () => {
      const body = {
        type: 'https://example.com/validation-error',
        title: 'Validation failed',
        status: 400,
        errors: [
          { field: 'name', code: 'Required', message: 'Name is required.' },
          { field: 'email', code: 'InvalidFormat', message: 'Invalid email.' },
        ],
      };

      const result = parser.parseProblemDetails(body);
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBe(2);
      expect(result.errors[0].field).toBe('name');
      expect(result.errors[0].code).toBe('Required');
      expect(result.errors[1].isFieldError).toBe(true);
    });

    it('creates model-level error from title when no errors extension', () => {
      const body = {
        type: 'about:blank',
        title: 'Not Found',
        status: 404,
        detail: 'The requested resource was not found.',
      };

      const result = parser.parseProblemDetails(body);
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBe(1);
      expect(result.errors[0].code).toBe('ProblemDetails');
      expect(result.errors[0].isFieldError).toBe(false);
    });

    it('preserves traceId', () => {
      const body = {
        type: 'about:blank',
        title: 'Error',
        status: 400,
        traceId: 'trace-abc-123',
        errors: [],
      };

      const result = parser.parseProblemDetails(body);
      expect(result.traceId).toBe('trace-abc-123');
    });
  });

  describe('parseValidationErrors', () => {
    it('parses simple errors array', () => {
      const body = {
        errors: [{ field: 'name', code: 'Required', message: 'Name is required.' }],
      };

      const result = parser.parseValidationErrors(body);
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBe(1);
    });

    it('returns valid for non-object body', () => {
      const result = parser.parseValidationErrors('not-an-object');
      expect(result.isValid).toBe(true);
    });

    it('returns valid for missing errors field', () => {
      const result = parser.parseValidationErrors({});
      expect(result.isValid).toBe(true);
    });
  });

  describe('extractFieldError', () => {
    it('returns matching error', () => {
      const result = {
        isValid: false,
        errors: [
          { field: 'name', code: 'Required', message: 'Name is required.', isFieldError: true },
          { field: 'email', code: 'InvalidFormat', message: 'Invalid email.', isFieldError: true },
        ],
      };

      const error = parser.extractFieldError(result, 'name');
      expect(error).not.toBeNull();
      expect(error!.code).toBe('Required');
    });

    it('returns null when no match', () => {
      const result = {
        isValid: true,
        errors: [
          { field: 'name', code: 'Required', message: 'Name is required.', isFieldError: true },
        ],
      };

      const error = parser.extractFieldError(result, 'email');
      expect(error).toBeNull();
    });
  });

  describe('extractPageErrors', () => {
    it('returns only model-level errors', () => {
      const result = {
        isValid: false,
        errors: [
          { field: 'name', code: 'Required', message: 'Name is required.', isFieldError: true },
          { field: '', code: 'BusinessRule', message: 'General error.', isFieldError: false },
        ],
      };

      const pageErrors = parser.extractPageErrors(result);
      expect(pageErrors.length).toBe(1);
      expect(pageErrors[0].code).toBe('BusinessRule');
    });
  });

  describe('errorsForField', () => {
    it('returns all errors for a field', () => {
      const result = {
        isValid: false,
        errors: [
          { field: 'name', code: 'Required', message: 'Required.', isFieldError: true },
          { field: 'name', code: 'MaxLength', message: 'Too long.', isFieldError: true },
          { field: 'email', code: 'InvalidFormat', message: 'Invalid.', isFieldError: true },
        ],
      };

      const nameErrors = parser.errorsForField(result, 'name');
      expect(nameErrors.length).toBe(2);
    });
  });

  describe('errorsForFieldPrefix', () => {
    it('returns errors matching prefix', () => {
      const result = {
        isValid: false,
        errors: [
          { field: 'items.0.name', code: 'Required', message: 'Required.', isFieldError: true },
          {
            field: 'items.0.price',
            code: 'OutOfRange',
            message: 'Out of range.',
            isFieldError: true,
          },
          { field: 'items.1.name', code: 'Required', message: 'Required.', isFieldError: true },
          { field: 'name', code: 'Required', message: 'Required.', isFieldError: true },
        ],
      };

      const itemErrors = parser.errorsForFieldPrefix(result, 'items');
      expect(itemErrors.length).toBe(3);
    });
  });
});
