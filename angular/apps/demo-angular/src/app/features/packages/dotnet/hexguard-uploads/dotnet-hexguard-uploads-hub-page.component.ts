import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { DotnetPackageHubPageComponent } from '../../../../shared/components/dotnet-package-hub-page/dotnet-package-hub-page.component';
import { getDotnetSitePackage } from '../../../../site-catalog';

@Component({
  standalone: true,
  selector: 'demo-dotnet-hexguard-uploads-hub-page',
  imports: [DotnetPackageHubPageComponent, RouterLink],
  template: `
    <demo-dotnet-package-hub-page
      [entry]="packageEntry"
      overviewTestId="dotnet-pkg-hexguard-uploads"
      demoTestIdPrefix="dotnet-demo-"
    />

    <article class="demo-card demo-card--stack ecosystem-link-card">
      <p class="demo-eyebrow">Cross-stack pairing</p>
      <h3>Angular + .NET Upload State</h3>
      <p class="demo-card__summary">
        <code>HexGuard.Uploads</code> provides the server-side <code>UploadSession</code> model,
        <code>IUploadStore</code> abstraction, and Minimal API endpoints for file upload lifecycle
        (create, poll, cancel). <code>&#64;hexguard/angular-upload-state</code> provides the
        client-side signal-based upload queue with progress, cancel, and retry. Together they
        deliver end-to-end file upload management across the stack.
      </p>
      <a
        class="site-cta"
        routerLink="/packages/angular-upload-state"
        data-testid="ecosystem-link-angular-upload-state"
      >
        View Angular Upload State Demo &rarr;
      </a>
    </article>
  `,
  styles: [
    `
      .ecosystem-link-card {
        display: grid;
        gap: 0.5rem;
        background: rgba(248, 252, 251, 0.7);
        border-color: rgba(13, 73, 82, 0.12);
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DotnetUploadsHubPageComponent {
  readonly packageEntry = getDotnetSitePackage('hexguard-uploads');
}
