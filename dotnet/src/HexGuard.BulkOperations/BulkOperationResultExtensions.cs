using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;

namespace HexGuard.BulkOperations;

/// <summary>
/// Extension methods for producing bulk operation results from
/// ASP.NET Core Minimal API and controller endpoints.
/// </summary>
public static class BulkOperationResultExtensions
{
    /// <summary>
    /// Creates an <see cref="IResult"/> that produces a 200 OK or 207 Multi-Status
    /// response with the bulk operation result body.
    /// </summary>
    /// <param name="extensions">The <see cref="IResultExtensions"/> instance.</param>
    /// <param name="response">The bulk operation response.</param>
    /// <typeparam name="TItem">The item type.</typeparam>
    /// <typeparam name="TResult">The success result type.</typeparam>
    /// <returns>200 OK for completed, 207 Multi-Status for partial/full failure.</returns>
    public static IResult BulkOperation<TItem, TResult>(
        this IResultExtensions extensions,
        BulkOperationResponse<TItem, TResult> response)
    {
        ArgumentNullException.ThrowIfNull(response);

        return response.Status switch
        {
            BulkOperationStatus.Completed => Results.Ok(response),
            BulkOperationStatus.PartialFailure => Results.Json(response, statusCode: StatusCodes.Status207MultiStatus),
            BulkOperationStatus.Failed => Results.Json(response, statusCode: StatusCodes.Status207MultiStatus),
            _ => Results.Ok(response),
        };
    }

    /// <summary>
    /// Converts a bulk operation response to an RFC 9457 Problem Details
    /// payload when the operation resulted in partial or complete failure.
    /// When the operation completed successfully, returns <c>null</c>.
    /// </summary>
    /// <param name="response">The bulk operation response.</param>
    /// <typeparam name="TItem">The item type.</typeparam>
    /// <typeparam name="TResult">The success result type.</typeparam>
    /// <returns>A Problem Details dictionary, or <c>null</c> for fully successful operations.</returns>
    public static Dictionary<string, object?>? ToProblemDetails<TItem, TResult>(
        this BulkOperationResponse<TItem, TResult> response)
    {
        ArgumentNullException.ThrowIfNull(response);

        if (response.Status == BulkOperationStatus.Completed)
        {
            return null;
        }

        var errors = response.Results
            .Where(r => !r.Succeeded && r.Error is not null)
            .Select(r => new Dictionary<string, object?>
            {
                ["code"] = r.Error!.Code,
                ["message"] = r.Error.Message,
                ["field"] = r.Error.Field,
            })
            .ToList();

        return new Dictionary<string, object?>
        {
            ["type"] = "https://tools.ietf.org/html/rfc9457",
            ["title"] = response.Status == BulkOperationStatus.PartialFailure
                ? "Partial failure"
                : "Bulk operation failed",
            ["status"] = 207,
            ["detail"] = $"{response.SuccessCount} of {response.TotalCount} items succeeded.",
            ["errors"] = errors,
        };
    }
}
