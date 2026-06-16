import { TestBed } from '@angular/core/testing';
import { DefaultApiErrorState } from './api-error-state';

describe('DefaultApiErrorState', () => {
  let state: DefaultApiErrorState;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    state = new DefaultApiErrorState();
  });

  it('starts with no errors', () => {
    expect(state.errors().length).toBe(0);
    expect(state.hasErrors()).toBe(false);
    expect(state.pageErrors().length).toBe(0);
  });

  it('setErrors replaces all errors', () => {
    state.setErrors({
      isValid: false,
      errors: [
        { field: 'name', code: 'Required', message: 'Name is required.', isFieldError: true },
        { field: '', code: 'BusinessRule', message: 'General error.', isFieldError: false },
      ],
    });

    expect(state.errors().length).toBe(2);
    expect(state.hasErrors()).toBe(true);
  });

  it('clear removes all errors', () => {
    state.setErrors({
      isValid: false,
      errors: [
        { field: 'name', code: 'Required', message: 'Name is required.', isFieldError: true },
      ],
    });

    state.clear();
    expect(state.errors().length).toBe(0);
    expect(state.hasErrors()).toBe(false);
  });

  it('pageErrors returns only model-level errors', () => {
    state.setErrors({
      isValid: false,
      errors: [
        { field: 'name', code: 'Required', message: 'Name is required.', isFieldError: true },
        { field: '', code: 'BusinessRule', message: 'General error.', isFieldError: false },
      ],
    });

    expect(state.pageErrors().length).toBe(1);
    expect(state.pageErrors()[0].code).toBe('BusinessRule');
  });

  it('addError appends a single error', () => {
    state.addError({ field: 'name', code: 'Required', message: 'Name is required.', isFieldError: true });
    expect(state.errors().length).toBe(1);
  });

  it('hasFieldError checks specific field', () => {
    state.setErrors({
      isValid: false,
      errors: [
        { field: 'name', code: 'Required', message: 'Name is required.', isFieldError: true },
      ],
    });

    expect(state.hasFieldError('name')()).toBe(true);
    expect(state.hasFieldError('email')()).toBe(false);
  });
});
