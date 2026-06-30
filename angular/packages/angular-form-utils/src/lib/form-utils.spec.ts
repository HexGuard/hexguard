import { FormControl, FormGroup, FormArray, Validators } from '@angular/forms';
import { JsonPipe } from '@angular/common';
import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { fieldsEqual, fieldsNotEqual, requiredIf, requiresAtLeastOne, uniqueArrayValidator, minArrayLength, maxArrayLength } from './cross-field-validators';
import { injectFormDirtyState } from './form-dirty-state';
import { aggregateFormErrors, asyncFieldValidator, debouncedServerValidator, injectValidator } from './form-errors';
import { injectFormArrayDirtyState, arrayToggleItem, moveArrayItem, syncArrayValues, injectFormArray, injectFormArrayItem } from './form-array';
import type { FormArrayHandle } from './form-array';
import { controlSignal, isControlInvalid, formDiff, formStatusSignal, formSubmitHandler, injectFormField, injectFormSubmission, controlErrorMessages, injectFormControl, injectControlTouched, formPatch } from './form-control-utils';
import type { FormFieldHandle, FormSubmissionHandle } from './form-control-utils';
import { IsInvalidPipe, FormErrorPipe } from './form-pipes';
import { ShowFormErrorDirective } from './form-directives';
import { createControlValueAccessor } from './form-control-value-accessor';

describe('cross-field validators', () => {
  describe('fieldsEqual', () => {
    it('should return null when fields match', () => {
      const group = new FormGroup({ a: new FormControl('x'), b: new FormControl('x') });
      expect(fieldsEqual('a', 'b')(group)).toBeNull();
    });

    it('should return error when fields differ', () => {
      const group = new FormGroup({ a: new FormControl('x'), b: new FormControl('y') });
      const result = fieldsEqual('a', 'b')(group);
      expect(result).not.toBeNull();
      expect(result!['fieldsEqual']).toBeDefined();
    });

    it('should use custom message', () => {
      const group = new FormGroup({ a: new FormControl('x'), b: new FormControl('y') });
      const result = fieldsEqual('a', 'b', 'Must match!')(group);
      expect(result!['fieldsEqual'].message).toBe('Must match!');
    });
  });

  describe('fieldsNotEqual', () => {
    it('should return null when fields differ', () => {
      const group = new FormGroup({ a: new FormControl('x'), b: new FormControl('y') });
      expect(fieldsNotEqual('a', 'b')(group)).toBeNull();
    });

    it('should return error when fields match', () => {
      const group = new FormGroup({ a: new FormControl('x'), b: new FormControl('x') });
      const result = fieldsNotEqual('a', 'b')(group);
      expect(result!['fieldsNotEqual']).toBeDefined();
    });
  });

  describe('requiredIf', () => {
    it('should return null when condition is false', () => {
      const group = new FormGroup({ email: new FormControl('') });
      expect(requiredIf('email', (v) => v !== '')(group)).toBeNull();
    });

    it('should return error when condition is true and field is empty', () => {
      const group = new FormGroup({ email: new FormControl('') });
      const result = requiredIf('email', (v) => v === '')(group);
      expect(result!['requiredIf']).toBeDefined();
    });
  });

  describe('requiresAtLeastOne', () => {
    it('should return null when at least one field has value', () => {
      const group = new FormGroup({ a: new FormControl(''), b: new FormControl('val') });
      expect(requiresAtLeastOne(['a', 'b'])(group)).toBeNull();
    });

    it('should return error when all fields are empty', () => {
      const group = new FormGroup({ a: new FormControl(''), b: new FormControl('') });
      const result = requiresAtLeastOne(['a', 'b'])(group);
      expect(result!['requiresAtLeastOne']).toBeDefined();
    });
  });
});

describe('injectFormDirtyState', () => {
  function setup() {
    @Component({ template: '', standalone: true })
    class TestComponent {
      readonly form = new FormGroup({
        name: new FormControl(''),
        email: new FormControl(''),
      });
      readonly dirty = injectFormDirtyState(this.form);
    }
    const fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();
    return fixture.componentInstance;
  }

  it('should start clean', () => {
    const { dirty } = setup();
    expect(dirty.isDirty()).toBe(false);
  });

  it('should detect when a control becomes dirty', () => {
    const { form, dirty } = setup();
    form.get('name')?.markAsDirty();
    form.get('name')?.setValue('Jane');
    expect(dirty.isDirty()).toBe(true);
    expect(dirty.controlStates()['name']).toBe(true);
  });

  it('should mark control clean', () => {
    const { form, dirty } = setup();
    form.get('name')?.markAsDirty();
    form.get('name')?.setValue('Jane');
    expect(dirty.isDirty()).toBe(true);
    dirty.markControlClean('name');
    expect(dirty.controlStates()['name']).toBe(false);
  });

  it('should reset all dirty states', () => {
    const { form, dirty } = setup();
    form.get('name')?.markAsDirty();
    form.get('email')?.markAsDirty();
    dirty.resetAll();
    expect(dirty.isDirty()).toBe(false);
  });
});

