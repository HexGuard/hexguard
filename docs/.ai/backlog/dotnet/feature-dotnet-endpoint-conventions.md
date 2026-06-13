---
id: feature-dotnet-endpoint-conventions
type: feature
status: proposed
created: 2026-06-13
package: 'HexGuard.EndpointConventions'
---

# .NET Endpoint Conventions Package

## Summary

Design `HexGuard.EndpointConventions` as a .NET package for standardizing repetitive API endpoint
patterns such as validation failure shape, pagination metadata, common result envelopes, and
problem-details integration.

## Goals

- Standardize repeated API endpoint conventions.
- Reduce repeated controller or minimal API boilerplate.
- Compose with problem-details, pagination, and validation contracts.

## Non-Goals

- A web framework replacement.
- Forcing one application architecture.

## Decisions

- Prefer focused convention helpers over giant endpoint generators.
- Keep the package composable with ASP.NET Core primitives.

## Implementation Plan

1. Define the minimal endpoint convention surface.
2. Add helpers for validation, pagination metadata, and common responses.
3. Add tests and examples for controller and minimal API usage.

## Validation

- Unit and integration tests for endpoint helper behavior.

## Follow-Ups

- Revisit whether some concerns belong in narrower packages instead.