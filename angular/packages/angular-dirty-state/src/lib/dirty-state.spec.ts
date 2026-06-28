import { TestBed } from '@angular/core/testing';
import { injectDirtyState, injectDirtyGuard } from './dirty-state';

describe(injectDirtyState.name, () => {
  it('starts clean', () => {
    TestBed.runInInjectionContext(() => {
      const ds = injectDirtyState();
      expect(ds.isDirty()).toBe(false);
    });
  });

  it('markDirty sets isDirty to true', () => {
    TestBed.runInInjectionContext(() => {
      const ds = injectDirtyState();
      ds.markDirty();
      expect(ds.isDirty()).toBe(true);
    });
  });

  it('markClean sets isDirty to false', () => {
    TestBed.runInInjectionContext(() => {
      const ds = injectDirtyState();
      ds.markDirty();
      ds.markClean();
      expect(ds.isDirty()).toBe(false);
    });
  });

  it('reset sets isDirty to false', () => {
    TestBed.runInInjectionContext(() => {
      const ds = injectDirtyState();
      ds.markDirty();
      ds.reset();
      expect(ds.isDirty()).toBe(false);
    });
  });

  it('multiple markDirty calls keep dirty true', () => {
    TestBed.runInInjectionContext(() => {
      const ds = injectDirtyState();
      ds.markDirty();
      ds.markDirty();
      expect(ds.isDirty()).toBe(true);
    });
  });

  it('snapshot returns current state', () => {
    TestBed.runInInjectionContext(() => {
      const ds = injectDirtyState();
      expect(ds.snapshot()).toEqual({ dirty: false });
      ds.markDirty();
      expect(ds.snapshot()).toEqual({ dirty: true });
    });
  });

  it('markClean after multiple marks works', () => {
    TestBed.runInInjectionContext(() => {
      const ds = injectDirtyState();
      ds.markDirty();
      ds.markDirty();
      ds.markClean();
      expect(ds.isDirty()).toBe(false);
    });
  });
});

describe(injectDirtyGuard.name, () => {
  beforeEach(() => {
    vi.stubGlobal('confirm', vi.fn(() => false));
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('returns true when not dirty', () => {
    TestBed.runInInjectionContext(() => {
      const ds = injectDirtyState();
      const guard = injectDirtyGuard(ds);
      expect(guard({} as never, {} as never, {} as never, {} as never)).toBe(true);
    });
  });

  it('returns confirm result when dirty', () => {
    TestBed.runInInjectionContext(() => {
      const ds = injectDirtyState();
      ds.markDirty();
      const guard = injectDirtyGuard(ds);
      expect(guard({} as never, {} as never, {} as never, {} as never)).toBe(false);
    });
  });

  it('uses custom message from options', () => {
    TestBed.runInInjectionContext(() => {
      const confirm = vi.fn(() => true);
      vi.stubGlobal('confirm', confirm);
      const ds = injectDirtyState();
      ds.markDirty();
      const guard = injectDirtyGuard(ds, { message: 'Custom?' });
      guard({} as never, {} as never, {} as never, {} as never);
      expect(confirm).toHaveBeenCalledWith('Custom?');
    });
  });
});
