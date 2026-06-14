import { Location } from '@angular/common';
import { provideLocationMocks, type SpyLocation } from '@angular/common/testing';
import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { TestBed } from '@angular/core/testing';
import { provideRouter, type Routes } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';

import {
  QueryFormControlMissingError,
  QueryFormManagedKeyError,
  QueryFormResetKeyError,
  arrayParam,
  enumParam,
  numberParam,
  provideHexGuardUrlState,
  queryForm,
  stringParam,
} from '../public-api';

const statusOptions = ['open', 'closed', 'archived'] as const;

const ordersSchema = {
  search: stringParam(''),
  page: numberParam(1),
  status: enumParam(statusOptions, 'open'),
  tags: arrayParam(stringParam()),
};

const remappedOrdersSchema = {
  search: { codec: stringParam(''), queryKey: 'q' },
  page: { codec: numberParam(1), queryKey: 'p' },
  status: { codec: enumParam(statusOptions, 'open'), queryKey: 'status' },
  tags: { codec: arrayParam(stringParam()), queryKey: 'tag' },
};

function createOrdersForm(): FormGroup<{
  search: FormControl<string>;
  page: FormControl<number>;
  status: FormControl<(typeof statusOptions)[number]>;
  tags: FormControl<string[]>;
}> {
  return new FormGroup({
    search: new FormControl('', { nonNullable: true }),
    page: new FormControl(1, { nonNullable: true }),
    status: new FormControl<(typeof statusOptions)[number]>('open', { nonNullable: true }),
    tags: new FormControl<string[]>([], { nonNullable: true }),
  });
}

function createSubsetOrdersForm(): FormGroup<{
  search: FormControl<string>;
  status: FormControl<(typeof statusOptions)[number]>;
  tags: FormControl<string[]>;
}> {
  return new FormGroup({
    search: new FormControl('', { nonNullable: true }),
    status: new FormControl<(typeof statusOptions)[number]>('open', { nonNullable: true }),
    tags: new FormControl<string[]>([], { nonNullable: true }),
  });
}

@Component({
  standalone: true,
  selector: 'hexguard-query-orders-page',
  template: '',
})
class QueryOrdersPageComponent {
  readonly form = createOrdersForm();
  readonly query = queryForm(this.form, ordersSchema, {
    resetKeysOnChange: {
      search: ['page'],
      status: ['page'],
      tags: ['page'],
    },
  });
}

@Component({
  standalone: true,
  selector: 'hexguard-debounced-query-orders-page',
  template: '',
})
class DebouncedQueryOrdersPageComponent {
  readonly form = createOrdersForm();
  readonly query = queryForm(this.form, ordersSchema, { debounceMs: 30 });
}

@Component({
  standalone: true,
  selector: 'hexguard-push-query-orders-page',
  template: '',
})
class PushQueryOrdersPageComponent {
  readonly form = createOrdersForm();
  readonly query = queryForm(this.form, ordersSchema, { history: 'push' });
}

@Component({
  standalone: true,
  selector: 'hexguard-subset-query-orders-page',
  template: '',
})
class SubsetQueryOrdersPageComponent {
  readonly form = createSubsetOrdersForm();
  readonly query = queryForm(this.form, ordersSchema, {
    managedKeys: ['search', 'status', 'tags'],
    resetKeysOnChange: {
      search: ['page'],
      status: ['page'],
      tags: ['page'],
    },
  });
}

@Component({
  standalone: true,
  selector: 'hexguard-manual-query-orders-page',
  template: '',
})
class ManualQueryOrdersPageComponent {
  readonly form = createOrdersForm();
  readonly query = queryForm(this.form, ordersSchema, {
    syncMode: 'manual',
    resetKeysOnChange: {
      search: ['page'],
      status: ['page'],
      tags: ['page'],
    },
  });
}

@Component({
  standalone: true,
  selector: 'hexguard-remapped-query-orders-page',
  template: '',
})
class RemappedQueryOrdersPageComponent {
  readonly form = createOrdersForm();
  readonly query = queryForm(this.form, remappedOrdersSchema, {
    resetKeysOnChange: {
      search: ['page'],
      status: ['page'],
      tags: ['page'],
    },
  });
}

@Component({
  standalone: true,
  selector: 'hexguard-remove-invalid-query-orders-page',
  template: '',
})
class RemoveInvalidQueryOrdersPageComponent {
  readonly form = createOrdersForm();
  readonly query = queryForm(this.form, ordersSchema, { invalidParamBehavior: 'removeInvalid' });
}

