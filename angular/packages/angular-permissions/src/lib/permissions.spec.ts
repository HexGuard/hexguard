import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { provideHexGuardPermissions } from './permission-context';
import { injectPermissions } from './permissions';
import type { PermissionContext } from './types';

@Component({
  standalone: true,
  template: '',
})
class PermissionsHostComponent {
  readonly permissions = injectPermissions<string, string>();
  readonly canManageOrders = this.permissions.canSignal({
    allCapabilities: ['orders.manage'],
  });
}

describe('injectPermissions', () => {
  it('exposes imperative checks and decision details for the current context', () => {
    const context = signal<PermissionContext<string, string>>({
      capabilities: ['orders.view', 'orders.manage'],
      roles: ['admin'],
    });

    TestBed.configureTestingModule({
      providers: [provideHexGuardPermissions(context)],
    });

    const fixture = TestBed.createComponent(PermissionsHostComponent);
    const component = fixture.componentInstance;

    expect(component.permissions.can({ allCapabilities: ['orders.manage'] })).toBe(true);
    expect(component.permissions.can({ anyRoles: ['reviewer', 'admin'] })).toBe(true);
    expect(component.permissions.evaluate({ noneCapabilities: ['orders.delete'] })).toEqual({
      allowed: true,
      failedRequirements: [],
      context: context(),
      requirement: { noneCapabilities: ['orders.delete'] },
    });
    expect(component.canManageOrders()).toBe(true);
  });

  it('updates computed checks when the provided permission context signal changes', () => {
    const context = signal<PermissionContext<string, string>>({
      capabilities: ['orders.view'],
      roles: ['reviewer'],
    });

    TestBed.configureTestingModule({
      providers: [provideHexGuardPermissions(context)],
    });

    const fixture = TestBed.createComponent(PermissionsHostComponent);
    const component = fixture.componentInstance;

    expect(component.canManageOrders()).toBe(false);

    context.set({
      capabilities: ['orders.view', 'orders.manage'],
      roles: ['reviewer', 'admin'],
    });
    fixture.detectChanges();

    expect(component.canManageOrders()).toBe(true);
    expect(component.permissions.evaluate({ allRoles: ['admin'] }).allowed).toBe(true);
  });
});
