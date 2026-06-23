import { createSelectionState } from './selection-state-observable';

describe('createSelectionState', () => {
  it('starts empty', () => {
    const sel = createSelectionState<string>();
    const values: Array<readonly string[]> = [];
    sel.selected$.subscribe((s) => values.push([...s]));
    expect(values).toEqual([[]]);
  });

  it('toggle adds a key', () => {
    const sel = createSelectionState<string>();
    const values: Array<readonly string[]> = [];
    sel.selected$.subscribe((s) => values.push([...s]));
    sel.toggle('a');
    expect(values[values.length - 1]).toEqual(['a']);
  });

  it('toggle removes a key already selected', () => {
    const sel = createSelectionState<string>();
    sel.toggle('a');
    sel.toggle('a');

    const values: Array<readonly string[]> = [];
    sel.selected$.subscribe((s) => values.push([...s]));
    // BehaviorSubject emits current value on subscribe
    expect(values[0]).toEqual([]);
  });

  it('select adds a key in single mode', () => {
    const sel = createSelectionState<string>(false);
    sel.select('a');
    sel.select('b');

    const values: Array<readonly string[]> = [];
    sel.selected$.subscribe((s) => values.push([...s]));
    expect(values[0]).toEqual(['b']);
  });

  it('clear empties the selection', () => {
    const sel = createSelectionState<string>();
    sel.toggle('a');
    sel.toggle('b');
    sel.clear();

    const values: Array<readonly string[]> = [];
    sel.selected$.subscribe((s) => values.push([...s]));
    expect(values[0]).toEqual([]);
  });

  it('count$ emits the correct count', () => {
    const sel = createSelectionState<string>();
    const counts: number[] = [];
    sel.count$.subscribe((n) => counts.push(n));
    sel.toggle('a');
    sel.toggle('b');
    expect(counts).toEqual([0, 1, 2]);
  });

  it('isEmpty$ is true when nothing is selected', () => {
    const sel = createSelectionState<string>();
    const values: boolean[] = [];
    sel.isEmpty$.subscribe((v) => values.push(v));
    sel.toggle('a');
    sel.clear();
    expect(values).toEqual([true, false, true]);
  });

  it('canAct$ is true when at least one key is selected', () => {
    const sel = createSelectionState<string>();
    const values: boolean[] = [];
    sel.canAct$.subscribe((v) => values.push(v));
    sel.toggle('a');
    sel.clear();
    expect(values).toEqual([false, true, false]);
  });
});