@Component({
  standalone: true,
  selector: 'hexguard-missing-control-page',
  template: '',
})
class MissingControlPageComponent {
  readonly form = new FormGroup({
    search: new FormControl('', { nonNullable: true }),
  });
  readonly query = queryForm(this.form, ordersSchema);
}

@Component({
  standalone: true,
  selector: 'hexguard-invalid-reset-key-page',
  template: '',
})
class InvalidResetKeyPageComponent {
  readonly form = createOrdersForm();
  readonly query = queryForm(this.form, ordersSchema, {
    resetKeysOnChange: {
      search: ['missing' as never],
    },
  });
}

@Component({
  standalone: true,
  selector: 'hexguard-invalid-managed-key-page',
  template: '',
})
class InvalidManagedKeyPageComponent {
  readonly form = createOrdersForm();
  readonly query = queryForm(this.form, ordersSchema, {
    managedKeys: ['search', 'missing' as never],
  });
}

@Component({
  standalone: true,
  selector: 'hexguard-unmanaged-reset-source-page',
  template: '',
})
class UnmanagedResetSourcePageComponent {
  readonly form = createSubsetOrdersForm();
  readonly query = queryForm(this.form, ordersSchema, {
    managedKeys: ['search', 'status', 'tags'],
    resetKeysOnChange: {
      page: ['search'] as never,
    },
  });
}

@Component({
  standalone: true,
  selector: 'hexguard-static-page',
  template: '',
})
class StaticPageComponent {}

const routes: Routes = [
  { path: 'replace', component: QueryOrdersPageComponent },
  { path: 'debounce', component: DebouncedQueryOrdersPageComponent },
  { path: 'push', component: PushQueryOrdersPageComponent },
  { path: 'subset', component: SubsetQueryOrdersPageComponent },
  { path: 'manual', component: ManualQueryOrdersPageComponent },
  { path: 'remapped', component: RemappedQueryOrdersPageComponent },
  { path: 'remove-invalid', component: RemoveInvalidQueryOrdersPageComponent },
  { path: 'missing-control', component: MissingControlPageComponent },
  { path: 'invalid-reset-key', component: InvalidResetKeyPageComponent },
  { path: 'invalid-managed-key', component: InvalidManagedKeyPageComponent },
  { path: 'unmanaged-reset-source', component: UnmanagedResetSourcePageComponent },
  { path: 'other', component: StaticPageComponent },
];

function injectSpyLocation(): SpyLocation {
  return TestBed.inject(Location) as SpyLocation;
}

