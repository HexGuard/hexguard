import { Component, ErrorHandler } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HexguardErrorBoundaryComponent } from './error-boundary.component';

// ── Helper components ──────────────────────────────────────────────

@Component({
  standalone: true,
  selector: 'safe-component',
  template: ` <p data-testid="normal-content">I am safe</p> `,
})
class SafeComponent {}

@Component({
  standalone: true,
  template: `
    <hexguard-error-boundary>
      <safe-component />
    </hexguard-error-boundary>
  `,
  imports: [HexguardErrorBoundaryComponent, SafeComponent],
})
class SafeHostComponent {}

/** Create an error boundary component through Angular DI. */
function createErrorBoundary(): HexguardErrorBoundaryComponent {
  const fixture = TestBed.createComponent(HexguardErrorBoundaryComponent);
  return fixture.componentInstance;
}

describe(HexguardErrorBoundaryComponent.name, () => {
  describe('with safe content', () => {
    let fixture: ComponentFixture<SafeHostComponent>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [SafeHostComponent],
      }).compileComponents();

      fixture = TestBed.createComponent(SafeHostComponent);
      fixture.detectChanges();
    });

    it('renders the projected content', () => {
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
          activate(): void;
          deactivate(): void;
        };
      };
      boundary.controller.activate();
      boundary.controller.errorSignal.set(new Error('Test'));
      expect(boundary.hasError()).toBe(true);

      boundary.reset();
      expect(boundary.hasError()).toBe(false);
      expect(boundary.caughtError()).toBeNull();
      boundary.controller.deactivate();
    });

    it('fallbackContext provides error and reset in the template context', () => {
      const boundary = createErrorBoundary() as unknown as {
        fallbackContext(): { error: unknown; $implicit: unknown; reset: () => void };
        controller: {
          errorSignal: { set: (v: unknown) => void };
          activate(): void;
          deactivate(): void;
        };
      };
      boundary.controller.activate();
      const testError = new Error('Context test');
      boundary.controller.errorSignal.set(testError);

      const ctx = boundary.fallbackContext();
      expect(ctx.error).toBe(testError);
      expect(ctx.$implicit).toBe(testError);
      expect(typeof ctx.reset).toBe('function');
      boundary.controller.deactivate();
    });
  });

  describe('ErrorHandler integration', () => {
    it('intercepts errors and routes them to the active boundary', () => {
      const boundary = createErrorBoundary() as unknown as {
        hasError(): boolean;
        caughtError(): unknown;
        controller: { activate(): void; deactivate(): void };
      };
      const errorHandler = TestBed.inject(ErrorHandler);

      boundary.controller.activate();
      const testError = new Error('Boundary test');
      errorHandler.handleError(testError);

      expect(boundary.hasError()).toBe(true);
      expect(boundary.caughtError()).toBe(testError);
      boundary.controller.deactivate();
    });
  });
});
