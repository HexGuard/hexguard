export type OrderStatus = 'open' | 'closed' | 'archived';

export interface OrderRecord {
  readonly id: string;
  readonly customer: string;
  readonly region: string;
  readonly status: OrderStatus;
  readonly total: number;
  readonly tags: readonly string[];
  readonly ageDays: number;
}

export const STATUS_OPTIONS = ['open', 'closed', 'archived'] as const;
export const PAGE_SIZE_OPTIONS = [5, 10, 25, 50] as const;

const USD_FORMATTER = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});

export const ORDER_RECORDS: readonly OrderRecord[] = [
  {
    id: 'HG-1042',
    customer: 'Northwind',
    region: 'Berlin',
    status: 'open',
    total: 18420,
    tags: ['priority', 'b2b'],
    ageDays: 2,
  },
  {
    id: 'HG-1045',
    customer: 'Summit Health',
    region: 'Austin',
    status: 'open',
    total: 8120,
    tags: ['renewal'],
    ageDays: 1,
  },
  {
    id: 'HG-1049',
    customer: 'Aster Labs',
    region: 'London',
    status: 'open',
    total: 23100,
    tags: ['priority', 'expansion'],
    ageDays: 4,
  },
  {
    id: 'HG-1053',
    customer: 'Pine Valley',
    region: 'Toronto',
    status: 'closed',
    total: 5540,
    tags: ['b2c'],
    ageDays: 8,
  },
  {
    id: 'HG-1055',
    customer: 'Bluebird Freight',
    region: 'Oslo',
    status: 'archived',
    total: 16490,
    tags: ['legacy'],
    ageDays: 27,
  },
  {
    id: 'HG-1057',
    customer: 'Cedar Systems',
    region: 'Melbourne',
    status: 'closed',
    total: 11230,
    tags: ['renewal', 'apac'],
    ageDays: 6,
  },
  {
    id: 'HG-1060',
    customer: 'Orbit Retail',
    region: 'Chicago',
    status: 'open',
    total: 9720,
    tags: ['retail'],
    ageDays: 3,
  },
  {
    id: 'HG-1064',
    customer: 'Sora Travel',
    region: 'Tokyo',
    status: 'open',
    total: 14580,
    tags: ['apac', 'priority'],
    ageDays: 5,
  },
  {
    id: 'HG-1068',
    customer: 'Lighthouse Media',
    region: 'Dublin',
    status: 'closed',
    total: 6320,
    tags: ['retainer'],
    ageDays: 11,
  },
  {
    id: 'HG-1071',
    customer: 'Kepler Mobility',
    region: 'Seattle',
    status: 'archived',
    total: 20540,
    tags: ['fleet'],
    ageDays: 38,
  },
  {
    id: 'HG-1076',
    customer: 'Verde Foods',
    region: 'Lisbon',
    status: 'open',
    total: 7280,
    tags: ['retail', 'europe'],
    ageDays: 2,
  },
  {
    id: 'HG-1080',
    customer: 'Atlas Capital',
    region: 'New York',
    status: 'open',
    total: 18990,
    tags: ['priority', 'enterprise'],
    ageDays: 7,
  },
] as const;

export function normalizeTags(value: string): string[] {
  return Array.from(
    new Set(
      value
        .split(',')
        .map((item) => item.trim().toLowerCase())
        .filter((item) => item.length > 0),
    ),
  );
}

export function formatCurrency(value: number): string {
  return USD_FORMATTER.format(value);
}
