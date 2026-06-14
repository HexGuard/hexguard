import { Location } from '@angular/common';
import { provideLocationMocks, type SpyLocation } from '@angular/common/testing';
import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter, type Routes } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';

import {
  InvalidQueryParamError,
  arrayParam,
  booleanParam,
  enumParam,
  numberParam,
  provideHexGuardUrlState,
  stringParam,
  urlState,
} from '../public-api';

const ordersSchema = {
  search: stringParam(''),
  page: numberParam(1),
  status: enumParam(['open', 'closed', 'archived'] as const, 'open'),
  showArchived: booleanParam(false),
  tags: arrayParam(stringParam()),
};

const remappedOrdersSchema = {
  searchText: { codec: stringParam(''), queryKey: 'q' },
  pageNumber: { codec: numberParam(1), queryKey: 'p' },
  statusFilter: {
    codec: enumParam(['open', 'closed', 'archived'] as const, 'open'),
    queryKey: 'status',
  },
  includeArchived: { codec: booleanParam(false), queryKey: 'archived' },
  selectedTags: { codec: arrayParam(stringParam()), queryKey: 'tag' },
};

@Component({
  standalone: true,
  selector: 'hexguard-replace-orders-page',
  template: '',
})
class ReplaceOrdersPageComponent {
  readonly state = urlState(ordersSchema);
}

@Component({
  standalone: true,
  selector: 'hexguard-remapped-orders-page',
  template: '',
})
class RemappedOrdersPageComponent {
  readonly state = urlState(remappedOrdersSchema);
}

@Component({
  standalone: true,
  selector: 'hexguard-push-orders-page',
  template: '',
})
class PushOrdersPageComponent {
  readonly state = urlState(ordersSchema, { history: 'push' });
}

@Component({
  standalone: true,
  selector: 'hexguard-debounced-orders-page',
  template: '',
})
class DebouncedOrdersPageComponent {
  readonly state = urlState(ordersSchema, { debounceMs: 30 });
}

@Component({
  standalone: true,
  selector: 'hexguard-remove-invalid-orders-page',
  template: '',
})
class RemoveInvalidOrdersPageComponent {
  readonly state = urlState(ordersSchema, { invalidParamBehavior: 'removeInvalid' });
}

@Component({
  standalone: true,
  selector: 'hexguard-throw-in-dev-orders-page',
  template: '',
})
class ThrowInDevOrdersPageComponent {
  readonly state = urlState(ordersSchema, { invalidParamBehavior: 'throwInDev' });
}

@Component({
  standalone: true,
  selector: 'hexguard-reserved-query-key-page',
  template: '',
})
class ReservedQueryKeyPageComponent {
  readonly state = urlState({
    currentPage: { codec: numberParam(1), queryKey: 'patch' },
    selectedStatus: { codec: stringParam(''), queryKey: 'snapshot' },
  });
}

@Component({
  standalone: true,
  selector: 'hexguard-multi-state-orders-page',
  template: '',
})
class MultiStateOrdersPageComponent {
  readonly filtersState = urlState({
    search: stringParam(''),
    status: enumParam(['open', 'closed', 'archived'] as const, 'open'),
  });

  readonly paginationState = urlState({
    page: numberParam(1),
    showArchived: booleanParam(false),
    tags: arrayParam(stringParam()),
  });
}

@Component({
  standalone: true,
  selector: 'hexguard-static-page',
  template: '',
})
class StaticPageComponent {}

const routes: Routes = [
  { path: 'replace', component: ReplaceOrdersPageComponent },
  { path: 'remapped', component: RemappedOrdersPageComponent },
  { path: 'push', component: PushOrdersPageComponent },
  { path: 'debounce', component: DebouncedOrdersPageComponent },
  { path: 'remove-invalid', component: RemoveInvalidOrdersPageComponent },
  { path: 'throw-in-dev', component: ThrowInDevOrdersPageComponent },
  { path: 'reserved-query-keys', component: ReservedQueryKeyPageComponent },
  { path: 'multi', component: MultiStateOrdersPageComponent },
  { path: 'other', component: StaticPageComponent },
];

