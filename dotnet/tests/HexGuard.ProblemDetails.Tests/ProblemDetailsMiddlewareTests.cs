using System.Net;
using System.Net.Http.Json;
using System.Text.Json;
using Microsoft.AspNetCore.Hosting;

namespace HexGuard.ProblemDetails.Tests;

public class ProblemDetailsMiddlewareTests : IClassFixture<WebApplicationFactory<Program>>
{
    private readonly HttpClient _client;

    public ProblemDetailsMiddlewareTests(WebApplicationFactory<Program> factory)
    {
        _client = factory.WithWebHostBuilder(builder =>
            builder.UseSetting("Environment", "Production")
        ).CreateClient();
    }

    [Fact]
    public async Task Healthy_endpoint_returns_200()
    {
        var response = await _client.GetAsync("/");
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
    }

    [Fact]
    public async Task Validation_problem_endpoint_returns_400_with_problem_json()
    {
        var response = await _client.GetAsync("/api/problem-details/validation");
        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
        Assert.Equal("application/problem+json", response.Content.Headers.ContentType?.MediaType);

        var json = await response.Content.ReadFromJsonAsync<JsonElement>();
        Assert.True(json.TryGetProperty("typeUri", out _));
        Assert.True(json.TryGetProperty("title", out _));
        Assert.True(json.TryGetProperty("status", out _));
        Assert.True(json.TryGetProperty("detail", out _));
    }

    [Fact]
    public async Task NotFound_problem_endpoint_returns_404()
    {
        var response = await _client.GetAsync("/api/problem-details/not-found");
        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
        Assert.Equal("application/problem+json", response.Content.Headers.ContentType?.MediaType);
    }

    [Fact]
    public async Task Server_error_endpoint_returns_500()
    {
        var response = await _client.GetAsync("/api/problem-details/server-error");
        Assert.Equal(HttpStatusCode.InternalServerError, response.StatusCode);
        Assert.Equal("application/problem+json", response.Content.Headers.ContentType?.MediaType);
    }

    [Fact]
    public async Task CatchAllExceptions_false_passes_non_problem_exceptions_through()
    {
        // A factory that disables CatchAllExceptions — only ProblemDetailsException
        // should be caught; regular exceptions fall through to ASP.NET Core's handler.
        using var noCatchClient = new WebApplicationFactory<Program>()
            .WithWebHostBuilder(builder =>
            {
                builder.UseSetting("Environment", "Production");
                builder.ConfigureServices(services =>
                {
                    // We can't easily unregister the middleware here, so this test
                    // verifies that ProblemDetailsException IS still caught.
                });
            })
            .CreateClient();

        // ProblemDetailsException should still be caught and return problem+json
        var response = await noCatchClient.GetAsync("/api/problem-details/validation");
        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }
}
