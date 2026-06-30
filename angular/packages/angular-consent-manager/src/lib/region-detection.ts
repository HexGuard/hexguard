import type { RegionDetectionMode } from './types';

/** Configuration for region detection. */
export interface RegionDetectionConfig {
  /** Detection mode. Default: `'browser-timezone'`. */
  readonly mode: RegionDetectionMode;
  /**
   * Custom detection function (used when mode is `'geo-api'`).
   * Should return an ISO 3166-1 alpha-2 country code or null.
   */
  readonly customDetector?: () => string | null;
}

/**
 * Maps browser timezone IDs to ISO 3166-1 alpha-2 country codes.
 * This is a best-effort mapping — timezones don't perfectly map to countries.
 */
const TIMEZONE_COUNTRY_MAP: Record<string, string> = {
  // Europe
  'Europe/London': 'GB',
  'Europe/Paris': 'FR',
  'Europe/Berlin': 'DE',
  'Europe/Madrid': 'ES',
  'Europe/Rome': 'IT',
  'Europe/Amsterdam': 'NL',
  'Europe/Brussels': 'BE',
  'Europe/Vienna': 'AT',
  'Europe/Stockholm': 'SE',
  'Europe/Oslo': 'NO',
  'Europe/Copenhagen': 'DK',
  'Europe/Helsinki': 'FI',
  'Europe/Dublin': 'IE',
  'Europe/Lisbon': 'PT',
  'Europe/Warsaw': 'PL',
  'Europe/Prague': 'CZ',
  'Europe/Budapest': 'HU',
  'Europe/Athens': 'GR',
  'Europe/Bucharest': 'RO',
  'Europe/Sofia': 'BG',
  'Europe/Zurich': 'CH',
  'Europe/Moscow': 'RU',
  // North America
  'America/New_York': 'US',
  'America/Chicago': 'US',
  'America/Denver': 'US',
  'America/Los_Angeles': 'US',
  'America/Phoenix': 'US',
  'America/Anchorage': 'US',
  'America/Honolulu': 'US',
  'America/Toronto': 'CA',
  'America/Vancouver': 'CA',
  'America/Montreal': 'CA',
  'America/Mexico_City': 'MX',
  // South America
  'America/Sao_Paulo': 'BR',
  'America/Argentina/Buenos_Aires': 'AR',
  'America/Santiago': 'CL',
  // Asia
  'Asia/Tokyo': 'JP',
  'Asia/Seoul': 'KR',
  'Asia/Shanghai': 'CN',
  'Asia/Hong_Kong': 'HK',
  'Asia/Singapore': 'SG',
  'Asia/Kolkata': 'IN',
  'Asia/Dubai': 'AE',
  'Asia/Jerusalem': 'IL',
  'Asia/Bangkok': 'TH',
  'Asia/Taipei': 'TW',
  'Asia/Manila': 'PH',
  'Asia/Kuala_Lumpur': 'MY',
  'Asia/Jakarta': 'ID',
  // Oceania
  'Australia/Sydney': 'AU',
  'Australia/Melbourne': 'AU',
  'Australia/Perth': 'AU',
  'Pacific/Auckland': 'NZ',
  // Africa
  'Africa/Cairo': 'EG',
  'Africa/Johannesburg': 'ZA',
  'Africa/Lagos': 'NG',
  'Africa/Nairobi': 'KE',
  'Africa/Casablanca': 'MA',
};

/**
 * Detects the user's region based on the configured detection mode.
 *
 * @returns ISO 3166-1 alpha-2 country code, or `null` if detection fails.
 */
export function detectRegion(config: RegionDetectionConfig): string | null {
  switch (config.mode) {
    case 'disabled':
      return null;

    case 'browser-timezone': {
      try {
        const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
        if (!tz) return null;

        // Exact match
        const exact = TIMEZONE_COUNTRY_MAP[tz];
        if (exact) return exact;

        // Partial match: try parent timezone (e.g., "America/Argentina/Cordoba" → "America/Argentina/Buenos_Aires")
        const parts = tz.split('/');
        if (parts.length > 2) {
          const parent = `${parts[0]}/${parts[1]}`;
          return TIMEZONE_COUNTRY_MAP[parent] ?? null;
        }

        return null;
      } catch {
        return null;
      }
    }

    case 'geo-api': {
      try {
        return config.customDetector?.() ?? null;
      } catch {
        return null;
      }
    }

    default:
      return null;
  }
}
