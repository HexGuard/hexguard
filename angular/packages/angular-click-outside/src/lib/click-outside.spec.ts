import { TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';

import { injectClickOutside } from './click-outside';
import { HexguardClickOutsideDirective } from './click-outside.directive';

describe('injectClickOutside', () => {
  it('returns null initially', () => {
    TestBed.runInInjectionContext(() => {
      const elSignal = signal<Element | undefined>(document.createElement('div'));
      const handle = injectClickOutside(elSignal as any);
      expect(handle.clickOutside()).toBeNull();
    });
  });

  it('emits event when clicking outside the element', () => {
    TestBed.runInInjectionContext(() => {
      const el = document.createElement('div');
      const elSignal = signal({ nativeElement: el } as any);
      const handle = injectClickOutside(elSignal);

      // Simulate a click on document.body (outside the div)
      const event = new PointerEvent('pointerdown', { bubbles: true });
      document.body.dispatchEvent(event);

      expect(handle.clickOutside()).toBe(event);
    });
  });

  it('does not emit when clicking inside the element', () => {
    TestBed.runInInjectionContext(() => {
      const el = document.createElement('div');
      const elSignal = signal({ nativeElement: el } as any);
      const handle = injectClickOutside(elSignal);

      // Simulate a click on the element itself
      const event = new PointerEvent('pointerdown', { bubbles: true });
      el.dispatchEvent(event);

      expect(handle.clickOutside()).toBeNull();
    });
  });

  it('does not emit when disabled', () => {
    TestBed.runInInjectionContext(() => {
      const el = document.createElement('div');
      const enabled = signal(false);
      const elSignal = signal({ nativeElement: el } as any);
      const handle = injectClickOutside(elSignal, { enabled });

      document.body.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }));

      expect(handle.clickOutside()).toBeNull();
    });
  });

  it('respects exclude selectors', () => {
    TestBed.runInInjectionContext(() => {
      const el = document.createElement('div');
      const excludedChild = document.createElement('button');
      excludedChild.className = 'ignore-me';
      el.appendChild(excludedChild);
      document.body.appendChild(el);

      const elSignal = signal({ nativeElement: el } as any);
      const handle = injectClickOutside(elSignal, { exclude: ['.ignore-me'] });

      // Click on excluded child — should NOT trigger
      excludedChild.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }));
      expect(handle.clickOutside()).toBeNull();

      // Click outside entirely — SHOULD trigger
      document.body.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }));
      expect(handle.clickOutside()).toBeTruthy();

      document.body.removeChild(el);
    });
  });

  it('does nothing when element is undefined', () => {
    TestBed.runInInjectionContext(() => {
      const elSignal = signal<{ nativeElement: HTMLElement } | undefined>(undefined);
      const handle = injectClickOutside(elSignal);

      document.body.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }));
      expect(handle.clickOutside()).toBeNull();
    });
  });
});

describe('HexguardClickOutsideDirective', () => {
  it('creates the directive', () => {
    TestBed.configureTestingModule({
      imports: [HexguardClickOutsideDirective],
    });

    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();

    expect(fixture.componentInstance).toBeTruthy();
  });
});

import { Component } from '@angular/core';

@Component({
  standalone: true,
  imports: [HexguardClickOutsideDirective],
  template: ` <div (hexguardClickOutside)="onOutside()" data-testid="host">Content</div> `,
})
class TestHostComponent {
  outsideCount = 0;
  onOutside() {
    this.outsideCount++;
  }
}
