---
id: feature-angular-changelog
type: feature
status: proposed
created: 2026-06-30
package: '@hexguard/angular-changelog'
---

# @hexguard/angular-changelog

## Summary

Headless changelog generation from conventional commits — parse git history, categorize changes, generate markdown, and display in-app. For automated release notes.

## Goals

- Conventional commit parsing (feat, fix, chore, docs, refactor, perf, test)
- Change categorization (features, fixes, breaking changes, deprecations)
- Markdown changelog generation
- Version comparison (diff between two tags)
- In-app changelog display state
- Breaking change detection and highlighting
- Custom commit type mapping

## Non-Goals

- No git integration at runtime (uses pre-generated JSON)
- No release workflow execution
- No rendered changelog UI

## Proposed Public API

```typescript
// Define changelog at build time
export interface ChangelogConfig {
  entries: ChangelogEntry[];
  repository?: string; // for linking commits
}

export interface ChangelogEntry {
  version: string;
  date: Date;
  sections: ChangelogSection[];
  breaking?: { title: string; description: string; migration?: string }[];
}

export interface ChangelogSection {
  type: 'feat' | 'fix' | 'chore' | 'docs' | 'refactor' | 'perf' | 'test' | 'deprecated';
  title: string;
  items: { summary: string; commitHash?: string; issueRef?: string; scope?: string }[];
}

// In-app access
export function injectChangelog(): {
  readonly entries: Signal<ChangelogEntry[]>;
  readonly latestVersion: Signal<string>;
  readonly currentVersion: Signal<string>; // from deploy info
  readonly hasNewChanges: Signal<boolean>; // current < latest
  readonly breakingChanges: Signal<ChangelogEntry['breaking']>;
  getEntry(version: string): ChangelogEntry | null;
};

// Usage
const cl = injectChangelog();
if (cl.hasNewChanges()) {
  // Show "What's New" notification
  console.log(`Updated from ${cl.currentVersion()} to ${cl.latestVersion()}`);
}
```

## Implementation Plan
1. Scaffold `angular/packages/angular-changelog/`.
2. Implement changelog data model, in-app access signals, version comparison.
3. Add breaking change detection and notification state.
4. Add tests. Register in workspace.
