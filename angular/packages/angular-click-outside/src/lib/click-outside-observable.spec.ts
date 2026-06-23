import { fromClickOutsideEvent } from './click-outside-observable';

describe('fromClickOutsideEvent', () => {
  it('emits PointerEvent when clicking outside the element', () => {
    const el = document.createElement('div');
    document.body.appendChild(el);

    const events: PointerEvent[] = [];
    const sub = fromClickOutsideEvent(el).subscribe((e) => events.push(e));

    const outside = new PointerEvent('pointerdown', { bubbles: true });
    document.body.dispatchEvent(outside);
    expect(events).toHaveLength(1);
    expect(events[0]).toBe(outside);

    sub.unsubscribe();
    document.body.removeChild(el);
  });

  it('does not emit when clicking inside the element', () => {
    const el = document.createElement('div');
    document.body.appendChild(el);

    const events: PointerEvent[] = [];
    const sub = fromClickOutsideEvent(el).subscribe((e) => events.push(e));

    el.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }));
    expect(events).toHaveLength(0);

    sub.unsubscribe();
    document.body.removeChild(el);
  });

  it('respects exclude selectors', () => {
    const el = document.createElement('div');
    const excludedChild = document.createElement('button');
    excludedChild.className = 'ignore-me';
    el.appendChild(excludedChild);
    document.body.appendChild(el);

    const events: PointerEvent[] = [];
    const sub = fromClickOutsideEvent(el, { exclude: ['.ignore-me'] }).subscribe((e) =>
      events.push(e),
    );

    // Click on excluded child — should NOT emit
    excludedChild.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }));
    expect(events).toHaveLength(0);

    // Click outside the container — should emit
    document.body.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }));
    expect(events).toHaveLength(1);

    sub.unsubscribe();
    document.body.removeChild(el);
  });

  it('unsubscribes remove the event listener', () => {
    const el = document.createElement('div');
    document.body.appendChild(el);

    const events: PointerEvent[] = [];
    const sub = fromClickOutsideEvent(el).subscribe((e) => events.push(e));
    sub.unsubscribe();

    document.body.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }));
    expect(events).toHaveLength(0);

    document.body.removeChild(el);
  });
});
