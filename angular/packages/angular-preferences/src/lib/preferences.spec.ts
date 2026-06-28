import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { injectPreferences } from './preferences';
import { pref } from './pref-factory';

const TEST_PREFS = {
  sidebarOpen: pref('test-sidebar-open', true),
  theme: pref('test-theme', 'light' as 'light' | 'dark'),
  pageSize: pref('test-page-size', 20),
} as const;

describe('injectPreferences', () => {
  function setup() {
    @Component({ template: '', standalone: true })
    class TestComponent {
      readonly prefs = injectPreferences(TEST_PREFS);
    }
    const fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();
    return fixture.componentInstance.prefs;
  }

  beforeEach(() => {
    window.localStorage.clear();
  });

  afterEach(() => {
    window.localStorage.clear();
  });

  it('should return default values', () => {
    const prefs = setup();
    expect(prefs.get('sidebarOpen')()).toBe(true);
    expect(prefs.get('theme')()).toBe('light');
    expect(prefs.get('pageSize')()).toBe(20);
  });

  it('should set a preference', () => {
    const prefs = setup();
    prefs.set('sidebarOpen', false);
    expect(prefs.get('sidebarOpen')()).toBe(false);
  });

  it('should persist to storage via angular-storage', () => {
    const prefs = setup();
    prefs.set('theme', 'dark');
    TestBed.flushEffects();
    const stored = window.localStorage.getItem('test-theme');
    expect(stored).not.toBeNull();
    const parsed = JSON.parse(stored!);
    expect(parsed._value).toBe('dark');
  });

  it('should reset a single preference to default', () => {
    const prefs = setup();
    prefs.set('pageSize', 50);
    expect(prefs.get('pageSize')()).toBe(50);
    prefs.reset('pageSize');
    expect(prefs.get('pageSize')()).toBe(20);
  });

  it('should reset all preferences to defaults', () => {
    const prefs = setup();
    prefs.set('sidebarOpen', false);
    prefs.set('theme', 'dark');
    prefs.set('pageSize', 100);
    prefs.resetAll();
    expect(prefs.get('sidebarOpen')()).toBe(true);
    expect(prefs.get('theme')()).toBe('light');
    expect(prefs.get('pageSize')()).toBe(20);
  });

  it('should patch multiple preferences', () => {
    const prefs = setup();
    prefs.patch({ sidebarOpen: false, pageSize: 50 });
    expect(prefs.get('sidebarOpen')()).toBe(false);
    expect(prefs.get('pageSize')()).toBe(50);
    expect(prefs.get('theme')()).toBe('light'); // unchanged
  });

  it('should hydrate from previously stored values', () => {
    window.localStorage.setItem('test-sidebar-open', JSON.stringify({ _value: false, _v: 1 }));

    const prefs = setup();
    expect(prefs.get('sidebarOpen')()).toBe(false);
  });
});
