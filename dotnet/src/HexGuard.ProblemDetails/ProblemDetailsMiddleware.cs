using System.Net;
using System.Text.Json;
using Microsoft.AspNetCore.Http;

namespace HexGuard.ProblemDetails;

/// <summary>
/// ASP.NET Core middleware that catches unhandled exceptions and returns
/// RFC 9457 Problem Details JSON responses.
/// </summary>
public class ProblemDetailsMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ProblemDetailsMiddlewareOptions _options;

    /// <summary>
    /// Creates a new <see cref="ProblemDetailsMiddleware"/> instance.
    /// </summary>
    /// <param name="next">The next middleware in the pipeline.</param>
    /// <param name="options">Configuration options.</param>
    public ProblemDetailsMiddleware(RequestDelegate next, ProblemDetailsMiddlewareOptions? options = null)
    {
        _next = next ?? throw new ArgumentNullException(nameof(next));
        _options = options ?? new ProblemDetailsMiddlewareOptions();
    }

    /// <summary>
    /// Invokes the middleware, catching exceptions and writing Problem Details JSON.
    /// </summary>
    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (ProblemDetailsException pdex)
        {
            await WriteProblemDetailsResponse(context, pdex.Details);
        }
        catch (Exception ex) when (_options.CatchAllExceptions)
        {
            var pd = new ProblemDetails(
                TypeUri: WellKnownProblemTypes.InternalServerError,
                Title: _options.IncludeExceptionDetails ? ex.GetType().Name : "Internal Server Error",
                Status: (int)HttpStatusCode.InternalServerError,
                Detail: _options.IncludeExceptionDetails ? ex.Message : "An unexpected error occurred."
            );
            await WriteProblemDetailsResponse(context, pd);
        }
    }

    private static async Task WriteProblemDetailsResponse(HttpContext context, ProblemDetails pd)
    {
        context.Response.ContentType = "application/problem+json";
        context.Response.StatusCode = pd.Status ?? 500;

        var json = JsonSerializer.Serialize(pd, new JsonSerializerOptions
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
            DefaultIgnoreCondition = System.Text.Json.Serialization.JsonIgnoreCondition.WhenWritingNull,
        });

        await context.Response.WriteAsync(json, context.RequestAborted);
    }
}

/// <summary>
/// Options for <see cref="ProblemDetailsMiddleware"/>.
/// </summary>
public class ProblemDetailsMiddlewareOptions
{
    /// <summary>
    /// When <c>true</c>, catches all unhandled exceptions (not just
    /// <see cref="ProblemDetailsException"/>). Default: <c>true</c>.
    /// </summary>
    public bool CatchAllExceptions { get; set; } = true;

    /// <summary>
    /// When <c>true</c>, includes exception type and message in the
    /// Problem Details response. Default: <c>false</c>.
    /// </summary>
    public bool IncludeExceptionDetails { get; set; } = false;
}
