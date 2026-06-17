using HexGuard.ProblemDetails;

namespace HexGuard.ProblemDetails.Tests;

public class ProblemDetailsExceptionTests
{
    [Fact]
    public void Constructor_sets_Details()
    {
        var pd = new ProblemDetails(Title: "Test Error", Status: 400);
        var ex = new ProblemDetailsException(pd);

        Assert.Same(pd, ex.Details);
        Assert.Equal("Test Error", ex.Message);
    }

    [Fact]
    public void Constructor_sets_inner_exception()
    {
        var inner = new InvalidOperationException("Inner failure");
        var pd = new ProblemDetails(Title: "Wrapper Error");
        var ex = new ProblemDetailsException(pd, inner);

        Assert.Same(inner, ex.InnerException);
    }

    [Fact]
    public void Constructor_throws_on_null_details()
    {
        Assert.Throws<ArgumentNullException>(() => new ProblemDetailsException(null!));
    }

    [Fact]
    public void Message_falls_back_to_Detail_when_Title_is_null()
    {
        var pd = new ProblemDetails(Detail: "Something went wrong.");
        var ex = new ProblemDetailsException(pd);

        Assert.Equal("Something went wrong.", ex.Message);
    }
}
