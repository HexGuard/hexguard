import type { NotificationType } from '@hexguard/angular-notifications';

export interface NotificationDemoAction {
  readonly type: NotificationType;
  readonly label: string;
  readonly message: string;
}

export const NOTIFICATION_DEMO_ACTIONS: readonly NotificationDemoAction[] = [
  { type: 'success', label: 'Show Success', message: 'Operation completed successfully.' },
  { type: 'error', label: 'Show Error', message: 'An unexpected error occurred.' },
  { type: 'info', label: 'Show Info', message: 'Here is some useful information.' },
  { type: 'warning', label: 'Show Warning', message: 'This action may have consequences.' },
] as const;
