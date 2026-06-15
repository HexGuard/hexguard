import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';

import { asyncAction } from './async-action';
import { HexguardAsyncActionOutletComponent } from './async-action-outlet.component';

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
  imports: [HexguardAsyncActionOutletComponent],
  template: `
    <hexguard-async-action-outlet
      [action]="action"
      [idleTemplate]="idleTemplate"
      [pendingTemplate]="pendingTemplate"
      [successTemplate]="successTemplate"
      [errorTemplate]="errorTemplate"
    />

    <ng-template #idleTemplate>
      <p data-testid="idle">idle</p>
    </ng-template>

    <ng-template #pendingTemplate>
      <p data-testid="pending">pending</p>
    </ng-template>

    <ng-template #successTemplate let-result>
      <p data-testid="success">{{ result }}</p>
    </ng-template>

    <ng-template #errorTemplate let-error>
      <p data-testid="error">{{ error }}</p>
    </ng-template>
  `,
})
class AsyncActionOutletHostComponent {
  runImpl: (payload: { readonly id: string }) => Promise<string> = async ({ id }) =>
    `${id} approved`;

  readonly action = asyncAction<{ readonly id: string }, string, string>({
    run: (payload) => this.runImpl(payload),
    mapError: mapErrorMessage,
  });
}

function getByTestId(fixture: { nativeElement: HTMLElement }, testId: string): HTMLElement | null {
  return fixture.nativeElement.querySelector(`[data-testid="${testId}"]`);
}

describe('HexguardAsyncActionOutletComponent', () => {
  it('renders idle, pending, success, and idle-again states around a successful run', async () => {
    await TestBed.configureTestingModule({
      imports: [AsyncActionOutletHostComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(AsyncActionOutletHostComponent);
    const host = fixture.componentInstance;

    fixture.detectChanges();
    expect(getByTestId(fixture, 'idle')?.textContent).toContain('idle');

    const deferred = createDeferred<string>();
    host.runImpl = () => deferred.promise;

    const run = host.action.run({ id: 'HG-1042' });
    fixture.detectChanges();

    expect(getByTestId(fixture, 'pending')?.textContent).toContain('pending');

    deferred.resolve('HG-1042 approved');

    await run;
    fixture.detectChanges();

    expect(getByTestId(fixture, 'success')?.textContent).toContain('HG-1042 approved');

    host.action.reset();
    fixture.detectChanges();

    expect(getByTestId(fixture, 'idle')?.textContent).toContain('idle');
  });

  it('renders the error template after a failed run', async () => {
    await TestBed.configureTestingModule({
      imports: [AsyncActionOutletHostComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(AsyncActionOutletHostComponent);
    const host = fixture.componentInstance;

    host.runImpl = async () => {
      throw new Error('Approval rejected.');
    };
    fixture.detectChanges();

    await expect(host.action.run({ id: 'HG-1042' })).rejects.toBe('Approval rejected.');
    fixture.detectChanges();

    expect(getByTestId(fixture, 'error')?.textContent).toContain('Approval rejected.');
  });
});
