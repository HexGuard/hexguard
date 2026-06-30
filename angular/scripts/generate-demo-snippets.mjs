import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { format, resolveConfig } from 'prettier';

const generatedSnippetsPath = resolve('apps/demo-angular/src/app/generated/demo-snippets.ts');

async function formatWithResolvedConfig(source, filepath) {
  const resolvedConfig =
    (await resolveConfig(filepath, {
      editorconfig: true,
    })) ?? {};

  return format(source, {
    ...resolvedConfig,
    filepath,
  });
}

const snippets = [
  {
    id: 'angular-url-state/orders-demo-state',
    title: 'Orders demo component source',
    description:
      'Generated from the real Orders demo component files, including TypeScript, template, and styles.',
    workspacePath:
      'apps/demo-angular/src/app/features/packages/angular/angular-url-state/pages/orders-demo-page/orders-demo-page.component.ts',
    sourcePath:
      'angular/apps/demo-angular/src/app/features/packages/angular/angular-url-state/pages/orders-demo-page/orders-demo-page.component.ts',
  },
  {
    id: 'angular-url-state/dashboard-demo-state',
    title: 'Dashboard demo component source',
    description:
      'Generated from the real Dashboard demo component files, including TypeScript, template, and styles.',
    workspacePath:
      'apps/demo-angular/src/app/features/packages/angular/angular-url-state/pages/dashboard-demo-page/dashboard-demo-page.component.ts',
    sourcePath:
      'angular/apps/demo-angular/src/app/features/packages/angular/angular-url-state/pages/dashboard-demo-page/dashboard-demo-page.component.ts',
  },
  {
    id: 'angular-query-form/orders-demo-state',
    title: 'Orders query-form component source',
    description:
      'Generated from the real Orders Query Form component files, including TypeScript, template, and styles.',
    workspacePath:
      'apps/demo-angular/src/app/features/packages/angular/angular-query-form/pages/orders-query-form-demo-page/orders-query-form-demo-page.component.ts',
    sourcePath:
      'angular/apps/demo-angular/src/app/features/packages/angular/angular-query-form/pages/orders-query-form-demo-page/orders-query-form-demo-page.component.ts',
  },
  {
    id: 'angular-query-form/recovery-demo-state',
    title: 'Recovery query-form component source',
    description:
      'Generated from the real Recovery Query Form component files, including TypeScript, template, and styles.',
    workspacePath:
      'apps/demo-angular/src/app/features/packages/angular/angular-query-form/pages/recovery-query-form-demo-page/recovery-query-form-demo-page.component.ts',
    sourcePath:
      'angular/apps/demo-angular/src/app/features/packages/angular/angular-query-form/pages/recovery-query-form-demo-page/recovery-query-form-demo-page.component.ts',
  },
  {
    id: 'angular-async-state/value-demo-state',
    title: 'Async value component source',
    description:
      'Generated from the real asyncState value demo component files, including TypeScript, template, and styles.',
    workspacePath:
      'apps/demo-angular/src/app/features/packages/angular/angular-async-state/pages/async-state-value-demo-page/async-state-value-demo-page.component.ts',
    sourcePath:
      'angular/apps/demo-angular/src/app/features/packages/angular/angular-async-state/pages/async-state-value-demo-page/async-state-value-demo-page.component.ts',
  },
  {
    id: 'angular-async-state/observable-demo-state',
    title: 'Observable-state component source',
    description:
      'Generated from the real observableState demo component files, including TypeScript, template, and styles.',
    workspacePath:
      'apps/demo-angular/src/app/features/packages/angular/angular-async-state/pages/async-state-observable-demo-page/async-state-observable-demo-page.component.ts',
    sourcePath:
      'angular/apps/demo-angular/src/app/features/packages/angular/angular-async-state/pages/async-state-observable-demo-page/async-state-observable-demo-page.component.ts',
  },
  {
    id: 'angular-async-state/action-demo-state',
    title: 'Async action component source',
    description:
      'Generated from the real asyncAction demo component files, including TypeScript, template, and styles.',
    workspacePath:
      'apps/demo-angular/src/app/features/packages/angular/angular-async-state/pages/async-state-action-demo-page/async-state-action-demo-page.component.ts',
    sourcePath:
      'angular/apps/demo-angular/src/app/features/packages/angular/angular-async-state/pages/async-state-action-demo-page/async-state-action-demo-page.component.ts',
  },
  {
    id: 'angular-lookups/editor-demo-state',
    title: 'Lookup editor demo component source',
    description:
      'Generated from the real lookup editor demo component files, including TypeScript, template, and styles.',
    workspacePath:
      'apps/demo-angular/src/app/features/packages/angular/angular-lookups/pages/lookups-editor-demo-page/lookups-editor-demo-page.component.ts',
    sourcePath:
      'angular/apps/demo-angular/src/app/features/packages/angular/angular-lookups/pages/lookups-editor-demo-page/lookups-editor-demo-page.component.ts',
  },
  {
    id: 'angular-lookups/backend-demo-state',
    title: 'Lookup backend integration demo component source',
    description:
      'Generated from the real lookup backend demo component files, including TypeScript, template, and styles.',
    workspacePath:
      'apps/demo-angular/src/app/features/packages/angular/angular-lookups/pages/lookups-backend-demo-page/lookups-backend-demo-page.component.ts',
    sourcePath:
      'angular/apps/demo-angular/src/app/features/packages/angular/angular-lookups/pages/lookups-backend-demo-page/lookups-backend-demo-page.component.ts',
  },
  {
    id: 'angular-lookups/summary-demo-state',
    title: 'Lookup summary demo component source',
    description:
      'Generated from the real lookup summary demo component files, including TypeScript, template, and styles.',
    workspacePath:
      'apps/demo-angular/src/app/features/packages/angular/angular-lookups/pages/lookups-summary-demo-page/lookups-summary-demo-page.component.ts',
    sourcePath:
      'angular/apps/demo-angular/src/app/features/packages/angular/angular-lookups/pages/lookups-summary-demo-page/lookups-summary-demo-page.component.ts',
  },
  {
    id: 'angular-optimistic-state/toggle-demo-state',
    title: 'Optimistic toggle component source',
    description:
      'Generated from the real optimistic toggle demo component files, including TypeScript, template, and styles.',
    workspacePath:
      'apps/demo-angular/src/app/features/packages/angular/angular-optimistic-state/pages/optimistic-state-toggle-demo-page/optimistic-state-toggle-demo-page.component.ts',
    sourcePath:
      'angular/apps/demo-angular/src/app/features/packages/angular/angular-optimistic-state/pages/optimistic-state-toggle-demo-page/optimistic-state-toggle-demo-page.component.ts',
  },
  {
    id: 'angular-optimistic-state/inline-edit-demo-state',
    title: 'Optimistic inline-edit component source',
    description:
      'Generated from the real optimistic inline-edit demo component files, including TypeScript, template, and styles.',
    workspacePath:
      'apps/demo-angular/src/app/features/packages/angular/angular-optimistic-state/pages/optimistic-state-inline-edit-demo-page/optimistic-state-inline-edit-demo-page.component.ts',
    sourcePath:
      'angular/apps/demo-angular/src/app/features/packages/angular/angular-optimistic-state/pages/optimistic-state-inline-edit-demo-page/optimistic-state-inline-edit-demo-page.component.ts',
  },
  {
    id: 'angular-optimistic-state/bulk-demo-state',
    title: 'Optimistic bulk component source',
    description:
      'Generated from the real optimistic bulk demo component files, including TypeScript, template, and styles.',
    workspacePath:
      'apps/demo-angular/src/app/features/packages/angular/angular-optimistic-state/pages/optimistic-state-bulk-demo-page/optimistic-state-bulk-demo-page.component.ts',
    sourcePath:
      'angular/apps/demo-angular/src/app/features/packages/angular/angular-optimistic-state/pages/optimistic-state-bulk-demo-page/optimistic-state-bulk-demo-page.component.ts',
  },
  {
    id: 'angular-permissions/actions-demo-state',
    title: 'Permissions action demo component source',
    description:
      'Generated from the real permissions action demo component files, including TypeScript, template, and styles.',
    workspacePath:
      'apps/demo-angular/src/app/features/packages/angular/angular-permissions/pages/permission-actions-demo-page/permission-actions-demo-page.component.ts',
    sourcePath:
      'angular/apps/demo-angular/src/app/features/packages/angular/angular-permissions/pages/permission-actions-demo-page/permission-actions-demo-page.component.ts',
  },
  {
    id: 'angular-permissions/routing-demo-state',
    title: 'Permissions routing demo component source',
    description:
      'Generated from the real permissions routing demo component files, including TypeScript, template, and styles.',
    workspacePath:
      'apps/demo-angular/src/app/features/packages/angular/angular-permissions/pages/permission-routing-demo-page/permission-routing-demo-page.component.ts',
    sourcePath:
      'angular/apps/demo-angular/src/app/features/packages/angular/angular-permissions/pages/permission-routing-demo-page/permission-routing-demo-page.component.ts',
  },
  {
    id: 'angular-selection-state/demo',
    title: 'Selection state demo component source',
    description:
      'Generated from the real Selection State demo component files, including TypeScript, template, and styles.',
    workspacePath:
      'apps/demo-angular/src/app/features/packages/angular/angular-selection-state/pages/selection-state-demo-page/selection-state-demo-page.component.ts',
    sourcePath:
      'angular/apps/demo-angular/src/app/features/packages/angular/angular-selection-state/pages/selection-state-demo-page/selection-state-demo-page.component.ts',
  },
  {
    id: 'angular-date-utils/demo-state',
    title: 'Date utils demo component source',
    description:
      'Generated from the real Date Utils demo component files, including TypeScript, template, and styles.',
    workspacePath:
      'apps/demo-angular/src/app/features/packages/angular/angular-date-utils/pages/date-utils-demo-page/date-utils-demo-page.component.ts',
    sourcePath:
      'angular/apps/demo-angular/src/app/features/packages/angular/angular-date-utils/pages/date-utils-demo-page/date-utils-demo-page.component.ts',
  },
  {
    id: 'angular-network-status/demo-state',
    title: 'Network status demo component source',
    description:
      'Generated from the real Network Status demo component files, including TypeScript, template, and styles.',
    workspacePath:
      'apps/demo-angular/src/app/features/packages/angular/angular-network-status/pages/network-status-demo-page/network-status-demo-page.component.ts',
    sourcePath:
      'angular/apps/demo-angular/src/app/features/packages/angular/angular-network-status/pages/network-status-demo-page/network-status-demo-page.component.ts',
  },
  {
    id: 'angular-storage/demo-state',
    title: 'Storage demo component source',
    description:
      'Generated from the real Storage demo component files, including TypeScript, template, and styles.',
    workspacePath:
      'apps/demo-angular/src/app/features/packages/angular/angular-storage/pages/storage-demo-page/storage-demo-page.component.ts',
    sourcePath:
      'angular/apps/demo-angular/src/app/features/packages/angular/angular-storage/pages/storage-demo-page/storage-demo-page.component.ts',
  },
  {
    id: 'angular-bulk-operations/demo',
    title: 'Bulk operations demo component source',
    description:
      'Generated from the real Bulk Operations demo component files, including TypeScript, template, and styles.',
    workspacePath:
      'apps/demo-angular/src/app/features/packages/angular/angular-bulk-operations/pages/bulk-operations-demo-page/bulk-operations-demo-page.component.ts',
    sourcePath:
      'angular/apps/demo-angular/src/app/features/packages/angular/angular-bulk-operations/pages/bulk-operations-demo-page/bulk-operations-demo-page.component.ts',
  },
  {
    id: 'angular-bulk-operations/api-demo',
    title: 'Bulk operations live API demo component source',
    description:
      'Generated from the real Bulk Operations API demo component files, including TypeScript, template, and styles.',
    workspacePath:
      'apps/demo-angular/src/app/features/packages/angular/angular-bulk-operations/pages/bulk-operations-api-demo-page/bulk-operations-api-demo-page.component.ts',
    sourcePath:
      'angular/apps/demo-angular/src/app/features/packages/angular/angular-bulk-operations/pages/bulk-operations-api-demo-page/bulk-operations-api-demo-page.component.ts',
  },
  {
    id: 'angular-bulk-operations/library-demo',
    title: 'Bulk operations library API workflow demo component source',
    description:
      'Generated from the real Bulk Operations Library API workflow demo component files, including TypeScript, template, and styles.',
    workspacePath:
      'apps/demo-angular/src/app/features/packages/angular/angular-bulk-operations/pages/bulk-operations-library-demo-page/bulk-operations-library-demo-page.component.ts',
    sourcePath:
      'angular/apps/demo-angular/src/app/features/packages/angular/angular-bulk-operations/pages/bulk-operations-library-demo-page/bulk-operations-library-demo-page.component.ts',
  },
  {
    id: 'angular-breakpoint-observer/demo-state',
    title: 'Breakpoint observer demo component source',
    description:
      'Generated from the real Breakpoint Observer demo component files, including TypeScript, template, and styles.',
    workspacePath:
      'apps/demo-angular/src/app/features/packages/angular/angular-breakpoint-observer/pages/breakpoint-observer-demo-page/breakpoint-observer-demo-page.component.ts',
    sourcePath:
      'angular/apps/demo-angular/src/app/features/packages/angular/angular-breakpoint-observer/pages/breakpoint-observer-demo-page/breakpoint-observer-demo-page.component.ts',
  },
  {
    id: 'angular-navigation-pending/demo-state',
    title: 'Navigation pending demo component source',
    description:
      'Generated from the real Navigation Pending demo component files, including TypeScript, template, and styles.',
    workspacePath:
      'apps/demo-angular/src/app/features/packages/angular/angular-navigation-pending/pages/navigation-pending-demo-page/navigation-pending-demo-page.component.ts',
    sourcePath:
      'angular/apps/demo-angular/src/app/features/packages/angular/angular-navigation-pending/pages/navigation-pending-demo-page/navigation-pending-demo-page.component.ts',
  },
  {
    id: 'angular-click-outside/demo-state',
    title: 'Click outside demo component source',
    description:
      'Generated from the real Click Outside demo component files, including TypeScript, template, and styles.',
    workspacePath:
      'apps/demo-angular/src/app/features/packages/angular/angular-click-outside/pages/click-outside-demo-page/click-outside-demo-page.component.ts',
    sourcePath:
      'angular/apps/demo-angular/src/app/features/packages/angular/angular-click-outside/pages/click-outside-demo-page/click-outside-demo-page.component.ts',
  },
  {
    id: 'angular-color/demo-state',
    title: 'Color demo component source',
    description:
      'Generated from the real Color demo component files, including TypeScript, template, and styles.',
    workspacePath:
      'apps/demo-angular/src/app/features/packages/angular/angular-color/pages/color-demo-page/color-demo-page.component.ts',
    sourcePath:
      'angular/apps/demo-angular/src/app/features/packages/angular/angular-color/pages/color-demo-page/color-demo-page.component.ts',
  },
  {
    id: 'angular-consent-manager/demo-state',
    title: 'Consent Manager demo component source',
    description:
      'Generated from the real Consent Manager demo component files, including TypeScript, template, and styles.',
    workspacePath:
      'apps/demo-angular/src/app/features/packages/angular/angular-consent-manager/pages/consent-manager-demo-page/consent-manager-demo-page.component.ts',
    sourcePath:
      'angular/apps/demo-angular/src/app/features/packages/angular/angular-consent-manager/pages/consent-manager-demo-page/consent-manager-demo-page.component.ts',
  },
  {
    id: 'angular-cookie-consent/demo-state',
    title: 'Cookie Consent demo component source',
    description:
      'Generated from the real Cookie Consent demo component files, including TypeScript, template, and styles.',
    workspacePath:
      'apps/demo-angular/src/app/features/packages/angular/angular-cookie-consent/pages/cookie-consent-demo-page/cookie-consent-demo-page.component.ts',
    sourcePath:
      'angular/apps/demo-angular/src/app/features/packages/angular/angular-cookie-consent/pages/cookie-consent-demo-page/cookie-consent-demo-page.component.ts',
  },
  {
    id: 'angular-design-tokens/demo-state',
    title: 'Design Tokens demo component source',
    description:
      'Generated from the real Design Tokens demo component files, including TypeScript, template, and styles.',
    workspacePath:
      'apps/demo-angular/src/app/features/packages/angular/angular-design-tokens/pages/design-tokens-demo-page/design-tokens-demo-page.component.ts',
    sourcePath:
      'angular/apps/demo-angular/src/app/features/packages/angular/angular-design-tokens/pages/design-tokens-demo-page/design-tokens-demo-page.component.ts',
  },
  {
    id: 'angular-component-variants/demo-state',
    title: 'Component Variants demo component source',
    description: 'Generated from the real Component Variants demo component files.',
    workspacePath:
      'apps/demo-angular/src/app/features/packages/angular/angular-component-variants/pages/component-variants-demo-page/component-variants-demo-page.component.ts',
    sourcePath:
      'angular/apps/demo-angular/src/app/features/packages/angular/angular-component-variants/pages/component-variants-demo-page/component-variants-demo-page.component.ts',
  },
  {
    id: 'angular-icon-registry/demo-state',
    title: 'Icon Registry demo component source',
    description: 'Generated from the real Icon Registry demo component files.',
    workspacePath:
      'apps/demo-angular/src/app/features/packages/angular/angular-icon-registry/pages/icon-registry-demo-page/icon-registry-demo-page.component.ts',
    sourcePath:
      'angular/apps/demo-angular/src/app/features/packages/angular/angular-icon-registry/pages/icon-registry-demo-page/icon-registry-demo-page.component.ts',
  },
  {
    id: 'angular-skeleton/demo-state',
    title: 'Skeleton demo component source',
    description: 'Generated from the real Skeleton demo component files.',
    workspacePath:
      'apps/demo-angular/src/app/features/packages/angular/angular-skeleton/pages/skeleton-demo-page/skeleton-demo-page.component.ts',
    sourcePath:
      'angular/apps/demo-angular/src/app/features/packages/angular/angular-skeleton/pages/skeleton-demo-page/skeleton-demo-page.component.ts',
  },
  {
    id: 'angular-clipboard/demo-state',
    title: 'Clipboard demo component source',
    description:
      'Generated from the real Clipboard demo component files, including TypeScript, template, and styles.',
    workspacePath:
      'apps/demo-angular/src/app/features/packages/angular/angular-clipboard/pages/clipboard-demo-page/clipboard-demo-page.component.ts',
    sourcePath:
      'angular/apps/demo-angular/src/app/features/packages/angular/angular-clipboard/pages/clipboard-demo-page/clipboard-demo-page.component.ts',
  },
  {
    id: 'angular-theme/demo-state',
    title: 'Theme demo component source',
    description:
      'Generated from the real Theme demo component files, including TypeScript, template, and styles.',
    workspacePath:
      'apps/demo-angular/src/app/features/packages/angular/angular-theme/pages/theme-demo-page/theme-demo-page.component.ts',
    sourcePath:
      'angular/apps/demo-angular/src/app/features/packages/angular/angular-theme/pages/theme-demo-page/theme-demo-page.component.ts',
  },
  {
    id: 'angular-form-drafts/demo-state',
    title: 'Form Drafts demo component source',
    description:
      'Generated from the real Form Drafts demo component files, including TypeScript, template, and styles.',
    workspacePath:
      'apps/demo-angular/src/app/features/packages/angular/angular-form-drafts/pages/form-drafts-demo-page/form-drafts-demo-page.component.ts',
    sourcePath:
      'angular/apps/demo-angular/src/app/features/packages/angular/angular-form-drafts/pages/form-drafts-demo-page/form-drafts-demo-page.component.ts',
  },
  {
    id: 'angular-file-picker/demo-state',
    title: 'File Picker demo component source',
    description:
      'Generated from the real File Picker demo component files, including TypeScript, template, and styles.',
    workspacePath:
      'apps/demo-angular/src/app/features/packages/angular/angular-file-picker/pages/file-picker-demo-page/file-picker-demo-page.component.ts',
    sourcePath:
      'angular/apps/demo-angular/src/app/features/packages/angular/angular-file-picker/pages/file-picker-demo-page/file-picker-demo-page.component.ts',
  },
  {
    id: 'angular-live-data/demo-state',
    title: 'Live Data demo component source',
    description:
      'Generated from the real Live Data demo component files, including TypeScript, template, and styles.',
    workspacePath:
      'apps/demo-angular/src/app/features/packages/angular/angular-live-data/pages/live-data-demo-page/live-data-demo-page.component.ts',
    sourcePath:
      'angular/apps/demo-angular/src/app/features/packages/angular/angular-live-data/pages/live-data-demo-page/live-data-demo-page.component.ts',
  },
  {
    id: 'angular-pagination/cross-stack-demo-state',
    title: 'Pagination cross-stack demo component source',
    description:
      'Generated from the Cross-stack pagination demo component files, including TypeScript, template, and styles.',
    workspacePath:
      'apps/demo-angular/src/app/features/packages/angular/angular-pagination/pages/pagination-cross-stack-demo-page/pagination-cross-stack-demo-page.component.ts',
    sourcePath:
      'angular/apps/demo-angular/src/app/features/packages/angular/angular-pagination/pages/pagination-cross-stack-demo-page/pagination-cross-stack-demo-page.component.ts',
    sourcePath:
      'angular/apps/demo-angular/src/app/features/packages/angular/angular-live-data/pages/live-data-demo-page/live-data-demo-page.component.ts',
  },
  {
    id: 'angular-confirmation/demo-state',
    title: 'Confirmation demo component source',
    description:
      'Generated from the real Confirmation demo component files, including TypeScript, template, and styles.',
    workspacePath:
      'apps/demo-angular/src/app/features/packages/angular/angular-confirmation/pages/confirmation-demo-page/confirmation-demo-page.component.ts',
    sourcePath:
      'angular/apps/demo-angular/src/app/features/packages/angular/angular-confirmation/pages/confirmation-demo-page/confirmation-demo-page.component.ts',
  },
  {
    id: 'angular-pagination/demo-state',
    title: 'Pagination demo component source',
    description:
      'Generated from the real Pagination demo component files, including TypeScript, template, and styles.',
    workspacePath:
      'apps/demo-angular/src/app/features/packages/angular/angular-pagination/pages/pagination-demo-page/pagination-demo-page.component.ts',
    sourcePath:
      'angular/apps/demo-angular/src/app/features/packages/angular/angular-pagination/pages/pagination-demo-page/pagination-demo-page.component.ts',
  },
  {
    id: 'angular-undo/demo-state',
    title: 'Undo demo component source',
    description:
      'Generated from the real Undo demo component files, including TypeScript, template, and styles.',
    workspacePath:
      'apps/demo-angular/src/app/features/packages/angular/angular-undo/pages/undo-demo-page/undo-demo-page.component.ts',
    sourcePath:
      'angular/apps/demo-angular/src/app/features/packages/angular/angular-undo/pages/undo-demo-page/undo-demo-page.component.ts',
  },
  {
    id: 'angular-route-memory/demo-state',
    title: 'Route Memory demo component source',
    description:
      'Generated from the real Route Memory demo component files, including TypeScript, template, and styles.',
    workspacePath:
      'apps/demo-angular/src/app/features/packages/angular/angular-route-memory/pages/route-memory-demo-page/route-memory-demo-page.component.ts',
    sourcePath:
      'angular/apps/demo-angular/src/app/features/packages/angular/angular-route-memory/pages/route-memory-demo-page/route-memory-demo-page.component.ts',
  },
  {
    id: 'angular-page-context/demo-state',
    title: 'Page Context demo component source',
    description:
      'Generated from the real Page Context demo component files, including TypeScript, template, and styles.',
    workspacePath:
      'apps/demo-angular/src/app/features/packages/angular/angular-page-context/pages/page-context-demo-page/page-context-demo-page.component.ts',
    sourcePath:
      'angular/apps/demo-angular/src/app/features/packages/angular/angular-page-context/pages/page-context-demo-page/page-context-demo-page.component.ts',
  },
  {
    id: 'angular-scroll-state/demo-state',
    title: 'Scroll State demo component source',
    description:
      'Generated from the real Scroll State demo component files, including TypeScript, template, and styles.',
    workspacePath:
      'apps/demo-angular/src/app/features/packages/angular/angular-scroll-state/pages/scroll-state-demo-page/scroll-state-demo-page.component.ts',
    sourcePath:
      'angular/apps/demo-angular/src/app/features/packages/angular/angular-scroll-state/pages/scroll-state-demo-page/scroll-state-demo-page.component.ts',
  },
  {
    id: 'angular-wizard-state/demo-state',
    title: 'Wizard State demo component source',
    description:
      'Generated from the real Wizard State demo component files, including TypeScript, template, and styles.',
    workspacePath:
      'apps/demo-angular/src/app/features/packages/angular/angular-wizard-state/pages/wizard-state-demo-page/wizard-state-demo-page.component.ts',
    sourcePath:
      'angular/apps/demo-angular/src/app/features/packages/angular/angular-wizard-state/pages/wizard-state-demo-page/wizard-state-demo-page.component.ts',
  },
  {
    id: 'angular-upload-state/demo',
    title: 'Upload State demo component source',
    description:
      'Generated from the real Upload State demo component files, including TypeScript, template, and styles.',
    workspacePath:
      'apps/demo-angular/src/app/features/packages/angular/angular-upload-state/pages/upload-state-demo-page/upload-state-demo-page.component.ts',
    sourcePath:
      'angular/apps/demo-angular/src/app/features/packages/angular/angular-upload-state/pages/upload-state-demo-page/upload-state-demo-page.component.ts',
  },
  {
    id: 'angular-command-palette/demo-state',
    title: 'Command Palette demo component source',
    description:
      'Generated from the real Command Palette demo component files, including TypeScript, template, and styles.',
    workspacePath:
      'apps/demo-angular/src/app/features/packages/angular/angular-command-palette/pages/command-palette-demo-page/command-palette-demo-page.component.ts',
    sourcePath:
      'angular/apps/demo-angular/src/app/features/packages/angular/angular-command-palette/pages/command-palette-demo-page/command-palette-demo-page.component.ts',
  },
  {
    id: 'angular-dirty-state/demo-state',
    title: 'Dirty State demo component source',
    description:
      'Generated from the real Dirty State demo component files, including TypeScript, template, and styles.',
    workspacePath:
      'apps/demo-angular/src/app/features/packages/angular/angular-dirty-state/pages/dirty-state-demo-page/dirty-state-demo-page.component.ts',
    sourcePath:
      'angular/apps/demo-angular/src/app/features/packages/angular/angular-dirty-state/pages/dirty-state-demo-page/dirty-state-demo-page.component.ts',
  },
  {
    id: 'angular-table-state/demo-state',
    title: 'Table State demo component source',
    description:
      'Generated from the real Table State demo component files, including TypeScript, template, and styles.',
    workspacePath:
      'apps/demo-angular/src/app/features/packages/angular/angular-table-state/pages/table-state-demo-page/table-state-demo-page.component.ts',
    sourcePath:
      'angular/apps/demo-angular/src/app/features/packages/angular/angular-table-state/pages/table-state-demo-page/table-state-demo-page.component.ts',
  },
  {
    id: 'angular-signal-persist/demo-state',
    title: 'Signal Persist demo component source',
    description:
      'Generated from the real Signal Persist demo component files, including TypeScript, template, and styles.',
    workspacePath:
      'apps/demo-angular/src/app/features/packages/angular/angular-signal-persist/pages/signal-persist-demo-page/signal-persist-demo-page.component.ts',
    sourcePath:
      'angular/apps/demo-angular/src/app/features/packages/angular/angular-signal-persist/pages/signal-persist-demo-page/signal-persist-demo-page.component.ts',
  },
  {
    id: 'angular-signal-utils/demo-state',
    title: 'Signal Utils demo component source',
    description:
      'Generated from the real Signal Utils demo component files, including TypeScript, template, and styles.',
    workspacePath:
      'apps/demo-angular/src/app/features/packages/angular/angular-signal-utils/pages/signal-utils-demo-page/signal-utils-demo-page.component.ts',
    sourcePath:
      'angular/apps/demo-angular/src/app/features/packages/angular/angular-signal-utils/pages/signal-utils-demo-page/signal-utils-demo-page.component.ts',
  },
  {
    id: 'angular-preferences/demo-state',
    title: 'Preferences demo component source',
    description:
      'Generated from the real Preferences demo component files, including TypeScript, template, and styles.',
    workspacePath:
      'apps/demo-angular/src/app/features/packages/angular/angular-preferences/pages/preferences-demo-page/preferences-demo-page.component.ts',
    sourcePath:
      'angular/apps/demo-angular/src/app/features/packages/angular/angular-preferences/pages/preferences-demo-page/preferences-demo-page.component.ts',
  },
  {
    id: 'angular-http-dedupe/demo-state',
    title: 'HTTP Dedupe demo component source',
    description:
      'Generated from the real HTTP Dedupe demo component files, including TypeScript, template, and styles.',
    workspacePath:
      'apps/demo-angular/src/app/features/packages/angular/angular-http-dedupe/pages/http-dedupe-demo-page/http-dedupe-demo-page.component.ts',
    sourcePath:
      'angular/apps/demo-angular/src/app/features/packages/angular/angular-http-dedupe/pages/http-dedupe-demo-page/http-dedupe-demo-page.component.ts',
  },
  {
    id: 'angular-recently-viewed/demo-state',
    title: 'Recently Viewed demo component source',
    description:
      'Generated from the real Recently Viewed demo component files, including TypeScript, template, and styles.',
    workspacePath:
      'apps/demo-angular/src/app/features/packages/angular/angular-recently-viewed/pages/recently-viewed-demo-page/recently-viewed-demo-page.component.ts',
    sourcePath:
      'angular/apps/demo-angular/src/app/features/packages/angular/angular-recently-viewed/pages/recently-viewed-demo-page/recently-viewed-demo-page.component.ts',
  },
  {
    id: 'angular-form-utils/demo-state',
    title: 'Form Utils demo component source',
    description:
      'Generated from the real Form Utils demo component files, including TypeScript, template, and styles.',
    workspacePath:
      'apps/demo-angular/src/app/features/packages/angular/angular-form-utils/pages/form-utils-demo-page/form-utils-demo-page.component.ts',
    sourcePath:
      'angular/apps/demo-angular/src/app/features/packages/angular/angular-form-utils/pages/form-utils-demo-page/form-utils-demo-page.component.ts',
  },
  {
    id: 'angular-query-signal-forms/demo-state',
    title: 'Query Signal Forms demo component source',
    description:
      'Generated from the real Query Signal Forms demo component files, including TypeScript, template, and styles.',
    workspacePath:
      'apps/demo-angular/src/app/features/packages/angular/angular-query-signal-forms/pages/query-signal-forms-demo-page/query-signal-forms-demo-page.component.ts',
    sourcePath:
      'angular/apps/demo-angular/src/app/features/packages/angular/angular-query-signal-forms/pages/query-signal-forms-demo-page/query-signal-forms-demo-page.component.ts',
  },
];

