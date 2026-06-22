import { inject, signal } from '@angular/core';
import type { ConfirmationHandle, ConfirmationRequest, ConfirmationResult } from './types';

let nextId = 0;

export function injectConfirmation(): ConfirmationHandle {
  const isOpen = signal(false);
  const currentRequest = signal<ConfirmationRequest | null>(null);
  let resolveCurrent: ((value: boolean) => void) | null = null;

  function ask(request: Omit<ConfirmationRequest, 'id'>): Promise<boolean> {
    if (isOpen()) {
      return Promise.resolve(false);
    }
    const id = `confirm-${++nextId}`;
    const req: ConfirmationRequest = { id, ...request };
    currentRequest.set(req);
    isOpen.set(true);
    return new Promise<boolean>((resolve) => {
      resolveCurrent = resolve;
    });
  }

  function confirm(): void {
    isOpen.set(false);
    currentRequest.set(null);
    resolveCurrent?.(true);
    resolveCurrent = null;
  }

  function cancel(): void {
    isOpen.set(false);
    currentRequest.set(null);
    resolveCurrent?.(false);
    resolveCurrent = null;
  }

  async function run<T>(
    request: Omit<ConfirmationRequest, 'id'>,
    action: () => Promise<T>,
  ): Promise<ConfirmationResult<T>> {
    const ok = await ask(request);
    if (!ok) {
      return { confirmed: false };
    }
    const result = await action();
    return { confirmed: true, result };
  }

  return {
    isOpen: isOpen.asReadonly(),
    currentRequest: currentRequest.asReadonly(),
    ask,
    run,
    confirm,
    cancel,
  };
}
