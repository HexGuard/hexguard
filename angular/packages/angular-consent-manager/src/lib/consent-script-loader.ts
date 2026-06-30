import type { ConsentManagedScript, ConsentState, ScriptLoadingStrategy } from './types';

/** Internal script entry with loading state tracking. */
interface ScriptEntry {
  readonly def: ConsentManagedScript;
  loaded: boolean;
  pending: boolean;
}

/**
 * Manages third-party script loading based on consent state.
 *
 * Scripts registered with `'block_until_consent'` strategy will not load
 * until the user grants their consent category.
 */
export class ConsentScriptLoader {
  private readonly entries = new Map<string, ScriptEntry>();

  /** Registered script definitions. */
  get scripts(): readonly ConsentManagedScript[] {
    return Array.from(this.entries.values()).map(e => e.def);
  }

  /**
   * Register scripts for consent-managed loading.
   * Scripts with `'load_always'` strategy load immediately.
   */
  register(scripts: readonly ConsentManagedScript[]): void {
    for (const def of scripts) {
      if (!this.entries.has(def.id)) {
        this.entries.set(def.id, { def, loaded: false, pending: false });
        if (def.strategy === 'load_always') {
          this.loadScript(def);
        } else {
          this.entries.get(def.id)!.pending = true;
        }
      }
    }
  }

  /**
   * Called when the consent state changes.
   * Loads pending scripts whose category has been granted.
   */
  onConsentChange(state: ConsentState): void {
    for (const [id, entry] of this.entries) {
      if (entry.loaded || !entry.pending) continue;

      const categoryState = state[entry.def.category];
      if (categoryState === true) {
        this.loadScript(entry.def);
        entry.loaded = true;
        entry.pending = false;
      } else if (categoryState === false && entry.def.strategy === 'block_until_consent') {
        // Consent denied for this category — discard pending script
        entry.pending = false;
      }
    }
  }

  /**
   * Returns scripts that are still waiting for consent.
   */
  getPendingScripts(): ConsentManagedScript[] {
    return Array.from(this.entries.values())
      .filter(e => e.pending)
      .map(e => e.def);
  }

  private loadScript(def: ConsentManagedScript): void {
    if (typeof document === 'undefined') return;

    const script = document.createElement('script');
    script.id = `hex-${def.id}`;
    script.src = def.src;
    script.async = true;

    if (def.attributes) {
      for (const [attr, val] of Object.entries(def.attributes)) {
        script.setAttribute(attr, val);
      }
    }

    script.onload = () => {
      this.entries.get(def.id)!.loaded = true;
      def.onLoad?.();
    };

    script.onerror = () => {
      this.entries.get(def.id)!.pending = false;
    };

    document.head.appendChild(script);
  }
}
