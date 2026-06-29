import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { injectRecentlyViewed } from './recently-viewed';

function item(id: string, label?: string, ts?: number) {
  return { id, label: label ?? id, viewedAt: ts ?? Date.now() };
}

describe('injectRecentlyViewed', () => {
  function setup<TMeta>(options?: Parameters<typeof injectRecentlyViewed>[0]) {
    @Component({ template: '', standalone: true })
    class TestComponent {
      readonly recent = injectRecentlyViewed<TMeta>(options);
    }
    const fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();
    TestBed.flushEffects();
    return fixture.componentInstance.recent;
  }

  beforeEach(() => { window.localStorage.clear(); });
  afterEach(() => { window.localStorage.clear(); });

  it('should start empty', () => {
    const recent = setup();
    expect(recent.items()).toEqual([]);
    expect(recent.count()).toBe(0);
  });

  it('should add an item to the front', () => {
    const recent = setup();
    recent.add(item('a', 'Item A', 100));
    expect(recent.items()).toHaveLength(1);
    expect(recent.items()[0].id).toBe('a');
  });

  it('should prepend new items', () => {
    const recent = setup();
    recent.add(item('a', 'A', 200));
    recent.add(item('b', 'B', 100));
    expect(recent.items().map((i) => i.id)).toEqual(['b', 'a']);
  });

  it('should dedup by id with replace strategy', () => {
    const recent = setup();
    recent.add(item('a', 'A', 100));
    recent.add(item('b', 'B', 200));
    recent.add(item('a', 'A-updated', 300));
    expect(recent.items()).toHaveLength(2);
    expect(recent.items()[0].id).toBe('a');
    expect(recent.items()[0].label).toBe('A-updated');
  });

  it('should dedup by id with ignore strategy', () => {
    const recent = setup({ dedup: 'ignore' });
    recent.add(item('a', 'A', 100));
    recent.add(item('a', 'A-ignored', 200));
    expect(recent.items()).toHaveLength(1);
    expect(recent.items()[0].label).toBe('A');
  });

  it('should allow duplicates with allow-duplicates strategy', () => {
    const recent = setup({ dedup: 'allow-duplicates' });
    recent.add(item('a', 'A', 100));
    recent.add(item('a', 'A-dup', 200));
    expect(recent.items()).toHaveLength(2);
  });

  it('should respect maxItems', () => {
    const recent = setup({ maxItems: 3 });
    recent.add(item('a', 'A', 300));
    recent.add(item('b', 'B', 200));
    recent.add(item('c', 'C', 100));
    recent.add(item('d', 'D', 50));
    expect(recent.items()).toHaveLength(3);
    expect(recent.items().map((i) => i.id)).toEqual(['d', 'c', 'b']);
  });

  it('should filter stale items when ttlMs is set', () => {
    const recent = setup({ ttlMs: 100 });
    recent.add(item('fresh', 'Fresh', Date.now()));
    recent.add(item('stale', 'Stale', Date.now() - 200));
    expect(recent.items()).toHaveLength(1);
    expect(recent.items()[0].id).toBe('fresh');
  });

  it('should remove an item by id', () => {
    const recent = setup();
    recent.add(item('a', 'A', 100));
    recent.add(item('b', 'B', 200));
    recent.remove('a');
    expect(recent.items()).toHaveLength(1);
    expect(recent.items()[0].id).toBe('b');
  });

  it('should clear all items', () => {
    const recent = setup();
    recent.add(item('a', 'A', 100));
    recent.add(item('b', 'B', 200));
    recent.clear();
    expect(recent.items()).toEqual([]);
  });

  it('should count items', () => {
    const recent = setup();
    expect(recent.count()).toBe(0);
    recent.add(item('a', 'A', 100));
    expect(recent.count()).toBe(1);
    recent.add(item('b', 'B', 200));
    expect(recent.count()).toBe(2);
    recent.remove('a');
    expect(recent.count()).toBe(1);
  });
});
