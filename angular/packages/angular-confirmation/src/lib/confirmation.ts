import { DestroyRef, inject } from '@angular/core';
import type { ConfirmationHandle, ConfirmationRequest, ConfirmationResult } from './types';
import { ConfirmationService } from './confirmation-service';

export function injectConfirmation(): ConfirmationHandle {
  const service = inject(ConfirmationService);
  const destroyRef = inject(DestroyRef);

  destroyRef.onDestroy(() => {
    service.cleanup();
  });

  async function run<T>(
    request: Omit<ConfirmationRequest, 'id'>,
    action: () => Promise<T>,
  ): Promise<ConfirmationResult<T>> {
    const ok = await service.ask(request);
    if (!ok) {
      return { confirmed: false };
    }
    const result = await action();
    return { confirmed: true, result };
  }

  return {
    isOpen: service.isOpen.asReadonly(),
    currentRequest: service.currentRequest.asReadonly(),
    ask: (request) => service.ask(request),
    run,
    confirm: () => service.confirm(),
    cancel: () => service.cancel(),
  };
}
