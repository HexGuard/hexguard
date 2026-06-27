---
id: feature-ts-hash
type: feature
status: proposed
created: 2026-06-27
package: '@hexguard/ts-hash'
---

# @hexguard/ts-hash

## Summary

Zero-dependency hashing utilities for TypeScript — SHA-256, SHA-512, HMAC, CRC32, and hash-based IDs. For data integrity, cache keys, and fingerprinting. Uses the Web Crypto API.

## Proposed Public API

```typescript
// Cryptographic hashes (Web Crypto)
export function sha256(data: string | ArrayBuffer): Promise<string>;
export function sha512(data: string | ArrayBuffer): Promise<string>;
export function sha1(data: string | ArrayBuffer): Promise<string>;

// HMAC
export function hmacSha256(data: string, key: string): Promise<string>;
export function hmacSha512(data: string, key: string): Promise<string>;

// Non-cryptographic hashes
export function crc32(data: string): number;
export function fnv1a(data: string): number;
export function murmur3(data: string, seed?: number): number;

// Hash-based IDs
export function hashId(input: string, length?: number): string;
export function shortHash(input: string): string; // URL-safe, 8 chars

// Content fingerprinting
export function fingerprint(obj: unknown): string; // deterministic JSON hash
export function fileFingerprint(buffer: ArrayBuffer): Promise<string>;

// Constant-time comparison
export function timingSafeEqual(a: string, b: string): boolean;
```

## Implementation Plan
1. Create `ts/packages/ts-hash/` with zero dependencies.
2. Implement all hash functions using Web Crypto API where possible.
3. Add tests for collision resistance and determinism.
4. Publish to npm.