describe('injectFormDirtyState with deeply nested controls', () => {
  function setup() {
    @Component({ template: '', standalone: true })
    class TestComponent {
      readonly form = new FormGroup({
        name: new FormControl(''),
        address: new FormGroup({
          street: new FormControl(''),
          city: new FormControl(''),
        }),
        tags: new FormArray([new FormControl(''), new FormControl('')]),
      });
      readonly dirty = injectFormDirtyState(this.form);
    }
    const fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();
    return fixture.componentInstance;
  }

  it('should detect nested group child dirty', () => {
    const { form, dirty } = setup();
    form.get('address.street')?.markAsDirty();
    form.get('address.street')?.setValue('Main St');
    expect(dirty.isDirty()).toBe(true);
    expect(dirty.controlStates()['address.street']).toBeUndefined();
  });

  it('should detect form array child dirty', () => {
    const { form, dirty } = setup();
    form.get('tags')?.markAsDirty();
    form.get('tags.0')?.setValue('tag1');
    expect(dirty.isDirty()).toBe(true);
  });
});

describe('aggregateFormErrors', () => {
  it('should return empty object for valid form', () => {
    const form = new FormGroup({ name: new FormControl('Jane') });
    expect(aggregateFormErrors(form)).toEqual({});
  });

  it('should collect root-level errors', () => {
    const form = new FormGroup({ name: new FormControl('', [Validators.required]) });
    form.get('name')?.markAsTouched();
    form.updateValueAndValidity();
    const errors = aggregateFormErrors(form);
    expect(errors['name']).toEqual({ required: true });
  });

  it('should collect multiple field errors', () => {
    const form = new FormGroup({
      name: new FormControl('', [Validators.required]),
      email: new FormControl('bad', [Validators.email]),
    });
    form.get('name')?.markAsTouched();
    form.get('email')?.markAsTouched();
    form.updateValueAndValidity();
    const errors = aggregateFormErrors(form);
    expect(errors['name']).toEqual({ required: true });
    expect(errors['email']).toEqual({ email: true });
  });

  it('should collect nested group errors with dotted paths', () => {
    const form = new FormGroup({
      address: new FormGroup({
        street: new FormControl('', [Validators.required]),
        city: new FormControl('NYC'),
      }),
    });
    form.get('address.street')?.markAsTouched();
    form.updateValueAndValidity();
    const errors = aggregateFormErrors(form);
    expect(errors['address.street']).toEqual({ required: true });
    expect(errors['address.city']).toBeUndefined();
  });

  it('should collect root-level cross-field validator errors', () => {
    const form = new FormGroup(
      { pw: new FormControl('abc'), confirm: new FormControl('xyz') },
      { validators: [fieldsEqual('pw', 'confirm')] },
    );
    form.updateValueAndValidity();
    const errors = aggregateFormErrors(form);
    expect(errors['(root)']).toBeDefined();
    expect(errors['(root)']!['fieldsEqual']).toBeDefined();
  });
});

describe('asyncFieldValidator', () => {
  it('should return null when validation passes', async () => {
    const validator = asyncFieldValidator<string>(async () => null);
    const control = new FormControl('ok');
    const result = await validator(control) as Promise<unknown>;
    expect(result).toBeNull();
  });

  it('should return errors when validation fails', async () => {
    const validator = asyncFieldValidator<string>(async (value) =>
      value === 'taken' ? { unique: { message: 'Taken.' } } : null,
    );
    const control = new FormControl('taken');
    const result = await validator(control) as Promise<unknown>;
    expect(result).toEqual({ unique: { message: 'Taken.' } });
  });

  it('should pass the control to the validation function', async () => {
    const validator = asyncFieldValidator<string>(async (_value, control) =>
      control.root === control ? null : { nested: true },
    );
    const control = new FormControl('test');
    const result = await validator(control) as Promise<unknown>;
    expect(result).toBeNull();
  });
});

describe('injectFormArrayDirtyState', () => {
  function setup() {
    @Component({ template: '', standalone: true })
    class TestComponent {
      readonly tags = new FormArray([new FormControl('a', { nonNullable: true }), new FormControl('b', { nonNullable: true })]);
      readonly dirty = injectFormArrayDirtyState(this.tags);
    }
    const fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();
    return fixture.componentInstance;
  }

  it('should start clean', () => {
    const { dirty } = setup();
    expect(dirty.isDirty()).toBe(false);
  });

  it('should detect when an item becomes dirty', () => {
    const { tags, dirty } = setup();
    tags.at(0)?.markAsDirty();
    tags.at(0)?.setValue('x');
    expect(dirty.isDirty()).toBe(true);
    expect(dirty.itemStates()[0]).toBe(true);
    expect(dirty.itemStates()[1]).toBe(false);
  });

  it('should mark an item clean', () => {
    const { tags, dirty } = setup();
    tags.at(0)?.markAsDirty();
    tags.at(0)?.setValue('x');
    dirty.markItemClean(0);
    expect(dirty.itemStates()[0]).toBe(false);
  });

  it('should mark an item dirty', () => {
    const { tags, dirty } = setup();
    dirty.markItemDirty(1);
    expect(dirty.itemStates()[1]).toBe(true);
  });

  it('should reset all dirty states', () => {
    const { tags, dirty } = setup();
    tags.at(0)?.markAsDirty();
    tags.at(1)?.markAsDirty();
    dirty.resetAll();
    expect(dirty.isDirty()).toBe(false);
  });
});

