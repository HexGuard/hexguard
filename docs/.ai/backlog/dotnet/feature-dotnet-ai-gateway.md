---
id: feature-dotnet-ai-gateway
type: feature
status: proposed
created: 2026-06-27
package: 'HexGuard.AiGateway'
---

# HexGuard.AiGateway

## Summary

AI provider abstraction gateway for .NET — unified interface across OpenAI, Anthropic, Azure OpenAI, and local models. Provider switching, failover, token tracking, and response streaming.

## Goals

- Unified chat completion interface across providers
- Provider switching with configuration
- Automatic failover (if primary provider errors, try fallback)
- Token counting and cost estimation per request
- Response streaming via IAsyncEnumerable
- Rate limit awareness with backoff
- Request/response logging for audit
- Function/tool calling abstraction
- Model capability detection

## Non-Goals

- No prompt templating or management
- No vector database integration
- No model fine-tuning or training

## Proposed Public API

```csharp
public interface IAiGateway
{
    Task<ChatResponse> ChatAsync(ChatRequest request, CancellationToken ct = default);
    IAsyncEnumerable<ChatStreamChunk> ChatStreamAsync(ChatRequest request, CancellationToken ct = default);
    Task<TokenCount> CountTokensAsync(string model, IReadOnlyList<ChatMessage> messages, CancellationToken ct = default);
    Task<IReadOnlyList<ModelInfo>> ListModelsAsync(CancellationToken ct = default);
}

public sealed record ChatRequest(
    IReadOnlyList<ChatMessage> Messages,
    string? Model = null,
    float Temperature = 0.7f,
    int MaxTokens = 2048,
    IReadOnlyList<ToolDefinition>? Tools = null,
    string? Provider = null // null = use default
);

public sealed record ChatMessage(
    ChatRole Role,
    string Content,
    string? Name = null,
    IReadOnlyList<ToolCall>? ToolCalls = null
);

public enum ChatRole { System, User, Assistant, Tool }

public sealed record ChatResponse(
    string Id,
    string Model,
    ChatMessage Message,
    TokenUsage Usage,
    string Provider
);

public sealed record TokenUsage(int PromptTokens, int CompletionTokens, int TotalTokens, decimal EstimatedCost);

// Registration
public static IServiceCollection AddHexGuardAiGateway(this IServiceCollection services,
    Action<AiGatewayOptions> configure);

public sealed class AiGatewayOptions
{
    public string DefaultProvider { get; set; } = "openai";
    public Dictionary<string, ProviderConfig> Providers { get; set; } = new();
    public FailoverPolicy Failover { get; set; }
}
```

## Implementation Plan
1. Create `dotnet/src/HexGuard.AiGateway/` with `.csproj`.
2. Implement unified interface, provider adapters (OpenAI, Anthropic), failover, streaming.
3. Add token counting and cost estimation.
4. Add xunit tests. Register in `HexGuard.slnx`.
