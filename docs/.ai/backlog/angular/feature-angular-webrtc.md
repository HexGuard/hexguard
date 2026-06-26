---
id: feature-angular-webrtc
type: feature
status: proposed
created: 2026-06-26
package: '@hexguard/angular-webrtc'
---

# @hexguard/angular-webrtc

## Summary

WebRTC peer connection state — local/remote streams, ICE status, data channels as signals. Every video call, screen sharing, and P2P transfer needs WebRTC state.

**Competition check:** No headless Angular WebRTC state package exists.

## Proposed Public API

```typescript
export interface WebRtcConfig {
  iceServers?: RTCIceServer[];
  offerOptions?: RTCOfferOptions;
}

export interface WebRtcState {
  readonly connectionState: Signal<RTCPeerConnectionState>;
  readonly iceConnectionState: Signal<RTCIceConnectionState>;
  readonly localStream: Signal<MediaStream | null>;
  readonly remoteStream: Signal<MediaStream | null>;
  readonly dataChannel: Signal<RTCDataChannel | null>;
  readonly error: Signal<string | null>;

  startLocalStream(constraints?: MediaStreamConstraints): Promise<MediaStream>;
  createOffer(): Promise<RTCSessionDescriptionInit>;
  createAnswer(offer: RTCSessionDescriptionInit): Promise<RTCSessionDescriptionInit>;
  addIceCandidate(candidate: RTCIceCandidateInit): Promise<void>;
  setRemoteDescription(sdp: RTCSessionDescriptionInit): Promise<void>;
  createDataChannel(label: string): RTCDataChannel;
  close(): void;
}

export function injectWebRtc(config?: WebRtcConfig): WebRtcState;
```

## Implementation Plan

1. Scaffold `angular/packages/angular-webrtc/`.
2. Implement `RTCPeerConnection` wrapper with signal state.
3. Add tests.
4. Register in workspace.
