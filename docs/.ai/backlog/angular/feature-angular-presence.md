---
id: feature-angular-presence
type: feature
status: proposed
created: 2026-06-26
package: '@hexguard/angular-presence'
---

# @hexguard/angular-presence

## Summary

User presence and awareness state for Angular — track online/away/busy status, typing indicators, and "viewing same document" peers. Real-time collaboration features (who's online, who's typing, who's viewing the same page) are increasingly expected in business apps, yet every team re-implements the same presence WebSocket wiring.

**Competition check:** No headless Angular presence package exists. Collaboration frameworks (Liveblocks, PartyKit, Durable Objects) are full-stack platforms — heavier than a headless state primitive.

## Why Wide Adoption

Presence indicators are standard in collaborative apps: document co-editing, chat apps, project management tools, support dashboards, and code review tools. "3 people viewing this document," "Alice is typing...", green/away/yellow status dots — every collaboration feature needs this state.

## Goals

1. Provide `injectPresence()` — user presence state with status and peer tracking.
2. Support status values: `online`, `away`, `busy`, `offline`.
3. Track peer list: who's connected, their status, and metadata.
4. Support typing indicators per context (e.g., "typing in document X").
5. Support heartbeat mechanism for away detection.
6. Provide transport abstraction (`PresenceTransport`) — implement with WebSocket, SignalR, or polling.
7. Auto-cleanup on destroy — disconnect from transport.

## Proposed Public API

```typescript
export type PresenceStatus = 'online' | 'away' | 'busy' | 'offline';

export interface PeerPresence {
  userId: string;
  displayName: string;
  status: PresenceStatus;
  lastSeen: Date;
  typingIn?: string[];                // Contexts where peer is typing
  metadata?: Record<string, string>;  // Custom data (avatar, role, etc.)
}

export interface PresenceTransport {
  connect(userId: string, status: PresenceStatus): Promise<void>;
  disconnect(): Promise<void>;
  sendStatus(status: PresenceStatus): void;
  sendTyping(context: string, isTyping: boolean): void;
  onPeersChanged(callback: (peers: PeerPresence[]) => void): void;
  onStatusChanged(callback: (status: PresenceStatus) => void): void;
}

export interface PresenceConfig {
  userId: string;
  displayName: string;
  transport: PresenceTransport;
  awayTimeout?: number;                // ms before auto-away (default: 5 min)
  heartbeatInterval?: number;          // ms between heartbeats (default: 30s)
}

export interface PresenceState {
  readonly status: Signal<PresenceStatus>;
  readonly peers: Signal<PeerPresence[]>;
  readonly onlineCount: Signal<number>;
  readonly typingPeers: Signal<PeerPresence[]>;   // Peers currently typing
  readonly isConnected: Signal<boolean>;

  setStatus(status: PresenceStatus): void;
  setTyping(context: string, isTyping: boolean): void;
  setMetadata(metadata: Record<string, string>): void;
}

export function injectPresence(config: PresenceConfig): PresenceState;
```

## Implementation Plan

1. Scaffold `angular/packages/angular-presence/`.
2. Implement `PresenceTransport` interface and a built-in WebSocket transport.
3. Implement `injectPresence()` with heartbeat, away detection, peer tracking.
4. Add tests: connect/disconnect, status changes, typing indicators, peer tracking.
5. Create demo page.
6. Register in workspace.
