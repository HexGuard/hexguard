import { readFileSync, writeFileSync } from 'node:fs';
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
      'apps/demo-angular/src/app/features/angular-url-state/pages/orders-demo-page/orders-demo-page.component.ts',
    sourcePath:
      'angular/apps/demo-angular/src/app/features/angular-url-state/pages/orders-demo-page/orders-demo-page.component.ts',
  },
  {
    id: 'angular-url-state/dashboard-demo-state',
    title: 'Dashboard demo component source',
    description:
      'Generated from the real Dashboard demo component files, including TypeScript, template, and styles.',
    workspacePath:
      'apps/demo-angular/src/app/features/angular-url-state/pages/dashboard-demo-page/dashboard-demo-page.component.ts',
    sourcePath:
      'angular/apps/demo-angular/src/app/features/angular-url-state/pages/dashboard-demo-page/dashboard-demo-page.component.ts',
  },
  {
    id: 'angular-query-form/orders-demo-state',
    title: 'Orders query-form component source',
    description:
      'Generated from the real Orders Query Form component files, including TypeScript, template, and styles.',
    workspacePath:
      'apps/demo-angular/src/app/features/angular-query-form/pages/orders-query-form-demo-page/orders-query-form-demo-page.component.ts',
    sourcePath:
      'angular/apps/demo-angular/src/app/features/angular-query-form/pages/orders-query-form-demo-page/orders-query-form-demo-page.component.ts',
  },
  {
    id: 'angular-query-form/recovery-demo-state',
    title: 'Recovery query-form component source',
    description:
      'Generated from the real Recovery Query Form component files, including TypeScript, template, and styles.',
    workspacePath:
      'apps/demo-angular/src/app/features/angular-query-form/pages/recovery-query-form-demo-page/recovery-query-form-demo-page.component.ts',
    sourcePath:
      'angular/apps/demo-angular/src/app/features/angular-query-form/pages/recovery-query-form-demo-page/recovery-query-form-demo-page.component.ts',
  },
  {
    id: 'angular-async-state/value-demo-state',
    title: 'Async value component source',
    description:
      'Generated from the real asyncState value demo component files, including TypeScript, template, and styles.',
    workspacePath:
      'apps/demo-angular/src/app/features/angular-async-state/pages/async-state-value-demo-page/async-state-value-demo-page.component.ts',
    sourcePath:
      'angular/apps/demo-angular/src/app/features/angular-async-state/pages/async-state-value-demo-page/async-state-value-demo-page.component.ts',
  },
  {
    id: 'angular-async-state/observable-demo-state',
    title: 'Observable-state component source',
    description:
      'Generated from the real observableState demo component files, including TypeScript, template, and styles.',
    workspacePath:
      'apps/demo-angular/src/app/features/angular-async-state/pages/async-state-observable-demo-page/async-state-observable-demo-page.component.ts',
    sourcePath:
      'angular/apps/demo-angular/src/app/features/angular-async-state/pages/async-state-observable-demo-page/async-state-observable-demo-page.component.ts',
  },
  {
    id: 'angular-async-state/action-demo-state',
    title: 'Async action component source',
    description:
      'Generated from the real asyncAction demo component files, including TypeScript, template, and styles.',
    workspacePath:
      'apps/demo-angular/src/app/features/angular-async-state/pages/async-state-action-demo-page/async-state-action-demo-page.component.ts',
    sourcePath:
      'angular/apps/demo-angular/src/app/features/angular-async-state/pages/async-state-action-demo-page/async-state-action-demo-page.component.ts',
  },
  {
    id: 'angular-optimistic-state/toggle-demo-state',
    title: 'Optimistic toggle component source',
    description:
      'Generated from the real optimistic toggle demo component files, including TypeScript, template, and styles.',
    workspacePath:
      'apps/demo-angular/src/app/features/angular-optimistic-state/pages/optimistic-state-toggle-demo-page/optimistic-state-toggle-demo-page.component.ts',
    sourcePath:
      'angular/apps/demo-angular/src/app/features/angular-optimistic-state/pages/optimistic-state-toggle-demo-page/optimistic-state-toggle-demo-page.component.ts',
  },
  {
    id: 'angular-optimistic-state/inline-edit-demo-state',
    title: 'Optimistic inline-edit component source',
    description:
      'Generated from the real optimistic inline-edit demo component files, including TypeScript, template, and styles.',
    workspacePath:
      'apps/demo-angular/src/app/features/angular-optimistic-state/pages/optimistic-state-inline-edit-demo-page/optimistic-state-inline-edit-demo-page.component.ts',
    sourcePath:
      'angular/apps/demo-angular/src/app/features/angular-optimistic-state/pages/optimistic-state-inline-edit-demo-page/optimistic-state-inline-edit-demo-page.component.ts',
  },
  {
    id: 'angular-optimistic-state/bulk-demo-state',
    title: 'Optimistic bulk component source',
    description:
      'Generated from the real optimistic bulk demo component files, including TypeScript, template, and styles.',
    workspacePath:
      'apps/demo-angular/src/app/features/angular-optimistic-state/pages/optimistic-state-bulk-demo-page/optimistic-state-bulk-demo-page.component.ts',
    sourcePath:
      'angular/apps/demo-angular/src/app/features/angular-optimistic-state/pages/optimistic-state-bulk-demo-page/optimistic-state-bulk-demo-page.component.ts',
  },
  {
    id: 'angular-permissions/actions-demo-state',
    title: 'Permissions action demo component source',
    description:
      'Generated from the real permissions action demo component files, including TypeScript, template, and styles.',
    workspacePath:
      'apps/demo-angular/src/app/features/angular-permissions/pages/permission-actions-demo-page/permission-actions-demo-page.component.ts',
    sourcePath:
      'angular/apps/demo-angular/src/app/features/angular-permissions/pages/permission-actions-demo-page/permission-actions-demo-page.component.ts',
  },
  {
    id: 'angular-permissions/routing-demo-state',
    title: 'Permissions routing demo component source',
    description:
      'Generated from the real permissions routing demo component files, including TypeScript, template, and styles.',
    workspacePath:
      'apps/demo-angular/src/app/features/angular-permissions/pages/permission-routing-demo-page/permission-routing-demo-page.component.ts',
    sourcePath:
      'angular/apps/demo-angular/src/app/features/angular-permissions/pages/permission-routing-demo-page/permission-routing-demo-page.component.ts',
  },
];

function normalizeSource(source) {
  return source.replace(/\r\n/g, '\n').replace(/\r/g, '\n').replace(/\n$/, '');
}

function replaceExtension(path, extension) {
  return path.replace(/\.ts$/, extension);
}

function createSourceFile(id, label, language, workspacePath, sourcePath) {
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
  ],
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
