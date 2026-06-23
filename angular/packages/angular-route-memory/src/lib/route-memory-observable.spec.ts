import { createRouteMemory } from './route-memory-observable';

describe('createRouteMemory', () => {
  it('hasMemory$ emits false for unknown key', () => {
    const mem = createRouteMemory();
    const values: boolean[] = [];
    mem.hasMemory$('unknown').subscribe((v) => values.push(v));
    expect(values).toEqual([false]);
  });

  it('hasMemory$ emits true after save', () => {
    const mem = createRouteMemory();
    const values: boolean[] = [];
    mem.hasMemory$('key').subscribe((v) => values.push(v));
    mem.save('key', { data: 1 });
    expect(values[values.length - 1]).toBe(true);
  });

  it('restore returns saved context', () => {
    const mem = createRouteMemory();
    mem.save('key', { foo: 'bar' });
    expect(mem.restore('key')).toEqual({ foo: 'bar' });
  });

  it('restore returns a copy (not a reference)', () => {
    const mem = createRouteMemory();
    mem.save('key', { foo: 'bar' });
    const result = mem.restore('key')!;
    result['foo'] = 'modified';
    expect(mem.restore('key')).toEqual({ foo: 'bar' });
  });

  it('restore returns null for unknown key', () => {
    const mem = createRouteMemory();
    expect(mem.restore('unknown')).toBeNull();
  });

  it('save overwrites previous value', () => {
    const mem = createRouteMemory();
    mem.save('key', { v: 1 });
    mem.save('key', { v: 2 });
    expect(mem.restore('key')).toEqual({ v: 2 });
  });

  it('clear removes the entry', () => {
    const mem = createRouteMemory();
    mem.save('key', { data: 1 });
    mem.clear('key');
    expect(mem.restore('key')).toBeNull();
  });

  it('clearAll removes all entries', () => {
    const mem = createRouteMemory();
    mem.save('a', { v: 1 });
    mem.save('b', { v: 2 });
    mem.clearAll();
    expect(mem.restore('a')).toBeNull();
    expect(mem.restore('b')).toBeNull();
  });

  it('hasMemory$ emits false after clear', () => {
    const mem = createRouteMemory();
    const values: boolean[] = [];
    mem.hasMemory$('key').subscribe((v) => values.push(v));
    mem.save('key', { data: 1 });
    mem.clear('key');
    expect(values[values.length - 1]).toBe(false);
  });
});
