import { describe, it, expect } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { defineVariants } from './define-variants';
import { injectVariantState } from './variant-state';
import { useVariants } from './use-variants';
import { extendVariants } from './extend-variants';

const BUTTON_VARIANTS = defineVariants(
  {
    size: { sm: 'btn-sm', md: 'btn-md', lg: 'btn-lg' },
    color: {
      primary: 'btn-primary',
      secondary: 'btn-secondary',
      outline: 'btn-outline',
    },
    state: { default: '', loading: 'btn-loading', disabled: 'btn-disabled' },
  },
  {
    defaults: { size: 'md', color: 'primary', state: 'default' },
    aria: {
      'state.loading': { 'aria-busy': 'true' },
      'state.disabled': { 'aria-disabled': 'true' },
    },
  },
);

describe('defineVariants', () => {
  it('creates a variant definition with groups', () => {
    expect(Object.keys(BUTTON_VARIANTS.groups).length).toBeGreaterThan(0);
    expect(BUTTON_VARIANTS.groups['size']).toBeDefined();
    expect(BUTTON_VARIANTS.groups['size']['sm']).toBe('btn-sm');
  });

  it('resolves defaults', () => {
    expect(BUTTON_VARIANTS.defaults['size']).toBe('md');
    expect(BUTTON_VARIANTS.defaults['color']).toBe('primary');
    expect(BUTTON_VARIANTS.defaults['state']).toBe('default');
  });

  it('uses first variant as default when not specified', () => {
    const def = defineVariants({ theme: { light: 'theme-light', dark: 'theme-dark' } });
    expect(def.defaults['theme']).toBe('light');
  });

  it('stores ARIA mappings', () => {
    expect(BUTTON_VARIANTS.aria['state.loading']).toEqual({ 'aria-busy': 'true' });
    expect(BUTTON_VARIANTS.aria['state.disabled']).toEqual({ 'aria-disabled': 'true' });
  });

  it('throws on empty variant group', () => {
    expect(() => defineVariants({ empty: {} })).toThrow();
  });

  it('throws on invalid default group reference', () => {
    expect(() =>
      defineVariants({ size: { sm: 'btn-sm' } }, { defaults: { unknown: 'x' } }),
    ).toThrow(/unknown variant group/i);
  });

  it('throws on invalid default variant reference', () => {
    expect(() => defineVariants({ size: { sm: 'btn-sm' } }, { defaults: { size: 'xl' } })).toThrow(
      /not found/i,
    );
  });
});

describe('injectVariantState', () => {
  it('initializes to defaults', () => {
    TestBed.runInInjectionContext(() => {
      const state = injectVariantState(BUTTON_VARIANTS);
      expect(state.get('size')()).toBe('md');
      expect(state.get('color')()).toBe('primary');
    });
  });

  it('cssClasses returns space-joined class string', () => {
    TestBed.runInInjectionContext(() => {
      const state = injectVariantState(BUTTON_VARIANTS);
      expect(state.cssClasses()).toContain('btn-md');
      expect(state.cssClasses()).toContain('btn-primary');
    });
  });

  it('set() updates variant value', () => {
    TestBed.runInInjectionContext(() => {
      const state = injectVariantState(BUTTON_VARIANTS);
      state.set('size', 'lg');
      expect(state.get('size')()).toBe('lg');
      expect(state.cssClasses()).toContain('btn-lg');
    });
  });

  it('set() throws on unknown group', () => {
    TestBed.runInInjectionContext(() => {
      const state = injectVariantState(BUTTON_VARIANTS);
      expect(() => state.set('unknown', 'x')).toThrow();
    });
  });

  it('set() throws on unknown variant', () => {
    TestBed.runInInjectionContext(() => {
      const state = injectVariantState(BUTTON_VARIANTS);
      expect(() => state.set('size', 'xxl')).toThrow();
    });
  });

  it('aria signal reflects current state', () => {
    TestBed.runInInjectionContext(() => {
      const state = injectVariantState(BUTTON_VARIANTS);
      state.set('state', 'loading');
      expect(state.aria()['aria-busy']).toBe('true');
    });
  });

  it('aria signal is empty for default state', () => {
    TestBed.runInInjectionContext(() => {
      const state = injectVariantState(BUTTON_VARIANTS);
      expect(Object.keys(state.aria()).length).toBe(0);
    });
  });

  it('values signal reflects all current variants', () => {
    TestBed.runInInjectionContext(() => {
      const state = injectVariantState(BUTTON_VARIANTS);
      const vals = state.values();
      expect(vals['size']).toBe('md');
      expect(vals['color']).toBe('primary');
      expect(vals['state']).toBe('default');
    });
  });

  it('cssClasses excludes empty class strings', () => {
    TestBed.runInInjectionContext(() => {
      const state = injectVariantState(BUTTON_VARIANTS);
      // 'default' variant has empty class string — it should not appear
      const classes = state.cssClasses();
      expect(classes).not.toContain('  '); // no double spaces
      expect(classes.trim()).toBe(classes); // no leading/trailing space
    });
  });
});

describe('useVariants', () => {
  it('returns a VariantState identical to injectVariantState', () => {
    TestBed.runInInjectionContext(() => {
      const state = useVariants(BUTTON_VARIANTS);
      expect(state.cssClasses()).toContain('btn-md');
      state.set('color', 'secondary');
      expect(state.cssClasses()).toContain('btn-secondary');
    });
  });
});

describe('extendVariants', () => {
  it('adds new variant groups', () => {
    const extended = extendVariants(BUTTON_VARIANTS, {
      shape: { circle: 'btn-circle', square: 'btn-square' },
    });

    expect(extended.groups['shape']).toBeDefined();
    expect(extended.groups['shape']['circle']).toBe('btn-circle');

    // Original groups preserved
    expect(extended.groups['size']['sm']).toBe('btn-sm');
  });

  it('preserves base defaults', () => {
    const extended = extendVariants(BUTTON_VARIANTS, {
      shape: { circle: 'btn-circle', square: 'btn-square' },
    });

    expect(extended.defaults['size']).toBe('md');
    expect(extended.defaults['color']).toBe('primary');
  });

  it('allows overriding defaults for new groups', () => {
    const extended = extendVariants(
      BUTTON_VARIANTS,
      { shape: { circle: 'btn-circle', square: 'btn-square' } },
      { defaults: { shape: 'circle' } },
    );

    expect(extended.defaults['shape']).toBe('circle');
  });

  it('preserves ARIA mappings', () => {
    const extended = extendVariants(BUTTON_VARIANTS, {
      shape: { circle: 'btn-circle', square: 'btn-square' },
    });

    expect(extended.aria['state.loading']).toEqual({ 'aria-busy': 'true' });
  });

  it('throws when extending with an existing group name', () => {
    expect(() => extendVariants(BUTTON_VARIANTS, { size: { xs: 'btn-xs' } })).toThrow(
      /already exists/i,
    );
  });
});
