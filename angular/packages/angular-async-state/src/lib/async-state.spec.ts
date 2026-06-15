import { EMPTY, Subject, of } from 'rxjs';
import { describe, expect, it } from 'vitest';

import { asyncAction } from './async-action';
import { asyncState } from './async-state';
import { AsyncActionPendingError } from './errors';
import { observableState } from './observable-state';

function mapErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'Unknown error';
}

describe('asyncState', () => {
  it('loads and reloads values while preserving the derived lifecycle state', async () => {
    let calls = 0;
    const state = asyncState({
      initialValue: [] as string[],
      load: async () => {
        calls += 1;

        return calls === 1 ? ['HG-1042'] : ['HG-1042', 'HG-1049'];
      },
    });

    const firstLoad = state.load();

    expect(state.isLoading()).toBe(true);
    await expect(firstLoad).resolves.toEqual(['HG-1042']);
    expect(state.isLoaded()).toBe(true);
    expect(state.hasValue()).toBe(true);

    const reload = state.reload();

    expect(state.isReloading()).toBe(true);
    await expect(reload).resolves.toEqual(['HG-1042', 'HG-1049']);
    expect(state.value()).toEqual(['HG-1042', 'HG-1049']);
  });

  it('maps first-load failures without marking the state as loaded', async () => {
    const state = asyncState<string[], string>({
      initialValue: [],
      load: async () => {
        throw new Error('Initial load failed.');
      },
      mapError: mapErrorMessage,
    });

    await expect(state.load()).rejects.toBe('Initial load failed.');

    expect(state.isError()).toBe(true);
    expect(state.hasLoaded()).toBe(false);
    expect(state.hasValue()).toBe(false);
    expect(state.isEmpty()).toBe(false);
    expect(state.error()).toBe('Initial load failed.');
  });

  it('keeps the last successful value visible when a reload fails', async () => {
    let shouldFail = false;
    const state = asyncState<readonly string[], string>({
      initialValue: [],
      load: async () => {
        if (shouldFail) {
          throw new Error('Refresh failed.');
        }

        return ['HG-1042'];
      },
      mapError: mapErrorMessage,
    });

    await expect(state.load()).resolves.toEqual(['HG-1042']);

    shouldFail = true;

    const reload = state.reload();

    expect(state.isReloading()).toBe(true);
    await expect(reload).rejects.toBe('Refresh failed.');
    expect(state.isError()).toBe(true);
    expect(state.hasLoaded()).toBe(true);
    expect(state.hasValue()).toBe(true);
    expect(state.value()).toEqual(['HG-1042']);
    expect(state.error()).toBe('Refresh failed.');
  });

  it('treats successful empty results as empty and resets back to idle', async () => {
    const state = asyncState<string[]>({
      initialValue: ['seed'],
      load: async () => [],
    });

    await expect(state.load()).resolves.toEqual([]);
    expect(state.isLoaded()).toBe(true);
    expect(state.isEmpty()).toBe(true);
    expect(state.hasValue()).toBe(false);

    state.setValue(['HG-1042']);
    expect(state.hasValue()).toBe(true);

    state.reset();

    expect(state.isIdle()).toBe(true);
    expect(state.hasLoaded()).toBe(false);
    expect(state.value()).toEqual(['seed']);
  });
});

describe('asyncAction', () => {
  it('reuses the same in-flight promise by default while pending', async () => {
    let resolver: ((value: string) => void) | undefined;
    let calls = 0;
    const action = asyncAction<string, string>({
      run: async (payload) => {
        calls += 1;

        return new Promise<string>((resolve) => {
          resolver = resolve;
          void payload;
        });
      },
    });

    const firstRun = action.run('hexguard');
    const secondRun = action.run('hexguard');

    expect(calls).toBe(1);
    expect(action.pending()).toBe(true);

    resolver?.('HEXGUARD');

    await expect(firstRun).resolves.toBe('HEXGUARD');
    await expect(secondRun).resolves.toBe('HEXGUARD');
    expect(action.hasSucceeded()).toBe(true);
    expect(action.lastResult()).toBe('HEXGUARD');
  });

  it('rejects duplicate runs when configured to do so', async () => {
    let resolver: (() => void) | undefined;
    const action = asyncAction({
      duplicateRunPolicy: 'reject' as const,
      run: async () =>
        new Promise<void>((resolve) => {
          resolver = resolve;
        }),
    });

    const firstRun = action.run();

    await expect(action.run()).rejects.toThrowError(AsyncActionPendingError);

    resolver?.();

    await expect(firstRun).resolves.toBeUndefined();
  });

  it('maps failures and returns to idle when reset', async () => {
    const action = asyncAction<void, void, string>({
      run: async () => {
        throw new Error('Approval failed.');
      },
      mapError: mapErrorMessage,
    });

    await expect(action.run()).rejects.toBe('Approval failed.');

    expect(action.hasFailed()).toBe(true);
    expect(action.error()).toBe('Approval failed.');

    action.reset();

    expect(action.isIdle()).toBe(true);
    expect(action.error()).toBeNull();
    expect(action.lastResult()).toBeNull();
  });

  it('accepts one-shot observable results while preserving the existing action handle', async () => {
    const action = asyncAction<string, string>({
      run: (value) => of(value.toUpperCase()),
    });

    await expect(action.run('hexguard')).resolves.toBe('HEXGUARD');
    expect(action.hasSucceeded()).toBe(true);
    expect(action.lastResult()).toBe('HEXGUARD');
  });

  it('treats observable completion without emission as a failure', async () => {
    const action = asyncAction<void, void, string>({
      run: () => EMPTY,
      mapError: mapErrorMessage,
    });

    await expect(action.run()).rejects.toBe(
      'asyncAction observable completed without emitting a result.',
    );
    expect(action.hasFailed()).toBe(true);
  });
});

