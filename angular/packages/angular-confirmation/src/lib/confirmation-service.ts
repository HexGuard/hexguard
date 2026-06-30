import { Injectable, signal } from '@angular/core';
import type { ConfirmationHandle, ConfirmationRequest, ConfirmationResult } from './types';

let nextId = 0;

/**
 * Singleton service managing the confirmation dialog state.
 *
 * Only one confirmation dialog can be open at a time. All
 * `injectConfirmation()` calls share the same `isOpen` and
 * `currentRequest` signals.
 */
@Injectable({ providedIn: 'root' })
export class ConfirmationService {
  readonly isOpen = signal(false);
  readonly currentRequest = signal<ConfirmationRequest | null>(null);

  private resolveCurrent: ((value: boolean) => void) | null = null;

  ask(request: Omit<ConfirmationRequest, 'id'>): Promise<boolean> {
    if (this.isOpen()) {
      return Promise.resolve(false);
    }
    const id = `confirm-${++nextId}`;
    const req: ConfirmationRequest = { id, ...request };
    this.currentRequest.set(req);
    this.isOpen.set(true);
    return new Promise<boolean>((resolve) => {
      this.resolveCurrent = resolve;
    });
  }

  confirm(): void {
    this.isOpen.set(false);
    this.currentRequest.set(null);
    this.resolveCurrent?.(true);
    this.resolveCurrent = null;
  }

  cancel(): void {
    this.isOpen.set(false);
    this.currentRequest.set(null);
    this.resolveCurrent?.(false);
    this.resolveCurrent = null;
  }

  cleanup(): void {
    this.isOpen.set(false);
    this.currentRequest.set(null);
    this.resolveCurrent?.(false);
    this.resolveCurrent = null;
  }
}