describe('arrayToggleItem', () => {
  it('should add a value not already in the array', () => {
    const array = new FormArray([new FormControl('a', { nonNullable: true })]);
    arrayToggleItem(array, 'b', (v) => new FormControl(v, { nonNullable: true }));
    expect(array.length).toBe(2);
    expect(array.value).toEqual(['a', 'b']);
  });

  it('should remove a value already in the array', () => {
    const array = new FormArray([new FormControl('a', { nonNullable: true }), new FormControl('b', { nonNullable: true })]);
    arrayToggleItem(array, 'a', (v) => new FormControl(v, { nonNullable: true }));
    expect(array.length).toBe(1);
    expect(array.value).toEqual(['b']);
  });

  it('should create a FormControl when no factory is provided', () => {
    const array = new FormArray([new FormControl('a', { nonNullable: true })]);
    arrayToggleItem(array, 'b');
    expect(array.length).toBe(2);
    expect(array.at(1).value).toBe('b');
  });

  it('should toggle the same value twice (add → remove)', () => {
    const array = new FormArray([new FormControl('a', { nonNullable: true })]);
    arrayToggleItem(array, 'b', (v) => new FormControl(v, { nonNullable: true }));
    expect(array.length).toBe(2);
    arrayToggleItem(array, 'b', (v) => new FormControl(v, { nonNullable: true }));
    expect(array.length).toBe(1);
    expect(array.value).toEqual(['a']);
  });
});

describe('moveArrayItem', () => {
  it('should move item forward (lower to higher index)', () => {
    const array = new FormArray([
      new FormControl('a', { nonNullable: true }),
      new FormControl('b', { nonNullable: true }),
      new FormControl('c', { nonNullable: true }),
    ]);
    moveArrayItem(array, 0, 2);
    expect(array.value).toEqual(['b', 'c', 'a']);
  });

  it('should move item backward (higher to lower index)', () => {
    const array = new FormArray([
      new FormControl('a', { nonNullable: true }),
      new FormControl('b', { nonNullable: true }),
      new FormControl('c', { nonNullable: true }),
    ]);
    moveArrayItem(array, 2, 0);
    expect(array.value).toEqual(['c', 'a', 'b']);
  });

  it('should be a no-op when fromIndex equals toIndex', () => {
    const array = new FormArray([
      new FormControl('a', { nonNullable: true }),
      new FormControl('b', { nonNullable: true }),
    ]);
    moveArrayItem(array, 1, 1);
    expect(array.value).toEqual(['a', 'b']);
  });

  it('should be a no-op when indices are out of bounds', () => {
    const array = new FormArray([
      new FormControl('a', { nonNullable: true }),
      new FormControl('b', { nonNullable: true }),
    ]);
    moveArrayItem(array, -1, 1);
    expect(array.value).toEqual(['a', 'b']);
    moveArrayItem(array, 0, 5);
    expect(array.value).toEqual(['a', 'b']);
  });

  it('should preserve dirty state of the moved control', () => {
    const array = new FormArray([
      new FormControl('a', { nonNullable: true }),
      new FormControl('b', { nonNullable: true }),
    ]);
    array.at(0)?.markAsDirty();
    moveArrayItem(array, 0, 1);
    expect(array.at(1).dirty).toBe(true);
  });
});

describe('syncArrayValues', () => {
  it('should add missing values', () => {
    const array = new FormArray([new FormControl('a', { nonNullable: true })]);
    syncArrayValues(array, ['a', 'b', 'c'], (v) => new FormControl(v, { nonNullable: true }));
    expect(array.value).toEqual(['a', 'b', 'c']);
  });

  it('should remove values not in the new set', () => {
    const array = new FormArray([
      new FormControl('a', { nonNullable: true }),
      new FormControl('b', { nonNullable: true }),
      new FormControl('c', { nonNullable: true }),
    ]);
    syncArrayValues(array, ['a', 'c'], (v) => new FormControl(v, { nonNullable: true }));
    expect(array.value).toEqual(['a', 'c']);
  });

  it('should remove and add in one operation', () => {
    const array = new FormArray([
      new FormControl('a', { nonNullable: true }),
      new FormControl('b', { nonNullable: true }),
    ]);
    syncArrayValues(array, ['b', 'c', 'd'], (v) => new FormControl(v, { nonNullable: true }));
    expect(array.value).toEqual(['b', 'c', 'd']);
  });

  it('should preserve existing control when value matches', () => {
    const array = new FormArray([new FormControl('a', { nonNullable: true })]);
    array.at(0)?.markAsDirty();
    syncArrayValues(array, ['a'], (v) => new FormControl(v, { nonNullable: true }));
    // The existing dirty control should be preserved
    expect(array.length).toBe(1);
    expect(array.at(0).dirty).toBe(true);
  });

  it('should order values as given', () => {
    const array = new FormArray([
      new FormControl('c', { nonNullable: true }),
      new FormControl('a', { nonNullable: true }),
      new FormControl('b', { nonNullable: true }),
    ]);
    syncArrayValues(array, ['a', 'b', 'c'], (v) => new FormControl(v, { nonNullable: true }));
    expect(array.value).toEqual(['a', 'b', 'c']);
  });

  it('should create controls without a factory', () => {
    const array = new FormArray([new FormControl('x', { nonNullable: true })]);
    syncArrayValues(array, ['y', 'z']);
    expect(array.length).toBe(2);
    expect(array.at(0).value).toBe('y');
    expect(array.at(1).value).toBe('z');
  });

  it('should handle empty new values by clearing', () => {
    const array = new FormArray([
      new FormControl('a', { nonNullable: true }),
      new FormControl('b', { nonNullable: true }),
    ]);
    syncArrayValues(array, [], (v) => new FormControl(v, { nonNullable: true }));
    expect(array.length).toBe(0);
  });
});

