---
id: feature-angular-ai-chat
type: feature
status: proposed
created: 2026-06-27
package: '@hexguard/angular-ai-chat'
---

# @hexguard/angular-ai-chat

## Summary

Headless AI chat conversation state — message history, streaming responses, conversation management, and token tracking. For AI assistants, customer support bots, and LLM-powered features.

## Goals

- Message list with role (user, assistant, system, tool)
- Streaming response support (SSE token-by-token)
- Conversation management (create, rename, delete, switch)
- Message branching (edit a message, fork the conversation)
- Token counting and cost estimation
- Context window awareness (warn when approaching limit)
- System prompt management
- Tool/function call visualization state
- Message regeneration and retry
- Conversation export (Markdown, JSON)

## Non-Goals

- No rendered chat UI
- No actual LLM API calls (consumer handles)
- No model training or fine-tuning

## Proposed Public API

```typescript
export function injectAiChat(config: {
  modelName?: string;
  maxContextTokens?: number;
}): {
  // Conversations
  readonly conversations: Signal<Conversation[]>;
  readonly activeConversation: Signal<Conversation | null>;
  readonly messages: Signal<ChatMessage[]>;
  readonly isStreaming: Signal<boolean>;
  readonly streamingContent: Signal<string>;
  readonly tokenCount: Signal<number>;
  readonly contextUsage: Signal<number>; // 0-1
  readonly error: Signal<string | null>;
  // Actions
  createConversation(title?: string): Conversation;
  switchConversation(id: string): void;
  deleteConversation(id: string): void;
  sendMessage(content: string): Promise<void>;
  retry(messageId: string): Promise<void>;
  editMessage(messageId: string, newContent: string): Promise<void>;
  regenerate(messageId: string): Promise<void>;
  // Streaming callback
  onStreamToken(token: string): void;
  onStreamComplete(fullResponse: string): void;
  onStreamError(error: string): void;
  // System prompt
  setSystemPrompt(prompt: string): void;
  // Tools
  readonly toolCalls: Signal<ToolCall[]>;
  provideToolResult(callId: string, result: unknown): void;
};

export interface Conversation { id: string; title: string; createdAt: Date; messageCount: number; }
export interface ChatMessage { id: string; role: 'system' | 'user' | 'assistant' | 'tool'; content: string; timestamp: Date; tokenCount?: number; parentId?: string; toolCalls?: ToolCall[]; }
export interface ToolCall { id: string; name: string; arguments: Record<string, unknown>; result?: unknown; }
```

## Implementation Plan
1. Scaffold `angular/packages/angular-ai-chat/`.
2. Implement conversation CRUD, message management, streaming, token tracking with signals.
3. Add branching, tool calls, and context window awareness.
4. Add tests. Register in workspace.
