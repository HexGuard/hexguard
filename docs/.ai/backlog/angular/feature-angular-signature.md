---
id: feature-angular-signature
type: feature
status: proposed
created: 2026-06-27
package: '@hexguard/angular-signature'
---

# @hexguard/angular-signature

## Summary

Headless e-signature capture state — canvas-based signature drawing, typed name acceptance, signature preview, and submission. For contract signing, consent forms, delivery confirmations, and approvals.

## Goals

- Signature drawing state (strokes, clear, undo)
- Typed-name signature acceptance
- Signature preview as data URL
- Multiple signers with signing order
- Signature field placement (which fields need signing)
- Signature completion tracking per signer
- Signature validation (non-empty, minimum complexity)
- Submission with audit metadata

## Non-Goals

- No canvas rendering (consumer renders)
- No legal validity verification
- No document embedding

## Proposed Public API

```typescript
export function injectSignature(): {
  // Drawing state
  readonly strokes: Signal<Stroke[]>;
  readonly isEmpty: Signal<boolean>;
  readonly previewDataUrl: Signal<string | null>;
  addStroke(stroke: Stroke): void;
  undo(): void;
  clear(): void;
  // Typed signature
  readonly typedName: Signal<string>;
  readonly acceptedTerms: Signal<boolean>;
  readonly signatureType: Signal<'draw' | 'type' | null>;
  setTypedName(name: string): void;
  setAcceptedTerms(accepted: boolean): void;
  readonly isValid: Signal<boolean>;
};

export function injectSigningSession(config: {
  endpoint: string;
}): {
  readonly signers: Signal<Signer[]>;
  readonly currentSigner: Signal<Signer | null>;
  readonly allSigned: Signal<boolean>;
  readonly isSubmitting: Signal<boolean>;
  submitSignature(signerId: string, signature: SignatureData): Promise<void>;
  decline(signerId: string, reason: string): Promise<void>;
};

export interface Stroke { points: { x: number; y: number }[]; pressure?: number; }
export interface SignatureData { type: 'draw' | 'type'; dataUrl?: string; typedName?: string; }
export interface Signer { id: string; name: string; email: string; order: number; status: 'pending' | 'signed' | 'declined'; signedAt?: Date; }
```

## Implementation Plan
1. Scaffold `angular/packages/angular-signature/`.
2. Implement drawing state, typed acceptance, signer workflow with signals.
3. Add validation and preview generation.
4. Add tests. Register in workspace.
