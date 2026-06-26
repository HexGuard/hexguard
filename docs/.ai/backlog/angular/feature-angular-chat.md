---
id: feature-angular-chat
type: feature
status: proposed
created: 2026-06-26
package: '@hexguard/angular-chat'
---

# @hexguard/angular-chat

## Summary

Headless chat/conversation state for Angular — manage message lists, streaming text display (for AI token-by-token responses), typing indicators, message grouping, scroll anchoring, and conversation history. With the rise of AI-powered chat interfaces (chatbots, AI assistants, customer support), every Angular team is building chat UIs — yet no headless Angular package exists for the conversation state layer.

**Competition check:** Zero headless Angular chat state packages exist. Existing chat UI components (like `ngx-chat`) are opinionated, outdated, and not designed for AI streaming responses.

## Why Wide Adoption

AI chat interfaces are rapidly becoming standard in business apps: AI assistants, customer support chatbots, code/document generation, data query agents. Additionally, traditional human-to-human chat (messaging, comments, collaboration) remains universal. The core state pattern is the same across all: message list → streaming text → typing indicator → scroll management → send action.

## Goals

1. Provide `injectChat()` — conversation state with message list, send, and streaming text.
2. Support message types: user, assistant, system, with typed content (text, code, image, card).
3. Support **streaming text** — append text token-by-token as the AI generates (signal-based, not DOM manipulation).
4. Provide typing indicator (show "..." when remote user or AI is responding).
5. Provide scroll anchoring state (auto-scroll to bottom unless user has scrolled up).
6. Provide message grouping (group consecutive messages from the same sender).
7. Support conversation branching (edit a previous message and fork the conversation).

## Non-Goals

- No chat UI components (consumer renders bubbles, input, etc.).
- No WebSocket/SignalR integration (consumer connects their own transport).
- No markdown/code rendering (consumer formats message content).

## Proposed Public API

```typescript
// ── Types ─────────────────────────────────────────────────

export type MessageRole = 'user' | 'assistant' | 'system';
export type MessageContent = TextContent | CodeContent | ImageContent | CardContent;

export interface TextContent { type: 'text'; text: string; }
export interface CodeContent { type: 'code'; language: string; code: string; }
export interface ImageContent { type: 'image'; url: string; alt?: string; }
export interface CardContent { type: 'card'; title: string; description?: string; data?: Record<string, unknown>; }

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: MessageContent[];
  timestamp: Date;
  status: 'sending' | 'sent' | 'error';
}

export interface ChatConfig {
  initialMessages?: ChatMessage[];
  maxHistory?: number;                    // Auto-prune beyond this count
  groupMessages?: boolean;                // Group consecutive same-sender messages
}

export interface ChatState {
  readonly messages: Signal<ChatMessage[]>;
  readonly groupedMessages: Signal<ChatMessage[][]>;  // Groups when enabled
  readonly isStreaming: Signal<boolean>;
  readonly streamingText: Signal<string>;              // Current partial AI response
  readonly isTyping: Signal<boolean>;                  // Remote user typing
  readonly hasScrolledUp: Signal<boolean>;             // User manually scrolled up
  readonly isEmpty: Signal<boolean>;
  readonly error: Signal<string | null>;

  send(content: string): Promise<ChatMessage>;         // Returns the sent message
  sendMessage(message: Omit<ChatMessage, 'id' | 'timestamp'>): ChatMessage;

  // Streaming (for AI responses)
  startStreaming(): void;                               // Begin streaming state
  appendToken(token: string): void;                     // Add next token
  completeStreaming(fullMessage?: Partial<ChatMessage>): void;  // Finalize stream
  cancelStreaming(): void;

  // Typing indicator
  setTyping(isTyping: boolean): void;

  // Scroll anchoring
  markScrolledUp(): void;
  markScrolledToBottom(): void;

  // Conversation management
  clear(): void;
  removeMessage(id: string): void;
  editMessage(id: string, newContent: string): ChatMessage;  // Creates fork
}

export function injectChat(config?: ChatConfig): ChatState;
```

## Implementation Plan

1. Scaffold `angular/packages/angular-chat/` following the standard pattern.
2. Implement message types and `ChatMessage` model.
3. Implement `injectChat()` with message list, send, and streaming.
4. Implement streaming text append with signal-based updates.
5. Implement message grouping.
6. Implement scroll anchoring detection.
7. Add tests: send/receive, streaming append, grouping, scroll anchoring, edit/fork, typing indicator.
8. Create demo page with AI streaming simulation.
9. Register in workspace, build scripts, and catalog.
