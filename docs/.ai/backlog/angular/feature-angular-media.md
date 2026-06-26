---
id: feature-angular-media
type: feature
status: proposed
created: 2026-06-26
package: '@hexguard/angular-media'
---

# @hexguard/angular-media

## Summary

Headless HTML5 audio/video playback state for Angular — play/pause/seek/volume/muted/duration/currentTime/buffered/rate as signals. Every podcast player, video platform, music app, and audio clip preview needs media playback state.

**Competition check:** No headless Angular media playback state package exists. Apps manually wire `<audio>`/`<video>` events to signals.

## Goals

1. Provide `injectMediaPlayer(element | url)` — wraps an audio/video element with signal-based state.
2. Expose signals: `playing`, `paused`, `duration`, `currentTime`, `volume`, `muted`, `rate`, `buffered`, `ended`, `error`.
3. Provide `play()`/`pause()`/`toggle()`/`seek(time)`/`setVolume(v)`/`setRate(r)`.
4. Support `preload` and `autoplay` options.
5. Support time update throttling.
6. Auto-cleanup on destroy — removes all event listeners.

## Proposed Public API

```typescript
export interface MediaPlayerConfig {
  source?: string | Signal<string>;
  element?: HTMLAudioElement | HTMLVideoElement;
  autoplay?: boolean;
  preload?: 'none' | 'metadata' | 'auto';
  throttleMs?: number;                     // Default: 250ms
}

export interface MediaPlayerState {
  readonly playing: Signal<boolean>;
  readonly paused: Signal<boolean>;
  readonly duration: Signal<number>;
  readonly currentTime: Signal<number>;
  readonly volume: Signal<number>;         // 0–1
  readonly muted: Signal<boolean>;
  readonly playbackRate: Signal<number>;
  readonly buffered: Signal<number>;       // 0–1
  readonly ended: Signal<boolean>;
  readonly seeking: Signal<boolean>;
  readonly error: Signal<MediaError | null>;

  play(): Promise<void>;
  pause(): void;
  toggle(): Promise<void>;
  seek(time: number): void;
  setVolume(volume: number): void;
  toggleMute(): void;
  setRate(rate: number): void;
  setSource(url: string): void;
}

export function injectMediaPlayer(config?: MediaPlayerConfig): MediaPlayerState;
```

## Implementation Plan

1. Scaffold `angular/packages/angular-media/`.
2. Implement `injectMediaPlayer()` wrapping HTMLMediaElement events as signals.
3. Implement throttled `timeupdate` for performance.
4. Add tests with mock media element.
5. Register in workspace.
