---
id: feature-angular-auth-flow
type: feature
status: proposed
created: 2026-06-26
package: '@hexguard/angular-auth-flow'
---

# @hexguard/angular-auth-flow

## Summary

Headless authentication flow state â€” login, register, MFA, OAuth, forgot password, token refresh, route guards, HTTP interceptor. **The #1 time sink in new app development** â€” saves 2-4 weeks per project.

**Composes with** `angular-storage` (token persistence), `angular-idle` (session timeout).


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
export function injectAuthFlow(config: {
  login: (credentials: Credentials) => Promise<AuthTokens>;
  register?: (data: RegisterData) => Promise<AuthTokens>;
  refreshToken: (refreshToken: string) => Promise<AuthTokens>;
  getUser: (token: string) => Promise<User>;
  mfa?: { send: (method: string) => Promise<void>; verify: (code: string) => Promise<AuthTokens> };
  forgotPassword?: (email: string) => Promise<void>;
  resetPassword?: (token: string, password: string) => Promise<void>;
}): {
  readonly user: Signal<User | null>;
  readonly isAuthenticated: Signal<boolean>;
  readonly isLoading: Signal<boolean>;
  readonly error: Signal<string | null>;
  readonly requiresMfa: Signal<MfaChallenge | null>;
  login/register/logout/verifyMfa/forgotPassword/resetPassword(): Promise<void>;
  provideAuthInterceptor(): Provider;  // Auto-token + 401 refresh
};

export const authGuard: CanActivateFn;   // â†’ /login
export const guestGuard: CanActivateFn;  // â†’ /
export const mfaGuard: CanActivateFn;    // â†’ /mfa
```

## Implementation Plan

1. Scaffold `angular/packages/angular-auth-flow/`.
2. Implement auth state machine with signals.
3. Implement token refresh with request queue.
4. Implement route guards with post-login redirect.
5. Implement HTTP interceptor for auto-token + 401 handling.
6. Add tests: login/logout, token refresh, guards, MFA flow.
7. Register in workspace.