describe('isControlInvalid', () => {
  it('should return false for null/undefined', () => {
    expect(isControlInvalid(null)).toBe(false);
    expect(isControlInvalid(undefined)).toBe(false);
  });

  it('should return false when control is untouched and invalid', () => {
    const ctrl = new FormControl('', [Validators.required]);
    ctrl.updateValueAndValidity();
    expect(isControlInvalid(ctrl)).toBe(false);
  });

  it('should return false when control is touched and valid', () => {
    const ctrl = new FormControl('hello');
    ctrl.markAsTouched();
    expect(isControlInvalid(ctrl)).toBe(false);
  });

  it('should return true when control is touched and invalid', () => {
    const ctrl = new FormControl('', [Validators.required]);
    ctrl.markAsTouched();
    ctrl.updateValueAndValidity();
    expect(isControlInvalid(ctrl)).toBe(true);
  });
});

describe('formDiff', () => {
  it('should return empty object when values are identical', () => {
    const a = { name: 'Alice', age: 30 };
    expect(formDiff(a, { ...a })).toEqual({});
  });

  it('should detect primitive value changes', () => {
    const diff = formDiff({ name: 'Alice', age: 30 }, { name: 'Bob', age: 30 });
    expect(diff).toEqual({ name: 'Bob' });
  });

  it('should detect nested object changes', () => {
    const diff = formDiff(
      { address: { city: 'NYC', zip: '10001' } },
      { address: { city: 'LA', zip: '10001' } },
    );
    expect(diff).toEqual({ address: { city: 'LA' } });
  });

  it('should detect array changes', () => {
    const diff = formDiff({ tags: ['a', 'b'] }, { tags: ['a', 'b', 'c'] });
    expect(diff).toEqual({ tags: ['a', 'b', 'c'] });
  });

  it('should detect added keys', () => {
    const diff = formDiff({ a: 1 } as Record<string, unknown>, { a: 1, b: 2 });
    expect(diff).toEqual({ b: 2 });
  });

  it('should detect removed keys', () => {
    const diff = formDiff({ a: 1, b: 2 } as Record<string, unknown>, { a: 1 });
    expect(diff).toEqual({ b: undefined });
  });

  it('should return empty for null/undefined values that are equal', () => {
    const diff = formDiff({ a: null } as Record<string, unknown>, { a: null });
    expect(diff).toEqual({});
  });
});

describe('controlSignal', () => {
  function setup() {
    @Component({ template: '', standalone: true })
    class TestComponent {
      readonly form = new FormGroup({
        name: new FormControl('Alice', { nonNullable: true }),
        nested: new FormGroup({
          count: new FormControl(0, { nonNullable: true }),
        }),
      });
      readonly nameSignal = controlSignal(this.form, 'name');
      readonly countSignal = controlSignal(this.form, 'nested.count');
    }
    const fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();
    return fixture.componentInstance;
  }

  it('should return initial value', () => {
    const { nameSignal } = setup();
    expect(nameSignal()).toBe('Alice');
  });

  it('should track value changes', () => {
    const { form, nameSignal } = setup();
    form.get('name')?.setValue('Bob');
    expect(nameSignal()).toBe('Bob');
  });

  it('should work with nested paths', () => {
    const { form, countSignal } = setup();
    expect(countSignal()).toBe(0);
    form.get('nested.count')?.setValue(42);
    expect(countSignal()).toBe(42);
  });

  it('should throw for invalid path', () => {
    @Component({ template: '', standalone: true })
    class InvalidComponent {
      readonly form = new FormGroup({ name: new FormControl('') });
      readonly result = (() => {
        try { controlSignal(this.form, 'nonexistent'); return 'no error'; }
        catch (e) { return (e as Error).message; }
      })();
    }
    const fixture = TestBed.createComponent(InvalidComponent);
    fixture.detectChanges();
    expect(fixture.componentInstance.result).toContain('nonexistent');
  });
});

describe('IsInvalidPipe', () => {
  const pipe = new IsInvalidPipe();

  it('should return false for null/undefined', () => {
    expect(pipe.transform(null)).toBe(false);
    expect(pipe.transform(undefined)).toBe(false);
  });

  it('should return false when control is untouched and invalid', () => {
    const ctrl = new FormControl('', [Validators.required]);
    ctrl.updateValueAndValidity();
    expect(pipe.transform(ctrl)).toBe(false);
  });

  it('should return true when control is touched and invalid', () => {
    const ctrl = new FormControl('', [Validators.required]);
    ctrl.markAsTouched();
    ctrl.updateValueAndValidity();
    expect(pipe.transform(ctrl)).toBe(true);
  });
});

