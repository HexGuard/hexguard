using HexGuard.Uploads;

namespace HexGuard.SampleApi.Packages.HexGuardUploads;

/// <summary>
/// Sample endpoints demonstrating the HexGuard.Uploads library.
/// </summary>
public static class UploadsSampleEndpoints
{
    /// <summary>
    /// Maps upload demo endpoints under <c>/api/uploads</c>.
    /// </summary>
    public static IEndpointRouteBuilder MapUploadsSampleEndpoints(
        this IEndpointRouteBuilder endpoints)
    {
        var group = endpoints.MapGroup("/api/uploads");

        // GET /api/uploads/sample-files — list sample file names
        group.MapGet("/sample-files", () =>
        {
            return Results.Ok(UploadsSampleData.SampleFileNames.Select((name, i) => new
            {
                id = i + 1,
                name,
                size = (long)new Random().Next(10_000, 5_000_000),
            }));
        });

        return group;
    }
}
