---
id: feature-blazor-ci-cd
type: feature
status: proposed
created: 2026-06-29
package: 'HexGuard.Blazor.CiCd'
---

# HexGuard.Blazor.CiCd

## Summary

CI/CD pipeline helpers for Blazor projects — GitHub Actions workflows, Azure DevOps templates, Docker configurations, and deployment scripts. Pre-configured for Blazor WASM, Server, and Hybrid.

## Pain Point

Setting up CI/CD for Blazor has unique challenges: WASM needs .NET SDK + WASM tools installed, Server needs SignalR-aware load balancing (sticky sessions, Azure SignalR Service), and publishing profiles vary significantly. Every project starts from scratch, copying YAML from blog posts and docs.

## Goals

- GitHub Actions workflow templates (build, test, deploy)
- Azure DevOps pipeline templates
- Docker multi-stage build for Blazor Server
- Azure Static Web Apps deployment for WASM
- App Service + SignalR Service deployment for Server
- Environment-specific build configurations
- WASM compression (Brotli pre-compression)
- AOT compilation opt-in for WASM

## Non-Goals

- No deployment execution — provides templates, not runtime
- No infrastructure as code (ARM/Bicep/Terraform)
- No monitoring or alerting setup

## Proposed Public API

```yaml
# GitHub Actions: .github/workflows/blazor-ci.yml (generated)
name: Blazor CI
on: [push, pull_request]
jobs:
  build:
    uses: HexGuard/Blazor.CiCd/.github/workflows/build.yml@v1
    with:
      project: src/MyApp/MyApp.csproj
      dotnet-version: '10.0.x'
      wasm-aot: false
  deploy-wasm:
    needs: build
    uses: HexGuard/Blazor.CiCd/.github/workflows/deploy-wasm.yml@v1
    with:
      artifact: wasm-publish
      azure-static-web-app: myapp
      environment: production

# Docker: Dockerfile (generated for Blazor Server)
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
# ... optimized multi-stage build
EXPOSE 8080
ENV ASPNETCORE_URLS=http://+:8080
# SignalR: WebSocket support, sticky session hints
```

```csharp
// .NET tool for CI/CD helpers
// dotnet hexguard-blazor cicd generate
//   --type wasm|server|hybrid
//   --ci github|azure-devops
//   --output .github/workflows/

public static class BlazorCiCd
{
    public static void GenerateWorkflow(BlazorCiCdOptions options);
}

public sealed class BlazorCiCdOptions
{
    public BlazorHostingModel HostingModel { get; set; }
    public CiPlatform Platform { get; set; }
    public string ProjectPath { get; set; } = "";
    public bool EnableWasmAot { get; set; }
    public DeploymentTarget Deployment { get; set; }
}

public enum BlazorHostingModel { Wasm, Server, Hybrid, Auto }
public enum CiPlatform { GitHubActions, AzureDevOps }
public enum DeploymentTarget { AzureStaticWebApps, AppService, ContainerApps, AwsAmplify }
```

## Implementation Plan
1. Create `dotnet/src/HexGuard.Blazor.CiCd/` with `.csproj` (.NET tool).
2. Implement workflow generators for GitHub Actions and Azure DevOps.
3. Add Docker templates, deployment targets, WASM optimizations.
4. Add tests. Register in `HexGuard.slnx`.
