import { describe, expect, it, vi } from 'vitest';

import { asyncAction } from './async-action';
import { withRetry } from './async-action-retry';

describe('withRetry', () => {
  it('should succeed on first attempt', async () => {
    const action = asyncAction<string, string>({
      run: (input) => Promise.resolve(`ok:${input}`),
    });

    const retrying = withRetry(action, { maxRetries: 3, baseDelayMs: 10 });
    const result = await retrying.run('hello');

    expect(result).toBe('ok:hello');
    expect(action.hasSucceeded()).toBe(true);
  });

  it('should retry on failure and eventually succeed', async () => {
    let attempts = 0;
    const action = asyncAction<string, string>({
      run: (input) => {
        attempts++;
        if (attempts < 3) return Promise.reject(new Error('transient'));
        return Promise.resolve(`ok:${input}`);
      },
    });

    const retrying = withRetry(action, { maxRetries: 3, baseDelayMs: 10 });
    const result = await retrying.run('test');

    expect(result).toBe('ok:test');
    expect(attempts).toBe(3);
    expect(retrying.retryCount()).toBe(0); // Reset after success
  });

  it('should fail after exhausting retries', async () => {
    const action = asyncAction<string, string>({
      run: () => Promise.reject(new Error('persistent')),
    });

    const retrying = withRetry(action, { maxRetries: 2, baseDelayMs: 10 });

    await expect(retrying.run('x')).rejects.toThrow('persistent');
    expect(action.hasFailed()).toBe(true);
  });

  it('should respect shouldRetry predicate', async () => {
    const fn = vi.fn();
    const action = asyncAction<string, string>({
      run: () => {
        fn();
        return Promise.reject(new Error('fatal'));
      },
    });

    const retrying = withRetry(action, {
      maxRetries: 3,
      baseDelayMs: 10,
      shouldRetry: () => false,
    });

    await expect(retrying.run('x')).rejects.toThrow('fatal');
    // Only called once — no retry because shouldRetry returned false
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('should expose retryCount and isRetrying signals', async () => {
    let attempts = 0;
    const action = asyncAction<string, string>({
      run: () => {
        attempts++;
        if (attempts < 2) return Promise.reject(new Error('transient'));
        return Promise.resolve('done');
      },
    });

    const retrying = withRetry(action, { maxRetries: 3, baseDelayMs: 10 });
    expect(retrying.retryCount()).toBe(0);
    expect(retrying.isRetrying()).toBe(false);

    await retrying.run('x');

    expect(retrying.retryCount()).toBe(0); // Reset after completion
    expect(attempts).toBe(2);
  });

  it('should forward reset to the underlying action', () => {
    const action = asyncAction<string, string>({
      run: () => Promise.resolve('ok'),
    });

    action.run('first');
    const retrying = withRetry(action, { maxRetries: 2, baseDelayMs: 10 });
    retrying.reset();

    expect(action.isIdle()).toBe(true);
    expect(retrying.retryCount()).toBe(0);
  });
});
