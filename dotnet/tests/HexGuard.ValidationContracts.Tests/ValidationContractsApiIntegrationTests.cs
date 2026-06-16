using System.Net.Http.Json;
using System.Text.Json;
using System.Text.Json.Serialization;
namespace HexGuard.ValidationContracts.Tests;

public sealed class ValidationContractsApiIntegrationTests
    : IClassFixture<WebApplicationFactory<Program>>
{
    private readonly WebApplicationFactory<Program> _factory;
    private static readonly JsonSerializerOptions JsonOptions = new()
    {
        PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
        DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull,
    };

    public ValidationContractsApiIntegrationTests(WebApplicationFactory<Program> factory)
    {
        _factory = factory;
    }

    [Fact]
    public async Task RootEndpoint_ReturnsPackageInfo()
    {
        using var client = _factory.CreateClient();
        var response = await client.GetAsync("/api/validation-contracts/");
        response.EnsureSuccessStatusCode();

        var body = await response.Content.ReadFromJsonAsync<JsonElement>(JsonOptions);
        Assert.Equal("validation-contracts", body.GetProperty("packageId").GetString());
    }

    [Fact]
    public async Task ErrorCodesEndpoint_ReturnsKnownCodes()
    {
        using var client = _factory.CreateClient();
        var response = await client.GetAsync("/api/validation-contracts/error-codes");
        response.EnsureSuccessStatusCode();

        var body = await response.Content.ReadFromJsonAsync<JsonElement>(JsonOptions);
        Assert.True(body.TryGetProperty("codes", out var codes));
        Assert.True(codes.GetArrayLength() >= 5);
    }

    [Fact]
    public async Task Validate_ReturnsSuccess_ForValidPayload()
    {
        using var client = _factory.CreateClient();
        var payload = new
        {
            name = "Wireless Mouse",
            price = 29.99m,
            category = "Electronics",
            sku = "ELE-123456",
            tags = new[] { "new", "popular" },
        };

        var response = await client.PostAsJsonAsync("/api/validation-contracts/validate", payload, JsonOptions);
        response.EnsureSuccessStatusCode();

        var body = await response.Content.ReadFromJsonAsync<JsonElement>(JsonOptions);
        Assert.True(body.GetProperty("isValid").GetBoolean());
    }

    [Fact]
    public async Task Validate_ReturnsBadRequest_ForMissingName()
    {
        using var client = _factory.CreateClient();
        var payload = new
        {
            name = "",
            price = 29.99m,
            category = "Electronics",
        };

        var response = await client.PostAsJsonAsync("/api/validation-contracts/validate", payload, JsonOptions);
        Assert.Equal(System.Net.HttpStatusCode.BadRequest, response.StatusCode);

        var body = await response.Content.ReadFromJsonAsync<JsonElement>(JsonOptions);

        // RFC 9457 Problem Details shape
        Assert.True(body.TryGetProperty("type", out _));
        Assert.Equal(400, body.GetProperty("status").GetInt32());

        // The "errors" extension
        Assert.True(body.TryGetProperty("errors", out var errors));
        Assert.True(errors.GetArrayLength() >= 1);

        var firstError = errors[0];
        Assert.Equal("name", firstError.GetProperty("field").GetString());
        Assert.Equal("Required", firstError.GetProperty("code").GetString());
    }

    [Fact]
    public async Task Validate_ReturnsBadRequest_ForInvalidCategory()
    {
        using var client = _factory.CreateClient();
        var payload = new
        {
            name = "Test Product",
            price = 10.0m,
            category = "InvalidCategory",
        };

        var response = await client.PostAsJsonAsync("/api/validation-contracts/validate", payload, JsonOptions);
        Assert.Equal(System.Net.HttpStatusCode.BadRequest, response.StatusCode);

        var body = await response.Content.ReadFromJsonAsync<JsonElement>(JsonOptions);
        Assert.True(body.TryGetProperty("errors", out var errors));
        Assert.Contains(errors.EnumerateArray(), e =>
            e.GetProperty("field").GetString() == "category" &&
            e.GetProperty("code").GetString() == "InvalidFormat");
    }

    [Fact]
    public async Task Validate_ReturnsBadRequest_ForNullPayload()
    {
        using var client = _factory.CreateClient();
        var response = await client.PostAsJsonAsync<object?>(
            "/api/validation-contracts/validate",
            null,
            JsonOptions);

        Assert.Equal(System.Net.HttpStatusCode.BadRequest, response.StatusCode);
    }

    [Fact]
    public async Task Validate_AccumulatesMultipleErrors()
    {
        using var client = _factory.CreateClient();
        var payload = new
        {
            name = "",       // Required
            price = -5m,     // OutOfRange
            category = "",   // Required
        };

        var response = await client.PostAsJsonAsync("/api/validation-contracts/validate", payload, JsonOptions);
        Assert.Equal(System.Net.HttpStatusCode.BadRequest, response.StatusCode);

        var body = await response.Content.ReadFromJsonAsync<JsonElement>(JsonOptions);
        var errors = body.GetProperty("errors");
        Assert.True(errors.GetArrayLength() >= 3);
    }
}
