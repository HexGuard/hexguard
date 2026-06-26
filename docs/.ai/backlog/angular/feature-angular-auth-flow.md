---
id: feature-angular-auth-flow
type: feature
status: proposed
created: 2026-06-26
package: '@hexguard/angular-auth-flow'
---

# @hexguard/angular-auth-flow

## Summary

Headless authentication flow state — login, register, MFA, OAuth, forgot password, token refresh, route guards, HTTP interceptor. **The #1 time sink in new app development** — saves 2-4 weeks per project.

**Composes with** `angular-storage` (token persistence), `angular-idle` (session timeout).

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

export const authGuard: CanActivateFn;   // → /login
export const guestGuard: CanActivateFn;  // → /
export const mfaGuard: CanActivateFn;    // → /mfa
```

## Implementation Plan

1. Scaffold `angular/packages/angular-auth-flow/`.
2. Implement auth state machine with signals.
3. Implement token refresh with request queue.
4. Implement route guards with post-login redirect.
5. Implement HTTP interceptor for auto-token + 401 handling.
6. Add tests: login/logout, token refresh, guards, MFA flow.
7. Register in workspace.
