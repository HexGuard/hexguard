import { computed, DestroyRef, inject, signal } from '@angular/core';
import type { WizardStateHandle, WizardStateOptions } from './types';

export function injectWizardState(options: WizardStateOptions): WizardStateHandle {
  const destroyRef = inject(DestroyRef);
  const { steps, storage, onFinish, onCancel } = options;

  const rawIndex = signal(0);
  const isFinished = signal(false);
  const wasCancelled = signal(false);

  // Resume from storage if available
  if (storage) {
    const snapshot = storage.restore();
    if (snapshot && !snapshot.isFinished) {
      rawIndex.set(snapshot.currentIndex);
    }
  }

  // Compute visible steps (those where canShow is not false)
  const visibleSteps = computed(() => {
    return steps.filter((s) => {
      if (s.canShow === undefined) return true;
      return s.canShow();
    });
  });

  // Map raw index to visible index
  const visibleIndex = computed(() => {
    const vis = visibleSteps();
    const raw = rawIndex();
    if (raw < 0 || raw >= vis.length) return 0;
    return raw;
  });

  const currentStep = computed(() => {
    const vis = visibleSteps();
    const idx = visibleIndex();
    return vis[idx] ?? null;
  });

  const currentIndex = visibleIndex;

  const isFirst = computed(() => visibleIndex() === 0);

  const isLast = computed(() => {
    const vis = visibleSteps();
    return visibleIndex() >= vis.length - 1;
  });

  const canGoNext = computed(() => {
    const step = currentStep();
    if (!step || !step.validate) return true;
    return step.validate();
  });

  const canGoBack = computed(() => !isFirst() && !isFinished());

  const progress = computed(() => {
    const vis = visibleSteps();
    if (vis.length <= 1) return 100;
    return Math.round((visibleIndex() / (vis.length - 1)) * 100);
  });

  function fireStepLeave(): void {
    const step = currentStep();
    step?.onStepLeave?.();
  }

  function fireStepEnter(): void {
    const step = currentStep();
    step?.onStepEnter?.();
  }

  function next(): void {
    if (isFinished() || !canGoNext()) return;
    const vis = visibleSteps();
    const nextIdx = visibleIndex() + 1;
    if (nextIdx < vis.length) {
      fireStepLeave();
      rawIndex.set(rawIndex() + 1);
      fireStepEnter();
      saveSnapshot();
    }
  }

  function back(): void {
    if (isFinished() || !canGoBack()) return;
    const prevIdx = visibleIndex() - 1;
    if (prevIdx >= 0) {
      fireStepLeave();
      rawIndex.set(Math.max(0, rawIndex() - 1));
      fireStepEnter();
      saveSnapshot();
    }
  }

  function goToStep(id: string): void {
    if (isFinished()) return;
    const vis = visibleSteps();
    const idx = vis.findIndex((s) => s.id === id);
    if (idx >= 0) {
      fireStepLeave();
      rawIndex.set(idx);
      fireStepEnter();
      saveSnapshot();
    }
  }

  function skip(): void {
    if (isFinished()) return;
    const vis = visibleSteps();
    const nextIdx = visibleIndex() + 1;
    if (nextIdx < vis.length) {
      fireStepLeave();
      rawIndex.set(rawIndex() + 1);
      fireStepEnter();
      saveSnapshot();
    }
  }

  function finish(): void {
    isFinished.set(true);
    storage?.clear();
    onFinish?.();
  }

  function cancel(): void {
    wasCancelled.set(true);
    storage?.clear();
    onCancel?.();
  }

  function reset(): void {
    isFinished.set(false);
    wasCancelled.set(false);
    rawIndex.set(0);
    storage?.clear();
    fireStepEnter();
  }

  function saveSnapshot(): void {
    if (storage) {
      storage.save({ currentIndex: rawIndex(), isFinished: false });
    }
  }

  // Attach onStepEnter for the initial step
  const initialStep = steps.find((s) => s.canShow === undefined || s.canShow());
  if (initialStep) {
    // Defer to next microtask to let the injection context settle
    queueMicrotask(() => initialStep.onStepEnter?.());
  }

  destroyRef.onDestroy(() => {
    storage?.clear();
  });

  return {
    currentStep,
    currentIndex,
    isFirst,
    isLast,
    canGoNext,
    canGoBack,
    progress,
    isFinished: isFinished.asReadonly(),
    next,
    back,
    goToStep,
    skip,
    finish,
    cancel,
    reset,
  };
}
