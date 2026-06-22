import { TestBed } from '@angular/core/testing';
import { injectConfirmation } from './confirmation';

describe(injectConfirmation.name, () => {
  it('starts closed with no request', () => {
    TestBed.runInInjectionContext(() => {
      const c = injectConfirmation();
      expect(c.isOpen()).toBe(false);
      expect(c.currentRequest()).toBeNull();
    });
  });

  it('opens on ask() and resolves true on confirm', async () => {
    await TestBed.runInInjectionContext(async () => {
      const c = injectConfirmation();
      const promise = c.ask({ title: 'Delete?', message: 'Sure?' });
      expect(c.isOpen()).toBe(true);
      expect(c.currentRequest()).toBeTruthy();
      expect(c.currentRequest()!.title).toBe('Delete?');
      c.confirm();
      const result = await promise;
      expect(result).toBe(true);
      expect(c.isOpen()).toBe(false);
    });
  });

  it('resolves false on cancel', async () => {
    await TestBed.runInInjectionContext(async () => {
      const c = injectConfirmation();
      const promise = c.ask({ title: 'Delete?', message: 'Sure?' });
      expect(c.isOpen()).toBe(true);
      c.cancel();
      const result = await promise;
      expect(result).toBe(false);
      expect(c.isOpen()).toBe(false);
    });
  });

  it('rejects duplicate ask()', async () => {
    await TestBed.runInInjectionContext(async () => {
      const c = injectConfirmation();
      c.ask({ title: 'First', message: '?' });
      const second = await c.ask({ title: 'Second', message: '?' });
      expect(second).toBe(false);
    });
  });

  it('run() returns confirmed:false when cancelled', async () => {
    await TestBed.runInInjectionContext(async () => {
      const c = injectConfirmation();
      const promise = c.run({ title: 'Run?', message: '?' }, async () => 'done');
      c.cancel();
      const result = await promise;
      expect(result.confirmed).toBe(false);
    });
  });

  it('run() executes action when confirmed', async () => {
    await TestBed.runInInjectionContext(async () => {
      const c = injectConfirmation();
      const promise = c.run({ title: 'Run?', message: '?' }, async () => 'done');
      c.confirm();
      const result = await promise;
      expect(result.confirmed).toBe(true);
      expect(result.result).toBe('done');
    });
  });
});
