/**
 * Options for creating a cookie-based storage adapter.
 */
export interface CookieStorageOptions {
  /** Cookie path. @default '/' */
  readonly path?: string;
  /** Cookie domain. */
  readonly domain?: string;
  /** Cookie SameSite policy. @default 'lax' */
  readonly sameSite?: 'strict' | 'lax' | 'none';
  /** Whether the cookie is secure (HTTPS only). @default false */
  readonly secure?: boolean;
  /** Cookie max-age in seconds. When set, the cookie expires after this duration. */
  readonly maxAgeSeconds?: number;
}

function isBrowser(): boolean {
  return typeof document !== 'undefined' && typeof document.cookie === 'string';
}

function encodeCookieValue(value: string): string {
  return encodeURIComponent(value);
}

function decodeCookieValue(value: string): string {
  return decodeURIComponent(value);
}

/**
 * Creates a cookie-backed storage adapter that mimics the `Storage` interface
 * (`getItem`, `setItem`, `removeItem`, `clear`, `length`, `key`).
 *
 * Useful for SSR scenarios where `localStorage` is unavailable, or for
 * sharing small pieces of state (tokens, preferences) with the server.
 *
 * @example
 * ```typescript
 * const cookies = cookieStorage({ path: '/', secure: true, sameSite: 'lax' });
 * cookies.setItem('theme', 'dark');
 * const theme = cookies.getItem('theme'); // 'dark'
 * ```
 */
export function cookieStorage(options: CookieStorageOptions = {}): Storage {
  const { path = '/', domain, sameSite = 'lax', secure = false, maxAgeSeconds } = options;

  function getItem(key: string): string | null {
    if (!isBrowser()) return null;

    const prefix = `${encodeCookieValue(key)}=`;
    const cookies = document.cookie.split('; ');

    for (const cookie of cookies) {
      const trimmed = cookie.trim();
      if (trimmed.startsWith(prefix)) {
        return decodeCookieValue(trimmed.slice(prefix.length));
      }
    }

    return null;
  }

  function setItem(key: string, value: string): void {
    if (!isBrowser()) return;

    let cookie = `${encodeCookieValue(key)}=${encodeCookieValue(value)}; path=${path}`;

    if (domain) cookie += `; domain=${domain}`;
    if (sameSite) cookie += `; SameSite=${sameSite}`;
    if (secure) cookie += '; Secure';
    if (maxAgeSeconds !== undefined) cookie += `; max-age=${maxAgeSeconds}`;

    document.cookie = cookie;
  }

  function removeItem(key: string): void {
    if (!isBrowser()) return;

    document.cookie = `${encodeCookieValue(key)}=; path=${path}; max-age=0`;
  }

  function clear(): void {
    if (!isBrowser()) return;

    const cookies = document.cookie.split('; ');
    for (const cookie of cookies) {
      const eqIdx = cookie.indexOf('=');
      const k = eqIdx > -1 ? cookie.slice(0, eqIdx) : cookie;
      document.cookie = `${k.trim()}=; path=${path}; max-age=0`;
    }
  }

  function key(index: number): string | null {
    if (!isBrowser()) return null;
    const cookies = document.cookie.split('; ').filter(Boolean);
    if (index < 0 || index >= cookies.length) return null;
    const eqIdx = cookies[index].indexOf('=');
    return eqIdx > -1 ? cookies[index].slice(0, eqIdx).trim() : cookies[index].trim();
  }

  const storage: Storage = { getItem, setItem, removeItem, clear, length: 0, key };

  Object.defineProperty(storage, 'length', {
    get: () => {
      if (!isBrowser()) return 0;
      return document.cookie.split('; ').filter(Boolean).length;
    },
    configurable: true,
  });

  return storage;
}
