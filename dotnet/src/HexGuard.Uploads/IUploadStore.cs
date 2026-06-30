namespace HexGuard.Uploads;

/// <summary>
/// Abstraction for storing and retrieving upload sessions.
/// </summary>
public interface IUploadStore
{
    /// <summary>Creates a new upload session.</summary>
    Task<UploadSession> CreateAsync(UploadSession session, CancellationToken ct = default);

    /// <summary>Gets an upload session by ID, or null if not found.</summary>
    Task<UploadSession?> GetAsync(Guid sessionId, CancellationToken ct = default);

    /// <summary>Updates an existing upload session.</summary>
    Task UpdateAsync(UploadSession session, CancellationToken ct = default);

    /// <summary>Deletes an upload session.</summary>
    Task DeleteAsync(Guid sessionId, CancellationToken ct = default);
}
