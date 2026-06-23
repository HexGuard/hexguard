import { createNotificationStream } from './notification-observable';

describe('createNotificationStream', () => {
  it('emits notification on success()', () => {
    const notifier = createNotificationStream();
    const values: Array<{ type: string; message: string }> = [];
    notifier.notifications$.subscribe((n) => values.push(n));
    notifier.success('Done!');
    expect(values).toHaveLength(1);
    expect(values[0].type).toBe('success');
    expect(values[0].message).toBe('Done!');
  });

  it('emits notification on error()', () => {
    const notifier = createNotificationStream();
    const values: string[] = [];
    notifier.notifications$.subscribe((n) => values.push(n.message));
    notifier.error('Failed');
    expect(values).toEqual(['Failed']);
  });

  it('emits notification on info()', () => {
    const notifier = createNotificationStream();
    const values: Array<{ type: string }> = [];
    notifier.notifications$.subscribe((n) => values.push(n));
    notifier.info('Processing');
    expect(values[0].type).toBe('info');
  });

  it('emits notification on warning()', () => {
    const notifier = createNotificationStream();
    const values: Array<{ type: string }> = [];
    notifier.notifications$.subscribe((n) => values.push(n));
    notifier.warning('Careful');
    expect(values[0].type).toBe('warning');
  });

  it('includes optional title', () => {
    const notifier = createNotificationStream();
    const values: Array<{ title?: string }> = [];
    notifier.notifications$.subscribe((n) => values.push(n));
    notifier.info('msg', { title: 'Heads up' });
    expect(values[0].title).toBe('Heads up');
  });

  it('includes optional duration', () => {
    const notifier = createNotificationStream();
    const values: Array<{ duration: number }> = [];
    notifier.notifications$.subscribe((n) => values.push(n));
    notifier.info('msg', { duration: 10_000 });
    expect(values[0].duration).toBe(10_000);
  });
});
