import { TestBed } from '@angular/core/testing';

import { NotificationService } from './notification.service';

describe(NotificationService.name, () => {
  let service: NotificationService;

  beforeEach(() => {
    vi.useFakeTimers();
    service = TestBed.inject(NotificationService);
  });

  afterEach(() => {
    vi.useRealTimers();
    service.dismissAll();
  });

  it('starts with an empty notification list', () => {
    expect(service.notifications()).toEqual([]);
    expect(service.count()).toBe(0);
  });

  describe('show()', () => {
    it('adds a notification to the list', () => {
      service.show('Test message', 'info');
      expect(service.count()).toBe(1);
      expect(service.notifications()[0].message).toBe('Test message');
    });

    it('defaults to info type', () => {
      const handle = service.show('Test');
      expect(service.notifications()[0].type).toBe('info');
    });

    it('adds new notifications at the front', () => {
      service.show('First');
      service.show('Second');
      expect(service.notifications()[0].message).toBe('Second');
    });

    it('assigns a unique ID to each notification', () => {
      const a = service.show('A');
      const b = service.show('B');
      expect(a.id).not.toBe(b.id);
    });

    it('auto-dismisses after the default duration', () => {
      service.show('Auto dismiss');
      expect(service.count()).toBe(1);

      vi.advanceTimersByTime(5000);
      expect(service.count()).toBe(0);
    });

    it('respects custom duration', () => {
      service.show('Custom', 'info', { duration: 100 });
      vi.advanceTimersByTime(50);
      expect(service.count()).toBe(1);
      vi.advanceTimersByTime(50);
      expect(service.count()).toBe(0);
    });

    it('does not auto-dismiss when duration is 0', () => {
      service.show('Persistent', 'info', { duration: 0 });
      vi.advanceTimersByTime(10000);
      expect(service.count()).toBe(1);
    });

    it('does not auto-dismiss when duration is Infinity', () => {
      service.show('Infinite', 'info', { duration: Infinity });
      vi.advanceTimersByTime(100000);
      expect(service.count()).toBe(1);
    });

    it('attaches an action to the notification', () => {
      const handler = vi.fn();
      service.show('With action', 'info', {
        action: { label: 'Retry', handler },
      });
      expect(service.notifications()[0].action?.label).toBe('Retry');
      expect(service.notifications()[0].action?.handler).toBe(handler);
    });

    it('supports an optional title in the notification', () => {
      service.show('Details saved', 'success', { title: 'Save completed' });
      expect(service.notifications()[0].title).toBe('Save completed');
    });
  });

  describe('convenience methods', () => {
    it('success() creates a success notification', () => {
      service.success('OK');
      expect(service.notifications()[0].type).toBe('success');
    });

    it('error() creates an error notification', () => {
      service.error('Fail');
      expect(service.notifications()[0].type).toBe('error');
    });

    it('info() creates an info notification', () => {
      service.info('Heads up');
      expect(service.notifications()[0].type).toBe('info');
    });

    it('warning() creates a warning notification', () => {
      service.warning('Caution');
      expect(service.notifications()[0].type).toBe('warning');
    });
  });

  describe('dismiss()', () => {
    it('removes a notification by ID', () => {
      const handle = service.show('To remove');
      expect(service.count()).toBe(1);

      service.dismiss(handle.id);
      expect(service.count()).toBe(0);
    });

    it('is a no-op for unknown IDs', () => {
      service.show('A');
      service.dismiss('non-existent');
      expect(service.count()).toBe(1);
    });
  });

  describe('dismissAll()', () => {
    it('removes all notifications', () => {
      service.show('A');
      service.show('B');
      service.show('C');
      expect(service.count()).toBe(3);

      service.dismissAll();
      expect(service.count()).toBe(0);
    });
  });

  describe('dismissByType()', () => {
    it('removes only notifications of the given type', () => {
      service.success('A');
      service.error('B');
      service.info('C');
      service.error('D');

      service.dismissByType('error');
      expect(service.count()).toBe(2);
      expect(service.notifications().every((n) => n.type !== 'error')).toBe(true);
    });
  });

  describe('NotificationHandle.update()', () => {
    it('updates the notification duration and restarts the timer', () => {
      const handle = service.show('Update me', 'info', { duration: 5000 });

      handle.update({ duration: 100 });
      vi.advanceTimersByTime(100);
      expect(service.count()).toBe(0);
    });

    it('updates the action', () => {
      const handle = service.show('Test');
      expect(service.notifications()[0].action).toBeUndefined();

      const handler = vi.fn();
      handle.update({ action: { label: 'Go', handler } });
      expect(service.notifications()[0].action?.label).toBe('Go');
    });
  });
});
