---
id: feature-angular-speech
type: feature
status: proposed
created: 2026-06-25
package: '@hexguard/angular-speech'
---

# @hexguard/angular-speech

## Summary

Web Speech API wrapper for Angular — text-to-speech (synthesis) and speech-to-text (recognition) as signal-based injectable primitives. No headless Angular package exists for the Web Speech API, despite its broad browser support and applicability for accessibility, voice commands, and read-aloud features.

**Competition check:** Existing Angular speech packages (e.g., `ngx-speech-recognition`) are outdated, depend on deprecated APIs, or bundle UI components. No package offers signal-based, headless speech state with both synthesis and recognition.

## Why Wide Adoption

Text-to-speech powers accessibility features (read aloud, screen-reader-like functionality), hands-free operation (read recipes, articles), and voice feedback. Speech recognition enables voice search, voice commands, dictation, and voice-controlled UIs. Both APIs are natively supported in Chrome, Edge, Safari, and Firefox. A headless Angular wrapper makes them accessible in any component without raw `window.SpeechSynthesis` / `webkitSpeechRecognition` interop.

## Goals

1. Provide `injectSpeechSynthesis()` — text-to-speech with speak/pause/resume/cancel, voice selection, rate/pitch control, and speaking state signal.
2. Provide `injectSpeechRecognition()` — speech-to-text with interim results, language selection, continuous mode, and listening state signal.
3. Expose `supported` signal for progressive enhancement.
4. Automatic cleanup on destroy (cancel synthesis, stop recognition).
5. No runtime dependencies beyond Angular + `tslib`.

## Non-Goals

- No UI components (headless — consumers render their own "Listen" or "Voice input" buttons).
- No grammar or context-free-grammar support (niche use case).
- No wake-word detection (browser API doesn't support it).

## Decisions

1. **Browser API wrappers**: Both features wrap `window.SpeechSynthesis` and `window.SpeechRecognition` (or `webkitSpeechRecognition`).
2. **Signal-first**: State (speaking, listening, voices, transcript) exposed as signals.
3. **Detect support**: `supported()` signal checks for API availability on init.

## Proposed Public API

```typescript
// ── Types ─────────────────────────────────────────────────

export interface SpeechVoice {
  name: string;
  lang: string;
  default: boolean;
}

export interface SynthesisOptions {
  voice?: SpeechVoice | string;
  rate?: number;      // 0.1–10, default 1
  pitch?: number;     // 0–2, default 1
  volume?: number;    // 0–1, default 1
}

export interface RecognitionOptions {
  language?: string;       // BCP 47 tag, default browser language
  continuous?: boolean;    // Keep listening after result (default false)
  interimResults?: boolean; // Return partial results (default true)
  maxAlternatives?: number; // Max alternative hypotheses (default 1)
}

// ── Synthesis ─────────────────────────────────────────────

export function injectSpeechSynthesis(opts?: SynthesisOptions): {
  readonly supported: Signal<boolean>;
  readonly speaking: Signal<boolean>;
  readonly paused: Signal<boolean>;
  readonly voices: Signal<SpeechVoice[]>;
  readonly selectedVoice: Signal<SpeechVoice | null>;

  speak(text: string, options?: SynthesisOptions): Promise<void>;
  pause(): void;
  resume(): void;
  cancel(): void;
  setVoice(voice: SpeechVoice | string): void;
};

// ── Recognition ───────────────────────────────────────────

export function injectSpeechRecognition(opts?: RecognitionOptions): {
  readonly supported: Signal<boolean>;
  readonly listening: Signal<boolean>;
  readonly transcript: Signal<string>;       // Final transcript
  readonly interimTranscript: Signal<string>; // Partial interim text
  readonly error: Signal<string | null>;
  readonly isFinal: Signal<boolean>;         // True when final result received

  start(): void;
  stop(): void;
  abort(): void;
};

// ── Usage ─────────────────────────────────────────────────

@Component({})
class ArticleReaderComponent {
  readonly tts = injectSpeechSynthesis();

  readAloud(text: string) {
    this.tts.speak(text, { rate: 0.9 });
  }

  stopReading() {
    this.tts.cancel();
  }
}

@Component({})
class VoiceSearchComponent {
  readonly recognition = injectSpeechRecognition({
    language: 'en-US',
    continuous: false,
    interimResults: true,
  });

  readonly query = signal('');

  startVoiceSearch() {
    this.recognition.transcript.subscribe(t => this.query.set(t));
    this.recognition.start();
  }
}
```

## Implementation Plan

1. Scaffold `angular/packages/angular-speech/` following the standard pattern.
2. Implement synthesis types and `injectSpeechSynthesis()`.
3. Implement recognition types and `injectSpeechRecognition()`.
4. Add browser-support detection.
5. Add tests with mocked `SpeechSynthesis`/`SpeechRecognition` APIs.
6. Register in workspace, build scripts, and catalog.