describe('queryForm', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideRouter(routes), provideLocationMocks(), provideHexGuardUrlState()],
    });
  });

  it('hydrates reactive form controls from initial query params', async () => {
    const harness = await RouterTestingHarness.create();
    const component = await harness.navigateByUrl(
      '/replace?search=boots&page=3&status=closed&tags=red&tags=blue',
      QueryOrdersPageComponent,
    );

    expect(component.form.controls.search.value).toBe('boots');
    expect(component.form.controls.page.value).toBe(3);
    expect(component.form.controls.status.value).toBe('closed');
    expect(component.form.controls.tags.value).toEqual(['red', 'blue']);
    expect(component.query.snapshot()).toEqual({
      search: 'boots',
      page: 3,
      status: 'closed',
      tags: ['red', 'blue'],
    });
  });

  it('updates query params when form controls change', async () => {
    const location = injectSpyLocation();
    const harness = await RouterTestingHarness.create();
    const component = await harness.navigateByUrl('/replace', QueryOrdersPageComponent);

    component.form.controls.search.setValue('north');
    await harness.fixture.whenStable();

    expect(location.path()).toBe('/replace?search=north');
    expect(component.query.urlState.search()).toBe('north');
  });

  it('supports remapped query keys while keeping form control names stable', async () => {
    const location = injectSpyLocation();
    const harness = await RouterTestingHarness.create();
    const component = await harness.navigateByUrl(
      '/remapped?q=boots&p=3&status=closed&tag=red&tag=blue',
      RemappedQueryOrdersPageComponent,
    );

    expect(component.form.controls.search.value).toBe('boots');
    expect(component.form.controls.page.value).toBe(3);
    expect(component.form.controls.status.value).toBe('closed');
    expect(component.form.controls.tags.value).toEqual(['red', 'blue']);

    component.form.controls.search.setValue('north');
    await harness.fixture.whenStable();

    expect(location.path()).toBe('/remapped?q=north&status=closed&tag=red&tag=blue');
  });

  it('supports binding only a subset of schema keys while keeping url-only keys in the same schema', async () => {
    const location = injectSpyLocation();
    const harness = await RouterTestingHarness.create();
    const component = await harness.navigateByUrl(
      '/subset?search=boots&page=3&status=closed&tags=red&tags=blue',
      SubsetQueryOrdersPageComponent,
    );

    expect(component.form.controls.search.value).toBe('boots');
    expect(component.form.controls.status.value).toBe('closed');
    expect(component.form.controls.tags.value).toEqual(['red', 'blue']);
    expect(component.query.snapshot()).toEqual({
      search: 'boots',
      page: 3,
      status: 'closed',
      tags: ['red', 'blue'],
    });

    component.form.controls.search.setValue('north');
    await harness.fixture.whenStable();

    expect(location.path()).toBe('/subset?search=north&status=closed&tags=red&tags=blue');
    expect(component.query.urlState.page()).toBe(1);
  });

  it('resets dependent keys to codec defaults when configured fields change', async () => {
    const location = injectSpyLocation();
    const harness = await RouterTestingHarness.create();
    const component = await harness.navigateByUrl('/replace?page=3', QueryOrdersPageComponent);

    component.form.controls.search.setValue('north');
    await harness.fixture.whenStable();

    expect(component.form.controls.page.value).toBe(1);
    expect(component.query.urlState.page()).toBe(1);
    expect(location.path()).toBe('/replace?search=north');
  });

  it('does not reset a dependent key that changed explicitly in the same form emission', async () => {
    const location = injectSpyLocation();
    const harness = await RouterTestingHarness.create();
    const component = await harness.navigateByUrl('/replace?page=3', QueryOrdersPageComponent);

    component.form.patchValue({ search: 'north', page: 2 });
    await harness.fixture.whenStable();

    expect(component.form.controls.page.value).toBe(2);
    expect(component.query.urlState.page()).toBe(2);
    expect(location.path()).toBe('/replace?search=north&page=2');
  });

  it('supports handle patch and reset operations', async () => {
    const location = injectSpyLocation();
    const harness = await RouterTestingHarness.create();
    const component = await harness.navigateByUrl('/replace', QueryOrdersPageComponent);

    component.query.patch({ search: 'north', page: 2, tags: ['priority'] });
    await harness.fixture.whenStable();

    expect(component.form.controls.search.value).toBe('north');
    expect(component.form.controls.page.value).toBe(2);
    expect(component.form.controls.tags.value).toEqual(['priority']);
    expect(location.path()).toBe('/replace?search=north&page=2&tags=priority');

    component.query.reset();
    await harness.fixture.whenStable();

    expect(component.form.controls.search.value).toBe('');
    expect(component.form.controls.page.value).toBe(1);
    expect(component.form.controls.status.value).toBe('open');
    expect(component.form.controls.tags.value).toEqual([]);
    expect(location.path()).toBe('/replace');
  });

  it('debounces form-originated URL writes through URL-state options', async () => {
    const location = injectSpyLocation();
    const harness = await RouterTestingHarness.create();
    const component = await harness.navigateByUrl('/debounce', DebouncedQueryOrdersPageComponent);

    vi.useFakeTimers();

    try {
      component.form.controls.search.setValue('a');
      component.form.controls.search.setValue('ab');

      expect(location.path()).toBe('/debounce');

      await vi.advanceTimersByTimeAsync(30);
      await harness.fixture.whenStable();

      expect(location.path()).toBe('/debounce?search=ab');
    } finally {
      vi.useRealTimers();
    }
  });

  it('supports manual sync mode with staged form edits and explicit commit', async () => {
    const location = injectSpyLocation();
    const harness = await RouterTestingHarness.create();
    const component = await harness.navigateByUrl('/manual?page=3', ManualQueryOrdersPageComponent);

    component.form.controls.search.setValue('north');
    await harness.fixture.whenStable();

    expect(component.form.controls.page.value).toBe(1);
    expect(component.query.hasPendingChanges()).toBe(true);
    expect(component.query.snapshot()).toEqual({
      search: '',
      page: 3,
      status: 'open',
      tags: [],
    });
    expect(location.path()).toBe('/manual?page=3');

    component.query.commit();
    await harness.fixture.whenStable();

    expect(component.query.hasPendingChanges()).toBe(false);
    expect(component.query.snapshot()).toEqual({
      search: 'north',
      page: 1,
      status: 'open',
      tags: [],
    });
    expect(location.path()).toBe('/manual?search=north');
  });

  it('reverts staged manual edits back to the committed URL state', async () => {
    const location = injectSpyLocation();
    const harness = await RouterTestingHarness.create();
    const component = await harness.navigateByUrl(
      '/manual?search=boots&page=3',
      ManualQueryOrdersPageComponent,
    );

    component.form.controls.search.setValue('north');
    await harness.fixture.whenStable();

    expect(component.query.hasPendingChanges()).toBe(true);
    expect(component.form.controls.page.value).toBe(1);

    component.query.revert();
    await harness.fixture.whenStable();

    expect(component.query.hasPendingChanges()).toBe(false);
    expect(component.form.controls.search.value).toBe('boots');
    expect(component.form.controls.page.value).toBe(3);
    expect(location.path()).toBe('/manual?search=boots&page=3');
  });

  it('overwrites staged manual edits when the committed URL state changes externally', async () => {
    const location = injectSpyLocation();
    const harness = await RouterTestingHarness.create();
    const component = await harness.navigateByUrl('/manual?page=3', ManualQueryOrdersPageComponent);

    component.form.controls.search.setValue('north');
    await harness.fixture.whenStable();

    expect(component.query.hasPendingChanges()).toBe(true);

    location.go('/manual', 'search=api&page=2');
    await harness.fixture.whenStable();

    expect(component.query.hasPendingChanges()).toBe(false);
    expect(component.form.controls.search.value).toBe('api');
    expect(component.form.controls.page.value).toBe(2);
    expect(component.query.snapshot()).toEqual({
      search: 'api',
      page: 2,
      status: 'open',
      tags: [],
    });
  });

  it('replays pushed query-form state through browser history', async () => {
    const location = injectSpyLocation();
    const harness = await RouterTestingHarness.create();
    const component = await harness.navigateByUrl('/push', PushQueryOrdersPageComponent);

    component.form.controls.page.setValue(2);
    await harness.fixture.whenStable();
    component.form.controls.page.setValue(3);
    await harness.fixture.whenStable();

    expect(location.path()).toBe('/push?page=3');

    location.back();
    await harness.fixture.whenStable();

    expect(component.form.controls.page.value).toBe(2);
    expect(component.query.urlState.page()).toBe(2);
    expect(location.path()).toBe('/push?page=2');
  });

  it('reflects inherited invalid-query cleanup in the form', async () => {
    const location = injectSpyLocation();
    const harness = await RouterTestingHarness.create();
    const component = await harness.navigateByUrl(
      '/remove-invalid?search=boots&page=oops&status=unknown',
      RemoveInvalidQueryOrdersPageComponent,
    );

    await harness.fixture.whenStable();

    expect(component.form.controls.search.value).toBe('boots');
    expect(component.form.controls.page.value).toBe(1);
    expect(component.form.controls.status.value).toBe('open');
    expect(location.path()).toBe('/remove-invalid?search=boots');
  });

  it('throws a descriptive error when a schema key has no matching control', async () => {
    const harness = await RouterTestingHarness.create();

    await expect(
      harness.navigateByUrl('/missing-control', MissingControlPageComponent),
    ).rejects.toThrowError(QueryFormControlMissingError);
  });

  it('throws a descriptive error when reset options reference an unknown schema key', async () => {
    const harness = await RouterTestingHarness.create();

    await expect(
      harness.navigateByUrl('/invalid-reset-key', InvalidResetKeyPageComponent),
    ).rejects.toThrowError(QueryFormResetKeyError);
  });

  it('throws a descriptive error when managedKeys references an unknown schema key', async () => {
    const harness = await RouterTestingHarness.create();

    await expect(
      harness.navigateByUrl('/invalid-managed-key', InvalidManagedKeyPageComponent),
    ).rejects.toThrowError(QueryFormManagedKeyError);
  });

  it('throws a descriptive error when reset options use an unmanaged source key', async () => {
    const harness = await RouterTestingHarness.create();

    await expect(
      harness.navigateByUrl('/unmanaged-reset-source', UnmanagedResetSourcePageComponent),
    ).rejects.toThrowError(QueryFormResetKeyError);
  });

  it('cleans up pending debounced writes when the owning route is destroyed', async () => {
    const location = injectSpyLocation();
    const harness = await RouterTestingHarness.create();
    const component = await harness.navigateByUrl('/debounce', DebouncedQueryOrdersPageComponent);

    vi.useFakeTimers();

    try {
      component.form.controls.search.setValue('boots');

      await harness.navigateByUrl('/other', StaticPageComponent);
      await harness.fixture.whenStable();

      await vi.advanceTimersByTimeAsync(30);
      await harness.fixture.whenStable();

      expect(location.path()).toBe('/other');
      expect(location.urlChanges.some((value) => value.includes('/other?search=boots'))).toBe(
        false,
      );
    } finally {
      vi.useRealTimers();
    }
  });
});
