---
description: 'Use when editing repo documentation, package docs, or roadmap content. Covers the root README hub, docs folder layout, and keeping package-level docs in sync with code.'
applyTo:
  - 'README.md'
  - 'docs/**/*.md'
  - 'angular/packages/angular-url-state/README.md'
  - 'CONTRIBUTING.md'
---

# Documentation Workflow

- Keep `README.md` focused on package discovery, repo navigation, and high-level development entry points.
- Put operational guides and deeper explanations under `docs/` instead of expanding the root README indefinitely.
- When package behavior changes, update both the package README and the matching `docs/packages/` page.
- Demo run instructions belong in `docs/demo/README.md`.
- AI workflow and planning docs belong in `docs/.ai/`.
