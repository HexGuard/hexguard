import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { HexguardCanDirective, injectPermissions } from '@hexguard/angular-permissions';

import { ANGULAR_PERMISSIONS_ACTIONS_DEMO } from '../../../../../../demo-registry';
import { DemoInspectorPanelComponent } from '../../../../../../shared/components/demo-inspector-panel.component';
import { DemoNavigationStripComponent } from '../../../../../../shared/components/demo-navigation-strip.component';
import { DemoPageLayoutComponent } from '../../../../../../shared/components/demo-page-layout.component';
import { DemoStatusStripComponent } from '../../../../../../shared/components/demo-status-strip.component';
import { createTrackedCurrentUrl } from '../../../../../../shared/current-url.signal';
import { formatSnapshot } from '../../../../../../shared/formatting';
import {
  ADMIN_OVERRIDE_REQUIREMENT,
  APPROVE_ORDERS_REQUIREMENT,
  AUDIT_PANEL_REQUIREMENT,
  PERMISSION_DEMO_PERSONAS,
  PermissionsDemoSessionService,
  REFUND_ORDERS_REQUIREMENT,
} from '../../data/permissions-demo.data';

@Component({
  standalone: true,
  selector: 'demo-permission-actions-demo-page',
  imports: [
    DemoInspectorPanelComponent,
    DemoNavigationStripComponent,
    DemoPageLayoutComponent,
    DemoStatusStripComponent,
    FormsModule,
    HexguardCanDirective,
  ],
  templateUrl: './permission-actions-demo-page.component.html',
  styleUrl: './permission-actions-demo-page.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PermissionActionsDemoPageComponent {
  readonly demo = ANGULAR_PERMISSIONS_ACTIONS_DEMO;
  readonly personas = PERMISSION_DEMO_PERSONAS;
  readonly session = inject(PermissionsDemoSessionService);
  readonly permissions = injectPermissions<string, string>();
  readonly auditPanelRequirement = AUDIT_PANEL_REQUIREMENT;
  readonly adminOverrideRequirement = ADMIN_OVERRIDE_REQUIREMENT;

  // demo-snippet:start permissions-actions-demo
  readonly canApproveOrders = this.permissions.canSignal(APPROVE_ORDERS_REQUIREMENT);
  readonly canRefundOrders = this.permissions.canSignal(REFUND_ORDERS_REQUIREMENT);
  readonly canOpenAuditPanel = this.permissions.canSignal(AUDIT_PANEL_REQUIREMENT);
  readonly canUseAdminOverride = this.permissions.canSignal(ADMIN_OVERRIDE_REQUIREMENT);
  readonly currentUrl = createTrackedCurrentUrl(this.demo.route);
  readonly statusSummary = computed(() => {
    const enabledActions = [
      this.canApproveOrders() ? 'approve orders' : null,
      this.canRefundOrders() ? 'issue refunds' : null,
      this.canOpenAuditPanel() ? 'inspect audit notes' : null,
      this.canUseAdminOverride() ? 'use admin overrides' : null,
    ].filter((value): value is string => value != null);

    if (enabledActions.length === 0) {
      return `${this.session.persona().label} only has read access.`;
    }

    return `${this.session.persona().label} can ${enabledActions.join(', ')}.`;
  });
  readonly snapshotJson = computed(() =>
    formatSnapshot({
      personaId: this.session.persona().id,
      roles: this.session.persona().roles,
      capabilities: this.session.persona().capabilities,
      decisions: {
        approveOrders: this.canApproveOrders(),
        refundOrders: this.canRefundOrders(),
        auditPanel: this.canOpenAuditPanel(),
        adminOverride: this.canUseAdminOverride(),
      },
    }),
  );
  // demo-snippet:end permissions-actions-demo

  updatePersona(id: string): void {
    this.session.setPersona(id);
  }
}