function injectSpyLocation(): SpyLocation {
  return TestBed.inject(Location) as SpyLocation;
}

describe('urlState', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideRouter(routes), provideLocationMocks(), provideHexGuardUrlState()],
    });
  });

  it('hydrates signals from initial query params', async () => {
    const harness = await RouterTestingHarness.create();
    const component = await harness.navigateByUrl(
      '/replace?search=boots&page=3&status=closed&showArchived=true&tags=red&tags=blue',
      ReplaceOrdersPageComponent,
    );

    expect(component.state.search()).toBe('boots');
    expect(component.state.page()).toBe(3);
    expect(component.state.status()).toBe('closed');
    expect(component.state.showArchived()).toBe(true);
    expect(component.state.tags()).toEqual(['red', 'blue']);
  });

  it('updates query params when state changes and removes defaults from the URL', async () => {
    const location = injectSpyLocation();
    const harness = await RouterTestingHarness.create();
    const component = await harness.navigateByUrl('/replace', ReplaceOrdersPageComponent);

    component.state.page.set(2);
    await harness.fixture.whenStable();

    expect(location.path()).toBe('/replace?page=2');
    expect(location.urlChanges.at(-1)).toBe('replace: /replace?page=2');

    component.state.page.set(1);
    await harness.fixture.whenStable();

    expect(location.path()).toBe('/replace');
    expect(location.urlChanges.at(-1)).toBe('replace: /replace');
  });

  it('hydrates and serializes remapped query keys while keeping local signal names descriptive', async () => {
    const location = injectSpyLocation();
    const harness = await RouterTestingHarness.create();
    const component = await harness.navigateByUrl(
      '/remapped?q=boots&p=3&status=closed&archived=true&tag=red&tag=blue',
      RemappedOrdersPageComponent,
    );

    expect(component.state.searchText()).toBe('boots');
    expect(component.state.pageNumber()).toBe(3);
    expect(component.state.statusFilter()).toBe('closed');
    expect(component.state.includeArchived()).toBe(true);
    expect(component.state.selectedTags()).toEqual(['red', 'blue']);

    component.state.pageNumber.set(2);
    await harness.fixture.whenStable();

    expect(location.path()).toBe(
      '/remapped?q=boots&p=2&status=closed&archived=true&tag=red&tag=blue',
    );
    expect(component.state.snapshot()).toEqual({
      searchText: 'boots',
      pageNumber: 2,
      statusFilter: 'closed',
      includeArchived: true,
      selectedTags: ['red', 'blue'],
    });
  });

  it('avoids duplicate navigation for equivalent state', async () => {
    const location = injectSpyLocation();
    const harness = await RouterTestingHarness.create();
    const component = await harness.navigateByUrl('/replace?page=2', ReplaceOrdersPageComponent);
    const initialChangeCount = location.urlChanges.length;

    component.state.page.set(2);
    await harness.fixture.whenStable();

    expect(location.urlChanges.length).toBe(initialChangeCount);
  });

  it('supports push history and reacts to popstate navigation', async () => {
    const location = injectSpyLocation();
    const harness = await RouterTestingHarness.create();
    const component = await harness.navigateByUrl('/push', PushOrdersPageComponent);

    component.state.page.set(2);
    await harness.fixture.whenStable();
    component.state.page.set(3);
    await harness.fixture.whenStable();

    expect(location.urlChanges.at(-1)).toBe('/push?page=3');

    location.back();
    await harness.fixture.whenStable();

    expect(component.state.page()).toBe(2);
    expect(location.path()).toBe('/push?page=2');
  });

  it('debounces url updates', async () => {
    const location = injectSpyLocation();
    const harness = await RouterTestingHarness.create();
    const component = await harness.navigateByUrl('/debounce', DebouncedOrdersPageComponent);

    vi.useFakeTimers();

    try {
      component.state.search.set('a');
      component.state.search.set('ab');

      expect(location.path()).toBe('/debounce');

      await vi.advanceTimersByTimeAsync(30);
      await harness.fixture.whenStable();

      expect(location.path()).toBe('/debounce?search=ab');
      expect(
        location.urlChanges.filter((value) => value === 'replace: /debounce?search=ab'),
      ).toHaveLength(1);
    } finally {
      vi.useRealTimers();
    }
  });

  it('falls back safely for invalid values by default', async () => {
    const harness = await RouterTestingHarness.create();
    const component = await harness.navigateByUrl(
      '/replace?page=oops&status=unknown&showArchived=maybe',
      ReplaceOrdersPageComponent,
    );

    expect(component.state.page()).toBe(1);
    expect(component.state.status()).toBe('open');
    expect(component.state.showArchived()).toBe(false);
  });

  it('can remove invalid query params after parsing', async () => {
    const location = injectSpyLocation();
    const harness = await RouterTestingHarness.create();
    const component = await harness.navigateByUrl(
      '/remove-invalid?search=boots&page=oops&status=unknown',
      RemoveInvalidOrdersPageComponent,
    );

    await harness.fixture.whenStable();

    expect(component.state.search()).toBe('boots');
    expect(component.state.page()).toBe(1);
    expect(component.state.status()).toBe('open');
    expect(location.path()).toBe('/remove-invalid?search=boots');
  });

  it('throws in dev mode for invalid initial query params when configured', async () => {
    const harness = await RouterTestingHarness.create();

    await expect(
      harness.navigateByUrl('/throw-in-dev?page=oops', ThrowInDevOrdersPageComponent),
    ).rejects.toThrowError(InvalidQueryParamError);
  });

  it('throws in dev mode for invalid query param changes when configured', async () => {
    const location = injectSpyLocation();
    const harness = await RouterTestingHarness.create();
    const component = await harness.navigateByUrl(
      '/throw-in-dev?page=2',
      ThrowInDevOrdersPageComponent,
    );

    expect(component.state.page()).toBe(2);

    expect(() => {
      location.go('/throw-in-dev', 'page=oops');
    }).toThrowError(InvalidQueryParamError);
  });

  it('allows reserved handle method names as external query keys when remapped', async () => {
    const location = injectSpyLocation();
    const harness = await RouterTestingHarness.create();
    const component = await harness.navigateByUrl(
      '/reserved-query-keys?patch=4&snapshot=closed',
      ReservedQueryKeyPageComponent,
    );

    expect(component.state.currentPage()).toBe(4);
    expect(component.state.selectedStatus()).toBe('closed');

    component.state.patch({ currentPage: 2 });
    await harness.fixture.whenStable();

    expect(location.path()).toBe('/reserved-query-keys?patch=2&snapshot=closed');
  });

  it('allows multiple urlState instances to coordinate disjoint query keys', async () => {
    const location = injectSpyLocation();
    const harness = await RouterTestingHarness.create();
    const component = await harness.navigateByUrl(
      '/multi?search=boots&status=closed&page=3&showArchived=true&tags=priority',
      MultiStateOrdersPageComponent,
    );

    expect(component.filtersState.search()).toBe('boots');
    expect(component.filtersState.status()).toBe('closed');
    expect(component.paginationState.page()).toBe(3);
    expect(component.paginationState.showArchived()).toBe(true);
    expect(component.paginationState.tags()).toEqual(['priority']);

    component.filtersState.search.set('socks');
    await harness.fixture.whenStable();

    expect(component.paginationState.page()).toBe(3);
    expect(component.paginationState.showArchived()).toBe(true);
    expect(location.path()).toContain('search=socks');
    expect(location.path()).toContain('status=closed');
    expect(location.path()).toContain('page=3');
    expect(location.path()).toContain('showArchived=true');
    expect(location.path()).toContain('tags=priority');

    component.paginationState.page.set(4);
    await harness.fixture.whenStable();

    expect(component.filtersState.search()).toBe('socks');
    expect(component.filtersState.status()).toBe('closed');
    expect(location.path()).toContain('page=4');
    expect(location.path()).toContain('search=socks');
  });

  it('clears pending debounced writes when the owning route is destroyed', async () => {
    const location = injectSpyLocation();
    const harness = await RouterTestingHarness.create();
    const component = await harness.navigateByUrl('/debounce', DebouncedOrdersPageComponent);

    vi.useFakeTimers();

    try {
      component.state.search.set('boots');

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
