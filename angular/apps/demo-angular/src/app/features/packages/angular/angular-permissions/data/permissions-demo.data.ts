import { Injectable, computed, signal } from '@angular/core';

import type { PermissionContext, PermissionRequirement } from '@hexguard/angular-permissions';

export type PermissionDemoPersonaId = 'guest' | 'analyst' | 'approver' | 'admin';

export interface PermissionDemoPersona {
  readonly id: PermissionDemoPersonaId;
  readonly label: string;
  readonly summary: string;
  readonly roles: readonly string[];
  readonly capabilities: readonly string[];
}

export const PERMISSION_DEMO_PERSONAS = [
  {
    id: 'guest',
    label: 'Guest reviewer',
    summary: 'Can inspect read-only order state but cannot trigger privileged actions.',
    roles: ['guest'],
    capabilities: ['orders.view'],
  },
  {
    id: 'analyst',
    label: 'Analyst',
    summary: 'Can view orders and issue refunds, but still cannot approve finance work.',
    roles: ['analyst'],
    capabilities: ['orders.view', 'orders.refund'],
  },
  {
    id: 'approver',
    label: 'Approver',
    summary: 'Can approve orders and inspect finance routes, but cannot open audit workflows.',
    roles: ['approver'],
    capabilities: ['orders.view', 'orders.approve', 'finance.view'],
  },
  {
    id: 'admin',
    label: 'Admin auditor',
    summary: 'Has the full action set, finance approval access, and audit visibility.',
    roles: ['admin', 'auditor'],
    capabilities: [
      'orders.view',
      'orders.approve',
      'orders.refund',
      'orders.override',
      'finance.view',
      'finance.approve',
      'audit.view',
    ],
  },
] as const satisfies readonly PermissionDemoPersona[];

export const APPROVE_ORDERS_REQUIREMENT = {
  allCapabilities: ['orders.approve'],
} as const satisfies PermissionRequirement<string, string>;

export const REFUND_ORDERS_REQUIREMENT = {
  allCapabilities: ['orders.refund'],
} as const satisfies PermissionRequirement<string, string>;

export const ADMIN_OVERRIDE_REQUIREMENT = {
  allCapabilities: ['orders.override'],
  allRoles: ['admin'],
} as const satisfies PermissionRequirement<string, string>;

export const AUDIT_PANEL_REQUIREMENT = {
  anyRoles: ['auditor', 'admin'],
  allCapabilities: ['audit.view'],
} as const satisfies PermissionRequirement<string, string>;

export const FINANCE_ROUTE_REQUIREMENT = {
  allCapabilities: ['finance.approve'],
} as const satisfies PermissionRequirement<string, string>;

export const AUDIT_ROUTE_REQUIREMENT = {
  anyRoles: ['auditor', 'admin'],
} as const satisfies PermissionRequirement<string, string>;

@Injectable({ providedIn: 'root' })
export class PermissionsDemoSessionService {
  readonly personas = PERMISSION_DEMO_PERSONAS;
  readonly personaId = signal<PermissionDemoPersonaId>('guest');
  readonly persona = computed(
    () => this.personas.find((persona) => persona.id === this.personaId()) ?? this.personas[0],
  );
  readonly context = computed<PermissionContext<string, string>>(() => ({
    capabilities: this.persona().capabilities,
    roles: this.persona().roles,
    hierarchy: {
      admin: ['approver', 'analyst', 'auditor'],
      approver: ['analyst'],
      auditor: ['analyst'],
      analyst: ['guest'],
    },
  }));

  setPersona(id: string): void {
    const match = this.personas.find((persona) => persona.id === id);

    if (match) {
      this.personaId.set(match.id);
    }
  }
}
