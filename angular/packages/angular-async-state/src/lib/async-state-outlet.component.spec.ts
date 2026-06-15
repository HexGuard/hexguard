import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';

import { asyncState } from './async-state';
import { HexguardAsyncStateOutletComponent } from './async-state-outlet.component';

function mapErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'Unknown error';
}

function createDeferred<T>() {
  let resolve!: (value: T | PromiseLike<T>) => void;
  let reject!: (reason?: unknown) => void;
  const promise = new Promise<T>((nextResolve, nextReject) => {
    resolve = nextResolve;
    reject = nextReject;
  });

  return { promise, resolve, reject };
}

@Component({
  standalone: true,
  imports: [HexguardAsyncStateOutletComponent],
  template: `
    <hexguard-async-state-outlet
      [state]="state"
      [idleTemplate]="idleTemplate"
      [valueTemplate]="valueTemplate"
      [loadingTemplate]="loadingTemplate"
      [errorTemplate]="errorTemplate"
      [emptyTemplate]="emptyTemplate"
      [reloadingTemplate]="reloadingTemplate"
      [staleErrorTemplate]="staleErrorTemplate"
    />

    <ng-template #idleTemplate>
      <p data-testid="idle">idle</p>
    </ng-template>

    <ng-template #loadingTemplate>
      <p data-testid="loading">loading</p>
    </ng-template>

    <ng-template #errorTemplate let-error>
      <p data-testid="error">{{ error }}</p>
    </ng-template>

    <ng-template #emptyTemplate>
      <p data-testid="empty">empty</p>
    </ng-template>

    <ng-template #reloadingTemplate>
      <p data-testid="reloading">reloading</p>
    </ng-template>

    <ng-template #staleErrorTemplate let-error="error">
      <p data-testid="stale-error">{{ error }}</p>
    </ng-template>

    <ng-template #valueTemplate let-value>
      <p data-testid="value">{{ value.join(', ') }}</p>
    </ng-template>
  `,
})
class AsyncStateOutletHostComponent {
  loadImpl: () => Promise<readonly string[]> = async () => ['HG-1042'];
  readonly state = asyncState<readonly string[], string>({
    initialValue: [],
    load: () => this.loadImpl(),
    mapError: mapErrorMessage,
  });
}

function getByTestId(fixture: { nativeElement: HTMLElement }, testId: string): HTMLElement | null {
  return fixture.nativeElement.querySelector(`[data-testid="${testId}"]`);
}

describe('HexguardAsyncStateOutletComponent', () => {
  it('renders the idle template before the first load starts', async () => {
    await TestBed.configureTestingModule({
      imports: [AsyncStateOutletHostComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(AsyncStateOutletHostComponent);

    fixture.detectChanges();

    expect(getByTestId(fixture, 'idle')?.textContent).toContain('idle');
  });

  it('renders the loading template and then the value template after a successful first load', async () => {
    await TestBed.configureTestingModule({
      imports: [AsyncStateOutletHostComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(AsyncStateOutletHostComponent);
    const host = fixture.componentInstance;
    const deferred = createDeferred<readonly string[]>();

    host.loadImpl = () => deferred.promise;
    fixture.detectChanges();

    const load = host.state.load();
    fixture.detectChanges();

    expect(getByTestId(fixture, 'loading')?.textContent).toContain('loading');

    deferred.resolve(['HG-1042']);

    await load;
    fixture.detectChanges();

    expect(getByTestId(fixture, 'value')?.textContent).toContain('HG-1042');
  });

  it('renders the empty template for a successful empty result', async () => {
    await TestBed.configureTestingModule({
      imports: [AsyncStateOutletHostComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(AsyncStateOutletHostComponent);
    const host = fixture.componentInstance;

    host.loadImpl = async () => [];
    fixture.detectChanges();

    await host.state.load();
    fixture.detectChanges();

    expect(getByTestId(fixture, 'empty')?.textContent).toContain('empty');
  });

  it('renders the first-load error template when the initial request fails', async () => {
    await TestBed.configureTestingModule({
      imports: [AsyncStateOutletHostComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(AsyncStateOutletHostComponent);
    const host = fixture.componentInstance;

    host.loadImpl = async () => {
      throw new Error('Initial request failed.');
    };
    fixture.detectChanges();

    await expect(host.state.load()).rejects.toBe('Initial request failed.');
    fixture.detectChanges();

    expect(getByTestId(fixture, 'error')?.textContent).toContain('Initial request failed.');
  });

  it('keeps the value template visible and renders the stale-error template after a failed reload', async () => {
    await TestBed.configureTestingModule({
      imports: [AsyncStateOutletHostComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(AsyncStateOutletHostComponent);
    const host = fixture.componentInstance;

    host.state.setValue(['Cached metrics']);
    fixture.detectChanges();

    const deferred = createDeferred<readonly string[]>();
    host.loadImpl = () => deferred.promise;

    const reload = host.state.reload();
    fixture.detectChanges();

    expect(getByTestId(fixture, 'reloading')?.textContent).toContain('reloading');
    expect(getByTestId(fixture, 'value')?.textContent).toContain('Cached metrics');

    deferred.reject(new Error('Refresh failed.'));

    await expect(reload).rejects.toBe('Refresh failed.');
    fixture.detectChanges();

    expect(getByTestId(fixture, 'stale-error')?.textContent).toContain('Refresh failed.');
    expect(getByTestId(fixture, 'value')?.textContent).toContain('Cached metrics');
  });
});
