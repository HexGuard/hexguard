import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { injectCommandRegistry } from '@hexguard/angular-command-palette';
import type { Command } from '@hexguard/angular-command-palette';
import { ANGULAR_COMMAND_PALETTE_DEMO } from '../../../../../../demo-registry';
import { DemoInspectorPanelComponent } from '../../../../../../shared/components/demo-inspector-panel.component';
import { DemoNavigationStripComponent } from '../../../../../../shared/components/demo-navigation-strip.component';
import { DemoPageLayoutComponent } from '../../../../../../shared/components/demo-page-layout.component';
import { DemoStatusStripComponent } from '../../../../../../shared/components/demo-status-strip.component';
import { formatSnapshot } from '../../../../../../shared/formatting';

@Component({
  standalone: true,
  selector: 'demo-command-palette-demo-page',
  templateUrl: './command-palette-demo-page.component.html',
  styleUrl: './command-palette-demo-page.component.css',
  imports: [
    DemoInspectorPanelComponent,
    DemoNavigationStripComponent,
    DemoPageLayoutComponent,
    DemoStatusStripComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommandPaletteDemoPageComponent {
  protected readonly demo = ANGULAR_COMMAND_PALETTE_DEMO;
  protected readonly registry = injectCommandRegistry();
  protected readonly query = signal('');
  protected readonly lastInvoked = signal('');

  constructor() {
    this.registry.register(
      {
        id: 'order.create',
        title: 'Create Order',
        shortcut: 'Ctrl+Shift+N',
        category: 'Orders',
        invoke: () => this.lastInvoked.set('Create Order'),
      },
      {
        id: 'order.list',
        title: 'List Orders',
        shortcut: 'Ctrl+Shift+L',
        category: 'Orders',
        invoke: () => this.lastInvoked.set('List Orders'),
      },
      {
        id: 'user.create',
        title: 'Create User',
        shortcut: 'Ctrl+Shift+U',
        category: 'Users',
        invoke: () => this.lastInvoked.set('Create User'),
      },
      {
        id: 'dashboard',
        title: 'Go to Dashboard',
        shortcut: 'Ctrl+D',
        category: 'Navigation',
        invoke: () => this.lastInvoked.set('Go to Dashboard'),
      },
    );
  }

  protected get filteredCommands(): Command[] {
    return this.registry.search(this.query());
  }

  protected invokeCommand(cmd: Command): void {
    cmd.invoke();
  }

  protected readonly snapshotJson = computed(() =>
    formatSnapshot({
      paletteOpen: this.registry.paletteOpen(),
      registeredCommands: this.registry.getCommands().length,
      lastInvoked: this.lastInvoked(),
    }),
  );
}
