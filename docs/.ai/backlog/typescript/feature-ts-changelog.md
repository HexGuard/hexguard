---
id: feature-ts-changelog
type: feature
status: proposed
created: 2026-06-30
package: '@hexguard/ts-changelog'
---

# @hexguard/ts-changelog

## Summary

Zero-dependency changelog utilities — conventional commit parsing, change categorization, markdown generation, and version grouping. For automated release notes.

## Proposed Public API

```typescript
// Parse conventional commits
export function parseCommits(raw: string): ParsedCommit[];
export interface ParsedCommit {
  hash: string;
  type: CommitType;      // feat, fix, chore, docs, etc.
  scope?: string;
  description: string;
  body?: string;
  breaking: boolean;
  breakingDescription?: string;
  references: string[];  // issue/pr numbers
  author: string;
  date: Date;
}

export type CommitType = 'feat' | 'fix' | 'chore' | 'docs' | 'style' | 'refactor' | 'perf' | 'test' | 'ci' | 'build' | 'revert';

// Categorize changes
export function categorize(commits: ParsedCommit[]): ChangelogSections;
export interface ChangelogSections {
  features: ParsedCommit[];
  fixes: ParsedCommit[];
  breaking: ParsedCommit[];
  chores: ParsedCommit[];
  docs: ParsedCommit[];
  other: ParsedCommit[];
}

// Generate markdown
export function generateChangelog(commits: ParsedCommit[], options?: ChangelogOptions): string;
export interface ChangelogOptions {
  version?: string;
  date?: Date | string;
  repository?: string;      // for linking commits
  includeAuthor?: boolean;
  groupByScope?: boolean;
  title?: string;
}

// Version grouping
export function groupByVersion(commits: ParsedCommit[], tags: { version: string; hash: string }[]): Map<string, ParsedCommit[]>;

// Git log parsing
export function parseGitLog(log: string): ParsedCommit[];
// Handles: git log --oneline --format="%H %s %an %ad"

// Type mappings
export const COMMIT_TYPE_LABELS: Record<CommitType, string>;
// { feat: 'Features', fix: 'Bug Fixes', chore: 'Chores', ... }

// Filtering
export function filterBreaking(commits: ParsedCommit[]): ParsedCommit[];
export function filterByScope(commits: ParsedCommit[], scope: string): ParsedCommit[];
export function filterByType(commits: ParsedCommit[], type: CommitType): ParsedCommit[];
```

## Implementation Plan
1. Create `ts/packages/ts-changelog/` with zero dependencies.
2. Implement commit parsing, categorization, markdown generation, git log parsing.
3. Add tests with real changelog fixtures.
4. Publish to npm.
