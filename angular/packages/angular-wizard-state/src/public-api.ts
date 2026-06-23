/**
 * Public API for `@hexguard/angular-wizard-state`.
 *
 * The package provides a single injectable — `injectWizardState()` — for
 * managing multi-step flow state with validation gates, conditional step
 * visibility, and resumability via storage adapters.
 */
export { injectWizardState } from './lib/wizard-state';
export type { WizardStep, WizardStateOptions, WizardStateHandle, WizardStorage } from './lib/types';
