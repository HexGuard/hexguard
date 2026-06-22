export interface KpiMetric {
  label: string;
  value: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
}

export interface LiveDataDashboard {
  title: string;
  lastUpdated: string;
  metrics: KpiMetric[];
}

let simulatedValue = 100;

export function fetchDashboardMetrics(): Promise<LiveDataDashboard> {
  simulatedValue += Math.round((Math.random() - 0.5) * 20);
  const now = new Date();
  const time = now.toLocaleTimeString();
  return Promise.resolve({
    title: 'Live Dashboard',
    lastUpdated: time,
    metrics: [
      {
        label: 'Active Users',
        value: Math.round(Math.random() * 500 + 200),
        unit: 'users',
        trend: 'up',
      },
      {
        label: 'Response Time',
        value: Math.round(Math.random() * 100 + 20),
        unit: 'ms',
        trend: 'down',
      },
      {
        label: 'Error Rate',
        value: Math.round(Math.random() * 20) / 10,
        unit: '%',
        trend: Math.random() > 0.7 ? 'up' : 'stable',
      },
      {
        label: 'Throughput',
        value: simulatedValue,
        unit: 'req/s',
        trend: Math.random() > 0.5 ? 'up' : 'down',
      },
    ],
  });
}

export function fetchFailingMetrics(): Promise<LiveDataDashboard> {
  return Promise.reject(new Error('API rate limit exceeded'));
}
