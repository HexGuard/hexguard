import { createConfirmationStream } from './confirmation-observable';

describe('createConfirmationStream', () => {
  it('emits a request on ask$()', () => {
    const dialog = createConfirmationStream();
    const requests: Array<{ title: string }> = [];
    dialog.requests$.subscribe((req) => requests.push(req));

    dialog.ask$({ title: 'Delete?', message: 'Sure?' }).subscribe();
    expect(requests).toHaveLength(1);
    expect(requests[0].title).toBe('Delete?');
  });

  it('resolves ask$() with true on confirm', () => {
    const dialog = createConfirmationStream();
    const results: boolean[] = [];
    dialog.ask$({ title: 'Delete?', message: 'Sure?' }).subscribe((v) => results.push(v));
    dialog.confirm();
    expect(results).toEqual([true]);
  });

  it('resolves ask$() with false on cancel', () => {
    const dialog = createConfirmationStream();
    const results: boolean[] = [];
    dialog.ask$({ title: 'Delete?', message: 'Sure?' }).subscribe((v) => results.push(v));
    dialog.cancel();
    expect(results).toEqual([false]);
  });

  it('returns false immediately when ask$() is called while pending', () => {
    const dialog = createConfirmationStream();
    const results: boolean[] = [];
    dialog.ask$({ title: 'First', message: '...' }).subscribe();
    dialog.ask$({ title: 'Second', message: '...' }).subscribe((v) => results.push(v));
    expect(results).toEqual([false]);
  });
});
