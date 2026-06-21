export type RecoverySeverity = 'all' | 'critical' | 'warning' | 'info';
export type RecoveryView = 'summary' | 'detail';

export interface RecoveryIncident {
  readonly id: string;
  readonly service: string;
  readonly title: string;
  readonly severity: Exclude<RecoverySeverity, 'all'>;
  readonly ageMinutes: number;
  readonly owner: string;
}

export const RECOVERY_SEVERITY_OPTIONS = ['all', 'critical', 'warning', 'info'] as const;
export const RECOVERY_VIEW_OPTIONS = ['summary', 'detail'] as const;
export const RECOVERY_PAGE_SIZE = 3;

export const RECOVERY_INCIDENTS: readonly RecoveryIncident[] = [
  {
    id: 'INC-3021',
    service: 'Billing API',
    title: 'Delayed invoice export jobs',
    severity: 'warning',
    ageMinutes: 43,
    owner: 'Nora',
  },
  {
    id: 'INC-3024',
    service: 'Search Gateway',
    title: 'Cluster failover retries',
    severity: 'critical',
    ageMinutes: 14,
    owner: 'Ravi',
  },
  {
    id: 'INC-3027',
    service: 'Warehouse Sync',
    title: 'EU stock refresh lag',
    severity: 'warning',
    ageMinutes: 27,
    owner: 'Mina',
  },
  {
    id: 'INC-3031',
    service: 'CRM Events',
    title: 'Webhook replay completed',
    severity: 'info',
    ageMinutes: 9,
    owner: 'Luis',
  },
  {
    id: 'INC-3035',
    service: 'Analytics API',
    title: 'Dashboard cache miss spike',
    severity: 'critical',
    ageMinutes: 56,
    owner: 'Tess',
  },
  {
    id: 'INC-3038',
    service: 'Identity Bridge',
    title: 'SAML refresh token audit',
    severity: 'info',
    ageMinutes: 22,
    owner: 'Anika',
  },
] as const;

export function summarizeRecoveryIncidents(total: number, page: number, pageCount: number): string {
  if (total === 0) {
    return 'No incidents match the current query-form state.';
  }

  const start = (page - 1) * RECOVERY_PAGE_SIZE + 1;
  const end = Math.min(start + pageCount - 1, total);

  return `Showing ${start}-${end} of ${total} incidents.`;
}
