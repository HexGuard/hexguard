import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

import { injectPermissions } from '@hexguard/angular-permissions';

import { ANGULAR_PERMISSIONS_ROUTING_DEMO } from '../../../../../../demo-registry';
import { DemoInspectorPanelComponent } from '../../../../../../shared/components/demo-inspector-panel.component';
import { DemoNavigationStripComponent } from '../../../../../../shared/components/demo-navigation-strip.component';
import { DemoPageLayoutComponent } from '../../../../../../shared/components/demo-page-layout.component';
import { DemoStatusStripComponent } from '../../../../../../shared/components/demo-status-strip.component';
import { createTrackedCurrentUrl } from '../../../../../../shared/current-url.signal';
import { formatSnapshot } from '../../../../../../shared/formatting';
import {
  AUDIT_ROUTE_REQUIREMENT,
  FINANCE_ROUTE_REQUIREMENT,
  PERMISSION_DEMO_PERSONAS,
  PermissionsDemoSessionService,
} from '../../data/permissions-demo.data';

@Component({
  standalone: true,
  selector: 'demo-permission-routing-overview-panel',
  template: `
    <section data-testid="permissions-routing-overview-panel">
      <p class="demo-eyebrow">Overview</p>
      <h3>Route helpers stay thin and explicit.</h3>
      <p class="demo-card__summary">
        The finance child route uses <code>canActivatePermissions()</code> to block activation when
        the persona lacks <code>finance.approve</code>. The audit child route uses
        <code>canMatchPermissions()</code> so the route redirect happens before the child component
        ever renders.
      </p>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PermissionRoutingOverviewPanelComponent {}

@Component({
  standalone: true,
  selector: 'demo-permission-routing-finance-panel',
  template: `
    <section data-testid="permissions-routing-finance-panel">
      <p class="demo-eyebrow">Finance approvals</p>
      <h3>Finance approval queue unlocked.</h3>
      <p class="demo-card__summary">
        This child route only activates for personas that hold the <code>finance.approve</code>
        capability.
      </p>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PermissionRoutingFinancePanelComponent {}

@Component({
  standalone: true,
  selector: 'demo-permission-routing-audit-panel',
  template: `
    <section data-testid="permissions-routing-audit-panel">
      <p class="demo-eyebrow">Audit export</p>
      <h3>Audit review route matched.</h3>
      <p class="demo-card__summary">
        This child route only matches personas with the <code>auditor</code> or <code>admin</code>
        role.
      </p>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PermissionRoutingAuditPanelComponent {}

@Component({
  standalone: true,
  selector: 'demo-permission-routing-denied-panel',
  template: `
    <section data-testid="permissions-routing-denied-panel">
      <p class="demo-eyebrow">Denied route</p>
      <h3>Guard redirected the current persona here.</h3>
      <p class="demo-card__summary">
        The requested child route needs a capability or role that the current persona does not have,
        so the guard kept the route contract explicit instead of silently hiding state.
      </p>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PermissionRoutingDeniedPanelComponent {}

@Component({
  standalone: true,
  selector: 'demo-permission-routing-demo-page',
  imports: [
    DemoInspectorPanelComponent,
    DemoNavigationStripComponent,
    DemoPageLayoutComponent,
    DemoStatusStripComponent,
    FormsModule,
    RouterLink,
    RouterLinkActive,
    RouterOutlet,
  ],
  templateUrl: './permission-routing-demo-page.component.html',
  styleUrl: './permission-routing-demo-page.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PermissionRoutingDemoPageComponent {
  readonly demo = ANGULAR_PERMISSIONS_ROUTING_DEMO;
  readonly personas = PERMISSION_DEMO_PERSONAS;
  readonly session = inject(PermissionsDemoSessionService);
  readonly permissions = injectPermissions<string, string>();

  // demo-snippet:start permissions-routing-demo
  readonly canOpenFinance = this.permissions.canSignal(FINANCE_ROUTE_REQUIREMENT);
  readonly canOpenAudit = this.permissions.canSignal(AUDIT_ROUTE_REQUIREMENT);
  readonly currentUrl = createTrackedCurrentUrl(this.demo.route);
  readonly statusSummary = computed(() => {
    if (this.currentUrl().endsWith('/denied')) {
      return `${this.session.persona().label} was redirected because the requested child route is not allowed.`;
    }

    return `${this.session.persona().label} can ${this.canOpenFinance() ? 'activate finance' : 'not activate finance'} and ${this.canOpenAudit() ? 'match audit routes' : 'not match audit routes'}.`;
  });
  readonly snapshotJson = computed(() =>
    formatSnapshot({
      personaId: this.session.persona().id,
      roles: this.session.persona().roles,
      capabilities: this.session.persona().capabilities,
      currentUrl: this.currentUrl(),
      decisions: {
        financeRoute: this.canOpenFinance(),
        auditRoute: this.canOpenAudit(),
      },
    }),
  );
  // demo-snippet:end permissions-routing-demo

  updatePersona(id: string): void {
    this.session.setPersona(id);
  }
}
