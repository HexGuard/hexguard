import { TestBed } from '@angular/core/testing';
import { injectTheme } from './theme';

describe(injectTheme.name, () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute('data-theme');
  });

  it('starts with system mode default', () => {
    TestBed.runInInjectionContext(() => {
      const theme = injectTheme();
      expect(theme.mode()).toBe('system');
      expect(typeof theme.effectiveTheme()).toBe('string');
      expect(typeof theme.isDark()).toBe('boolean');
      expect(typeof theme.isLight()).toBe('boolean');
    });
  });

  it('setMode updates the mode signal', () => {
    TestBed.runInInjectionContext(() => {
      const theme = injectTheme();
      theme.setMode('dark');
      expect(theme.mode()).toBe('dark');
      expect(theme.effectiveTheme()).toBe('dark');
      expect(theme.isDark()).toBe(true);
      expect(theme.isLight()).toBe(false);
    });
  });

  it('setMode persists to localStorage', () => {
    TestBed.runInInjectionContext(() => {
      const theme = injectTheme();
      theme.setMode('dark');
      expect(localStorage.getItem('hexguard-theme')).toBe('dark');
    });
  });

  it('setMode with system clears localStorage', () => {
    TestBed.runInInjectionContext(() => {
      const theme = injectTheme();
      theme.setMode('dark');
      theme.setMode('system');
      expect(localStorage.getItem('hexguard-theme')).toBeNull();
    });
  });

  it('toggle switches light to dark', () => {
    TestBed.runInInjectionContext(() => {
      const theme = injectTheme();
      theme.setMode('light');
      theme.toggle();
      expect(theme.mode()).toBe('dark');
    });
  });

  it('toggle switches dark to light', () => {
    TestBed.runInInjectionContext(() => {
      const theme = injectTheme();
      theme.setMode('dark');
      theme.toggle();
      expect(theme.mode()).toBe('light');
    });
  });

  it('resetToSystem resets mode to system', () => {
    TestBed.runInInjectionContext(() => {
      const theme = injectTheme();
      theme.setMode('dark');
      theme.resetToSystem();
      expect(theme.mode()).toBe('system');
    });
  });

  it('applies data-theme attribute on setMode', () => {
    TestBed.runInInjectionContext(() => {
      const theme = injectTheme();
      theme.setMode('dark');
      // Effect runs after current synchronous context
      expect(theme.effectiveTheme()).toBe('dark');
      expect(theme.mode()).toBe('dark');
    });
  });

  it('loads persisted mode from localStorage', () => {
    localStorage.setItem('hexguard-theme', 'dark');
    TestBed.runInInjectionContext(() => {
      const theme = injectTheme();
      expect(theme.mode()).toBe('dark');
    });
  });

  it('accepts custom persistKey', () => {
    TestBed.runInInjectionContext(() => {
      const theme = injectTheme({ persistKey: 'my-theme' });
      theme.setMode('light');
      expect(localStorage.getItem('my-theme')).toBe('light');
      expect(localStorage.getItem('hexguard-theme')).toBeNull();
    });
  });
});
