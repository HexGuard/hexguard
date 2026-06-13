export type QueryFormOrderStatus = 'open' | 'closed' | 'archived';

export interface QueryFormOrderRecord {
  readonly id: string;
  readonly customer: string;
  readonly region: string;
  readonly status: QueryFormOrderStatus;
  readonly total: number;
  readonly tags: readonly string[];
  readonly ageDays: number;
}

export const QUERY_FORM_ORDER_STATUS_OPTIONS = ['open', 'closed', 'archived'] as const;
export const QUERY_FORM_PAGE_SIZE_OPTIONS = [5, 10, 25] as const;
export const QUERY_FORM_TAG_OPTIONS = [
  'priority',
  'enterprise',
  'retail',
  'renewal',
  'apac',
  'europe',
] as const;

const USD_FORMATTER = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});

export const QUERY_FORM_ORDER_RECORDS: readonly QueryFormOrderRecord[] = [
  {
    id: 'HG-1042',
    customer: 'Northwind',
    region: 'Berlin',
    status: 'open',
    total: 18420,
    tags: ['priority', 'retail', 'enterprise'],
    ageDays: 2,
  },
  {
    id: 'HG-1045',
    customer: 'Summit Health',
    region: 'Austin',
    status: 'open',
    total: 8120,
    tags: ['renewal', 'enterprise'],
    ageDays: 1,
  },
  {
    id: 'HG-1049',
    customer: 'Aster Labs',
    region: 'London',
    status: 'open',
    total: 23100,
    tags: ['priority', 'enterprise'],
    ageDays: 4,
  },
  {
    id: 'HG-1053',
    customer: 'Pine Valley',
    region: 'Toronto',
    status: 'closed',
    total: 5540,
    tags: ['retail'],
    ageDays: 8,
  },
  {
    id: 'HG-1055',
    customer: 'Bluebird Freight',
    region: 'Oslo',
    status: 'archived',
    total: 16490,
    tags: ['europe'],
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
    tags: ['retail', 'enterprise'],
    ageDays: 3,
  },
  {
    id: 'HG-1064',
    customer: 'Sora Travel',
    region: 'Tokyo',
    status: 'open',
    total: 14580,
    tags: ['apac', 'priority', 'enterprise'],
    ageDays: 5,
  },
  {
    id: 'HG-1068',
    customer: 'Lighthouse Media',
    region: 'Dublin',
    status: 'closed',
    total: 6320,
    tags: ['renewal', 'europe'],
    ageDays: 11,
  },
  {
    id: 'HG-1071',
    customer: 'Kepler Mobility',
    region: 'Seattle',
    status: 'archived',
    total: 20540,
    tags: ['enterprise'],
    ageDays: 38,
  },
  {
    id: 'HG-1076',
    customer: 'Verde Foods',
    region: 'Lisbon',
    status: 'open',
    total: 7280,
    tags: ['retail', 'europe', 'enterprise'],
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

export function formatQueryFormCurrency(value: number): string {
  return USD_FORMATTER.format(value);
}

export function toggleQueryFormTag(
  currentTags: readonly string[],
  tag: string,
  allTags: readonly string[],
): string[] {
  const nextTags = currentTags.includes(tag)
    ? currentTags.filter((entry) => entry !== tag)
    : [...currentTags, tag];

  return allTags.filter((entry) => nextTags.includes(entry));
}
