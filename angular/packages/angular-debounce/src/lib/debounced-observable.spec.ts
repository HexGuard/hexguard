import { Subject } from 'rxjs';
import { debouncedObservable } from './debounced-observable';

describe('debouncedObservable', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('trailing-only (default)', () => {
    it('delays emission after source emits', () => {
      const source$ = new Subject<string>();
      const values: string[] = [];
      const sub = debouncedObservable(source$, 100).subscribe((v) => values.push(v));

      source$.next('a');
      expect(values).toEqual([]);

      vi.advanceTimersByTime(100);
      expect(values).toEqual(['a']);
      sub.unsubscribe();
    });

    it('resets the timer on rapid emissions', () => {
      const source$ = new Subject<string>();
      const values: string[] = [];
      const sub = debouncedObservable(source$, 100).subscribe((v) => values.push(v));

      source$.next('a');
      vi.advanceTimersByTime(50);
      source$.next('b');
      vi.advanceTimersByTime(50);
      expect(values).toEqual([]);

      vi.advanceTimersByTime(50);
      expect(values).toEqual(['b']);
      sub.unsubscribe();
    });
  });

  describe('leading-only', () => {
    it('emits immediately on each source emission', () => {
      const source$ = new Subject<string>();
      const values: string[] = [];
      const sub = debouncedObservable(source$, 100, { leading: true, trailing: false }).subscribe(
        (v) => values.push(v),
      );

      source$.next('a');
      expect(values).toEqual(['a']);

      source$.next('b');
      expect(values).toEqual(['a', 'b']);

      vi.advanceTimersByTime(200);
      expect(values).toEqual(['a', 'b']);
      sub.unsubscribe();
    });
  });

  describe('both edges (leading + trailing)', () => {
    it('emits on leading edge and again after trailing delay', () => {
      const source$ = new Subject<string>();
      const values: string[] = [];
      const sub = debouncedObservable(source$, 100, { leading: true, trailing: true }).subscribe(
        (v) => values.push(v),
      );

      source$.next('a');
      expect(values).toEqual(['a']);

      vi.advanceTimersByTime(100);
      expect(values).toEqual(['a', 'a']);
      sub.unsubscribe();
    });

    it('tracks the last value for trailing emission', () => {
      const source$ = new Subject<string>();
      const values: string[] = [];
      const sub = debouncedObservable(source$, 100, { leading: true, trailing: true }).subscribe(
        (v) => values.push(v),
      );

      source$.next('a');
      expect(values).toEqual(['a']);
      source$.next('b');
      expect(values).toEqual(['a', 'b']);

      vi.advanceTimersByTime(100);
      expect(values).toEqual(['a', 'b', 'b']);
      sub.unsubscribe();
    });
  });

  describe('error and complete propagation', () => {
    it('forwards errors from the source', () => {
      const source$ = new Subject<string>();
      const errors: unknown[] = [];
      const sub = debouncedObservable(source$, 100).subscribe({ error: (e) => errors.push(e) });

      source$.error(new Error('fail'));
      expect(errors).toHaveLength(1);
      expect((errors[0] as Error).message).toBe('fail');
      sub.unsubscribe();
    });

    it('flushes pending value on source complete', () => {
      const source$ = new Subject<string>();
      const values: string[] = [];
      let completed = false;
      const sub = debouncedObservable(source$, 100).subscribe({
        next: (v) => values.push(v),
        complete: () => {
          completed = true;
        },
      });

      source$.next('a');
      source$.complete();
      expect(values).toEqual(['a']);
      expect(completed).toBe(true);
      sub.unsubscribe();
    });

    it('does not flush when no value is pending on complete', () => {
      const source$ = new Subject<string>();
      const values: string[] = [];
      let completed = false;
      const sub = debouncedObservable(source$, 100).subscribe({
        next: (v) => values.push(v),
        complete: () => {
          completed = true;
        },
      });

      source$.complete();
      expect(values).toEqual([]);
      expect(completed).toBe(true);
      sub.unsubscribe();
    });
  });

  describe('cleanup', () => {
    it('unsubscribes clean up timers and source subscription', () => {
      const source$ = new Subject<string>();
      const values: string[] = [];
      const sub = debouncedObservable(source$, 100).subscribe((v) => values.push(v));

      source$.next('a');
      sub.unsubscribe();

      vi.advanceTimersByTime(200);
      expect(values).toEqual([]);
    });
  });
});