describe('FormErrorPipe', () => {
  const pipe = new FormErrorPipe();

  it('should return null for null/undefined', () => {
    expect(pipe.transform(null)).toBeNull();
    expect(pipe.transform(undefined)).toBeNull();
  });

  it('should return null when control has no errors', () => {
    const ctrl = new FormControl('hello');
    expect(pipe.transform(ctrl)).toBeNull();
  });

  it('should return all errors when no error key is given', () => {
    const ctrl = new FormControl('', [Validators.required]);
    ctrl.updateValueAndValidity();
    const errors = pipe.transform(ctrl);
    expect(errors).toEqual({ required: true });
  });

  it('should return specific error when error key is given', () => {
    const ctrl = new FormControl('bad', [Validators.email]);
    ctrl.markAsTouched();
    ctrl.updateValueAndValidity();
    const error = pipe.transform(ctrl, 'email');
    expect(error).toEqual(true);
  });

  it('should return null for a non-matching error key', () => {
    const ctrl = new FormControl('', [Validators.required]);
    ctrl.updateValueAndValidity();
    expect(pipe.transform(ctrl, 'email')).toBeNull();
  });
});

describe('ShowFormErrorDirective', () => {
  @Component({
    template: ` <p *showFormError="control; let errors" data-testid="error-block">{{ errors | json }}</p> `,
    standalone: true,
    imports: [ShowFormErrorDirective, JsonPipe],
  })
  class TestHostComponent {
    readonly control = new FormControl('', [Validators.required]);
  }

  function setup() {
    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
    return fixture;
  }

  it('should not show content when control is valid', () => {
    const fixture = setup();
    fixture.componentInstance.control.setValue('hello');
    fixture.componentInstance.control.markAsTouched();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('[data-testid="error-block"]')).toBeNull();
  });

  it('should show content when control is touched and invalid', () => {
    const fixture = setup();
    fixture.componentInstance.control.markAsTouched();
    fixture.componentInstance.control.updateValueAndValidity();
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector('[data-testid="error-block"]');
    expect(el).not.toBeNull();
    expect(el.textContent).toContain('required');
  });

  it('should hide content when control becomes valid after being invalid', () => {
    const fixture = setup();
    fixture.componentInstance.control.markAsTouched();
    fixture.componentInstance.control.updateValueAndValidity();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('[data-testid="error-block"]')).not.toBeNull();

    fixture.componentInstance.control.setValue('now valid');
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('[data-testid="error-block"]')).toBeNull();
  });
});

describe('formStatusSignal', () => {
  function setup() {
    @Component({ template: '', standalone: true })
    class TestComponent {
      readonly form = new FormGroup({
        name: new FormControl('', [Validators.required]),
      });
      readonly status = formStatusSignal(this.form);
    }
    const fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();
    return fixture.componentInstance;
  }

  it('should return initial status', () => {
    const { status } = setup();
    expect(status()).toBe('INVALID');
  });

  it('should update when form becomes valid', () => {
    const { form, status } = setup();
    form.get('name')?.setValue('Alice');
    expect(status()).toBe('VALID');
  });

  it('should update when form becomes invalid again', () => {
    const { form, status } = setup();
    form.get('name')?.setValue('Alice');
    expect(status()).toBe('VALID');
    form.get('name')?.setValue('');
    form.get('name')?.updateValueAndValidity();
    expect(status()).toBe('INVALID');
  });
});

describe('formSubmitHandler', () => {
  it('should call onValid when form is valid', () => {
    const form = new FormGroup({ name: new FormControl('Alice') });
    const onValid = vi.fn();
    const submit = formSubmitHandler(form, onValid);
    submit();
    expect(onValid).toHaveBeenCalledTimes(1);
  });

  it('should not call onValid when form is invalid', () => {
    const form = new FormGroup({ name: new FormControl('', [Validators.required]) });
    const onValid = vi.fn();
    const submit = formSubmitHandler(form, onValid);
    submit();
    expect(onValid).not.toHaveBeenCalled();
  });

  it('should mark all controls as touched', () => {
    const form = new FormGroup({ name: new FormControl('', [Validators.required]) });
    const submit = formSubmitHandler(form, vi.fn());
    expect(form.get('name')?.touched).toBe(false);
    submit();
    expect(form.get('name')?.touched).toBe(true);
  });

  it('should support async onValid', async () => {
    const form = new FormGroup({ name: new FormControl('Alice') });
    let completed = false;
    const submit = formSubmitHandler(form, async () => {
      await Promise.resolve();
      completed = true;
    });
    submit();
    await Promise.resolve();
    expect(completed).toBe(true);
  });
});

describe('injectFormArray', () => {
  function setup() {
    @Component({ template: '', standalone: true })
    class TestComponent {
      readonly items = injectFormArray<FormControl<string>>(() => [
        new FormControl('a', { nonNullable: true }),
        new FormControl('b', { nonNullable: true }),
      ]);
    }
    const fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();
    return fixture.componentInstance;
  }

  it('should expose initial controls', () => {
    const { items } = setup();
    expect(items.length()).toBe(2);
    expect(items.value()).toEqual(['a', 'b']);
  });

  it('should expose dirty state', () => {
    const { items } = setup();
    expect(items.dirty()).toBe(false);
    items.at(0)?.markAsDirty();
    items.at(0)?.updateValueAndValidity(); // triggers statusChanges on parent
    expect(items.dirty()).toBe(true);
  });

  it('should push a new control', () => {
    const { items } = setup();
    items.push(new FormControl('c', { nonNullable: true }));
    expect(items.length()).toBe(3);
    expect(items.value()).toEqual(['a', 'b', 'c']);
  });

  it('should remove a control at index', () => {
    const { items } = setup();
    items.remove(0);
    expect(items.length()).toBe(1);
    expect(items.value()).toEqual(['b']);
  });

  it('should insert a control at index', () => {
    const { items } = setup();
    items.insert(1, new FormControl('x', { nonNullable: true }));
    expect(items.value()).toEqual(['a', 'x', 'b']);
  });

  it('should move a control', () => {
    const { items } = setup();
    items.move(0, 1);
    expect(items.value()).toEqual(['b', 'a']);
  });

  it('should swap two controls', () => {
    const { items } = setup();
    items.push(new FormControl('c', { nonNullable: true }));
    items.swap(0, 2);
    expect(items.value()).toEqual(['c', 'b', 'a']);
  });

  it('should clear all controls', () => {
    const { items } = setup();
    items.clear();
    expect(items.length()).toBe(0);
  });

  it('should reset values to initial', () => {
    const { items } = setup();
    items.at(0)?.setValue('x');
    items.at(1)?.setValue('y');
    expect(items.value()).toEqual(['x', 'y']);
    items.reset();
    expect(items.value()).toEqual(['a', 'b']);
  });

  it('should get control at index', () => {
    const { items } = setup();
    expect(items.at(0)?.value).toBe('a');
    expect(items.at(99)).toBeUndefined();
  });
});

