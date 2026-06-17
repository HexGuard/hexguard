using System.Text.Json;
using Microsoft.AspNetCore.Http;

namespace HexGuard.ProblemDetails;

/// <summary>
/// Extension methods for converting <see cref="ProblemDetails"/> to ASP.NET
/// Core <see cref="IResult"/> instances for Minimal API endpoints.
/// </summary>
public static class ProblemDetailsResultExtensions
{
    private static readonly JsonSerializerOptions s_jsonOptions = new()
    {
        PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
        DefaultIgnoreCondition = System.Text.Json.Serialization.JsonIgnoreCondition.WhenWritingNull,
    };

    /// <summary>
    /// Wraps the <paramref name="problem"/> as an <see cref="IResult"/> that
    /// produces an RFC 9457 <c>application/problem+json</c> response.
    /// </summary>
    public static IResult ToProblemResult(this ProblemDetails problem)
    {
        ArgumentNullException.ThrowIfNull(problem);

        return Results.Content(
            content: JsonSerializer.Serialize(problem, s_jsonOptions),
            contentType: "application/problem+json",
            statusCode: problem.Status ?? 500
        );
    }
}
