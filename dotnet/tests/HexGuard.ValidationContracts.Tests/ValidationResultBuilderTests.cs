namespace HexGuard.ValidationContracts.Tests;

public sealed class ValidationResultBuilderTests
{
    [Fact]
    public void Build_ReturnsValidResult_WhenNoErrorsAdded()
    {
        var result = new ValidationResultBuilder().Build();
        Assert.True(result.IsValid);
        Assert.Empty(result.Errors);
    }

    [Fact]
    public void AddError_AccumulatesErrors()
    {
        var result = new ValidationResultBuilder()
            .AddError("name", "Required", "Name is required.")
            .AddError("email", "InvalidFormat", "Invalid email.")
            .Build();

        Assert.False(result.IsValid);
        Assert.Equal(2, result.Errors.Count);
    }

    [Fact]
    public void AddModelError_CreatesFieldLevelError()
    {
        var result = new ValidationResultBuilder()
            .AddModelError("BusinessRule", "General failure.")
            .Build();

        var error = Assert.Single(result.Errors);
        Assert.Equal("", error.Field);
        Assert.Equal("BusinessRule", error.Code);
    }

    [Fact]
    public void WithTraceId_SetsIdentifier()
    {
        var result = new ValidationResultBuilder()
            .WithTraceId("trace-abc")
            .AddError("name", "Required", "Name is required.")
            .Build();

        Assert.Equal("trace-abc", result.TraceId);
    }

    [Fact]
    public void Build_ReturnsImmutableList()
    {
        var builder = new ValidationResultBuilder();
        builder.AddError("name", "Required", "Name is required.");
        var result = builder.Build();

        // Verify it's an IReadOnlyList (immutable by contract)
        Assert.IsAssignableFrom<IReadOnlyList<ValidationError>>(result.Errors);
    }

    [Fact]
    public void AddErrors_AccumulatesMultipleErrors()
    {
        var errors = new[]
        {
            new ValidationError("name", "Required", "Name is required."),
            new ValidationError("email", "InvalidFormat", "Invalid email."),
        };

        var result = new ValidationResultBuilder()
            .AddErrors(errors)
            .Build();

        Assert.Equal(2, result.Errors.Count);
    }
}
