---
id: feature-angular-websocket
type: feature
status: proposed
created: 2026-06-26
package: '@hexguard/angular-websocket'
---

# @hexguard/angular-websocket

## Summary

Typed WebSocket connection state for Angular â€” connect, auto-reconnect, send/receive typed messages, connection status and latency as signals. Lower-level than SignalR; works with any WebSocket server.

**Distinct from `angular-signalr`** (SignalR protocol). This is a raw WebSocket wrapper for custom protocols.


## Goals

- Provide reactive, signal-based headless state for Angular applications
- Dependency-free at runtime beyond Angular core and tslib
- SSR-safe with TransferState awareness where applicable


## Non-Goals

- No rendered UI components — headless state, signals, and services only
- No browser globals or window-dependent code without SSR guard
- No backend API calls (consumer provides data/endpoints)

## Proposed Public API

```typescript
export interface WebSocketConfig {
  url: string | Signal<string>;
  protocols?: string | string[];
  reconnect?: { maxAttempts?: number; strategy?: 'exponential' | 'fixed' | 'linear'; baseDelayMs?: number };
  autoConnect?: boolean;
  serializer?: (data: unknown) => string | ArrayBuffer;
  deserializer?: (data: MessageEvent) => unknown;
}

export interface WebSocketState<TReceive = unknown, TSend = unknown> {
  readonly connected: Signal<boolean>;
  readonly connecting: Signal<boolean>;
  readonly error: Signal<string | null>;
  readonly messages: Signal<TReceive[]>;
  readonly latency: Signal<number | null>;
  readonly reconnectAttempt: Signal<number>;

  connect(): void;
  disconnect(): void;
  send(data: TSend): void;
  clearMessages(): void;
}

export function injectWebSocket<TReceive = unknown, TSend = unknown>(
  config: WebSocketConfig
): WebSocketState<TReceive, TSend>;
```

## Implementation Plan

1. Scaffold `angular/packages/angular-websocket/`.
2. Implement WebSocket wrapper with reconnect logic.
3. Implement signal-based state tracking.
4. Add tests with mock WebSocket server.
5. Register in workspace.
