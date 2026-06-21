# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/), and this project adheres to [Semantic Versioning](https://semver.org/).

## 0.1.0 — 2026-06-17

### Added

- `ProblemDetails` record — RFC 9457 core type with `TypeUri`, `Title`, `Status`, `Detail`, `Instance`, and `Extensions` members.
- `ProblemDetailsBuilder` — fluent builder with `WithType()`, `WithTitle()`, `WithStatus()`, `WithDetail()`, `WithInstance()`, `WithExtension()`, and `Build()` methods.
- `WellKnownProblemTypes` — constants for standard type URIs (`AboutBlank`, `ValidationError`, `NotFound`, `OutOfRange`, `BadRequest`, `InternalServerError`).
- `ProblemDetailsException` — exception carrying a `ProblemDetails` payload for throw-vs-return middleware patterns.
- `ProblemDetailsMiddleware` — ASP.NET Core middleware with `CatchAllExceptions` and `IncludeExceptionDetails` options.
- `ProblemDetailsMiddlewareOptions` — configuration class for the middleware.
- `ProblemDetailsResultExtensions` — `ToProblemResult()` extension method for Minimal API `IResult`.
- `PublicApi.cs` — documentation of the public API surface.
- SampleApi endpoints under `/api/problem-details/` — validation, not-found, and server-error demos.
- Cross-stack pairing with `@hexguard/angular-api-errors` for end-to-end RFC 9457 error pipelines.
