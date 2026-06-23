import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { injectCommandRegistry } from './command-registry';

describe(injectCommandRegistry.name, () => {
  it('starts with no commands and palette closed', () => {
    TestBed.runInInjectionContext(() => {
      const r = injectCommandRegistry();
      expect(r.getCommands()).toEqual([]);
      expect(r.paletteOpen()).toBe(false);
    });
  });

  it('registers and retrieves commands', () => {
    TestBed.runInInjectionContext(() => {
      const r = injectCommandRegistry();
      r.register({ id: 'order.create', title: 'Create Order', invoke: vi.fn() });
      expect(r.getCommands()).toHaveLength(1);
      expect(r.getCommands()[0].id).toBe('order.create');
    });
  });

  it('registers multiple commands at once', () => {
    TestBed.runInInjectionContext(() => {
      const r = injectCommandRegistry();
      r.register(
        { id: 'a', title: 'A', invoke: vi.fn() },
        { id: 'b', title: 'B', invoke: vi.fn() },
      );
      expect(r.getCommands()).toHaveLength(2);
    });
  });

  it('unregisters a command', () => {
    TestBed.runInInjectionContext(() => {
      const r = injectCommandRegistry();
      r.register({ id: 'a', title: 'A', invoke: vi.fn() });
      r.unregister('a');
      expect(r.getCommands()).toHaveLength(0);
    });
  });

  it('search matches by title', () => {
    TestBed.runInInjectionContext(() => {
      const r = injectCommandRegistry();
      r.register({ id: 'order.create', title: 'Create Order', invoke: vi.fn() });
      r.register({ id: 'user.create', title: 'Create User', invoke: vi.fn() });
      const results = r.search('Order');
      expect(results).toHaveLength(1);
      expect(results[0].id).toBe('order.create');
    });
  });

  it('search matches by category', () => {
    TestBed.runInInjectionContext(() => {
      const r = injectCommandRegistry();
      r.register({ id: 'a', title: 'New', category: 'Orders', invoke: vi.fn() });
      const results = r.search('Orders');
      expect(results).toHaveLength(1);
    });
  });

  it('search returns all commands when query is empty', () => {
    TestBed.runInInjectionContext(() => {
      const r = injectCommandRegistry();
      r.register({ id: 'a', title: 'A', invoke: vi.fn() });
      r.register({ id: 'b', title: 'B', invoke: vi.fn() });
      expect(r.search('')).toHaveLength(2);
    });
  });

  it('handleShortcut matches a registered shortcut', () => {
    TestBed.runInInjectionContext(() => {
      const r = injectCommandRegistry();
      const fn = vi.fn();
      r.register({ id: 'test', title: 'Test', shortcut: 'Ctrl+Shift+N', invoke: fn });

      const event = new KeyboardEvent('keydown', {
        key: 'n',
        ctrlKey: true,
        shiftKey: true,
      });
      const handled = r.handleShortcut(event);
      expect(handled).toBe(true);
      expect(fn).toHaveBeenCalledOnce();
    });
  });

  it('handleShortcut returns false for unmatched shortcut', () => {
    TestBed.runInInjectionContext(() => {
      const r = injectCommandRegistry();
      const event = new KeyboardEvent('keydown', { key: 'x', ctrlKey: true });
      expect(r.handleShortcut(event)).toBe(false);
    });
  });

  it('handleShortcut does not invoke disabled command', () => {
    TestBed.runInInjectionContext(() => {
      const r = injectCommandRegistry();
      const enabled = signal(false);
      const fn = vi.fn();
      r.register({
        id: 'test',
        title: 'Test',
        shortcut: 'Ctrl+S',
        enabled: enabled.asReadonly(),
        invoke: fn,
      });

      const event = new KeyboardEvent('keydown', { key: 's', ctrlKey: true });
      expect(r.handleShortcut(event)).toBe(false);
      expect(fn).not.toHaveBeenCalled();
    });
  });

  it('paletteOpen state works correctly', () => {
    TestBed.runInInjectionContext(() => {
      const r = injectCommandRegistry();
      expect(r.paletteOpen()).toBe(false);
      r.openPalette();
      expect(r.paletteOpen()).toBe(true);
      r.closePalette();
      expect(r.paletteOpen()).toBe(false);
    });
  });

  it('togglePalette switches state', () => {
    TestBed.runInInjectionContext(() => {
      const r = injectCommandRegistry();
      r.togglePalette();
      expect(r.paletteOpen()).toBe(true);
      r.togglePalette();
      expect(r.paletteOpen()).toBe(false);
    });
  });

  it('starts open when initialOpen is true', () => {
    TestBed.runInInjectionContext(() => {
      const r = injectCommandRegistry({ initialOpen: true });
      expect(r.paletteOpen()).toBe(true);
    });
  });

  it('handleShortcut uses Ctrl or Meta key', () => {
    TestBed.runInInjectionContext(() => {
      const r = injectCommandRegistry();
      const fn = vi.fn();
      r.register({ id: 'test', title: 'Test', shortcut: 'Ctrl+K', invoke: fn });

      const eventMac = new KeyboardEvent('keydown', { key: 'k', metaKey: true });
      expect(r.handleShortcut(eventMac)).toBe(true);
      expect(fn).toHaveBeenCalledOnce();
    });
  });
});
