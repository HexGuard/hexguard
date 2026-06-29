---
id: feature-blazor-testing-bootstrap
type: feature
status: proposed
created: 2026-06-29
package: 'HexGuard.Blazor.TestingBootstrap'
---

# HexGuard.Blazor.TestingBootstrap

## Summary

Test infrastructure bootstrap for Blazor — pre-configured bUnit setup with mock HttpClient, fake auth state, and common test utilities. Eliminates the 30+ lines of test boilerplate every Blazor project rewrites.

## Problem

Setting up bUnit tests requires the same boilerplate per project: registering services (HttpClient, auth, navigation), creating `TestContext` with the right configuration, mocking `IJSRuntime`, setting up fake auth state, and building test harnesses for common scenarios. This friction leads to fewer component tests.

## Goals

- Single `CreateTestContext()` factory with sensible defaults
- Pre-configured mock `HttpClient` with configurable responses
- Fake `AuthenticationStateProvider` with configurable user
- Mock `IJSRuntime` with invocation recording
- Mock `NavigationManager` with navigation history
- Component render helpers for common scenarios
- Snapshot testing helpers
- Fluent assertion extensions for rendered components

## Non-Goals

- No replacement for bUnit or xUnit
- No E2E testing (Playwright/Selenium)
- No test data generation

## Proposed Public API

```csharp
// One-call test context
public static class BlazorTestContext
{
    public static TestContext Create(Action<TestContextOptions>? configure = null);
}

public sealed class TestContextOptions
{
    public bool UseFakeAuth { get; set; } = true;
    public ClaimsPrincipal? AuthenticatedUser { get; set; }
    public bool UseMockHttp { get; set; } = true;
    public bool UseMockJsRuntime { get; set; } = true;
    public bool UseMockNavigation { get; set; } = true;
}

// Example test
public class ProductsPageTests
{
    [Fact]
    public void ShowsProducts_WhenLoaded()
    {
        // Arrange
        using var ctx = BlazorTestContext.Create(options =>
        {
            options.AuthenticatedUser = TestUsers.Admin;
        });

        ctx.MockHttp.When("/api/products")
            .RespondJson(new[] { new Product("Widget", 9.99m) });

        // Act
        var cut = ctx.RenderComponent<ProductsPage>();

        // Assert
        cut.Find("[data-testid=product-name]").TextContent.ShouldBe("Widget");
        cut.Find("[data-testid=product-price]").TextContent.ShouldBe("$9.99");
    }
}

// Auth helpers
public static class TestUsers
{
    public static ClaimsPrincipal Admin => Create("admin", roles: ["Admin"]);
    public static ClaimsPrincipal User => Create("user", roles: ["User"]);
    public static ClaimsPrincipal Create(string name, string[]? roles = null, string[]? permissions = null);
}

// Mock HTTP helpers
public static class MockHttpExtensions
{
    public static MockHttpMessageHandler When(this TestContext ctx, string url);
    public static void RespondJson<T>(this MockedRequest request, T body, int statusCode = 200);
    public static void RespondError(this MockedRequest request, int statusCode, string? body = null);
}
```

## Implementation Plan
1. Create `dotnet/src/HexGuard.Blazor.TestingBootstrap/` with `.csproj` (RCL, test-only).
2. Implement `BlazorTestContext`, mock auth, mock HTTP, mock JS, mock navigation.
3. Add assertion extensions and snapshot helpers.
4. Add self-tests. Register in `HexGuard.slnx`.
