import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { format, resolveConfig } from 'prettier';

const generatedSnippetsPath = resolve('apps/demo-angular/src/app/generated/demo-snippets.ts');
const syntheticSnippetPath = resolve(
  'apps/demo-angular/src/app/generated/demo-snippet.synthetic.ts',
);

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
    marker: 'orders-demo-state',
    title: 'Orders demo state setup',
    description: 'Generated from the real Orders demo component source.',
    workspacePath:
      'apps/demo-angular/src/app/features/angular-url-state/pages/orders-demo-page/orders-demo-page.component.ts',
    sourcePath:
      'angular/apps/demo-angular/src/app/features/angular-url-state/pages/orders-demo-page/orders-demo-page.component.ts',
  },
  {
    id: 'angular-url-state/dashboard-demo-state',
    marker: 'dashboard-demo-state',
    title: 'Dashboard demo state setup',
    description: 'Generated from the real Dashboard demo component source.',
    workspacePath:
      'apps/demo-angular/src/app/features/angular-url-state/pages/dashboard-demo-page/dashboard-demo-page.component.ts',
    sourcePath:
      'angular/apps/demo-angular/src/app/features/angular-url-state/pages/dashboard-demo-page/dashboard-demo-page.component.ts',
  },
  {
    id: 'angular-query-form/orders-demo-state',
    marker: 'query-form-orders-demo',
    title: 'Orders query-form demo setup',
    description: 'Generated from the real Orders Query Form demo component source.',
    workspacePath:
      'apps/demo-angular/src/app/features/angular-query-form/pages/orders-query-form-demo-page/orders-query-form-demo-page.component.ts',
    sourcePath:
      'angular/apps/demo-angular/src/app/features/angular-query-form/pages/orders-query-form-demo-page/orders-query-form-demo-page.component.ts',
  },
  {
    id: 'angular-query-form/recovery-demo-state',
    marker: 'query-form-recovery-demo',
    title: 'Recovery query-form demo setup',
    description: 'Generated from the real Recovery Query Form demo component source.',
    workspacePath:
      'apps/demo-angular/src/app/features/angular-query-form/pages/recovery-query-form-demo-page/recovery-query-form-demo-page.component.ts',
    sourcePath:
      'angular/apps/demo-angular/src/app/features/angular-query-form/pages/recovery-query-form-demo-page/recovery-query-form-demo-page.component.ts',
  },
  {
    id: 'angular-async-state/value-demo-state',
    marker: 'async-state-value-demo',
    title: 'Async value demo setup',
    description: 'Generated from the real asyncState value demo component source.',
    workspacePath:
      'apps/demo-angular/src/app/features/angular-async-state/pages/async-state-value-demo-page/async-state-value-demo-page.component.ts',
    sourcePath:
      'angular/apps/demo-angular/src/app/features/angular-async-state/pages/async-state-value-demo-page/async-state-value-demo-page.component.ts',
  },
  {
    id: 'angular-async-state/action-demo-state',
    marker: 'async-state-action-demo',
    title: 'Async action demo setup',
    description: 'Generated from the real asyncAction demo component source.',
    workspacePath:
      'apps/demo-angular/src/app/features/angular-async-state/pages/async-state-action-demo-page/async-state-action-demo-page.component.ts',
    sourcePath:
      'angular/apps/demo-angular/src/app/features/angular-async-state/pages/async-state-action-demo-page/async-state-action-demo-page.component.ts',
  },
];

function extractSnippet(source, marker) {
  const startMarker = `// demo-snippet:start ${marker}`;
  const endMarker = `// demo-snippet:end ${marker}`;
  const start = source.indexOf(startMarker);
  const end = source.indexOf(endMarker);

  if (start === -1 || end === -1 || end <= start) {
    throw new Error(`Could not find snippet markers for ${marker}.`);
  }

  const raw = source.slice(start + startMarker.length, end).replace(/^\r?\n/, '');
  const lines = raw.replace(/\s+$/, '').split(/\r?\n/);
  const indentation = Math.min(
    ...lines
      .filter((line) => line.trim().length > 0)
      .map((line) => line.match(/^\s*/)?.[0].length ?? 0),
  );

  return lines.map((line) => line.slice(indentation)).join('\n');
}

async function formatClassMemberSnippet(code) {
  const wrapped = `class DemoSnippet {\n${code}\n}\n`;
  const formatted = await formatWithResolvedConfig(wrapped, syntheticSnippetPath);
  const bodyStart = formatted.indexOf('{') + 1;
  const bodyEnd = formatted.lastIndexOf('}');
  const body = formatted
    .slice(bodyStart, bodyEnd)
    .replace(/^\r?\n/, '')
    .replace(/\r?\n$/, '');
  const lines = body.split(/\r?\n/);
  const indentation = Math.min(
    ...lines
      .filter((line) => line.trim().length > 0)
      .map((line) => line.match(/^\s*/)?.[0].length ?? 0),
  );

  return lines.map((line) => line.slice(indentation)).join('\n');
}

const entries = await Promise.all(
  snippets.map(async (snippet) => {
    const source = readFileSync(snippet.workspacePath, 'utf8');

    return {
      ...snippet,
      code: await formatClassMemberSnippet(extractSnippet(source, snippet.marker)),
    };
  }),
);

const generated = `// This file is generated by scripts/generate-demo-snippets.mjs.

export interface DemoSourceSnippet {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly language: 'ts';
  readonly sourcePath: string;
  readonly code: string;
}

export const DEMO_SOURCE_SNIPPETS: Record<string, DemoSourceSnippet> = ${JSON.stringify(
  Object.fromEntries(
    entries.map((entry) => [
      entry.id,
      {
        id: entry.id,
        title: entry.title,
        description: entry.description,
        language: 'ts',
        sourcePath: entry.sourcePath,
        code: entry.code,
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
