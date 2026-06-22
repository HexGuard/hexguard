# HexGuard.Capabilities

Server-side capability and role contracts for .NET APIs. Paired with `@hexguard/angular-permissions` for cross-stack authorization gating.

## Overview

`HexGuard.Capabilities` provides a clean abstraction for managing user capabilities and roles on the server side. It defines contracts for registering, checking, and synchronizing capabilities — designed to feed the `@hexguard/angular-permissions` frontend package via a REST endpoint.

The package targets `net10.0` and depends only on `Microsoft.AspNetCore.App`.

## Installation

```shell
dotnet add package HexGuard.Capabilities
```

## Quick Start

### 1. Register services

```csharp
using HexGuard.Capabilities;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddHexGuardCapabilities(options =>
{
    options.CapabilityStore = new InMemoryCapabilityStore();
});

var app = builder.Build();
```

### 2. Define capabilities per user

```csharp
app.MapGet("/api/capabilities/user", (ICapabilityService service) =>
{
    var capabilities = service.GetCapabilities("user-123");
    return Results.Ok(capabilities);
});
```

### 3. Map to Angular frontend

The `CapabilitySet.Roles` maps to `PermissionContext.roles` and each `Permissions[resource]` entry is flattened to `"resource.action"` capability strings consumed by `injectPermissions()`, `*hexguardCan`, and route guards.

## API Reference

### `CapabilitySet`

| Property      | Type                           | Description                     |
| ------------- | ------------------------------ | ------------------------------- |
| `Roles`       | `string[]`                     | Role names assigned to the user |
| `Permissions` | `Dictionary<string, string[]>` | Resource-keyed permission sets  |

### `ICapabilityService`

| Method                                                           | Description                                |
| ---------------------------------------------------------------- | ------------------------------------------ |
| `GetCapabilities(string userId)`                                 | Returns the full capability set for a user |
| `CheckCapability(string userId, string resource, string action)` | Checks a specific permission               |

### `InMemoryCapabilityStore`

Default in-memory store for development and testing. Replace with a database-backed implementation of `ICapabilityStore` for production.

## Sample API Endpoints

| Endpoint                 | Method | Description                               |
| ------------------------ | ------ | ----------------------------------------- |
| `/api/capabilities/user` | GET    | Returns the current user's capability set |

## Cross-Stack Pairing

| Side    | Package                         |
| ------- | ------------------------------- |
| .NET    | `HexGuard.Capabilities`         |
| Angular | `@hexguard/angular-permissions` |

Both packages share identical permission contract shapes and are designed to work together through the `CapabilitySync` bridge.

## Build & Test

```bash
pnpm dotnet:restore
pnpm dotnet:build
pnpm dotnet:test

# Individual test
dotnet test dotnet/tests/HexGuard.Capabilities.Tests
```
