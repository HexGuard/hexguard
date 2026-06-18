using System.Net;
using System.Net.Http.Json;
using HexGuard.BulkOperations;
using HexGuard.SampleApi;
using Microsoft.AspNetCore.Mvc.Testing;

namespace HexGuard.BulkOperations.Tests;

public sealed class BulkOperationEndpointTests : IClassFixture<WebApplicationFactory<Program>>
{
    private readonly HttpClient _client;

    public BulkOperationEndpointTests(WebApplicationFactory<Program> factory)
    {
        _client = factory.CreateClient();
    }

    [Fact]
    public async Task Delete_endpoint_returns_207_for_partial_failure()
    {
        var request = new
        {
            items = new[]
            {
                new { id = "ord-001", name = "Widget A", status = "pending" },
                new { id = "ord-003", name = "Widget C", status = "shipped" },
            },
        };

        var response = await _client.PostAsJsonAsync("/api/bulk-operations/delete", request);

        Assert.Equal(HttpStatusCode.MultiStatus, response.StatusCode);

        var body = await response.Content.ReadFromJsonAsync<BulkOperationEndpointResponse>();
        Assert.NotNull(body);
        Assert.Equal(2, body.TotalCount);
        Assert.Equal(1, body.SuccessCount);
        Assert.Equal(1, body.FailureCount);
    }

    [Fact]
    public async Task Approve_endpoint_returns_mixed_results()
    {
        var request = new
        {
            items = new[]
            {
                new { id = "ord-001", name = "Widget A", status = "pending" },
                new { id = "ord-005", name = "Widget E", status = "cancelled" },
                new { id = "ord-006", name = "Widget F", status = "pending" },
            },
        };

        var response = await _client.PostAsJsonAsync("/api/bulk-operations/approve", request);

        Assert.Equal(HttpStatusCode.MultiStatus, response.StatusCode);

        var body = await response.Content.ReadFromJsonAsync<BulkOperationEndpointResponse>();
        Assert.NotNull(body);
        Assert.Equal(3, body.TotalCount);
        Assert.Equal(2, body.SuccessCount);
        Assert.Equal(1, body.FailureCount);
    }

    [Fact]
    public async Task Update_status_endpoint_returns_results()
    {
        var request = new
        {
            items = new[]
            {
                new { id = "ord-001", name = "Widget A", status = "pending" },
                new { id = "ord-002", name = "Widget B", status = "pending" },
            },
            sharedPayload = new { newStatus = "shipped" },
        };

        var response = await _client.PostAsJsonAsync("/api/bulk-operations/update-status", request);

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
    }

    // ── Response shape (matches BulkOperationResponse anonymous serialization) ──

    private sealed record BulkOperationEndpointResponse(
        int TotalCount,
        int SuccessCount,
        int FailureCount,
        List<object>? Results
    );
}
