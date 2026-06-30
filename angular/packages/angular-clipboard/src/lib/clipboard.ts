import { inject } from '@angular/core';
import type { ClipboardConfig, ClipboardHandle } from './types';
import { ClipboardService } from './clipboard-service';

export function injectClipboard(config?: ClipboardConfig): ClipboardHandle {
  const service = inject(ClipboardService);

  if (config?.historySize != null) {
    service.setHistorySize(config.historySize);
  }

  async function queryPermission(): Promise<void> {
    if (typeof navigator === 'undefined' || !navigator.permissions?.query) return;
    try {
      const result = await navigator.permissions.query({ name: 'clipboard-write' as PermissionName });
      service.permissionState.set(result.state as 'granted' | 'denied' | 'prompt' | 'unsupported');
      result.addEventListener('change', () => {
        service.permissionState.set(result.state as 'granted' | 'denied' | 'prompt' | 'unsupported');
      });
    } catch {
      // Permission query not supported; remain at current state
    }
  }

  async function copy(text: string): Promise<boolean> {
    service.isCopying.set(true);
    service.copyError.set(null);

    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        // Fallback for older browsers or non-HTTPS contexts
        fallbackCopy(text);
      }
      service.lastCopied.set(text);
      service.addToHistory(text);
      service.isCopying.set(false);
      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Copy failed';
      service.copyError.set(message);
      service.isCopying.set(false);
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
      service.lastPasted.set(text);
      return text;
    } catch {
      return null;
    }
  }

  // Kick off async permission query
  queueMicrotask(() => {
    void queryPermission();
  });

  return {
    lastCopied: service.lastCopied.asReadonly(),
    lastPasted: service.lastPasted.asReadonly(),
    history: service.history.asReadonly(),
    isCopying: service.isCopying.asReadonly(),
    copyError: service.copyError.asReadonly(),
    permissionState: service.permissionState.asReadonly(),
    copy,
    paste,
    clearHistory: () => service.clearHistory(),
  };
}