function normalizeSource(source) {
  return source.replace(/\r\n/g, '\n').replace(/\r/g, '\n').replace(/\n$/, '');
}

function replaceExtension(path, extension) {
  return path.replace(/\.ts$/, extension);
}

function createSourceFile(id, label, language, workspacePath, sourcePath) {
  if (!existsSync(workspacePath)) return null;
  return {
    id,
    label,
    language,
    sourcePath,
    code: normalizeSource(readFileSync(workspacePath, 'utf8')),
  };
}

const entries = snippets.map((snippet) => ({
  ...snippet,
  files: [
    createSourceFile('ts', 'component.ts', 'ts', snippet.workspacePath, snippet.sourcePath),
    createSourceFile(
      'html',
      'template.html',
      'html',
      replaceExtension(snippet.workspacePath, '.html'),
      replaceExtension(snippet.sourcePath, '.html'),
    ),
    createSourceFile(
      'css',
      'styles.css',
      'css',
      replaceExtension(snippet.workspacePath, '.css'),
      replaceExtension(snippet.sourcePath, '.css'),
    ),
  ].filter(Boolean),
}));

const generated = `// This file is generated by scripts/generate-demo-snippets.mjs.

export type DemoSourceLanguage = 'ts' | 'html' | 'css';

export interface DemoSourceFile {
  readonly id: 'ts' | 'html' | 'css';
  readonly label: string;
  readonly language: DemoSourceLanguage;
  readonly sourcePath: string;
  readonly code: string;
}

export interface DemoSourceSnippet {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly files: readonly DemoSourceFile[];
}

export const DEMO_SOURCE_SNIPPETS: Record<string, DemoSourceSnippet> = ${JSON.stringify(
  Object.fromEntries(
    entries.map((entry) => [
      entry.id,
      {
        id: entry.id,
        title: entry.title,
        description: entry.description,
        files: entry.files,
      },
    ]),
  ),
  null,
  2,
)};
`;

writeFileSync(
  generatedSnippetsPath,
  await formatWithResolvedConfig(generated, generatedSnippetsPath),
);