describe('observableState', () => {
  it('tracks multi-emission streams through live updates and completion', () => {
    const subject = new Subject<string>();
    const state = observableState({
      initialValue: '',
      source: () => subject.asObservable(),
    });

    expect(state.isIdle()).toBe(true);

    state.connect();

    expect(state.isConnecting()).toBe(true);

    subject.next('alpha');

    expect(state.isLive()).toBe(true);
    expect(state.value()).toBe('alpha');
    expect(state.hasValue()).toBe(true);

    subject.next('bravo');

    expect(state.value()).toBe('bravo');

    subject.complete();

    expect(state.isComplete()).toBe(true);
    expect(state.value()).toBe('bravo');
  });

  it('retains the last emitted value when the stream errors', () => {
    const subject = new Subject<string>();
    const state = observableState<string, string>({
      initialValue: '',
      source: () => subject.asObservable(),
      mapError: mapErrorMessage,
    });

    state.connect();
    subject.next('live-value');
    subject.error(new Error('Stream failed.'));

    expect(state.isError()).toBe(true);
    expect(state.value()).toBe('live-value');
    expect(state.error()).toBe('Stream failed.');
    expect(state.hasValue()).toBe(true);
  });

  it('disconnects and reconnects with a fresh subscription', () => {
    const first = new Subject<string>();
    const second = new Subject<string>();
    let sourceCalls = 0;
    const state = observableState({
      initialValue: 'seed',
      source: () => {
        sourceCalls += 1;

        return (sourceCalls === 1 ? first : second).asObservable();
      },
    });

    state.connect();
    first.next('first-value');

    state.disconnect();
    first.next('ignored-after-disconnect');

    expect(state.isIdle()).toBe(true);
    expect(state.value()).toBe('first-value');

    state.reconnect();
    second.next('second-value');

    expect(sourceCalls).toBe(2);
    expect(state.isLive()).toBe(true);
    expect(state.value()).toBe('second-value');
  });

  it('maps synchronous source failures before any emission', () => {
    const state = observableState<string, string>({
      initialValue: 'seed',
      source: () => {
        throw new Error('Socket setup failed.');
      },
      mapError: mapErrorMessage,
    });

    state.connect();

    expect(state.isError()).toBe(true);
    expect(state.error()).toBe('Socket setup failed.');
    expect(state.value()).toBe('seed');
    expect(state.hasValue()).toBe(false);
  });

  it('honors a custom empty predicate for emitted observable values', () => {
    const subject = new Subject<{ readonly items: readonly string[] }>();
    const state = observableState({
      initialValue: { items: ['seed'] as const },
      source: () => subject.asObservable(),
      empty: (value) => value.items.length === 0,
    });

    state.connect();
    subject.next({ items: [] });

    expect(state.isLive()).toBe(true);
    expect(state.isEmpty()).toBe(true);
    expect(state.hasValue()).toBe(false);

    subject.next({ items: ['HG-1042'] });

    expect(state.isEmpty()).toBe(false);
    expect(state.hasValue()).toBe(true);
  });

  it('completes without a value and resets back to the initial state', () => {
    const state = observableState({
      initialValue: ['seed'] as string[],
      source: () => EMPTY,
    });

    state.connect();

    expect(state.isComplete()).toBe(true);
    expect(state.hasValue()).toBe(false);
    expect(state.value()).toEqual(['seed']);

    state.reset();

    expect(state.isIdle()).toBe(true);
    expect(state.error()).toBeNull();
    expect(state.value()).toEqual(['seed']);
  });
});
