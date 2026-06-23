import { TestBed } from '@angular/core/testing';
import { injectPageContext } from './page-context';

describe(injectPageContext.name, () => {
  it('starts with empty defaults', () => {
    TestBed.runInInjectionContext(() => {
      const ctx = injectPageContext();
      expect(ctx.title()).toBe('');
      expect(ctx.breadcrumbs()).toEqual([]);
      expect(ctx.activeTab()).toBe('');
      expect(ctx.actions()).toEqual([]);
    });
  });

  it('sets title', () => {
    TestBed.runInInjectionContext(() => {
      const ctx = injectPageContext();
      ctx.set({ title: 'Order Details' });
      expect(ctx.title()).toBe('Order Details');
    });
  });

  it('sets breadcrumbs', () => {
    TestBed.runInInjectionContext(() => {
      const ctx = injectPageContext();
      ctx.set({ breadcrumbs: [{ label: 'Orders', route: '/orders' }, { label: 'Order #42' }] });
      expect(ctx.breadcrumbs()).toHaveLength(2);
      expect(ctx.breadcrumbs()[0].label).toBe('Orders');
    });
  });

  it('sets first tab as active when no active tab', () => {
    TestBed.runInInjectionContext(() => {
      const ctx = injectPageContext();
      ctx.set({
        tabs: [
          { id: 'details', label: 'Details' },
          { id: 'history', label: 'History' },
        ],
      });
      expect(ctx.activeTab()).toBe('details');
    });
  });

  it('does not override existing active tab when setting tabs', () => {
    TestBed.runInInjectionContext(() => {
      const ctx = injectPageContext();
      ctx.set({
        tabs: [
          { id: 'a', label: 'A' },
          { id: 'b', label: 'B' },
        ],
      });
      ctx.setActiveTab('b');
      ctx.set({
        tabs: [
          { id: 'a', label: 'A' },
          { id: 'b', label: 'B' },
          { id: 'c', label: 'C' },
        ],
      });
      expect(ctx.activeTab()).toBe('b');
    });
  });

  it('switches active tab via setActiveTab', () => {
    TestBed.runInInjectionContext(() => {
      const ctx = injectPageContext();
      ctx.set({
        tabs: [
          { id: 'a', label: 'A' },
          { id: 'b', label: 'B' },
        ],
      });
      ctx.setActiveTab('b');
      expect(ctx.activeTab()).toBe('b');
    });
  });

  it('sets actions', () => {
    TestBed.runInInjectionContext(() => {
      const ctx = injectPageContext();
      ctx.set({ actions: [{ id: 'edit', label: 'Edit' }] });
      expect(ctx.actions()).toHaveLength(1);
      expect(ctx.actions()[0].id).toBe('edit');
    });
  });

  it('partial update does not clear other fields', () => {
    TestBed.runInInjectionContext(() => {
      const ctx = injectPageContext();
      ctx.set({ title: 'Title', breadcrumbs: [{ label: 'Home' }] });
      ctx.set({ title: 'Updated' });
      expect(ctx.title()).toBe('Updated');
      expect(ctx.breadcrumbs()).toHaveLength(1);
    });
  });

  it('setActiveTab does not affect other signals', () => {
    TestBed.runInInjectionContext(() => {
      const ctx = injectPageContext();
      ctx.set({ title: 'Test', tabs: [{ id: 'a', label: 'A' }] });
      ctx.setActiveTab('a');
      expect(ctx.title()).toBe('Test');
    });
  });
});
