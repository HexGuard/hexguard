/**
 * Public API for `@hexguard/angular-upload-state`.
 *
 * The package provides `injectUploadState()` — headless file upload lifecycle
 * state with queue management, progress tracking, cancellation, and retry.
 */
export { injectUploadState } from './lib/upload-state';
export type { UploadItem, UploadItemStatus, UploadOptions, UploadState } from './lib/types';
