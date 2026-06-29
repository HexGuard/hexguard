import { FormControl, FormGroup } from '@angular/forms';
import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { fieldsEqual, fieldsNotEqual, requiredIf, requiresAtLeastOne } from './cross-field-validators';
import { injectFormDirtyState } from './form-dirty-state';

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
