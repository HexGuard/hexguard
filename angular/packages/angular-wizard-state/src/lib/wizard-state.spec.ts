import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { injectWizardState } from './wizard-state';
import type { WizardStep, WizardStorage } from './types';

describe(injectWizardState.name, () => {
  const basicSteps: readonly WizardStep[] = [
    { id: 'details', title: 'Details' },
    { id: 'config', title: 'Configuration' },
    { id: 'review', title: 'Review' },
  ];

  it('starts on the first step', () => {
    TestBed.runInInjectionContext(() => {
      const w = injectWizardState({ steps: basicSteps });
      expect(w.currentIndex()).toBe(0);
      expect(w.currentStep()?.id).toBe('details');
      expect(w.isFirst()).toBe(true);
      expect(w.isLast()).toBe(false);
      expect(w.isFinished()).toBe(false);
    });
  });

  it('advances to the next step', () => {
    TestBed.runInInjectionContext(() => {
      const w = injectWizardState({ steps: basicSteps });
      w.next();
      expect(w.currentIndex()).toBe(1);
      expect(w.currentStep()?.id).toBe('config');
    });
  });

  it('goes back to the previous step', () => {
    TestBed.runInInjectionContext(() => {
      const w = injectWizardState({ steps: basicSteps });
      w.next();
      w.next();
      expect(w.currentIndex()).toBe(2);
      w.back();
      expect(w.currentIndex()).toBe(1);
      expect(w.currentStep()?.id).toBe('config');
    });
  });

  it('stops at the first step when going back', () => {
    TestBed.runInInjectionContext(() => {
      const w = injectWizardState({ steps: basicSteps });
      w.back();
      expect(w.currentIndex()).toBe(0);
    });
  });

  it('does not advance past the last step via next()', () => {
    TestBed.runInInjectionContext(() => {
      const w = injectWizardState({ steps: basicSteps });
      w.next();
      w.next();
      w.next(); // should be blocked
      expect(w.currentIndex()).toBe(2);
    });
  });

  it('finish() marks wizard as finished', () => {
    TestBed.runInInjectionContext(() => {
      const w = injectWizardState({ steps: basicSteps });
      w.finish();
      expect(w.isFinished()).toBe(true);
    });
  });

  it('finish() fires onFinish callback', () => {
    const onFinish = vi.fn();
    TestBed.runInInjectionContext(() => {
      const w = injectWizardState({ steps: basicSteps, onFinish });
      w.finish();
      expect(onFinish).toHaveBeenCalledOnce();
    });
  });

  it('cancel() fires onCancel callback', () => {
    const onCancel = vi.fn();
    TestBed.runInInjectionContext(() => {
      const w = injectWizardState({ steps: basicSteps, onCancel });
      w.cancel();
      expect(onCancel).toHaveBeenCalledOnce();
    });
  });

  it('reset() returns to first step', () => {
    TestBed.runInInjectionContext(() => {
      const w = injectWizardState({ steps: basicSteps });
      w.next();
      w.next();
      w.reset();
      expect(w.currentIndex()).toBe(0);
      expect(w.isFinished()).toBe(false);
    });
  });

  it('goToStep navigates to the specified step', () => {
    TestBed.runInInjectionContext(() => {
      const w = injectWizardState({ steps: basicSteps });
      w.goToStep('review');
      expect(w.currentIndex()).toBe(2);
      expect(w.currentStep()?.id).toBe('review');
    });
  });

  it('respects validation gate', () => {
    const valid = signal(false);
    const stepsWithValidation: readonly WizardStep[] = [
      { id: 'step1', title: 'Step 1' },
      { id: 'step2', title: 'Step 2', validate: valid.asReadonly() },
    ];
    TestBed.runInInjectionContext(() => {
      const w = injectWizardState({ steps: stepsWithValidation });
      w.next();
      expect(w.currentStep()?.id).toBe('step2');
      expect(w.canGoNext()).toBe(false);
      w.next();
      expect(w.currentStep()?.id).toBe('step2'); // blocked by validation
      valid.set(true);
      expect(w.canGoNext()).toBe(true);
      w.next();
      // No step 3 to go to, so stays
    });
  });

  it('skips hidden steps', () => {
    const showConfig = signal(false);
    const stepsWithConditional: readonly WizardStep[] = [
      { id: 'details', title: 'Details' },
      { id: 'config', title: 'Config', canShow: showConfig.asReadonly() },
      { id: 'review', title: 'Review' },
    ];
    TestBed.runInInjectionContext(() => {
      const w = injectWizardState({ steps: stepsWithConditional });
      // config is hidden, so only 2 visible steps: details, review
      expect(w.isLast()).toBe(false);
      w.next();
      // should skip to review
      expect(w.currentStep()?.id).toBe('review');
    });
  });

  it('skip() advances without validation', () => {
    const valid = signal(false);
    const stepsWithValidation: readonly WizardStep[] = [
      { id: 'a', title: 'A' },
      { id: 'b', title: 'B', validate: valid.asReadonly() },
    ];
    TestBed.runInInjectionContext(() => {
      const w = injectWizardState({ steps: stepsWithValidation });
      w.next();
      expect(w.currentStep()?.id).toBe('b');
      w.skip();
      expect(w.currentIndex()).toBe(1);
    });
  });

  it('reports progress correctly', () => {
    TestBed.runInInjectionContext(() => {
      const w = injectWizardState({ steps: basicSteps });
      expect(w.progress()).toBe(0);
      w.next();
      expect(w.progress()).toBe(50);
      w.next();
      expect(w.progress()).toBe(100);
    });
  });

  it('supports storage adapter for resumability', () => {
    const storage: WizardStorage = {
      save: vi.fn(),
      restore: vi.fn().mockReturnValue(null),
      clear: vi.fn(),
    };
    TestBed.runInInjectionContext(() => {
      const w = injectWizardState({ steps: basicSteps, storage });
      w.next();
      expect(storage.save).toHaveBeenCalled();
    });
  });

  it('restores from storage adapter', () => {
    const storage: WizardStorage = {
      save: vi.fn(),
      restore: vi.fn().mockReturnValue({ currentIndex: 1, isFinished: false }),
      clear: vi.fn(),
    };
    TestBed.runInInjectionContext(() => {
      const w = injectWizardState({ steps: basicSteps, storage });
      expect(w.currentIndex()).toBe(1);
      expect(w.currentStep()?.id).toBe('config');
    });
  });

  it('isFirst and isLast are correct', () => {
    TestBed.runInInjectionContext(() => {
      const w = injectWizardState({ steps: basicSteps });
      expect(w.isFirst()).toBe(true);
      expect(w.isLast()).toBe(false);
      w.next();
      expect(w.isFirst()).toBe(false);
      expect(w.isLast()).toBe(false);
      w.next();
      expect(w.isFirst()).toBe(false);
      expect(w.isLast()).toBe(true);
    });
  });

  it('canGoBack is false on first step', () => {
    TestBed.runInInjectionContext(() => {
      const w = injectWizardState({ steps: basicSteps });
      expect(w.canGoBack()).toBe(false);
      w.next();
      expect(w.canGoBack()).toBe(true);
    });
  });
});
