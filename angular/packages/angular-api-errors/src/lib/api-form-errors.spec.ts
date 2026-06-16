import { FormControl, FormGroup, Validators } from '@angular/forms';
import { apiFormErrors } from './api-form-errors';

describe('apiFormErrors', () => {
  it('sets errors on matching form controls', () => {
    const form = new FormGroup({
      name: new FormControl(''),
      email: new FormControl(''),
    });

    const result = {
      isValid: false,
      errors: [
        { field: 'name', code: 'Required', message: 'Name is required.', isFieldError: true },
        { field: 'email', code: 'InvalidFormat', message: 'Invalid email.', isFieldError: true },
      ],
    };

    const pageErrors = apiFormErrors(form, result);
    expect(pageErrors.length).toBe(0);
    expect(form.get('name')!.errors).toEqual({ Required: 'Name is required.' });
    expect(form.get('email')!.errors).toEqual({ InvalidFormat: 'Invalid email.' });
  });

  it('returns unmatched errors as page errors', () => {
    const form = new FormGroup({
      name: new FormControl(''),
    });

    const result = {
      isValid: false,
      errors: [
        { field: 'name', code: 'Required', message: 'Name is required.', isFieldError: true },
        { field: '', code: 'BusinessRule', message: 'General failure.', isFieldError: false },
        { field: 'nonexistent', code: 'InvalidFormat', message: 'No matching control.', isFieldError: true },
      ],
    };

    const pageErrors = apiFormErrors(form, result);
    expect(pageErrors.length).toBe(2);
    expect(pageErrors[0].code).toBe('BusinessRule');
    expect(pageErrors[1].field).toBe('nonexistent');
  });

  it('marks controls as touched', () => {
    const form = new FormGroup({
      name: new FormControl(''),
    });

    const result = {
      isValid: false,
      errors: [
        { field: 'name', code: 'Required', message: 'Name is required.', isFieldError: true },
      ],
    };

    apiFormErrors(form, result);
    expect(form.get('name')!.touched).toBe(true);
  });

  it('uses custom setControlError when provided', () => {
    const form = new FormGroup({
      name: new FormControl(''),
    });

    const result = {
      isValid: false,
      errors: [
        { field: 'name', code: 'Required', message: 'Name is required.', isFieldError: true },
      ],
    };

    const customErrors: Array<{ field: string; code: string }> = [];
    const pageErrors = apiFormErrors(form, result, (control, error) => {
      customErrors.push({ field: error.field, code: error.code });
    });

    expect(pageErrors.length).toBe(0);
    expect(customErrors.length).toBe(1);
    expect(customErrors[0].field).toBe('name');
  });
});
