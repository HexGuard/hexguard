import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { provideHexGuardPermissions } from './permission-context';
import { HexguardCanDirective } from './hexguard-can.directive';
import type { PermissionContext, PermissionRequirement } from './types';

@Component({
  standalone: true,
  imports: [HexguardCanDirective],
  template: `
    <section data-testid="allowed" *hexguardCan="requirement; else denied">Allowed</section>
    <ng-template #denied>
      <section data-testid="denied">Denied</section>
    </ng-template>
  `,
})
class HexguardCanElseHostComponent {
  readonly requirement: PermissionRequirement<string, string> = {
    allCapabilities: ['orders.manage'],
  };
}

@Component({
  standalone: true,
  imports: [HexguardCanDirective],
  template: ` <section data-testid="allowed" *hexguardCan="requirement">Allowed</section> `,
})
class HexguardCanNoElseHostComponent {
  readonly requirement: PermissionRequirement<string, string> = {
    allCapabilities: ['orders.manage'],
  };
}

describe('HexguardCanDirective', () => {
  it('renders the primary template when the requirement is allowed and switches to else content when denied', () => {
    const context = signal<PermissionContext<string, string>>({
      capabilities: ['orders.manage'],
      roles: ['admin'],
    });

    TestBed.configureTestingModule({
      providers: [provideHexGuardPermissions(context)],
    });

    const fixture = TestBed.createComponent(HexguardCanElseHostComponent);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('[data-testid="allowed"]')?.textContent.trim()).toBe(
      'Allowed',
    );
    expect(fixture.nativeElement.querySelector('[data-testid="denied"]')).toBeNull();

    context.set({
      capabilities: ['orders.view'],
      roles: ['reviewer'],
    });
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('[data-testid="allowed"]')).toBeNull();
    expect(fixture.nativeElement.querySelector('[data-testid="denied"]')?.textContent.trim()).toBe(
      'Denied',
    );
  });

  it('clears the view entirely when access is denied and no else template is provided', () => {
    const context = signal<PermissionContext<string, string>>({
      capabilities: ['orders.view'],
      roles: ['reviewer'],
    });

    TestBed.configureTestingModule({
      providers: [provideHexGuardPermissions(context)],
    });

    const fixture = TestBed.createComponent(HexguardCanNoElseHostComponent);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('[data-testid="allowed"]')).toBeNull();

    context.set({
      capabilities: ['orders.view', 'orders.manage'],
      roles: ['admin'],
    });
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('[data-testid="allowed"]')?.textContent.trim()).toBe(
      'Allowed',
    );
  });
});
