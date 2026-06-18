using System.Net;
using System.Net.Http.Json;
using HexGuard.FeatureFlags;
using HexGuard.SampleApi;
using Microsoft.AspNetCore.Mvc.Testing;

namespace HexGuard.FeatureFlags.Tests;

public sealed class FeatureFlagEndpointTests : IClassFixture<WebApplicationFactory<Program>>
{
    private readonly HttpClient _client;

    public FeatureFlagEndpointTests(WebApplicationFactory<Program> factory)
    {
        _client = factory.CreateClient();
    }

    [Fact]
    public async Task Sync_endpoint_returns_flags()
    {
        var response = await _client.GetAsync("/api/feature-flags/sync");

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        var body = await response.Content.ReadFromJsonAsync<SyncResponse>();
        Assert.NotNull(body);
        Assert.NotNull(body.Flags);
        Assert.NotEmpty(body.ContextHash);
    }

    [Fact]
    public async Task Sync_endpoint_returns_304_when_hash_matches()
    {
        // First call gets the hash
        var first = await _client.GetFromJsonAsync<SyncResponse>("/api/feature-flags/sync");
        Assert.NotNull(first);

        // Second call with the same hash returns 304
        var response = await _client.GetAsync(
            $"/api/feature-flags/sync?contextHash={first.ContextHash}");

        Assert.Equal(HttpStatusCode.NotModified, response.StatusCode);
    }

    [Fact]
    public async Task Sync_endpoint_returns_200_when_hash_differs()
    {
        var response = await _client.GetAsync(
            "/api/feature-flags/sync?contextHash=wrong-hash");

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
    }

    [Fact]
    public async Task Evaluate_endpoint_returns_result_for_known_flag()
    {
        var response = await _client.GetAsync(
            "/api/feature-flags/evaluate?key=beta-search&userId=user-42");

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        var result = await response.Content.ReadFromJsonAsync<EvaluationResult>();
        Assert.NotNull(result);
        Assert.Equal("beta-search", result.Key);
    }

    [Fact]
    public async Task Evaluate_endpoint_returns_404_for_unknown_flag()
    {
        var response = await _client.GetAsync(
            "/api/feature-flags/evaluate?key=nonexistent&userId=user-42");

        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
    }

    // ── Response shapes ──────────────────────────────────────

    private sealed record SyncResponse(
        Dictionary<string, object>? Flags,
        DateTimeOffset EvaluatedAt,
        string ContextHash);

    private sealed record EvaluationResult(
        string Key,
        bool Enabled,
        string Variant,
        DateTimeOffset EvaluatedAt,
        string? MatchedRule);
}
