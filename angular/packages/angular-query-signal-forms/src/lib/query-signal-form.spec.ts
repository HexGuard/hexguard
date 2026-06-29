import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { querySignalForm } from './query-signal-form';
import { stringParam, numberParam, enumParam } from '@hexguard/angular-url-state';

describe('querySignalForm', () => {
  const TEST_SCHEMA = {
    search: stringParam(''),
    page: numberParam(1),
    status: enumParam(['all', 'open', 'closed'] as const, 'all'),
  };

  function setup(
    options?: Parameters<typeof querySignalForm<typeof TEST_SCHEMA>>[1],
  ) {
    @Component({ template: '', standalone: true })
    class TestComponent {
      readonly query = querySignalForm(TEST_SCHEMA, options);
    }

    TestBed.configureTestingModule({
      providers: [provideRouter([])],
    });

    const fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();
    return fixture.componentInstance.query;
  }

  it('should create with default values', () => {
    const q = setup();
    expect(q.snapshot()).toEqual({ search: '', page: 1, status: 'all' });
  });

  it('should patch values', () => {
    const q = setup();
    q.patch({ search: 'test', page: 2 });
    expect(q.snapshot().search).toBe('test');
    expect(q.snapshot().page).toBe(2);
  });

  it('should reset to defaults', () => {
    const q = setup();
    q.patch({ search: 'test', page: 5 });
    q.reset();
    expect(q.snapshot()).toEqual({ search: '', page: 1, status: 'all' });
  });

  it('should apply resetKeysOnChange rules', () => {
    const q = setup({
      resetKeysOnChange: { search: ['page'], status: ['page'] },
    });
    q.patch({ search: 'query', page: 3 });
    q.patch({ search: 'new-query' }); // should reset page to 1
    expect(q.snapshot().page).toBe(1);
  });

  it('should have hasPendingChanges in manual mode', () => {
    const q = setup({ syncMode: 'manual' });
    expect(q.hasPendingChanges()).toBe(false);
    q.patch({ search: 'test' });
    expect(q.hasPendingChanges()).toBe(true);
  });

  it('should commit staged changes in manual mode', () => {
    const q = setup({ syncMode: 'manual' });
    q.patch({ search: 'test', page: 2 });
    expect(q.hasPendingChanges()).toBe(true);
    q.commit();
    expect(q.hasPendingChanges()).toBe(false);
    expect(q.snapshot().search).toBe('test');
  });

  it('should revert staged changes in manual mode', () => {
    const q = setup({ syncMode: 'manual' });
    q.patch({ search: 'test2' });
    q.revert();
    expect(q.hasPendingChanges()).toBe(false);
    expect(q.snapshot().search).toBe('');
  });

  it('should provide urlState access', () => {
    const q = setup();
    expect(q.urlState).toBeDefined();
    expect(typeof q.urlState.patch).toBe('function');
  });
});
