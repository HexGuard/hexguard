import { inject } from '@angular/core';
import { ConsentManagerService } from './consent-service';
import type { ConsentState } from './types';

/** The action recorded in an audit entry. */
export type ConsentAction = 'grant' | 'deny' | 'update' | 'withdraw' | 'expire' | 'auto';

/** The method by which consent was expressed. */
export type ConsentMethod =
  | 'banner_accept_all'
  | 'banner_reject_all'
  | 'preference_center'
  | 'floating_button'
  | 'api'
  | 'expiry';

/** A single audit trail entry. */
export interface ConsentRecord {
  readonly id: string;
  readonly timestamp: string;
  readonly action: ConsentAction;
  readonly previousState: ConsentState | null;
  readonly newState: ConsentState;
  readonly consentVersion: number;
  readonly method: ConsentMethod;
  readonly userAgent: string;
  readonly region: string | null;
  readonly consentId: string | null;
}

/** Handle returned by {@link injectConsentAudit}. */
export interface ConsentAuditHandle {
  /** Return all stored audit records. */
  getRecords(): ConsentRecord[];
  /** Export records as a JSON string (for download or server sync). */
  exportRecords(): string;
  /** Clear all audit records. */
  clearRecords(): void;
}

/**
 * Injects the consent audit trail handle.
 * Provides access to stored {@link ConsentRecord} entries.
 *
 * @example
 * ```typescript
 * const audit = injectConsentAudit();
 * const records = audit.getRecords();
 * ```
 */
export function injectConsentAudit(): ConsentAuditHandle {
  const service = inject(ConsentManagerService);

  return {
    getRecords: () => service.getAuditRecords(),
    exportRecords: () => JSON.stringify(service.getAuditRecords(), null, 2),
    clearRecords: () => {
      try {
        const ls = typeof window !== 'undefined' ? window.localStorage : null;
        if (ls) {
          ls.removeItem('hexguard_consent_audit');
        }
      } catch { /* ignore */ }
    },
  };
}
