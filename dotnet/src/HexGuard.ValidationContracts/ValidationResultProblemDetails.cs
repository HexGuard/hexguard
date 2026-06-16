namespace HexGuard.ValidationContracts;

/// <summary>
/// Maps a <see cref="ValidationResult"/> into an RFC 9457 Problem Details response
/// with an <c>"errors"</c> extension carrying the full list of <see cref="ValidationError"/> items.
///
/// Intended for use in ASP.NET Core Minimal API or Controller endpoints that return
/// <c>Results.Problem(...)</c> or <c>BadRequest(...)</c> validation responses.
/// </summary>
public sealed record ValidationResultProblemDetails
{
    /// <summary>URI identifying the error type. Defaults to <c>"about:blank"</c>.</summary>
    public string Type { get; init; } = "about:blank";

    /// <summary>Short, human-readable summary of the problem.</summary>
    public string Title { get; init; } = "One or more validation errors occurred.";

    /// <summary>HTTP status code. Defaults to <c>400</c>.</summary>
    public int Status { get; init; } = 400;

    /// <summary>Human-readable explanation specific to this occurrence.</summary>
    public string? Detail { get; init; }

    /// <summary>URI identifying the specific occurrence of the problem.</summary>
    public string? Instance { get; init; }

    /// <summary>Trace or correlation identifier from the validation result, if available.</summary>
    public string? TraceId { get; init; }

    /// <summary>The list of validation errors (RFC 9457 extension member).</summary>
    public IReadOnlyList<ValidationError> Errors { get; init; } = Array.Empty<ValidationError>();

    /// <summary>
    /// Creates a <see cref="ValidationResultProblemDetails"/> from a <see cref="ValidationResult"/>.
    /// </summary>
    public static ValidationResultProblemDetails FromResult(
        ValidationResult result,
        int statusCode = 400,
        string? detail = null,
        string? instance = null)
    {
        ArgumentNullException.ThrowIfNull(result);

        return new ValidationResultProblemDetails
        {
            Status = statusCode,
            Detail = detail,
            Instance = instance,
            TraceId = result.TraceId,
            Errors = result.Errors,
        };
    }

    /// <summary>
    /// Serializes this instance to a dictionary suitable for <c>Results.Problem(...)</c>
    /// or <c>TypedResults.Problem(...)</c> in ASP.NET Core.
    /// </summary>
    public Dictionary<string, object?> ToProblemDetailsExtensions() =>
        new(StringComparer.Ordinal)
        {
            ["errors"] = Errors,
            ["traceId"] = TraceId,
        };
}
