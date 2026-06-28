import { DestroyRef, inject, signal } from '@angular/core';
import type { ClipboardConfig, ClipboardHandle, PermissionState } from './types';

export function injectClipboard(config?: ClipboardConfig): ClipboardHandle {
  const destroyRef = inject(DestroyRef);
  const historySize = config?.historySize ?? 10;

  const lastCopied = signal<string | null>(null);
  const lastPasted = signal<string | null>(null);
  const history = signal<readonly string[]>([]);
  const isCopying = signal(false);
  const copyError = signal<string | null>(null);
  const permissionState = signal<PermissionState>(detectPermissionState());

  function detectPermissionState(): PermissionState {
    if (typeof navigator === 'undefined') return 'unsupported';
    if (!navigator.clipboard) return 'unsupported';
    if (typeof navigator.permissions === 'undefined') return 'prompt';
    // We'll query async later; initial sync check is conservative
    return 'prompt';
  }

  async function queryPermission(): Promise<void> {
    if (typeof navigator === 'undefined' || !navigator.permissions?.query) return;
    try {
      const result = await navigator.permissions.query({ name: 'clipboard-write' as PermissionName });
      permissionState.set(result.state as PermissionState);
      result.addEventListener('change', () => {
        permissionState.set(result.state as PermissionState);
      });
    } catch {
      // Permission query not supported; remain at current state
    }
  }

  function addToHistory(text: string): void {
    const current = history().slice(0, historySize - 1);
    history.set([text, ...current]);
  }

  async function copy(text: string): Promise<boolean> {
    isCopying.set(true);
    copyError.set(null);

    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        // Fallback for older browsers or non-HTTPS contexts
        fallbackCopy(text);
      }
      lastCopied.set(text);
      addToHistory(text);
      isCopying.set(false);
      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Copy failed';
      copyError.set(message);
      isCopying.set(false);
      return false;
    }
  }

  function fallbackCopy(text: string): void {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    textarea.style.pointerEvents = 'none';
    document.body.appendChild(textarea);
    textarea.select();
    try {
      document.execCommand('copy');
    } finally {
      document.body.removeChild(textarea);
    }
  }

  async function paste(): Promise<string | null> {
    if (!navigator.clipboard?.readText) {
      return null;
    }

    try {
      // Check read permission before attempting
      if (navigator.permissions?.query) {
        const result = await navigator.permissions.query({ name: 'clipboard-read' as PermissionName });
        if (result.state === 'denied') {
          return null;
        }
      }
      const text = await navigator.clipboard.readText();
      lastPasted.set(text);
      return text;
    } catch {
      return null;
    }
  }

  function clearHistory(): void {
    history.set([]);
  }

  // Kick off async permission query
  queueMicrotask(() => {
    void queryPermission();
  });

  destroyRef.onDestroy(() => {
    isCopying.set(false);
    copyError.set(null);
  });

  return {
    lastCopied: lastCopied.asReadonly(),
    lastPasted: lastPasted.asReadonly(),
    history: history.asReadonly(),
    isCopying: isCopying.asReadonly(),
    copyError: copyError.asReadonly(),
    permissionState: permissionState.asReadonly(),
    copy,
    paste,
    clearHistory,
  };
}
