import { describe, it, expect } from 'vitest';
import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { skeletonState, bindLoading } from './skeleton-state';

describe('skeletonState', () => {
  it('defaults to inactive, text variant, count 1', () => {
    const s = skeletonState();
    expect(s.isActive()).toBe(false);
    expect(s.variant()).toBe('text');
    expect(s.count()).toBe(1);
    expect(s.shimmer().active).toBe(true);
    expect(s.shimmer().durationMs).toBe(1500);
  });

  it('show() sets isActive to true', () => {
    const s = skeletonState();
    s.show();
    expect(s.isActive()).toBe(true);
  });

  it('hide() sets isActive to false', () => {
    const s = skeletonState();
    s.show();
    s.hide();
    expect(s.isActive()).toBe(false);
  });

  it('setVariant() updates variant signal', () => {
    const s = skeletonState();
    s.setVariant('card');
    expect(s.variant()).toBe('card');
  });

  it('setCount() updates count signal', () => {
    const s = skeletonState();
    s.setCount(5);
    expect(s.count()).toBe(5);
  });

  it('setCount() clamps negative values to 0', () => {
    const s = skeletonState();
    s.setCount(-3);
    expect(s.count()).toBe(0);
  });

  it('accepts custom options', () => {
    const s = skeletonState({
      variant: 'circle',
      count: 3,
      shimmer: false,
      shimmerDurationMs: 2000,
    });
    expect(s.variant()).toBe('circle');
    expect(s.count()).toBe(3);
    expect(s.shimmer().active).toBe(false);
    expect(s.shimmer().durationMs).toBe(2000);
  });

  it('shimmer signal is reactive', () => {
    const s = skeletonState({ shimmer: true, shimmerDurationMs: 800 });
    expect(s.shimmer().active).toBe(true);
    expect(s.shimmer().durationMs).toBe(800);
  });
});

describe('bindLoading', () => {
  it('shows skeleton when loading is true', () => {
    TestBed.runInInjectionContext(() => {
      const loading = signal(false);
      const s = skeletonState();

      bindLoading(s, loading);

      loading.set(true);
      TestBed.flushEffects();
      expect(s.isActive()).toBe(true);
    });
  });

  it('hides skeleton when loading is false', () => {
    TestBed.runInInjectionContext(() => {
      const loading = signal(true);
      const s = skeletonState();
      s.show();

      bindLoading(s, loading);

      loading.set(false);
      TestBed.flushEffects();
      expect(s.isActive()).toBe(false);
    });
  });
});
