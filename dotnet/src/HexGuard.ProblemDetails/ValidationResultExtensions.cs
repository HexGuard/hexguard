using HexGuard.ValidationContracts;
using Microsoft.AspNetCore.Http;

namespace HexGuard.ProblemDetails;

/// <summary>
/// Extension methods for converting <see cref="ValidationResult"/> into
/// RFC 9457 Problem Details responses for ASP.NET Core Minimal APIs.
/// </summary>
public static class ValidationResultExtensions
{
    /// <summary>
    /// Converts the <paramref name="result"/> into an <see cref="IResult"/> that
    /// produces an RFC 9457 <c>application/problem+json</c> response with validation
    /// errors in the <c>"errors"</c> extension member.
    /// </summary>
    /// <param name="result">The validation result to convert.</param>
    /// <param name="statusCode">HTTP status code. Defaults to <c>400</c>.</param>
    /// <param name="detail">
    /// Human-readable explanation specific to this occurrence. If not provided, uses
    /// <c>"One or more validation errors occurred."</c>.
    /// </param>
    /// <param name="instance">URI identifying the specific occurrence of the problem.</param>
    public static IResult ToProblemResult(
        this ValidationResult result,
        int statusCode = 400,
        string? detail = null,
        string? instance = null)
    {
        ArgumentNullException.ThrowIfNull(result);

        var pd = result.ToProblemDetails(statusCode, detail, instance);

        return Results.Problem(
            statusCode: pd.Status,
            title: pd.Title,
            detail: pd.Detail,
            instance: pd.Instance,
            extensions: pd.ToProblemDetailsExtensions());
    }
}
