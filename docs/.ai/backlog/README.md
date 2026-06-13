# AI Backlog

This folder tracks implementation-ready work as one Markdown file per feature, ticket, pull
request, or follow-up. The goal is to keep long-lived planning close to the repo while avoiding a
single backlog file that becomes hard to diff, review, or archive.

## Proposed Structure

```text
docs/
  .ai/
    backlog/
      README.md
      feature-angular-query-form.md
      ticket-123-short-title.md
      pr-456-review-follow-up.md
```

Use one file per unit of work:

- `feature-<slug>.md` for product or package work that may span multiple commits or PRs.
- `ticket-<id>-<slug>.md` for externally tracked issues or internal tickets.
- `pr-<id>-<slug>.md` for review follow-ups, release fixes, or PR-specific tasks.
- `chore-<slug>.md` for repo maintenance that does not fit a feature or ticket.

## Backlog File Template

```md
---
id: feature-short-slug
type: feature | ticket | pr | chore
status: proposed | planned | in-progress | blocked | done
created: YYYY-MM-DD
branch: optional-branch-name
package: optional-package-name
owner: optional-owner
---

# Title

## Summary

Short description of the work and why it matters.

## Goals

- Goal 1
- Goal 2

## Non-Goals

- Explicitly deferred concern

## Decisions

- Decision 1

## Implementation Plan

1. Step 1
2. Step 2

## Validation

- Command or manual check

## Follow-Ups

- Future item
```

## Status Guidelines

- `proposed`: worth considering, but not yet committed to a concrete implementation path.
- `planned`: scope and execution path are clear enough to start.
- `in-progress`: implementation or review is actively happening on a branch.
- `blocked`: waiting on a decision, dependency, credential, environment, or upstream change.
- `done`: merged, released, or intentionally closed with the outcome recorded.

## Maintenance Notes

- Keep each file focused on one outcome, not a broad theme.
- Prefer updating the existing backlog file as facts change instead of adding near-duplicates.
- Move completed or abandoned work to `done` with a short outcome note.
- Link related docs, packages, PRs, and validation commands directly in the backlog file.
- Keep `docs/ai/backlog.md` as the short roadmap queue; use this folder for detailed execution
  tickets.
