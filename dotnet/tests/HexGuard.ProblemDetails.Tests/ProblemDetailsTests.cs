using System.Text.Json;
using HexGuard.ProblemDetails;

namespace HexGuard.ProblemDetails.Tests;

public class ProblemDetailsTests
{
    [Fact]
    public void Default_constructor_sets_all_properties_to_null()
    {
        var pd = new ProblemDetails();
        Assert.Null(pd.TypeUri);
        Assert.Null(pd.Title);
        Assert.Null(pd.Status);
        Assert.Null(pd.Detail);
        Assert.Null(pd.Instance);
        Assert.Null(pd.Extensions);
    }

    [Fact]
    public void Constructor_sets_properties()
    {
        var pd = new ProblemDetails(
            TypeUri: "https://docs.hexguard.dev/problems/validation-error",
            Title: "Validation Error",
            Status: 400,
            Detail: "The request is invalid.",
            Instance: "/api/products"
        );

        Assert.Equal("https://docs.hexguard.dev/problems/validation-error", pd.TypeUri);
        Assert.Equal("Validation Error", pd.Title);
        Assert.Equal(400, pd.Status);
        Assert.Equal("The request is invalid.", pd.Detail);
        Assert.Equal("/api/products", pd.Instance);
    }

    [Fact]
    public void Records_with_same_values_are_equal()
    {
        var pd1 = new ProblemDetails(TypeUri: "about:blank", Title: "Test", Status: 400);
        var pd2 = new ProblemDetails(TypeUri: "about:blank", Title: "Test", Status: 400);

        Assert.Equal(pd1, pd2);
        Assert.Equal(pd1.GetHashCode(), pd2.GetHashCode());
    }

    [Fact]
    public void Records_with_different_values_are_not_equal()
    {
        var pd1 = new ProblemDetails(Status: 400);
        var pd2 = new ProblemDetails(Status: 404);

        Assert.NotEqual(pd1, pd2);
    }

    [Fact]
    public void Serializes_to_camelCase_json()
    {
        var pd = new ProblemDetails(
            TypeUri: "about:blank",
            Title: "Test",
            Status: 400,
            Detail: "A test problem.",
            Instance: "/test",
            Extensions: new Dictionary<string, object?> { ["traceId"] = "abc-123" }
        );

        var json = JsonSerializer.Serialize(pd, new JsonSerializerOptions
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
            DefaultIgnoreCondition = System.Text.Json.Serialization.JsonIgnoreCondition.WhenWritingNull,
        });

        Assert.Contains("\"typeUri\"", json);
        Assert.Contains("\"title\"", json);
        Assert.Contains("\"status\"", json);
        Assert.Contains("\"detail\"", json);
        Assert.Contains("\"instance\"", json);
        Assert.Contains("\"traceId\"", json);
        Assert.Contains("abc-123", json);
    }
}
