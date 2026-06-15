import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import {
  provideRouter,
  Router,
  type ActivatedRouteSnapshot,
  type Route,
  type RouterStateSnapshot,
  type UrlSegment,
  type UrlTree,
} from '@angular/router';

import { provideHexGuardPermissions } from './permission-context';
import { canActivatePermissions, canMatchPermissions } from './permission-guards';
import type { PermissionContext } from './types';

@Component({
  standalone: true,
  template: '',
})
class GuardTargetComponent {}

function serializeUrl(tree: UrlTree): string {
  return TestBed.inject(Router).serializeUrl(tree);
}

describe('permission guards', () => {
  it('allows canActivate when the requirement is satisfied', () => {
    const context = signal<PermissionContext<string, string>>({
      capabilities: ['orders.manage'],
      roles: ['admin'],
    });

    TestBed.configureTestingModule({
      providers: [
        provideRouter([{ path: 'denied', component: GuardTargetComponent }]),
        provideHexGuardPermissions(context),
      ],
    });

    const guard = canActivatePermissions({ allCapabilities: ['orders.manage'] });
    const result = TestBed.runInInjectionContext(() =>
      guard({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot),
    );

    expect(result).toBe(true);
  });

  it('returns a redirect UrlTree from canActivate when access is denied', () => {
    const context = signal<PermissionContext<string, string>>({
      capabilities: ['orders.view'],
      roles: ['reviewer'],
    });

    TestBed.configureTestingModule({
      providers: [
        provideRouter([{ path: 'denied', component: GuardTargetComponent }]),
        provideHexGuardPermissions(context),
      ],
    });

    const guard = canActivatePermissions({ allRoles: ['admin'] }, { redirectTo: '/denied' });
    const result = TestBed.runInInjectionContext(() =>
      guard({} as ActivatedRouteSnapshot, { url: '/restricted' } as RouterStateSnapshot),
    );

    expect(serializeUrl(result as UrlTree)).toBe('/denied');
  });

  it('returns false from canMatch when access is denied without a redirect', () => {
    const context = signal<PermissionContext<string, string>>({
      capabilities: ['orders.view'],
      roles: ['reviewer'],
    });

    TestBed.configureTestingModule({
      providers: [provideRouter([]), provideHexGuardPermissions(context)],
    });

    const guard = canMatchPermissions({ anyRoles: ['admin', 'manager'] });
    const result = TestBed.runInInjectionContext(() =>
      guard({} as Route, [] as UrlSegment[], {} as never),
    );

    expect(result).toBe(false);
  });

  it('creates a redirect UrlTree from command arrays in canMatch', () => {
    const context = signal<PermissionContext<string, string>>({
      capabilities: ['orders.view'],
      roles: ['reviewer'],
    });

    TestBed.configureTestingModule({
      providers: [
        provideRouter([{ path: 'denied', component: GuardTargetComponent }]),
        provideHexGuardPermissions(context),
      ],
    });

    const guard = canMatchPermissions(
      { allCapabilities: ['orders.manage'] },
      { redirectTo: ['/denied'] },
    );
    const result = TestBed.runInInjectionContext(() =>
      guard({} as Route, [] as UrlSegment[], {} as never),
    );

    expect(serializeUrl(result as UrlTree)).toBe('/denied');
  });
});
