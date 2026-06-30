import { FormControl, FormGroup, FormArray, Validators } from '@angular/forms';
import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { fieldsEqual, fieldsNotEqual, requiredIf, requiresAtLeastOne } from './cross-field-validators';
import { injectFormDirtyState } from './form-dirty-state';
import { aggregateFormErrors, asyncFieldValidator } from './form-errors';
import { injectFormArrayDirtyState, arrayToggleItem, moveArrayItem, syncArrayValues } from './form-array';

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