describe('injectFormField', () => {
  function setup() {
    @Component({ template: '', standalone: true })
    class TestComponent {
      readonly form = new FormGroup({
        name: new FormControl('Alice', { nonNullable: true }),
        email: new FormControl('', [Validators.required, Validators.email]),
      });
      readonly name = injectFormField<string>(this.form, 'name');
      readonly email = injectFormField<string>(this.form, 'email');
    }
    const fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();
    return fixture.componentInstance;
  }

  it('should return initial value', () => {
    const { name } = setup();
    expect(name.value()).toBe('Alice');
  });

  it('should track value changes', () => {
    const { form, name } = setup();
    form.get('name')?.setValue('Bob');
    expect(name.value()).toBe('Bob');
  });

  it('should set value via setValue', () => {
    const { form, name } = setup();
    name.setValue('Charlie');
    expect(form.get('name')?.value).toBe('Charlie');
    expect(name.value()).toBe('Charlie');
  });

  it('should track invalid state', () => {
    const { email } = setup();
    expect(email.isInvalid()).toBe(false);
    email.markAsTouched();
    expect(email.isInvalid()).toBe(true);
  });

  it('should track errors', () => {
    const { email } = setup();
    email.markAsTouched();
    expect(email.errors()).not.toBeNull();
    expect(email.errors()!['required']).toBe(true);
  });

  it('should track dirty state', () => {
    const { form, name } = setup();
    expect(name.isDirty()).toBe(false);
    form.get('name')?.markAsDirty();
    form.get('name')?.updateValueAndValidity();
    expect(name.isDirty()).toBe(true);
  });

  it('should throw for invalid path', () => {
    expect(() => {
      @Component({ template: '', standalone: true })
      class InvalidComponent {
        readonly form = new FormGroup({ x: new FormControl('') });
        readonly f = injectFormField(this.form, 'nonexistent');
      }
      const fixture = TestBed.createComponent(InvalidComponent);
      fixture.detectChanges();
    }).toThrow(/nonexistent/);
  });
});

describe('injectFormSubmission', () => {
  function setup() {
    @Component({ template: '', standalone: true })
    class TestComponent {
      readonly form = new FormGroup({
        name: new FormControl('Alice', [Validators.required]),
      });
      readonly sub = injectFormSubmission(this.form, async () => {
        await Promise.resolve();
      });
    }
    const fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();
    return fixture.componentInstance;
  }

  it('should start not submitting', () => {
    const { sub } = setup();
    expect(sub.submitting()).toBe(false);
  });

  it('should submit and complete', async () => {
    const { sub } = setup();
    await sub.submit();
    expect(sub.submitting()).toBe(false);
  });

  it('should not submit when form is invalid', async () => {
    @Component({ template: '', standalone: true })
    class InvalidComponent {
      readonly form = new FormGroup({
        name: new FormControl('', [Validators.required]),
      });
      readonly sub = injectFormSubmission(this.form, async () => {
        await Promise.resolve();
      });
    }
    const fixture = TestBed.createComponent(InvalidComponent);
    fixture.detectChanges();
    const { sub } = fixture.componentInstance;
    await sub.submit();
    expect(sub.submitting()).toBe(false);
  });

  it('should prevent double submit', async () => {
    let callCount = 0;
    @Component({ template: '', standalone: true })
    class DoubleComponent {
      readonly form = new FormGroup({
        name: new FormControl('Alice', [Validators.required]),
      });
      readonly sub = injectFormSubmission(this.form, async () => {
        callCount++;
        await new Promise((r) => setTimeout(r, 100));
      });
    }
    const fixture = TestBed.createComponent(DoubleComponent);
    fixture.detectChanges();
    const { sub } = fixture.componentInstance;
    // Start two submits — second should be no-op
    const p1 = sub.submit();
    const p2 = sub.submit();
    await Promise.all([p1, p2]);
    expect(callCount).toBe(1);
  });

  it('should capture error on submit failure', async () => {
    @Component({ template: '', standalone: true })
    class ErrorComponent {
      readonly form = new FormGroup({
        name: new FormControl('Alice', [Validators.required]),
      });
      readonly sub = injectFormSubmission(this.form, async () => {
        throw new Error('Submit failed');
      });
    }
    const fixture = TestBed.createComponent(ErrorComponent);
    fixture.detectChanges();
    const { sub } = fixture.componentInstance;
    await expect(sub.submit()).rejects.toThrow('Submit failed');
    expect(sub.error()).toBeTruthy();
    expect(sub.submitting()).toBe(false);
  });
});

