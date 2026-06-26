---
id: feature-angular-signal-machine
type: feature
status: proposed
created: 2026-06-26
package: '@hexguard/angular-signal-machine'
---

# @hexguard/angular-signal-machine

## Summary

Lightweight finite state machine built on Angular signals — define typed states, transitions, guards, and entry/exit effects using a declarative schema. Useful for modelling workflows, connection lifecycles, upload progress, multi-step processes, and any UI with distinct, mutually-exclusive states.

**Competition check:** No Angular signal-based FSM package exists. State machine libraries (xstate) are framework-agnostic and heavyweight — this targets a narrow, headless, signal-native alternative.

## Why Wide Adoption

State machines appear in every app: login flow (logged-out/loading/logged-in/error), upload lifecycle (selecting/uploading/paused/complete/error), connection state (disconnected/connecting/connected/reconnecting), form submission (idle/validating/submitting/success/error). A signal-native FSM makes these explicit and testable.

## Goals

1. Provide `injectSignalMachine()` — typed FSM with states, transitions, guards, and effects.
2. Support synchronous and asynchronous transition effects (entry/exit).
3. Support guards — conditional transitions that can reject.
4. Expose `state` signal, `can(event)` signal, and `send(event)` action.
5. Support `history` — track previous states and transition count.
6. Type-safe — states and events are string literal unions.

## Proposed Public API

```typescript
export interface MachineStateDefinition<TState extends string, TEvent extends string> {
  initial: TState;
  states: Record<TState, {
    on?: Partial<Record<TEvent, MachineTransition<TState, TEvent>>>;
    entry?: () => void | (() => void) | Promise<void>;
    exit?: () => void;
  }>;
}

export interface MachineTransition<TState extends string, TEvent extends string> {
  target: TState;
  guard?: () => boolean | Signal<boolean>;
  effect?: () => void | (() => void) | Promise<void>;
}

export interface SignalMachine<TState extends string, TEvent extends string> {
  readonly state: Signal<TState>;
  readonly previousState: Signal<TState | null>;
  readonly transitionCount: Signal<number>;
  readonly can: (event: TEvent) => Signal<boolean>;

  send(event: TEvent): boolean;     // Returns false if rejected
  reset(): void;
}

export function injectSignalMachine<TState extends string, TEvent extends string>(
  config: MachineStateDefinition<TState, TEvent>
): SignalMachine<TState, TEvent>;

// Usage
const machine = injectSignalMachine({
  initial: 'idle',
  states: {
    idle: { on: { FETCH: { target: 'loading' } } },
    loading: {
      on: {
        SUCCESS: { target: 'loaded' },
        ERROR: { target: 'error' },
      },
      entry: () => fetchData(),
      exit: () => cancelToken(),
    },
    loaded: { on: { RESET: { target: 'idle' } } },
    error: { on: { RETRY: { target: 'loading', guard: () => hasNetwork() }, RESET: { target: 'idle' } } },
  },
});

// Reactive state-based rendering
if (machine.state() === 'loading') showSpinner();
machine.send('FETCH');
```

## Implementation Plan

1. Scaffold `angular/packages/angular-signal-machine/`.
2. Implement machine state container with `signal()` for current state.
3. Implement transition resolution with guard checking.
4. Implement entry/exit effect execution (sync and async).
5. Implement `can(event)` as a computed signal.
6. Add tests: basic transitions, guards blocking, async effects, reset, history tracking.
7. Create demo page.
8. Register in workspace.
