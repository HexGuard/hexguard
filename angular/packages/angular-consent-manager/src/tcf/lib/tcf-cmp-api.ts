/**
 * IAB TCF v2.2 CMP API (`window.__tcfapi`).
 *
 * Registers the CMP command queue on the global `window` object,
 * providing the standard `__tcfapi(command, version, callback, parameter)` interface
 * that ad vendors and the IAB framework expect.
 *
 * See: https://github.com/InteractiveAdvertisingBureau/GDPR-Transparency-and-Consent-Framework
 */

import type { Signal } from '@angular/core';

/** Shape of the TC data object passed to __tcfapi callbacks. */
export interface TcData {
  readonly tcString: string;
  readonly tcfPolicyVersion: number;
  readonly cmpId: number;
  readonly cmpVersion: number;
  readonly gdprApplies: boolean;
  readonly cmpStatus: 'stub' | 'loading' | 'loaded' | 'error';
  readonly eventStatus: 'tcloaded' | 'useractioncomplete' | 'cmpuishown' | undefined;
  readonly addendum?: Record<string, unknown>;
  readonly isServiceSpecific?: boolean;
  readonly useNonStandardStacks?: boolean;
  readonly purposeOneTreatment?: boolean;
  readonly publisherCC?: string;
  readonly purposeConsents?: Record<number, boolean>;
  readonly vendorConsents?: Record<number, boolean>;
  readonly purposeLegitimateInterest?: Record<number, boolean>;
  readonly vendorLegitimateInterest?: Record<number, boolean>;
  readonly specialFeatureOptIns?: Record<number, boolean>;
  readonly listenerId?: number;
}

type TcfApiCommand = 'addEventListener' | 'removeEventListener' | 'getTCData' | 'ping';

type TcfApiCallback = (tcData: TcData, success: boolean) => void;

interface TcfApiCall {
  command: TcfApiCommand;
  version: number;
  callback: TcfApiCallback;
  parameter?: unknown;
}

declare global {
  interface Window {
    __tcfapi: (command: TcfApiCommand, version: number, callback: TcfApiCallback, parameter?: unknown) => void;
  }
}

/** Internal representation of a TCF listener. */
interface TcfListener {
  readonly id: number;
  readonly callback: TcfApiCallback;
}

let listenerIdCounter = 0;

/**
 * Manages the `window.__tcfapi` command queue and listener notifications.
 */
export class TcfCmpApi {
  private listeners: TcfListener[] = [];
  private _cmpStatus: TcData['cmpStatus'] = 'stub';
  private _eventStatus: TcData['eventStatus'] = undefined;
  private _gdprApplies = true;

  /** The current TC string. Updated by the consent service. */
  private _tcString = '';

  /** Current purpose consent map (purposeId → consented). */
  private _purposeConsents: Record<number, boolean> = {};
  private _vendorConsents: Record<number, boolean> = {};
  private _purposeLegitimateInterest: Record<number, boolean> = {};
  private _vendorLegitimateInterest: Record<number, boolean> = {};
  private _specialFeatureOptIns: Record<number, boolean> = {};
  private _isServiceSpecific = false;
  private _useNonStandardStacks = false;
  private _purposeOneTreatment = false;
  private _publisherCC = 'XX';
  private _cmpId = 0;
  private _cmpVersion = 1;

  /** Registered signal to update when TC data changes (for injectTcfApi). */
  private _tcStringSignal: Signal<string | null> | null = null;
  private _tcStringSetter: ((value: string | null) => void) | null = null;

  /**
   * Create and register the CMP API on `window`.
   */
  constructor(config?: { cmpId?: number; cmpVersion?: number; gdprApplies?: boolean }) {
    this._cmpId = config?.cmpId ?? 0;
    this._cmpVersion = config?.cmpVersion ?? 1;
    if (config?.gdprApplies !== undefined) {
      this._gdprApplies = config.gdprApplies;
    }
    this.registerWindowApi();
  }

  /**
   * Connect to external signals to propagate TC data changes to Angular.
   */
  connectSignals(
    tcStringSignal: { set: (v: string | null) => void },
  ): void {
    this._tcStringSetter = (v) => tcStringSignal.set(v);
  }

