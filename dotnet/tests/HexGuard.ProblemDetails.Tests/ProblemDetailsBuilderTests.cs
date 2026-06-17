using HexGuard.ProblemDetails;

namespace HexGuard.ProblemDetails.Tests;

public class ProblemDetailsBuilderTests
{
    [Fact]
    public void Build_returns_defaults_when_nothing_is_set()
    {
        var pd = new ProblemDetailsBuilder().Build();
        Assert.Null(pd.TypeUri);
        Assert.Null(pd.Title);
        Assert.Null(pd.Status);
    }

    [Fact]
    public void Builder_sets_all_properties()
    {
        var pd = new ProblemDetailsBuilder()
            .WithType("https://docs.hexguard.dev/problems/validation-error")
            .WithTitle("Validation Error")
            .WithStatus(400)
            .WithDetail("The request is invalid.")
            .WithInstance("/api/products/42")
            .WithExtension("errors", new[] { new { field = "name", message = "Required" } })
            .Build();

        Assert.Equal("https://docs.hexguard.dev/problems/validation-error", pd.TypeUri);
        Assert.Equal("Validation Error", pd.Title);
        Assert.Equal(400, pd.Status);
        Assert.Equal("The request is invalid.", pd.Detail);
        Assert.Equal("/api/products/42", pd.Instance);
        Assert.NotNull(pd.Extensions);
        Assert.Contains("errors", pd.Extensions.Keys);
    }

    [Fact]
    public void WithType_throws_on_null()
    {
        Assert.Throws<ArgumentNullException>(() => new ProblemDetailsBuilder().WithType(null!));
    }

    [Fact]
    public void WithTitle_throws_on_null()
    {
        Assert.Throws<ArgumentNullException>(() => new ProblemDetailsBuilder().WithTitle(null!));
    }

    [Fact]
    public void WithDetail_throws_on_null()
    {
        Assert.Throws<ArgumentNullException>(() => new ProblemDetailsBuilder().WithDetail(null!));
    }

    [Fact]
    public void WithExtension_overwrites_same_key()
    {
        var pd = new ProblemDetailsBuilder()
            .WithExtension("key", "first")
            .WithExtension("key", "second")
            .Build();

        Assert.Equal("second", pd.Extensions!["key"]);
    }

    [Fact]
    public void Build_returns_immutable_extensions()
    {
        var pd = new ProblemDetailsBuilder()
            .WithExtension("key", "value")
            .Build();

        Assert.IsAssignableFrom<IReadOnlyDictionary<string, object?>>(pd.Extensions);
    }
}
