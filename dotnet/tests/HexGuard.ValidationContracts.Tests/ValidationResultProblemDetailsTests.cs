namespace HexGuard.ValidationContracts.Tests;

public sealed class ValidationResultProblemDetailsTests
{
    [Fact]
    public void FromResult_CreatesProblemDetails_WithDefaultStatus()
    {
        var result = new ValidationResult([
            new ValidationError("name", "Required", "Name is required."),
        ]);

        var problem = ValidationResultProblemDetails.FromResult(result);

        Assert.Equal(400, problem.Status);
        Assert.Equal("One or more validation errors occurred.", problem.Title);
        Assert.Single(problem.Errors);
    }

    [Fact]
    public void FromResult_SetsCustomStatusAndDetail()
    {
        var result = new ValidationResult([
            new ValidationError("name", "Required", "Name is required."),
        ]);

        var problem = ValidationResultProblemDetails.FromResult(
            result,
            statusCode: 422,
            detail: "Custom detail.",
            instance: "/api/test");

        Assert.Equal(422, problem.Status);
        Assert.Equal("Custom detail.", problem.Detail);
        Assert.Equal("/api/test", problem.Instance);
    }

    [Fact]
    public void FromResult_IncludesTraceId()
    {
        var result = new ValidationResult([], "trace-xyz");

        var problem = ValidationResultProblemDetails.FromResult(result);

        Assert.Equal("trace-xyz", problem.TraceId);
    }

    [Fact]
    public void FromResult_ThrowsOnNull()
    {
        Assert.Throws<ArgumentNullException>(() =>
            ValidationResultProblemDetails.FromResult(null!));
    }

    [Fact]
    public void ToProblemDetailsExtensions_IncludesErrors()
    {
        var result = new ValidationResult([
            new ValidationError("name", "Required", "Name is required."),
        ]);

        var problem = ValidationResultProblemDetails.FromResult(result);
        var extensions = problem.ToProblemDetailsExtensions();

        Assert.True(extensions.ContainsKey("errors"));
        Assert.True(extensions.ContainsKey("traceId"));
    }

    [Fact]
    public void DefaultConstructor_HasSensibleDefaults()
    {
        var problem = new ValidationResultProblemDetails();

        Assert.Equal("about:blank", problem.Type);
        Assert.Equal(400, problem.Status);
        Assert.Empty(problem.Errors);
        Assert.Null(problem.TraceId);
    }
}