describe('debouncedServerValidator', () => {
  it('should return null for valid value', async () => {
    const validator = debouncedServerValidator<string>(async () => null, 0);
    const ctrl = new FormControl('ok');
    const result = await validator(ctrl);
    expect(result).toBeNull();
  });

  it('should return errors for invalid value', async () => {
    const validator = debouncedServerValidator<string>(async (v: string) =>
      v === 'taken' ? { taken: true } : null, 0);
    const ctrl = new FormControl('taken');
    const result = await validator(ctrl);
    expect(result).toEqual({ taken: true });
  });
});

describe('injectValidator', () => {
  it('should return null when validation passes', () => {
    const v = injectValidator<string>((value) => value === 'ok' ? null : { notOk: true });
    const ctrl = new FormControl('ok');
    expect(v.validate(ctrl)).toBeNull();
  });

  it('should return errors when validation fails', () => {
    const v = injectValidator<string>((value) => value === 'ok' ? null : { notOk: true });
    const ctrl = new FormControl('bad');
    const result = v.validate(ctrl);
    expect(result).toEqual({ notOk: true });
  });

  it('should include async validator when provided', async () => {
    const v = injectValidator<string>(
      () => null,
      async (value) => value === 'taken' ? { taken: true } : null,
    );
    expect(v.asyncValidator).toBeDefined();
    const ctrl = new FormControl('taken');
    const result = await v.asyncValidator!(ctrl);
    expect(result).toEqual({ taken: true });
  });

  it('should provide NG_VALIDATORS provider', () => {
    const v = injectValidator<string>(() => null);
    expect(v.providers.length).toBeGreaterThan(0);
  });
});

describe('controlErrorMessages', () => {
  it('should return empty array for valid control', () => {
    const ctrl = new FormControl('hello');
    const msgs = controlErrorMessages(ctrl, { required: 'Required.' });
    expect(msgs()).toEqual([]);
  });

  it('should return messages for active errors', () => {
    const ctrl = new FormControl('', [Validators.required]);
    ctrl.markAsTouched();
    ctrl.updateValueAndValidity();
    const msgs = controlErrorMessages(ctrl, { required: 'Required.' });
    expect(msgs()).toEqual(['Required.']);
  });

  it('should support function messages', () => {
    const ctrl = new FormControl('', [Validators.minLength(5)]);
    ctrl.markAsTouched();
    ctrl.setValue('ab');
    ctrl.updateValueAndValidity();
    const msgs = controlErrorMessages(ctrl, {
      minlength: (err: any) => `Need at least ${err.requiredLength} chars.`,
    });
    expect(msgs()).toContain('Need at least 5 chars.');
  });

  it('should update reactively', () => {
    const ctrl = new FormControl('', [Validators.required]);
    ctrl.markAsTouched();
    ctrl.updateValueAndValidity();
    const msgs = controlErrorMessages(ctrl, { required: 'Required.' });
    expect(msgs()).toEqual(['Required.']);
    ctrl.setValue('ok');
    ctrl.updateValueAndValidity();
    expect(msgs()).toEqual([]);
  });
});

describe('injectFormArrayItem', () => {
  function setup() {
    const array = new FormArray([
      new FormControl('a', { nonNullable: true }),
      new FormControl('b', { nonNullable: true }),
      new FormControl('c', { nonNullable: true }),
    ]);
    return { array };
  }

  it('should provide index', () => {
    const { array } = setup();
    TestBed.runInInjectionContext(() => {
      const item = injectFormArrayItem(array, 0);
      expect(item.index()).toBe(0);
    });
  });

  it('should detect first and last', () => {
    const { array } = setup();
    TestBed.runInInjectionContext(() => {
      const first = injectFormArrayItem(array, 0);
      expect(first.isFirst()).toBe(true);
      expect(first.isLast()).toBe(false);
      const last = injectFormArrayItem(array, 2);
      expect(last.isFirst()).toBe(false);
      expect(last.isLast()).toBe(true);
    });
  });

  it('should remove self', () => {
    const { array } = setup();
    TestBed.runInInjectionContext(() => {
      const item = injectFormArrayItem(array, 1);
      expect(array.length).toBe(3);
      item.removeSelf();
      expect(array.length).toBe(2);
      expect(array.value).toEqual(['a', 'c']);
    });
  });

  it('should move up', () => {
    const { array } = setup();
    TestBed.runInInjectionContext(() => {
      const item = injectFormArrayItem(array, 2);
      item.moveUp();
      expect(array.value).toEqual(['a', 'c', 'b']);
    });
  });

  it('should move down', () => {
    const { array } = setup();
    TestBed.runInInjectionContext(() => {
      const item = injectFormArrayItem(array, 0);
      item.moveDown();
      expect(array.value).toEqual(['b', 'a', 'c']);
    });
  });

  it('should no-op moveUp on first item', () => {
    const { array } = setup();
    TestBed.runInInjectionContext(() => {
      const item = injectFormArrayItem(array, 0);
      item.moveUp();
      expect(array.value).toEqual(['a', 'b', 'c']);
    });
  });

  it('should no-op moveDown on last item', () => {
    const { array } = setup();
    TestBed.runInInjectionContext(() => {
      const item = injectFormArrayItem(array, 2);
      item.moveDown();
      expect(array.value).toEqual(['a', 'b', 'c']);
    });
  });
});

