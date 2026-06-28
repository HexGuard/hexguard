import { TestBed } from '@angular/core/testing';
import { injectClipboard } from './clipboard';

describe(injectClipboard.name, () => {
  beforeEach(() => {
    // Mock navigator.clipboard if not available in test environment
    if (typeof navigator !== 'undefined' && !navigator.clipboard) {
      Object.defineProperty(navigator, 'clipboard', {
        value: { writeText: vi.fn(), readText: vi.fn() },
        writable: true,
        configurable: true,
      });
    }
  });

  it('starts with default values', () => {
    TestBed.runInInjectionContext(() => {
      const clip = injectClipboard();
      expect(clip.lastCopied()).toBeNull();
      expect(clip.lastPasted()).toBeNull();
      expect(clip.history()).toEqual([]);
      expect(clip.isCopying()).toBe(false);
      expect(clip.copyError()).toBeNull();
    });
  });

  it('copy calls navigator.clipboard.writeText', async () => {
    await TestBed.runInInjectionContext(async () => {
      const writeText = vi.fn().mockResolvedValue(undefined);
      Object.defineProperty(navigator, 'clipboard', {
        value: { writeText, readText: vi.fn() },
        configurable: true,
      });

      const clip = injectClipboard();
      const result = await clip.copy('hello');

      expect(result).toBe(true);
      expect(writeText).toHaveBeenCalledWith('hello');
      expect(clip.lastCopied()).toBe('hello');
    });
  });

  it('copy updates history', async () => {
    await TestBed.runInInjectionContext(async () => {
      const writeText = vi.fn().mockResolvedValue(undefined);
      Object.defineProperty(navigator, 'clipboard', {
        value: { writeText, readText: vi.fn() },
        configurable: true,
      });

      const clip = injectClipboard();
      await clip.copy('first');
      await clip.copy('second');

      expect(clip.history()).toEqual(['second', 'first']);
    });
  });

  it('copy returns false on failure', async () => {
    await TestBed.runInInjectionContext(async () => {
      const writeText = vi.fn().mockRejectedValue(new Error('Permission denied'));
      Object.defineProperty(navigator, 'clipboard', {
        value: { writeText, readText: vi.fn() },
        configurable: true,
      });

      const clip = injectClipboard();
      const result = await clip.copy('fail');

      expect(result).toBe(false);
      expect(clip.lastCopied()).toBeNull();
      expect(clip.copyError()).toBe('Permission denied');
    });
  });

  it('copy uses execCommand fallback when clipboard API unavailable', async () => {
    await TestBed.runInInjectionContext(async () => {
      Object.defineProperty(navigator, 'clipboard', {
        value: undefined,
        configurable: true,
      });

      // execCommand is not available in jsdom, but should not throw
      const clip = injectClipboard();
      // This should attempt the fallback and return false since execCommand is unavailable
      const result = await clip.copy('fallback test');
      expect(result).toBe(false);
    });
  });

  it('paste returns null when clipboard API unavailable', async () => {
    await TestBed.runInInjectionContext(async () => {
      Object.defineProperty(navigator, 'clipboard', {
        value: undefined,
        configurable: true,
      });

      const clip = injectClipboard();
      const result = await clip.paste();
      expect(result).toBeNull();
    });
  });

  it('paste reads from clipboard when available', async () => {
    await TestBed.runInInjectionContext(async () => {
      const readText = vi.fn().mockResolvedValue('pasted content');
      Object.defineProperty(navigator, 'clipboard', {
        value: { writeText: vi.fn(), readText },
        configurable: true,
      });

      const clip = injectClipboard();
      const result = await clip.paste();

      expect(result).toBe('pasted content');
      expect(clip.lastPasted()).toBe('pasted content');
    });
  });

  it('clearHistory removes all entries', async () => {
    await TestBed.runInInjectionContext(async () => {
      const writeText = vi.fn().mockResolvedValue(undefined);
      Object.defineProperty(navigator, 'clipboard', {
        value: { writeText, readText: vi.fn() },
        configurable: true,
      });

      const clip = injectClipboard();
      await clip.copy('a');
      await clip.copy('b');
      expect(clip.history()).toHaveLength(2);

      clip.clearHistory();
      expect(clip.history()).toEqual([]);
    });
  });

  it('history is capped at configured size', async () => {
    await TestBed.runInInjectionContext(async () => {
      const writeText = vi.fn().mockResolvedValue(undefined);
      Object.defineProperty(navigator, 'clipboard', {
        value: { writeText, readText: vi.fn() },
        configurable: true,
      });

      const clip = injectClipboard({ historySize: 3 });
      await clip.copy('a');
      await clip.copy('b');
      await clip.copy('c');
      await clip.copy('d');

      expect(clip.history()).toHaveLength(3);
      expect(clip.history()[0]).toBe('d');
      expect(clip.history()[2]).toBe('b');
    });
  });

  it('starts with prompt permission state by default', () => {
    TestBed.runInInjectionContext(() => {
      const clip = injectClipboard();
      // Initial state is 'prompt' since navigator exists in test env.
      // The async permission query may update it via microtask.
      expect(['prompt', 'unsupported']).toContain(clip.permissionState());
    });
  });
});
