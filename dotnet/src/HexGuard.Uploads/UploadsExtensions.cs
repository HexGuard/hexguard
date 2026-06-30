using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;
using Microsoft.Extensions.DependencyInjection;

namespace HexGuard.Uploads;

/// <summary>
/// Extension methods for registering upload endpoints and services.
/// </summary>
public static class UploadsExtensions
{
    /// <summary>
    /// Registers <see cref="IUploadStore"/> with a singleton <see cref="InMemoryUploadStore"/>.
    /// </summary>
    public static IServiceCollection AddUploads(this IServiceCollection services)
    {
        services.AddSingleton<IUploadStore, InMemoryUploadStore>();
        return services;
    }

    /// <summary>
    /// Maps upload session endpoints under <c>/api/uploads</c>.
    /// </summary>
    public static IEndpointRouteBuilder MapUploadEndpoints(this IEndpointRouteBuilder endpoints)
    {
        var group = endpoints.MapGroup("/api/uploads");

        // POST /api/uploads — receive a file and create a session
        group.MapPost("/", async (HttpRequest request, IUploadStore store, CancellationToken ct) =>
        {
            if (!request.HasFormContentType)
                return Results.BadRequest(new { error = "Expected multipart form data." });

            var file = request.Form.Files.FirstOrDefault();
            if (file is null)
                return Results.BadRequest(new { error = "No file provided." });

            var session = UploadSession.Create(file.FileName, file.Length, file.ContentType);
            await store.CreateAsync(session, ct);

            // Store the file temporarily (in production, save to persistent storage)
            var tempDir = Path.Combine(Path.GetTempPath(), "hexguard-uploads");
            Directory.CreateDirectory(tempDir);
            var tempPath = Path.Combine(tempDir, session.SessionId.ToString());
            using (var stream = File.Create(tempPath))
            {
                await file.CopyToAsync(stream, ct);
            }

            var completed = session with
            {
                Status = UploadSessionStatus.Completed,
                Url = $"/api/uploads/{session.SessionId}/download",
            };
            await store.UpdateAsync(completed, ct);

            return Results.Ok(completed);
        });

        // GET /api/uploads/{id} — poll session status
        group.MapGet("/{id:guid}", async (Guid id, IUploadStore store, CancellationToken ct) =>
        {
            var session = await store.GetAsync(id, ct);
            return session is null ? Results.NotFound() : Results.Ok(session);
        });

        // DELETE /api/uploads/{id} — cancel a session
        group.MapDelete("/{id:guid}", async (Guid id, IUploadStore store, CancellationToken ct) =>
        {
            var session = await store.GetAsync(id, ct);
            if (session is null) return Results.NotFound();

            var cancelled = session with { Status = UploadSessionStatus.Cancelled };
            await store.UpdateAsync(cancelled, ct);

            // Clean up temp file
            var tempPath = Path.Combine(Path.GetTempPath(), "hexguard-uploads", id.ToString());
            if (File.Exists(tempPath)) File.Delete(tempPath);

            return Results.Ok(cancelled);
        });

        return group;
    }
}
