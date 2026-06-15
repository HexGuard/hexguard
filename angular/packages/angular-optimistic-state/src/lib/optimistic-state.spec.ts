import { describe, expect, it } from 'vitest';

import { OptimisticStatePendingError } from './errors';
import { optimisticState } from './optimistic-state';

interface FeatureToggleState {
  readonly enabled: boolean;
  readonly label: string;
  readonly pending: boolean;
}

interface FeatureToggleInput {
  readonly enabled: boolean;
}

interface FeatureToggleResult {
  readonly enabled: boolean;
  readonly label: string;
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

function createToggleState(overrides: Partial<FeatureToggleState> = {}): FeatureToggleState {
  return {
    enabled: false,
    label: 'stable',
    pending: false,
    ...overrides,
  };
}

describe('optimisticState', () => {
  it('applies an optimistic overlay immediately and reconciles the committed value on success', async () => {
    const deferred = createDeferred<FeatureToggleResult>();
    const state = optimisticState<FeatureToggleState, FeatureToggleInput, FeatureToggleResult>({
      initialValue: createToggleState(),
      getTarget: () => 'feature-toggle',
      apply: (value, input) => ({
        ...value,
        enabled: input.enabled,
        pending: true,
      }),
      reconcile: (value, result) => ({
        ...value,
        enabled: result.enabled,
        label: result.label,
        pending: false,
      }),
      run: () => deferred.promise,
    });

    const run = state.run({ enabled: true });

    expect(state.isPending()).toBe(true);
    expect(state.value()).toEqual({
      enabled: true,
      label: 'stable',
      pending: true,
    });
    expect(state.settledValue()).toEqual(createToggleState());

    deferred.resolve({ enabled: true, label: 'confirmed' });

    await expect(run).resolves.toEqual({ enabled: true, label: 'confirmed' });
    expect(state.isIdle()).toBe(true);
    expect(state.value()).toEqual({
      enabled: true,
      label: 'confirmed',
      pending: false,
    });
    expect(state.lastResult()).toEqual({ enabled: true, label: 'confirmed' });
  });

  it('rolls back the optimistic overlay and maps the failure when the mutation rejects', async () => {
    const deferred = createDeferred<FeatureToggleResult>();
    const state = optimisticState<
      FeatureToggleState,
      FeatureToggleInput,
      FeatureToggleResult,
      string
    >({
      initialValue: createToggleState(),
      getTarget: () => 'feature-toggle',
      apply: (value, input) => ({
        ...value,
        enabled: input.enabled,
        pending: true,
      }),
      reconcile: (value, result) => ({
        ...value,
        enabled: result.enabled,
        label: result.label,
        pending: false,
      }),
      run: () => deferred.promise,
      mapError: (error) => (error instanceof Error ? error.message : 'Unknown failure'),
    });

    const run = state.run({ enabled: true });

    expect(state.value()).toEqual({
      enabled: true,
      label: 'stable',
      pending: true,
    });

    deferred.reject(new Error('Save failed.'));

    await expect(run).rejects.toBe('Save failed.');
    expect(state.isError()).toBe(true);
    expect(state.error()).toBe('Save failed.');
    expect(state.value()).toEqual(createToggleState());
  });

  it('rejects a second same-target mutation by default while one is pending', async () => {
    const deferred = createDeferred<FeatureToggleResult>();
    const state = optimisticState<FeatureToggleState, FeatureToggleInput, FeatureToggleResult>({
      initialValue: createToggleState(),
      getTarget: () => 'feature-toggle',
      apply: (value, input) => ({
        ...value,
        enabled: input.enabled,
        pending: true,
      }),
      reconcile: (value, result) => ({
        ...value,
        enabled: result.enabled,
        label: result.label,
        pending: false,
      }),
      run: () => deferred.promise,
    });

    const firstRun = state.run({ enabled: true });

    await expect(state.run({ enabled: false })).rejects.toThrowError(OptimisticStatePendingError);

    deferred.resolve({ enabled: true, label: 'confirmed' });

    await expect(firstRun).resolves.toEqual({ enabled: true, label: 'confirmed' });
  });

  it('queues a same-target mutation until the current one settles when configured to queue', async () => {
    const deferredRuns: Array<ReturnType<typeof createDeferred<FeatureToggleResult>>> = [];
    let calls = 0;
    const state = optimisticState<FeatureToggleState, FeatureToggleInput, FeatureToggleResult>({
      initialValue: createToggleState(),
      conflictPolicy: 'queue',
      getTarget: () => 'feature-toggle',
      apply: (value, input) => ({
        ...value,
        enabled: input.enabled,
        pending: true,
      }),
      reconcile: (value, result) => ({
        ...value,
        enabled: result.enabled,
        label: result.label,
        pending: false,
      }),
      run: () => {
        calls += 1;
        const deferred = createDeferred<FeatureToggleResult>();

        deferredRuns.push(deferred);

        return deferred.promise;
      },
    });

    const firstRun = state.run({ enabled: true });
    const secondRun = state.run({ enabled: false });

    expect(calls).toBe(1);
    expect(state.pendingCount()).toBe(1);
    expect(state.queuedCount()).toBe(1);
    expect(state.value()).toEqual({
      enabled: true,
      label: 'stable',
      pending: true,
    });

    deferredRuns[0]?.resolve({ enabled: true, label: 'first result' });

    await expect(firstRun).resolves.toEqual({ enabled: true, label: 'first result' });
    expect(calls).toBe(2);
    expect(state.pendingCount()).toBe(1);
    expect(state.queuedCount()).toBe(0);
    expect(state.value()).toEqual({
      enabled: false,
      label: 'first result',
      pending: true,
    });

    deferredRuns[1]?.resolve({ enabled: false, label: 'second result' });

    await expect(secondRun).resolves.toEqual({ enabled: false, label: 'second result' });
    expect(state.value()).toEqual({
      enabled: false,
      label: 'second result',
      pending: false,
    });
  });

  it('replaces the local optimistic overlay and ignores the superseded result when configured to replace', async () => {
    const deferredRuns: Array<ReturnType<typeof createDeferred<FeatureToggleResult>>> = [];
    let calls = 0;
    const state = optimisticState<FeatureToggleState, FeatureToggleInput, FeatureToggleResult>({
      initialValue: createToggleState(),
      conflictPolicy: 'replace',
      getTarget: () => 'feature-toggle',
      apply: (value, input) => ({
        ...value,
        enabled: input.enabled,
        pending: true,
      }),
      reconcile: (value, result) => ({
        ...value,
        enabled: result.enabled,
        label: result.label,
        pending: false,
      }),
      run: () => {
        calls += 1;
        const deferred = createDeferred<FeatureToggleResult>();

        deferredRuns.push(deferred);

        return deferred.promise;
      },
    });

    const firstRun = state.run({ enabled: true });
    const secondRun = state.run({ enabled: false });

    expect(calls).toBe(2);
    expect(state.value()).toEqual({
      enabled: false,
      label: 'stable',
      pending: true,
    });
    expect(state.entries().map((entry) => entry.status)).toEqual(['replaced', 'pending']);

    deferredRuns[0]?.resolve({ enabled: true, label: 'superseded result' });

    await expect(firstRun).resolves.toEqual({ enabled: true, label: 'superseded result' });
    expect(state.value()).toEqual({
      enabled: false,
      label: 'stable',
      pending: true,
    });

    deferredRuns[1]?.resolve({ enabled: false, label: 'confirmed result' });

    await expect(secondRun).resolves.toEqual({ enabled: false, label: 'confirmed result' });
    expect(state.value()).toEqual({
      enabled: false,
      label: 'confirmed result',
      pending: false,
    });
  });
});
