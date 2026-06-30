using HexGuard.Uploads;

namespace HexGuard.Uploads.Tests;

public class UploadSessionTests
{
    [Fact]
    public void Create_ShouldGenerateNewSession()
    {
        var session = UploadSession.Create("test.txt", 1024, "text/plain");

        Assert.NotEqual(Guid.Empty, session.SessionId);
        Assert.Equal("test.txt", session.FileName);
        Assert.Equal(1024, session.FileSize);
        Assert.Equal("text/plain", session.ContentType);
        Assert.Equal(UploadSessionStatus.Uploading, session.Status);
        Assert.NotNull(session.CreatedAt);
    }

    [Fact]
    public void WithStatus_ShouldReturnNewInstance()
    {
        var session = UploadSession.Create("test.txt", 512, "image/png");
        var completed = session with { Status = UploadSessionStatus.Completed, Url = "/download" };

        Assert.Equal(UploadSessionStatus.Completed, completed.Status);
        Assert.Equal("/download", completed.Url);
        // Original should be unchanged
        Assert.Equal(UploadSessionStatus.Uploading, session.Status);
        Assert.Null(session.Url);
    }
}

public class InMemoryUploadStoreTests
{
    private readonly InMemoryUploadStore _store = new();

    [Fact]
    public async Task CreateAndGet_ShouldReturnSession()
    {
        var session = UploadSession.Create("file.bin", 2048, "application/octet-stream");
        await _store.CreateAsync(session);

        var retrieved = await _store.GetAsync(session.SessionId);
        Assert.NotNull(retrieved);
        Assert.Equal(session.SessionId, retrieved.SessionId);
        Assert.Equal("file.bin", retrieved.FileName);
    }

    [Fact]
    public async Task GetNonExistent_ShouldReturnNull()
    {
        var result = await _store.GetAsync(Guid.NewGuid());
        Assert.Null(result);
    }

    [Fact]
    public async Task Update_ShouldModifySession()
    {
        var session = UploadSession.Create("test.txt", 100, "text/plain");
        await _store.CreateAsync(session);

        var updated = session with { Status = UploadSessionStatus.Completed };
        await _store.UpdateAsync(updated);

        var retrieved = await _store.GetAsync(session.SessionId);
        Assert.NotNull(retrieved);
        Assert.Equal(UploadSessionStatus.Completed, retrieved.Status);
    }

    [Fact]
    public async Task Delete_ShouldRemoveSession()
    {
        var session = UploadSession.Create("test.txt", 100, "text/plain");
        await _store.CreateAsync(session);
        await _store.DeleteAsync(session.SessionId);

        var result = await _store.GetAsync(session.SessionId);
        Assert.Null(result);
    }
}
