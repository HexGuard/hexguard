import { fromBreakpointChanges } from './breakpoint-observer-observable';
import type { BreakpointChange } from './breakpoint-observer-observable';

function mockMatchMedia(minWidth: number, viewportWidth: number) {
  let matches = viewportWidth >= minWidth;
  let listeners: Array<(event: MediaQueryListEvent) => void> = [];

  return {
    get matches() {
      return matches;
    },
    media: `(min-width: ${minWidth}px)`,
    onchange: null,
    addEventListener: (_type: string, listener: EventListenerOrEventListenerObject) => {
      if (typeof listener === 'function') {
        listeners.push(listener as (event: MediaQueryListEvent) => void);
      }
    },
    removeEventListener: (_type: string, listener: EventListenerOrEventListenerObject) => {
      if (typeof listener === 'function') {
        listeners = listeners.filter((l) => l !== listener);
      }
    },
    dispatchEvent: () => true,
    addListener: () => {},
    removeListener: () => {},
    _simulateResize(newWidth: number) {
      const newMatches = newWidth >= minWidth;
      if (newMatches !== matches) {
        matches = newMatches;
        const event = { matches: newMatches } as MediaQueryListEvent;
        listeners.forEach((l) => l(event));
      }
    },
  } as MediaQueryList & { _simulateResize(newWidth: number): void };
}

describe('fromBreakpointChanges', () => {
  let originalMatchMedia: typeof window.matchMedia;
  let mqlInstances: Array<MediaQueryList & { _simulateResize(newWidth: number): void }>;

  beforeEach(() => {
    mqlInstances = [];
    originalMatchMedia = window.matchMedia;
    const viewportWidth = 1024;

    window.matchMedia = ((query: string) => {
      const minWidthMatch = query.match(/\(min-width: (\d+)px\)/);
      if (minWidthMatch) {
        const minWidth = Number(minWidthMatch[1]);
        const mql = mockMatchMedia(minWidth, viewportWidth) as MediaQueryList & {
          _simulateResize(newWidth: number): void;
        };
        mqlInstances.push(mql);
        return mql;
      }
      return { matches: false, media: query } as MediaQueryList;
    }) as typeof window.matchMedia;
  });

  afterEach(() => {
    window.matchMedia = originalMatchMedia;
  });

  it('does not emit on subscribe (cold observable)', () => {
    const values: BreakpointChange[] = [];
    const sub = fromBreakpointChanges().subscribe((v) => values.push(v));
    expect(values).toHaveLength(0);
    sub.unsubscribe();
  });

  it('emits when a breakpoint crosses its threshold', () => {
    const values: BreakpointChange[] = [];
    const sub = fromBreakpointChanges().subscribe((v) => values.push(v));

    // Resize from 1024px (lg) to 500px (below sm)
    const smMql = mqlInstances.find((m) => m.media.includes('640'));
    smMql?._simulateResize(500);

    expect(values).toHaveLength(1);
    expect(values[0]).toEqual({ name: 'sm', matches: false });
    sub.unsubscribe();
  });

  it('emits multiple changes on successive resizes', () => {
    const values: BreakpointChange[] = [];
    const sub = fromBreakpointChanges().subscribe((v) => values.push(v));

    // Simulate resize events
    const mdMql = mqlInstances.find((m) => m.media.includes('768'));
    mdMql?._simulateResize(500);

    const smMql = mqlInstances.find((m) => m.media.includes('640'));
    smMql?._simulateResize(500);

    expect(values).toHaveLength(2);
    expect(values[0]).toEqual({ name: 'md', matches: false });
    expect(values[1]).toEqual({ name: 'sm', matches: false });
    sub.unsubscribe();
  });

  it('emits both true and false for the same breakpoint', () => {
    const values: BreakpointChange[] = [];
    const sub = fromBreakpointChanges().subscribe((v) => values.push(v));

    const smMql = mqlInstances.find((m) => m.media.includes('640'));
    smMql?._simulateResize(500); // below → false
    smMql?._simulateResize(1024); // back above → true

    expect(values).toHaveLength(2);
    expect(values[0]).toEqual({ name: 'sm', matches: false });
    expect(values[1]).toEqual({ name: 'sm', matches: true });
    sub.unsubscribe();
  });

  it('uses custom breakpoints when provided', () => {
    const values: BreakpointChange[] = [];
    const sub = fromBreakpointChanges({ tablet: 768, desktop: 1024 }).subscribe((v) =>
      values.push(v),
    );

    const tabletMql = mqlInstances.find((m) => m.media.includes('768'));
    tabletMql?._simulateResize(500);

    expect(values).toHaveLength(1);
    expect(values[0]).toEqual({ name: 'tablet', matches: false });
    sub.unsubscribe();
  });

  it('unsubscribes clean up all matchMedia listeners', () => {
    const values: BreakpointChange[] = [];
    const sub = fromBreakpointChanges().subscribe((v) => values.push(v));
    sub.unsubscribe();

    // After unsubscribe, resizes should not emit
    mqlInstances.forEach((mql) => mql._simulateResize(500));
    expect(values).toHaveLength(0);
  });
});
