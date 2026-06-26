---
id: feature-dotnet-markdown
type: feature
status: proposed
created: 2026-06-26
package: HexGuard.Markdown
---

# HexGuard.Markdown

## Summary

Server-side Markdown → safe HTML rendering. Pairs with `@hexguard/ts-markdown` for consistent rendering across stack.

**Competition check:** `Markdig` (50M+) is the standard. This is a thinner wrapper with secure defaults.

## Proposed Public API

```csharp
public static class MarkdownRenderer
{
    public static string Render(string markdown, MarkdownOptions? options = null);
    public static string RenderInline(string markdown, MarkdownOptions? options = null);
}

public sealed record MarkdownOptions
{
    public bool Sanitize { get; init; } = true;
    public string LinkTarget { get; init; } = "_blank";
    public string LinkRel { get; init; } = "noopener noreferrer";
    public bool Gfm { get; init; } = true;
}

// Minimal API
app.MapPost("/render", (RenderRequest req) => Results.Ok(new {
    html = MarkdownRenderer.Render(req.Markdown)
}));
```

## Implementation Plan

1. Create `dotnet/src/HexGuard.Markdown/`.
2. Implement Markdown parser.
3. Implement sanitization.
4. Add tests.
5. Register in `HexGuard.slnx`.
6. Publish as NuGet.
