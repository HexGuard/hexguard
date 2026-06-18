import { debouncedSignal } from './debounce';

describe(debouncedSignal.name, () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('trailing-only (default)', () => {
    it('emits the initial value immediately', () => {
      const debounced = debouncedSignal('a', 100);
      expect(debounced.value()).toBe('a');
    });

    it('delays emission after set()', () => {
      const debounced = debouncedSignal('a', 100);

      debounced.set('b');
      // Should still show old value before the timer fires
      expect(debounced.value()).toBe('a');

      vi.advanceTimersByTime(100);
      expect(debounced.value()).toBe('b');
    });

    it('resets the timer on rapid set() calls', () => {
      const debounced = debouncedSignal('a', 100);

      debounced.set('b');
      vi.advanceTimersByTime(50);
      debounced.set('c');
      vi.advanceTimersByTime(50);
      expect(debounced.value()).toBe('a');

      vi.advanceTimersByTime(50);
      expect(debounced.value()).toBe('c');
    });

    it('shows isPending while a trailing flush is scheduled', () => {
      const debounced = debouncedSignal('a', 100);

      expect(debounced.isPending()).toBe(false);

      debounced.set('b');
      expect(debounced.isPending()).toBe(true);

      vi.advanceTimersByTime(100);
      expect(debounced.isPending()).toBe(false);
    });
  });

  describe('leading-only', () => {
    it('emits immediately on each set()', () => {
      const debounced = debouncedSignal('a', 100, { leading: true, trailing: false });

      expect(debounced.value()).toBe('a');

      debounced.set('b');
      expect(debounced.value()).toBe('b');

      vi.advanceTimersByTime(200);
      expect(debounced.value()).toBe('b');
    });

    it('is never pending', () => {
      const debounced = debouncedSignal('a', 100, { leading: true, trailing: false });

      expect(debounced.isPending()).toBe(false);
      debounced.set('b');
      expect(debounced.isPending()).toBe(false);
    });
  });

  describe('both edges (leading + trailing)', () => {
    it('emits on leading edge and again after trailing delay', () => {
      const debounced = debouncedSignal('a', 100, { leading: true, trailing: true });

      expect(debounced.value()).toBe('a');

      debounced.set('b');
      expect(debounced.value()).toBe('b');

      vi.advanceTimersByTime(100);
      // Trailing: emits again after delay
      expect(debounced.value()).toBe('b');
    });

    it('emits on every leading edge even during rapid set() calls', () => {
      const debounced = debouncedSignal('a', 100, { leading: true, trailing: true });

      debounced.set('b');
      expect(debounced.value()).toBe('b');

      // Rapid subsequent call — should also emit on leading edge
      debounced.set('c');
      expect(debounced.value()).toBe('c');

      vi.advanceTimersByTime(100);
      // Trailing emits the last set value
      expect(debounced.value()).toBe('c');
    });

    it('shows isPending between leading emission and trailing flush', () => {
      const debounced = debouncedSignal('a', 100, { leading: true, trailing: true });

      debounced.set('b');
      expect(debounced.isPending()).toBe(true);

      vi.advanceTimersByTime(100);
      expect(debounced.isPending()).toBe(false);
    });
  });

  describe('flush()', () => {
    it('immediately emits the current pending value', () => {
      const debounced = debouncedSignal('a', 100);

      debounced.set('b');
      expect(debounced.value()).toBe('a');

      debounced.flush();
      expect(debounced.value()).toBe('b');
      expect(debounced.isPending()).toBe(false);
    });
  });

  describe('cancel()', () => {
    it('cancels a pending timeout without emitting', () => {
      const debounced = debouncedSignal('a', 100);

      debounced.set('b');
      debounced.cancel();
      expect(debounced.isPending()).toBe(false);

      vi.advanceTimersByTime(100);
      expect(debounced.value()).toBe('a');
    });
  });

  describe('set()', () => {
    it('updates the value after debounce delay', () => {
      const debounced = debouncedSignal('a', 100);

      debounced.set('b');
      vi.advanceTimersByTime(100);
      expect(debounced.value()).toBe('b');
    });

    it('handles repeated set() calls with the same value', () => {
      const debounced = debouncedSignal('a', 100);

      debounced.set('b');
      vi.advanceTimersByTime(50);
      debounced.set('b');
      vi.advanceTimersByTime(50);
      // Timer should have been reset by the second set() with the same value
      expect(debounced.value()).toBe('a');

      vi.advanceTimersByTime(50);
      expect(debounced.value()).toBe('b');
    });
  });
});
