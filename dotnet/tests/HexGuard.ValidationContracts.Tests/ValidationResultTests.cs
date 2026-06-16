namespace HexGuard.ValidationContracts.Tests;

public sealed class ValidationResultTests
{
    [Fact]
    public void IsValid_ReturnsTrue_WhenNoErrors()
    {
        var result = new ValidationResult([]);
        Assert.True(result.IsValid);
    }

    [Fact]
    public void IsValid_ReturnsFalse_WhenErrorsExist()
    {
        var result = new ValidationResult([
            new ValidationError("name", "Required", "Name is required."),
        ]);
        Assert.False(result.IsValid);
    }

    [Fact]
    public void FieldErrors_ReturnsOnlyFieldLevelErrors()
    {
        var result = new ValidationResult([
            new ValidationError("name", "Required", "Name is required."),
            new ValidationError("", "BusinessRule", "General error."),
            new ValidationError("email", "InvalidFormat", "Invalid email."),
        ]);

        var fieldErrors = result.FieldErrors;
        Assert.Equal(2, fieldErrors.Count);
        Assert.All(fieldErrors, e => Assert.True(e.IsFieldError));
    }

    [Fact]
    public void ModelErrors_ReturnsOnlyModelLevelErrors()
    {
        var result = new ValidationResult([
            new ValidationError("name", "Required", "Name is required."),
            new ValidationError("", "BusinessRule", "General error."),
        ]);

        var modelErrors = result.ModelErrors;
        Assert.Single(modelErrors);
        Assert.Equal("BusinessRule", modelErrors[0].Code);
    }

    [Fact]
    public void ForField_FiltersByExactFieldPath()
    {
        var result = new ValidationResult([
            new ValidationError("name", "Required", "Name is required."),
            new ValidationError("name", "MaxLength", "Name is too long."),
            new ValidationError("email", "InvalidFormat", "Invalid email."),
        ]);

        var nameErrors = result.ForField("name");
        Assert.Equal(2, nameErrors.Count);
    }

    [Fact]
    public void ForFieldPrefix_FiltersByPrefix()
    {
        var result = new ValidationResult([
            new ValidationError("items.0.name", "Required", "Name is required."),
            new ValidationError("items.0.price", "OutOfRange", "Price out of range."),
            new ValidationError("items.1.name", "Required", "Name is required."),
            new ValidationError("name", "Required", "Top-level name."),
        ]);

        var itemErrors = result.ForFieldPrefix("items");
        Assert.Equal(3, itemErrors.Count);
    }

    [Fact]
    public void TraceId_IsOptional()
    {
        var withTrace = new ValidationResult([], "trace-123");
        Assert.Equal("trace-123", withTrace.TraceId);

        var withoutTrace = new ValidationResult([]);
        Assert.Null(withoutTrace.TraceId);
    }
}
