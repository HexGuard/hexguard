import { Injectable, signal } from '@angular/core';
import type { PermissionState } from './types';

/**
 * Singleton service managing clipboard interaction state.
 *
 * All `injectClipboard()` calls share the same `lastCopied`, `history`,
 * `permissionState`, and other signals, ensuring cross-component consistency.
 */
@Injectable({ providedIn: 'root' })
export class ClipboardService {
  private _historySize = 10;

  readonly lastCopied = signal<string | null>(null);
  readonly lastPasted = signal<string | null>(null);
  readonly history = signal<readonly string[]>([]);
  readonly isCopying = signal(false);
  readonly copyError = signal<string | null>(null);
  readonly permissionState = signal<PermissionState>(
    detectPermissionState(),
  );

  setHistorySize(size: number): void {
    this._historySize = size;
  }

  addToHistory(text: string): void {
    const current = this.history().slice(0, this._historySize - 1);
    this.history.set([text, ...current]);
  }

  clearHistory(): void {
    this.history.set([]);
  }
}

function detectPermissionState(): PermissionState {
  if (typeof navigator === 'undefined') return 'unsupported';
  if (!navigator.clipboard) return 'unsupported';
  if (typeof navigator.permissions === 'undefined') return 'prompt';
  return 'prompt';
}
