import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

import { SITE_CURRENT_PACKAGES, SITE_HEADER_LINKS } from './site-catalog';

@Component({
  selector: 'demo-root',
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  readonly headerLinks = SITE_HEADER_LINKS;
  readonly pageTitle = 'Open-source guardrails for Angular and .NET teams.';
  readonly packages = SITE_CURRENT_PACKAGES;
}
