using HexGuard.ProblemDetails;

namespace HexGuard.SampleApi.Packages.HexGuardProblemDetails;

/// <summary>
/// Demo endpoints that produce RFC 9457 Problem Details responses.
/// Paired with @hexguard/angular-api-errors Angular package.
/// </summary>
public static class ProblemDetailsSampleEndpoints
{
    /// <summary>
    /// Maps the <c>/api/problem-details/</c> endpoint group.
    /// </summary>
    public static IEndpointRouteBuilder MapProblemDetailsSampleEndpoints(
        this IEndpointRouteBuilder endpoints)
    {
        var group = endpoints.MapGroup("/api/problem-details");

        group.MapGet("/validation", () =>
        {
            var pd = new ProblemDetailsBuilder()
                .WithType(WellKnownProblemTypes.ValidationError)
                .WithTitle("Validation Error")
                .WithStatus(400)
                .WithDetail("The request contains invalid fields.")
                .WithInstance("/api/products")
                .WithExtension("errors", new[]
                {
                    new { field = "name", code = "required", message = "Product name is required." },
                    new { field = "price", code = "out_of_range", message = "Price must be between 0.01 and 100000." },
                })
                .Build();

            return pd.ToProblemResult();
        });

        group.MapGet("/not-found", () =>
        {
            var pd = new ProblemDetailsBuilder()
                .WithType(WellKnownProblemTypes.NotFound)
                .WithTitle("Resource Not Found")
                .WithStatus(404)
                .WithDetail("The requested product was not found.")
                .WithInstance("/api/products/999")
                .Build();

            return pd.ToProblemResult();
        });

        group.MapGet("/server-error", () =>
        {
            throw new ProblemDetailsException(
                new ProblemDetailsBuilder()
                    .WithType(WellKnownProblemTypes.InternalServerError)
                    .WithTitle("Internal Server Error")
                    .WithStatus(500)
                    .WithDetail("An unexpected error occurred while processing the request.")
                    .WithInstance("/api/products/error")
                    .Build()
            );
        });

        return group;
    }
}
