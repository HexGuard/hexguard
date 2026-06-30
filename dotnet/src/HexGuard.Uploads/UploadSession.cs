namespace HexGuard.Uploads;

/// <summary>
/// Represents the status of an upload session.
/// </summary>
public enum UploadSessionStatus
{
    /// <summary>File is being uploaded.</summary>
    Uploading,
    /// <summary>File is being processed server-side.</summary>
    Processing,
    /// <summary>Upload and processing completed successfully.</summary>
    Completed,
    /// <summary>Upload or processing failed.</summary>
    Failed,
    /// <summary>Upload was cancelled.</summary>
    Cancelled,
}

/// <summary>
/// Represents a file upload session with status tracking.
/// </summary>
/// <param name="SessionId">Unique session identifier.</param>
/// <param name="FileName">Original file name.</param>
/// <param name="FileSize">File size in bytes.</param>
/// <param name="ContentType">MIME content type.</param>
/// <param name="Status">Current upload status.</param>
/// <param name="Url">Final download URL when completed, or null.</param>
/// <param name="ErrorMessage">Error message if failed, or null.</param>
/// <param name="CreatedAt">Session creation timestamp.</param>
public sealed record UploadSession(
    Guid SessionId,
    string FileName,
    long FileSize,
    string ContentType,
    UploadSessionStatus Status,
    string? Url = null,
    string? ErrorMessage = null,
    DateTimeOffset? CreatedAt = null)
{
    /// <summary>Creates a new pending upload session.</summary>
    public static UploadSession Create(string fileName, long fileSize, string contentType) => new(
        SessionId: Guid.NewGuid(),
        FileName: fileName,
        FileSize: fileSize,
        ContentType: contentType,
        Status: UploadSessionStatus.Uploading,
        CreatedAt: DateTimeOffset.UtcNow);
}