describe('createControlValueAccessor', () => {
  it('should start with initial value', () => {
    TestBed.runInInjectionContext(() => {
      const cva = createControlValueAccessor('hello');
      expect(cva.value()).toBe('hello');
      expect(cva.touched()).toBe(false);
      expect(cva.disabled()).toBe(false);
    });
  });

  it('should update value on onChange', () => {
    TestBed.runInInjectionContext(() => {
      const cva = createControlValueAccessor('');
      cva.onChange('world');
      expect(cva.value()).toBe('world');
    });
  });

  it('should mark touched on onTouched', () => {
    TestBed.runInInjectionContext(() => {
      const cva = createControlValueAccessor('');
      expect(cva.touched()).toBe(false);
      cva.onTouched();
      expect(cva.touched()).toBe(true);
    });
  });

  it('should support writeValue from Angular forms', () => {
    TestBed.runInInjectionContext(() => {
      const cva = createControlValueAccessor('');
      cva.writeValue('from-forms');
      expect(cva.value()).toBe('from-forms');
    });
  });

  it('should support setDisabledState', () => {
    TestBed.runInInjectionContext(() => {
      const cva = createControlValueAccessor('');
      expect(cva.disabled()).toBe(false);
      cva.setDisabledState(true);
      expect(cva.disabled()).toBe(true);
    });
  });

  it('should call onChange callback on value change', () => {
    TestBed.runInInjectionContext(() => {
      const cva = createControlValueAccessor('');
      let called = false;
      cva.registerOnChange(() => { called = true; });
      cva.onChange('test');
      expect(called).toBe(true);
    });
  });

  it('should call onTouched callback', () => {
    TestBed.runInInjectionContext(() => {
      const cva = createControlValueAccessor('');
      let called = false;
      cva.registerOnTouched(() => { called = true; });
      cva.onTouched();
      expect(called).toBe(true);
    });
  });
});

describe('uniqueArrayValidator', () => {
  it('should return null for unique values', () => {
    const array = new FormArray([new FormControl('a'), new FormControl('b')]);
    expect(uniqueArrayValidator()(array)).toBeNull();
  });

  it('should return error for duplicate values', () => {
    const array = new FormArray([new FormControl('a'), new FormControl('a')]);
    const result = uniqueArrayValidator()(array);
    expect(result).not.toBeNull();
    expect(result!['uniqueArray']).toBeDefined();
    expect(result!['uniqueArray'].duplicate).toBe('a');
  });

  it('should return null for non-FormArray controls', () => {
    const ctrl = new FormControl('test');
    expect(uniqueArrayValidator()(ctrl)).toBeNull();
  });
});

describe('minArrayLength', () => {
  it('should return null when array has enough items', () => {
    const array = new FormArray([new FormControl('a'), new FormControl('b')]);
    expect(minArrayLength(2)(array)).toBeNull();
  });

  it('should return error when array has too few items', () => {
    const array = new FormArray([new FormControl('a')]);
    const result = minArrayLength(2)(array);
    expect(result).not.toBeNull();
    expect(result!['minArrayLength']).toBeDefined();
  });

  it('should return null for non-FormArray controls', () => {
    const ctrl = new FormControl('test');
    expect(minArrayLength(2)(ctrl)).toBeNull();
  });
});

describe('maxArrayLength', () => {
  it('should return null when array is within limit', () => {
    const array = new FormArray([new FormControl('a')]);
    expect(maxArrayLength(2)(array)).toBeNull();
  });

  it('should return error when array exceeds limit', () => {
    const array = new FormArray([new FormControl('a'), new FormControl('b'), new FormControl('c')]);
    const result = maxArrayLength(2)(array);
    expect(result).not.toBeNull();
    expect(result!['maxArrayLength']).toBeDefined();
    expect(result!['maxArrayLength'].max).toBe(2);
  });

  it('should return null for non-FormArray controls', () => {
    const ctrl = new FormControl('test');
    expect(maxArrayLength(2)(ctrl)).toBeNull();
  });
});

describe('injectFormControl', () => {
  it('should wrap a FormControl directly', () => {
    TestBed.runInInjectionContext(() => {
      const ctrl = new FormControl('hello');
      const field = injectFormControl(ctrl);
      expect(field.value()).toBe('hello');
      field.setValue('world');
      expect(ctrl.value).toBe('world');
    });
  });
});

describe('injectControlTouched', () => {
  it('should track touched state', () => {
    TestBed.runInInjectionContext(() => {
      const ctrl = new FormControl('');
      const touched = injectControlTouched(ctrl);
      expect(touched()).toBe(false);
      ctrl.markAsTouched();
      ctrl.updateValueAndValidity();
      expect(touched()).toBe(true);
    });
  });
});

describe('formPatch', () => {
  it('should patch values on a form group', () => {
    const form = new FormGroup({
      name: new FormControl(''),
      email: new FormControl(''),
    });
    formPatch(form, { name: 'Alice' });
    expect(form.value).toEqual({ name: 'Alice', email: '' });
  });
});
