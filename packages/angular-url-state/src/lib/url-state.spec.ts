import { Location } from '@angular/common';
import { provideLocationMocks, type SpyLocation } from '@angular/common/testing';
import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter, type Routes } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';

import {
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

const routes: Routes = [
  { path: 'replace', component: ReplaceOrdersPageComponent },
  { path: 'push', component: PushOrdersPageComponent },
  { path: 'debounce', component: DebouncedOrdersPageComponent },
  { path: 'remove-invalid', component: RemoveInvalidOrdersPageComponent },
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
});
