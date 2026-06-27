---
id: feature-dotnet-prompting
type: feature
status: proposed
created: 2026-06-27
package: HexGuard.Prompting
---

# HexGuard.Prompting

## Summary

AI prompt template engine — template storage, variable interpolation, token counting, response parsing, and provider abstraction (OpenAI, Anthropic, Azure OpenAI). Pairs with `@hexguard/angular-prompt`.

## Proposed Public API

```csharp
public interface IPromptService
{
    Task<PromptTemplate> GetAsync(string id, CancellationToken ct);
    Task<IReadOnlyList<PromptTemplate>> ListAsync(CancellationToken ct);
    Task<PromptTemplate> CreateAsync(PromptTemplate template, CancellationToken ct);
    Task<string> RenderAsync(string templateId, Dictionary<string, string> variables, CancellationToken ct);
    Task<PromptResponse> ExecuteAsync(string templateId, Dictionary<string, string> variables, CancellationToken ct);
    Task<int> EstimateTokensAsync(string templateId, Dictionary<string, string> variables, CancellationToken ct);
}

builder.Services.AddPrompting(options => {
    options.Provider = AiProvider.OpenAI;
    options.ApiKey = config["OpenAI:ApiKey"];
    options.DefaultModel = "gpt-4o";
});
```

## Implementation Plan
1. Create `dotnet/src/HexGuard.Prompting/`.
2. Implement template engine, token estimation, OpenAI/Anthropic adapters.
3. Add tests. Register in `HexGuard.slnx`. Publish as NuGet.
