namespace HexGuard.ValidationContracts.Tests;

public sealed class ValidationErrorTests
{
    [Fact]
    public void Constructor_SetsProperties()
    {
        var error = new ValidationError("name", "Required", "Name is required.");

        Assert.Equal("name", error.Field);
        Assert.Equal("Required", error.Code);
        Assert.Equal("Name is required.", error.Message);
    }

    [Fact]
    public void IsFieldError_ReturnsTrue_WhenFieldIsNotEmpty()
    {
        var error = new ValidationError("address.city", "Required", "City is required.");
        Assert.True(error.IsFieldError);
    }

    [Fact]
    public void IsFieldError_ReturnsFalse_WhenFieldIsEmpty()
    {
        var error = new ValidationError("", "BusinessRule", "General validation failure.");
        Assert.False(error.IsFieldError);
    }

    [Fact]
    public void Equality_ComparesAllProperties()
    {
        var error1 = new ValidationError("name", "Required", "Name is required.");
        var error2 = new ValidationError("name", "Required", "Name is required.");

        Assert.Equal(error1, error2);
        Assert.Equal(error1.GetHashCode(), error2.GetHashCode());
    }

    [Fact]
    public void Inequality_DetectsDifferentField()
    {
        var error1 = new ValidationError("name", "Required", "Name is required.");
        var error2 = new ValidationError("email", "Required", "Email is required.");

        Assert.NotEqual(error1, error2);
    }
}
