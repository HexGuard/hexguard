---
id: feature-dotnet-streaming
type: feature
status: proposed
created: 2026-06-26
package: HexGuard.Streaming
---

# HexGuard.Streaming

## Summary

Streaming response helpers for ASP.NET Core — NDJSON (newline-delimited JSON), Server-Sent Events already covered by `HexGuard.Sse`, chunked transfer encoding, and line-delimited streaming. For APIs that stream large datasets or real-time data to clients.

**Competition check:** ASP.NET Core has no built-in NDJSON support. `Sse` and `Streaming` complement each other.

## Goals

1. Provide NDJSON streaming response — one JSON object per line.
2. Provide chunked streaming with `IAsyncEnumerable<T>` response helper.
3. Provide line-delimited text streaming.
4. All with proper `Transfer-Encoding: chunked` and `Content-Type`.

## Proposed Public API

```csharp
// NDJSON
public static class NdjsonResults
{
    public static IResult Stream<T>(IAsyncEnumerable<T> items,
        CancellationToken ct = default);
}

// Chunked
public static class StreamingResults
{
    public static IResult Chunked<T>(IAsyncEnumerable<T> items,
        string contentType = "application/json", CancellationToken ct = default);
    public static IResult TextLines(IAsyncEnumerable<string> lines,
        CancellationToken ct = default);
}

// Usage
app.MapGet("/export/large.jsonl", async (AppDbContext db, CancellationToken ct) =>
{
    var products = db.Products.AsAsyncEnumerable();
    return NdjsonResults.Stream(products, ct);
});
```

## Implementation Plan

1. Create `dotnet/src/HexGuard.Streaming/`.
2. Implement NDJSON, chunked, line-delimited helpers.
3. Add tests.
4. Register in `HexGuard.slnx`.
5. Publish as NuGet.
