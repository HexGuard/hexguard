using System.Collections.Concurrent;

namespace HexGuard.Uploads;

/// <summary>
/// In-memory implementation of <see cref="IUploadStore"/> for development and testing.
/// Not suitable for production — use a persistent store instead.
/// </summary>
public sealed class InMemoryUploadStore : IUploadStore
{
    private readonly ConcurrentDictionary<Guid, UploadSession> _sessions = new();

    /// <inheritdoc />
    public Task<UploadSession> CreateAsync(UploadSession session, CancellationToken ct = default)
    {
        _sessions[session.SessionId] = session;
        return Task.FromResult(session);
    }

    /// <inheritdoc />
    public Task<UploadSession?> GetAsync(Guid sessionId, CancellationToken ct = default)
    {
        _sessions.TryGetValue(sessionId, out var session);
        return Task.FromResult(session);
    }

    /// <inheritdoc />
    public Task UpdateAsync(UploadSession session, CancellationToken ct = default)
    {
        _sessions[session.SessionId] = session;
        return Task.CompletedTask;
    }

    /// <inheritdoc />
    public Task DeleteAsync(Guid sessionId, CancellationToken ct = default)
    {
        _sessions.TryRemove(sessionId, out _);
        return Task.CompletedTask;
    }
}
