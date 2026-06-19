import { TestBed } from '@angular/core/testing';
import {
  CAPABILITY_SYNC_CONTEXT,
  toPermissionContext,
  type CapabilitySet,
} from '../public-api';
import { HEXGUARD_PERMISSION_CONTEXT } from './permission-context';

describe('toPermissionContext', () => {
  it('should map roles and permissions to permission context', () => {
    const source: CapabilitySet = {
      roles: ['admin', 'analyst'],
      permissions: {
        orders: ['read', 'write'],
        reports: ['read'],
      },
    };

    const result = toPermissionContext(source);

    expect(result.roles).toEqual(['admin', 'analyst']);
    expect(result.capabilities).toContain('orders.read');
    expect(result.capabilities).toContain('orders.write');
    expect(result.capabilities).toContain('reports.read');
  });

  it('should use custom separator', () => {
    const source: CapabilitySet = {
      roles: [],
      permissions: {
        orders: ['read'],
      },
    };

    const result = toPermissionContext(source, ':');

    expect(result.capabilities).toContain('orders:read');
  });

  it('should return empty context for empty input', () => {
    const source: CapabilitySet = {
      roles: [],
      permissions: {},
    };

    const result = toPermissionContext(source);

    expect(result.roles).toEqual([]);
    expect(result.capabilities).toEqual([]);
  });

  it('should handle nullish permissions gracefully', () => {
    const source = {
      roles: ['viewer'],
      permissions: {} as Record<string, readonly string[]>,
    };

    const result = toPermissionContext(source);
    expect(result.roles).toEqual(['viewer']);
    expect(result.capabilities).toEqual([]);
  });
});

describe('CAPABILITY_SYNC_CONTEXT', () => {
  it('should be a valid injection token', () => {
    expect(CAPABILITY_SYNC_CONTEXT).toBeDefined();
    expect(CAPABILITY_SYNC_CONTEXT.toString()).toContain('CAPABILITY_SYNC_CONTEXT');
  });
});
