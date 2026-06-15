import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';

import { optimisticState } from './optimistic-state';
import { HexguardOptimisticStateOutletComponent } from './optimistic-state-outlet.component';

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
  imports: [HexguardOptimisticStateOutletComponent],
  template: `
    <hexguard-optimistic-state-outlet
      [state]="state"
      [valueTemplate]="valueTemplate"
      [pendingTemplate]="pendingTemplate"
      [errorTemplate]="errorTemplate"
    />

    <ng-template #pendingTemplate let-entries>
      <p data-testid="pending">{{ entries.length }} pending</p>
    </ng-template>

    <ng-template #errorTemplate let-error>
      <p data-testid="error">{{ error }}</p>
    </ng-template>

    <ng-template #valueTemplate let-value>
      <p data-testid="value">{{ value.join(', ') }}</p>
    </ng-template>
  `,
})
class OptimisticStateOutletHostComponent {
  runImpl: (nextValue: string) => Promise<string> = async (nextValue) => nextValue;

  readonly state = optimisticState<readonly string[], string, string, string>({
    initialValue: ['stable'],
    getTarget: () => 'list',
    apply: (_value, nextValue) => [nextValue],
    reconcile: (_value, result) => [result],
    run: (nextValue) => this.runImpl(nextValue),
    mapError: (error) => (error instanceof Error ? error.message : 'Unknown error'),
  });
}

function getByTestId(fixture: { nativeElement: HTMLElement }, testId: string): HTMLElement | null {
  return fixture.nativeElement.querySelector(`[data-testid="${testId}"]`);
}

describe('HexguardOptimisticStateOutletComponent', () => {
  it('renders the current value template before any mutation runs', async () => {
    await TestBed.configureTestingModule({
      imports: [OptimisticStateOutletHostComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(OptimisticStateOutletHostComponent);

    fixture.detectChanges();

    expect(getByTestId(fixture, 'value')?.textContent).toContain('stable');
    expect(getByTestId(fixture, 'pending')).toBeNull();
    expect(getByTestId(fixture, 'error')).toBeNull();
  });

  it('renders the pending companion template while an optimistic mutation is active', async () => {
    await TestBed.configureTestingModule({
      imports: [OptimisticStateOutletHostComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(OptimisticStateOutletHostComponent);
    const host = fixture.componentInstance;
    const deferred = createDeferred<string>();

    host.runImpl = () => deferred.promise;
    fixture.detectChanges();

    const run = host.state.run('optimistic');
    fixture.detectChanges();

    expect(getByTestId(fixture, 'pending')?.textContent).toContain('1 pending');
    expect(getByTestId(fixture, 'value')?.textContent).toContain('optimistic');

    deferred.resolve('confirmed');

    await run;
    fixture.detectChanges();

    expect(getByTestId(fixture, 'pending')).toBeNull();
    expect(getByTestId(fixture, 'value')?.textContent).toContain('confirmed');
  });

  it('renders the error companion template after a failed mutation rolls back', async () => {
    await TestBed.configureTestingModule({
      imports: [OptimisticStateOutletHostComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(OptimisticStateOutletHostComponent);
    const host = fixture.componentInstance;

    host.runImpl = async () => {
      throw new Error('Save failed.');
    };
    fixture.detectChanges();

    await expect(host.state.run('optimistic')).rejects.toBe('Save failed.');
    fixture.detectChanges();

    expect(getByTestId(fixture, 'error')?.textContent).toContain('Save failed.');
    expect(getByTestId(fixture, 'value')?.textContent).toContain('stable');
  });
});
