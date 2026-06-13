# 0001 Separate Angular and .NET Spaces

Status: Accepted  
Date: 2026-06-13

## Context

HexGuard is growing as a package hub for Angular, .NET, and cross-stack package families. The repo already has a strong Angular monorepo shape, while planned .NET and paired packages need room to grow without inheriting Angular-specific assumptions.

A single flat planning surface makes it too easy to mix Angular-only, .NET-only, and paired package work. Separate repos would add overhead too early for a single developer, but a single undifferentiated workspace would blur package boundaries and make AI-assisted planning less precise.

## Decision

Keep one strategy repo, but treat Angular and .NET as separate spaces.

- Angular now lives in a dedicated top-level `angular/` workspace, with npm packages under `angular/packages/`, Angular apps under `angular/apps/`, and frontend tooling under `angular/`.
- .NET will get its own dedicated top-level workspace area when scaffolding starts, with separate room for source, tests, and samples.
- Cross-stack package families keep one shared planning brief so common semantics are designed once before stack-specific implementations diverge.
- Public workflow docs and planning records stay under `docs/.ai/`, with detailed execution briefs under `docs/.ai/backlog/` split by stack.

## Consequences

- Angular and .NET package work can evolve independently without losing the benefits of one repo.
- Cross-stack package families such as operation status, idempotency, and validation contracts keep one shared contract brief before splitting into implementation tasks.
- Root build and validation commands should grow by extending the existing command layer rather than replacing it with heavier orchestration.
- Deployed services may still move to separate repos later if they develop an independent operational lifecycle.

## Initial Follow-Through

1. Split the detailed backlog into `angular/`, `dotnet/`, and `cross-stack/` spaces.
2. Keep the short roadmap in `docs/.ai/backlog.md`, but point detailed package work to the matching stack space.
3. When .NET scaffolding begins, add the dedicated workspace area and document the root commands that install, build, test, and pack both stacks.
