using HexGuard.BulkOperations;

namespace HexGuard.BulkOperations.Tests;

public sealed class BulkOperationResultBuilderTests
{
    [Fact]
    public void All_success_returns_completed()
    {
        var results = new List<BulkOperationResult<string, string>>
        {
            new("item-1", true, "ok", null),
            new("item-2", true, "ok", null),
        };

        var response = BulkOperationResultBuilder.Build<string, string>(results);

        Assert.Equal(BulkOperationStatus.Completed, response.Status);
        Assert.Equal(2, response.TotalCount);
        Assert.Equal(2, response.SuccessCount);
        Assert.Equal(0, response.FailureCount);
    }

    [Fact]
    public void Some_failures_returns_partial_failure()
    {
        var results = new List<BulkOperationResult<string, string>>
        {
            new("item-1", true, "ok", null),
            new("item-2", false, null, new BulkOperationError("ERR", "Failed")),
        };

        var response = BulkOperationResultBuilder.Build<string, string>(results);

        Assert.Equal(BulkOperationStatus.PartialFailure, response.Status);
        Assert.Equal(2, response.TotalCount);
        Assert.Equal(1, response.SuccessCount);
        Assert.Equal(1, response.FailureCount);
    }

    [Fact]
    public void All_failures_returns_failed()
    {
        var results = new List<BulkOperationResult<string, string>>
        {
            new("item-1", false, null, new BulkOperationError("ERR", "Failed A")),
            new("item-2", false, null, new BulkOperationError("ERR", "Failed B")),
        };

        var response = BulkOperationResultBuilder.Build<string, string>(results);

        Assert.Equal(BulkOperationStatus.Failed, response.Status);
        Assert.Equal(2, response.TotalCount);
        Assert.Equal(0, response.SuccessCount);
        Assert.Equal(2, response.FailureCount);
    }

    [Fact]
    public void Empty_results_returns_completed()
    {
        var results = new List<BulkOperationResult<string, string>>();

        var response = BulkOperationResultBuilder.Build<string, string>(results);

        Assert.Equal(BulkOperationStatus.Completed, response.Status);
        Assert.Equal(0, response.TotalCount);
        Assert.Equal(0, response.SuccessCount);
        Assert.Equal(0, response.FailureCount);
    }

    [Fact]
    public void Errors_with_field_are_preserved()
    {
        var error = new BulkOperationError("VALIDATION", "Name is required", "name");
        var results = new List<BulkOperationResult<string, string>>
        {
            new("item-1", false, null, error),
        };

        var response = BulkOperationResultBuilder.Build<string, string>(results);

        var result = response.Results[0];
        Assert.NotNull(result.Error);
        Assert.Equal("name", result.Error.Field);
        Assert.Equal("VALIDATION", result.Error.Code);
    }

    [Fact]
    public void Null_results_throws()
    {
        Assert.Throws<ArgumentNullException>(() =>
            BulkOperationResultBuilder.Build<string, string>(null!));
    }

    [Fact]
    public void ToProblemDetails_returns_null_for_completed()
    {
        var results = new List<BulkOperationResult<string, string>>
        {
            new("item-1", true, "ok", null),
        };

        var response = BulkOperationResultBuilder.Build<string, string>(results);
        var problemDetails = response.ToProblemDetails();

        Assert.Null(problemDetails);
    }

    [Fact]
    public void ToProblemDetails_returns_payload_for_partial_failure()
    {
        var results = new List<BulkOperationResult<string, string>>
        {
            new("item-1", true, "ok", null),
            new("item-2", false, null, new BulkOperationError("ERR", "Something went wrong")),
        };

        var response = BulkOperationResultBuilder.Build<string, string>(results);
        var problemDetails = response.ToProblemDetails();

        Assert.NotNull(problemDetails);
        Assert.Equal(207, problemDetails["status"]);
        Assert.Contains("errors", problemDetails.Keys);
    }
}
