import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HexguardErrorBoundaryComponent } from './error-boundary.component';

// ── Helper components ──────────────────────────────────────────────

@Component({
  standalone: true,
  selector: 'safe-component',
  template: ` <p data-testid="normal-content">I am safe</p> `,
})
class SafeComponent {}

/** Host using `<ng-template>` (required by the boundary). */
@Component({
  standalone: true,
  template: `
    <hexguard-error-boundary>
      <ng-template>
        <safe-component />
      </ng-template>
    </hexguard-error-boundary>
  `,
  imports: [HexguardErrorBoundaryComponent, SafeComponent],
})
class SafeHostComponent {}

/** Helper: throws during construction (= during template rendering). */
@Component({
  standalone: true,
  selector: 'error-thrower',
  template: ``,
})
class ErrorThrowerComponent {
  constructor() {
    throw new Error('Rendering error');
  }
}

/** Host that throws during rendering inside the boundary. */
@Component({
  standalone: true,
  template: `
    <hexguard-error-boundary>
      <ng-template>
        <error-thrower />
      </ng-template>
    </hexguard-error-boundary>
  `,
  imports: [HexguardErrorBoundaryComponent, ErrorThrowerComponent],
})
class ErrorThrowingHostComponent {}

/** Create an error boundary component through Angular DI. */
function createErrorBoundary(): HexguardErrorBoundaryComponent {
  const fixture = TestBed.createComponent(HexguardErrorBoundaryComponent);
  return fixture.componentInstance;
}

describe(HexguardErrorBoundaryComponent.name, () => {
  describe('with safe content (ng-template)', () => {
    let fixture: ComponentFixture<SafeHostComponent>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [SafeHostComponent],
      }).compileComponents();

      fixture = TestBed.createComponent(SafeHostComponent);
      fixture.detectChanges();
    });

    it('renders the projected template content', () => {
      const content = fixture.nativeElement.querySelector(
        '[data-testid="normal-content"]',
      );
      expect(content).toBeTruthy();
      expect(content.textContent).toContain('I am safe');
    });

    it('does not show the fallback', () => {
      const fallback = fixture.nativeElement.querySelector(
        '[data-testid="error-boundary-fallback"]',
      );
      expect(fallback).toBeFalsy();
    });
  });

  describe('render-time error catching', () => {
    it('catches a throw during content creation and shows the fallback', () => {
      const fixture = TestBed.createComponent(ErrorThrowingHostComponent);

      // The error is thrown synchronously during createEmbeddedView /
      // detectChanges, caught by the try-catch in the boundary.
      fixture.detectChanges();

      const fallback = fixture.nativeElement.querySelector(
        '[data-testid="error-boundary-fallback"]',
      );
      expect(fallback).toBeTruthy();
    });
  });

  describe('error state', () => {
    it('initializes with no error', () => {
      const boundary = createErrorBoundary();
      expect(boundary.hasError()).toBe(false);
      expect(boundary.caughtError()).toBeNull();
    });

    it('reset() clears the error state', () => {
      const boundary = createErrorBoundary() as unknown as {
        hasError(): boolean;
        caughtError(): unknown;
        reset(): void;
        controller: {
          errorSignal: { set: (v: unknown) => void };
        };
      };
      boundary.controller.errorSignal.set(new Error('Test'));
      expect(boundary.hasError()).toBe(true);

      boundary.reset();
      expect(boundary.hasError()).toBe(false);
      expect(boundary.caughtError()).toBeNull();
    });

    it('fallbackContext provides error and reset in the template context', () => {
      const boundary = createErrorBoundary() as unknown as {
        fallbackContext(): { error: unknown; $implicit: unknown; reset: () => void };
        controller: {
          errorSignal: { set: (v: unknown) => void };
        };
      };
      const testError = new Error('Context test');
      boundary.controller.errorSignal.set(testError);

      const ctx = boundary.fallbackContext();
      expect(ctx.error).toBe(testError);
      expect(ctx.$implicit).toBe(testError);
      expect(typeof ctx.reset).toBe('function');
    });
  });
});