  /**
   * Update the TC string and all consent data, then notify all listeners.
   * Called by the consent service whenever consent changes.
   */
  updateConsent(data: {
    tcString: string;
    cmpId: number;
    cmpVersion: number;
    purposeConsents: Record<number, boolean>;
    vendorConsents?: Record<number, boolean>;
    purposeLegitimateInterest?: Record<number, boolean>;
    vendorLegitimateInterest?: Record<number, boolean>;
    specialFeatureOptIns?: Record<number, boolean>;
    isServiceSpecific?: boolean;
    useNonStandardStacks?: boolean;
    purposeOneTreatment?: boolean;
    publisherCC?: string;
    eventStatus: TcData['eventStatus'];
    gdprApplies?: boolean;
  }): void {
    this._tcString = data.tcString;
    this._cmpId = data.cmpId;
    this._cmpVersion = data.cmpVersion;
    this._purposeConsents = data.purposeConsents;
    this._vendorConsents = data.vendorConsents ?? {};
    this._purposeLegitimateInterest = data.purposeLegitimateInterest ?? {};
    this._vendorLegitimateInterest = data.vendorLegitimateInterest ?? {};
    this._specialFeatureOptIns = data.specialFeatureOptIns ?? {};
    this._isServiceSpecific = data.isServiceSpecific ?? false;
    this._useNonStandardStacks = data.useNonStandardStacks ?? false;
    this._purposeOneTreatment = data.purposeOneTreatment ?? false;
    this._publisherCC = data.publisherCC ?? 'XX';
    if (data.gdprApplies !== undefined) {
      this._gdprApplies = data.gdprApplies;
    }
    this._eventStatus = data.eventStatus;
    this._cmpStatus = 'loaded';

    // Update the Angular signal
    this._tcStringSetter?.(data.tcString);

    // Notify all listeners
    this.notifyListeners();
  }

  /**
   * Notify the CMP is loaded (ping response).
   */
  setLoaded(): void {
    this._cmpStatus = 'loaded';
  }

  /**
   * Set GDPR applicability.
   */
  setGdprApplies(applies: boolean): void {
    this._gdprApplies = applies;
  }

  /**
   * Get the current cmpStatus.
   */
  get status(): TcData['cmpStatus'] {
    return this._cmpStatus;
  }

  // ── Private ──────────────────────────────────────────────────────

  private registerWindowApi(): void {
    if (typeof window === 'undefined') return;

    // Process any calls that were queued before the CMP loaded
    const existingQueue = (window as unknown as Record<string, unknown>)['__tcfapi'];

    window.__tcfapi = (command, version, callback, parameter) => {
      this.handleCommand(command, version, callback, parameter);
    };

    // Process pre-existing queue (if any)
    if (Array.isArray(existingQueue)) {
      for (const call of existingQueue as unknown as TcfApiCall[]) {
        this.handleCommand(call.command, call.version, call.callback, call.parameter);
      }
    }
  }

  private handleCommand(
    command: TcfApiCommand,
    version: number,
    callback: TcfApiCallback,
    parameter?: unknown,
  ): void {
    switch (command) {
      case 'addEventListener':
        this.addEventListener(callback, parameter);
        break;
      case 'removeEventListener':
        this.removeEventListener(parameter);
        break;
      case 'getTCData':
        this.getTcData(callback, parameter);
        break;
      case 'ping':
        this.ping(callback);
        break;
    }
  }

  private addEventListener(callback: TcfApiCallback, parameter?: unknown): void {
    const listenerId = ++listenerIdCounter;
    this.listeners.push({ id: listenerId, callback });

    // Immediately respond with current state
    callback(this.buildTcData(listenerId, 'useractioncomplete'), true);
  }

  private removeEventListener(parameter?: unknown): void {
    const listenerId = parameter as number;
    this.listeners = this.listeners.filter(l => l.id !== listenerId);
  }

  private getTcData(callback: TcfApiCallback, parameter?: unknown): void {
    callback(this.buildTcData(undefined, 'tcloaded'), true);
  }

  private ping(callback: TcfApiCallback): void {
    callback({
      tcString: this._tcString,
      tcfPolicyVersion: 4,
      cmpId: this._cmpId,
      cmpVersion: this._cmpVersion,
      gdprApplies: this._gdprApplies,
      cmpStatus: this._cmpStatus,
      eventStatus: this._eventStatus,
    }, true);
  }

  private notifyListeners(): void {
    const tcData = this.buildTcData(undefined, 'useractioncomplete');
    for (const listener of this.listeners) {
      try {
        listener.callback({ ...tcData, listenerId: listener.id }, true);
      } catch { /* ignore listener errors */ }
    }
  }

  private buildTcData(listenerId?: number, eventStatus?: TcData['eventStatus']): TcData {
    return {
      tcString: this._tcString,
      tcfPolicyVersion: 4,
      cmpId: this._cmpId,
      cmpVersion: this._cmpVersion,
      gdprApplies: this._gdprApplies,
      cmpStatus: this._cmpStatus,
      eventStatus: eventStatus ?? this._eventStatus,
      listenerId,
      isServiceSpecific: this._isServiceSpecific,
      useNonStandardStacks: this._useNonStandardStacks,
      purposeOneTreatment: this._purposeOneTreatment,
      publisherCC: this._publisherCC,
      purposeConsents: { ...this._purposeConsents },
      vendorConsents: { ...this._vendorConsents },
      purposeLegitimateInterest: { ...this._purposeLegitimateInterest },
      vendorLegitimateInterest: { ...this._vendorLegitimateInterest },
      specialFeatureOptIns: { ...this._specialFeatureOptIns },
    };
  }
}
