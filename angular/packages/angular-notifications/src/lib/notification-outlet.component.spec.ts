import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HexguardNotificationOutletComponent } from './notification-outlet.component';
import { NotificationService } from './notification.service';

describe(HexguardNotificationOutletComponent.name, () => {
  let fixture: ComponentFixture<HexguardNotificationOutletComponent>;
  let service: NotificationService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HexguardNotificationOutletComponent],
    }).compileComponents();

    service = TestBed.inject(NotificationService);
    fixture = TestBed.createComponent(HexguardNotificationOutletComponent);
    fixture.detectChanges();
  });

  it('renders the outlet container', () => {
    const outletEl = fixture.nativeElement.querySelector('[data-testid="notification-outlet"]');
    expect(outletEl).toBeTruthy();
  });

  it('renders each notification as a div', () => {
    service.info('First');
    service.success('Second');
    fixture.detectChanges();

    const notificationEls = fixture.nativeElement.querySelectorAll('.notification');
    expect(notificationEls.length).toBe(2);
  });

  it('shows the notification message text', () => {
    service.error('Something went wrong');
    fixture.detectChanges();

    const messageEl = fixture.nativeElement.querySelector('.notification__message');
    expect(messageEl?.textContent).toContain('Something went wrong');
  });

  it('renders the notification title when provided', () => {
    service.show('Details saved', 'success', { title: 'Save completed' });
    fixture.detectChanges();

    const titleEl = fixture.nativeElement.querySelector('.notification__title');
    expect(titleEl).toBeTruthy();
    expect(titleEl.textContent).toContain('Save completed');
  });

  it('renders a dismiss button for each notification', () => {
    service.warning('Watch out');
    fixture.detectChanges();

    const dismissBtn = fixture.nativeElement.querySelector('.notification__dismiss-btn');
    expect(dismissBtn).toBeTruthy();
  });

  it('renders an action button when the notification has an action', () => {
    const handler = vi.fn();
    service.show('With action', 'info', {
      action: { label: 'Retry', handler },
    });
    fixture.detectChanges();

    const actionBtn = fixture.nativeElement.querySelector('.notification__action-btn');
    expect(actionBtn).toBeTruthy();
    expect(actionBtn?.textContent).toContain('Retry');
  });
});
