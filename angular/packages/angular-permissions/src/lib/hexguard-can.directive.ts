import {
  Directive,
  effect,
  inject,
  Injector,
  input,
  TemplateRef,
  type OnInit,
  ViewContainerRef,
} from '@angular/core';

import { injectPermissions } from './permissions';
import type { PermissionKey, PermissionRequirement } from './types';

/** Structural directive that shows the primary template only when a requirement is allowed. */
@Directive({
  selector: '[hexguardCan]',
  standalone: true,
})
export class HexguardCanDirective<
  TCapability extends PermissionKey = string,
  TRole extends PermissionKey = string,
> implements OnInit {
  readonly requirement = input.required<PermissionRequirement<TCapability, TRole>>({
    alias: 'hexguardCan',
  });

  readonly elseTemplate = input<TemplateRef<unknown> | null>(null, {
    alias: 'hexguardCanElse',
  });

  private readonly permissions = injectPermissions<TCapability, TRole>();
  private readonly injector = inject(Injector);
  private readonly templateRef = inject(TemplateRef<unknown>);
  private readonly viewContainerRef = inject(ViewContainerRef);
  private currentView: 'main' | 'else' | 'none' = 'none';

  ngOnInit(): void {
    effect(
      () => {
        this.render(this.permissions.can(this.requirement()), this.elseTemplate());
      },
      { injector: this.injector },
    );
  }

  private render(allowed: boolean, elseTemplate: TemplateRef<unknown> | null): void {
    if (allowed) {
      if (this.currentView === 'main') {
        return;
      }

      this.viewContainerRef.clear();
      this.viewContainerRef.createEmbeddedView(this.templateRef);
      this.currentView = 'main';
      return;
    }

    if (elseTemplate != null) {
      if (this.currentView === 'else') {
        return;
      }

      this.viewContainerRef.clear();
      this.viewContainerRef.createEmbeddedView(elseTemplate);
      this.currentView = 'else';
      return;
    }

    if (this.currentView !== 'none') {
      this.viewContainerRef.clear();
      this.currentView = 'none';
    }
  }
}
