import { signal } from '@angular/core';
import { selectedItemsToBulkRequest } from './selection-helpers';

describe('selectedItemsToBulkRequest', () => {
  it('maps selected keys to items', () => {
    const selectedSignal = signal<ReadonlySet<string>>(new Set(['a', 'b']));

    const itemsMap: Record<string, { name: string }> = {
      a: { name: 'Item A' },
      b: { name: 'Item B' },
      c: { name: 'Item C' },
    };

    const request = selectedItemsToBulkRequest(selectedSignal, itemsMap);
    expect(request.items).toEqual([{ name: 'Item A' }, { name: 'Item B' }]);
  });

  it('returns empty items when nothing selected', () => {
    const selectedSignal = signal<ReadonlySet<string>>(new Set());

    const itemsMap: Record<string, { name: string }> = {
      a: { name: 'Item A' },
    };

    const request = selectedItemsToBulkRequest(selectedSignal, itemsMap);
    expect(request.items).toEqual([]);
  });

  it('filters out missing items', () => {
    const selectedSignal = signal<ReadonlySet<string>>(new Set(['a', 'nonexistent']));

    const itemsMap: Record<string, { name: string }> = {
      a: { name: 'Item A' },
    };

    const request = selectedItemsToBulkRequest(selectedSignal, itemsMap);
    expect(request.items).toEqual([{ name: 'Item A' }]);
  });

  it('passes sharedPayload when provided', () => {
    const selectedSignal = signal<ReadonlySet<string>>(new Set(['a']));

    const itemsMap: Record<string, { name: string }> = {
      a: { name: 'Item A' },
    };

    const request = selectedItemsToBulkRequest(selectedSignal, itemsMap, { newStatus: 'approved' });
    expect(request.sharedPayload).toEqual({ newStatus: 'approved' });
  });

  it('preserves selected key order from the signal', () => {
    const selectedSignal = signal<ReadonlySet<string>>(new Set(['c', 'a', 'b']));

    const itemsMap: Record<string, { name: string }> = {
      a: { name: 'A' },
      b: { name: 'B' },
      c: { name: 'C' },
    };

    const request = selectedItemsToBulkRequest(selectedSignal, itemsMap);
    expect(request.items.map((i) => i.name)).toEqual(['C', 'A', 'B']);
  });

  it('updates when signal changes', () => {
    const selectedSignal = signal<ReadonlySet<string>>(new Set(['a']));

    const itemsMap: Record<string, { name: string }> = {
      a: { name: 'A' },
      b: { name: 'B' },
    };

    const r1 = selectedItemsToBulkRequest(selectedSignal, itemsMap);
    expect(r1.items).toHaveLength(1);

    selectedSignal.set(new Set(['a', 'b']));
    const r2 = selectedItemsToBulkRequest(selectedSignal, itemsMap);
    expect(r2.items).toHaveLength(2);
  });
});
