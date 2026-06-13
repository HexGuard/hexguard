import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'demo-root',
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  readonly navigation = [
    {
      label: 'Orders Search',
      route: '/orders',
      description: 'Debounced replace-state filters for search, paging, and tags.',
    },
    {
      label: 'Dashboard Filters',
      route: '/dashboard',
      description: 'Push-state history for tabs, date ranges, and archived toggles.',
    },
  ] as const;
}
