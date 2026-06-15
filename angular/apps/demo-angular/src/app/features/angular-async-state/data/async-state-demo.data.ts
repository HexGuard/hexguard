export type AsyncMetricTone = 'steady' | 'warning' | 'critical';

export interface AsyncStateMetricCard {
  readonly id: string;
  readonly label: string;
  readonly value: string;
  readonly detail: string;
  readonly tone: AsyncMetricTone;
}

export interface AsyncActionOrderOption {
  readonly id: string;
  readonly customer: string;
  readonly total: number;
  readonly region: string;
}

export const ASYNC_STATE_BASE_CARDS: readonly AsyncStateMetricCard[] = [
  {
    id: 'open-orders',
    label: 'Open orders',
    value: '128',
    detail: '12 more than the previous snapshot',
    tone: 'steady',
  },
  {
    id: 'approval-lag',
    label: 'Approval lag',
    value: '41m',
    detail: 'Within the current operations target',
    tone: 'steady',
  },
  {
    id: 'retry-queue',
    label: 'Retry queue',
    value: '6',
    detail: 'One customer integration is backing off',
    tone: 'warning',
  },
] as const;

export const ASYNC_STATE_REFRESHED_CARDS: readonly AsyncStateMetricCard[] = [
  {
    id: 'open-orders',
    label: 'Open orders',
    value: '119',
    detail: '9 orders cleared since the last refresh',
    tone: 'steady',
  },
  {
    id: 'approval-lag',
    label: 'Approval lag',
    value: '54m',
    detail: 'A regional queue is drifting above target',
    tone: 'warning',
  },
  {
    id: 'retry-queue',
    label: 'Retry queue',
    value: '11',
    detail: 'Recovery work is rising and needs attention',
    tone: 'critical',
  },
] as const;

export const ASYNC_ACTION_ORDER_OPTIONS: readonly AsyncActionOrderOption[] = [
  {
    id: 'HG-1042',
    customer: 'Northwind',
    total: 18420,
    region: 'Berlin',
  },
  {
    id: 'HG-1068',
    customer: 'Lighthouse Media',
    total: 6320,
    region: 'Dublin',
  },
  {
    id: 'HG-1080',
    customer: 'Atlas Capital',
    total: 18990,
    region: 'New York',
  },
] as const;

const USD_FORMATTER = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});

export function formatAsyncActionCurrency(value: number): string {
  return USD_FORMATTER.format(value);
}
