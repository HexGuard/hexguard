import { Component, type ElementRef, viewChild } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { inInfiniteScroll } from './infinite-scroll';

@Component({
  template: '<div #sentinel>sentinel</div>',
  standalone: true,
})
class TestHost {
  readonly sentinel = viewChild.required<ElementRef>('sentinel');
}

describe(inInfiniteScroll.name, () => {
  it('starts with default values', () => {
    const fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();

    TestBed.runInInjectionContext(() => {
      const infinite = inInfiniteScroll(fixture.componentInstance.sentinel());
      expect(infinite.isTriggered()).toBe(false);
      expect(infinite.isLoading()).toBe(false);
      expect(infinite.isExhausted()).toBe(false);
    });
  });

  it('accepts custom rootMargin', () => {
    const fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();

    TestBed.runInInjectionContext(() => {
      const infinite = inInfiniteScroll(fixture.componentInstance.sentinel(), {
        rootMargin: '100px',
      });
      expect(infinite.isTriggered()).toBe(false);
    });
  });
});
