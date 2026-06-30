import { inject } from '@angular/core';
import type { CommandRegistryHandle, CommandRegistryOptions } from './types';
import { CommandRegistryService } from './command-registry-service';

export function injectCommandRegistry(options?: CommandRegistryOptions): CommandRegistryHandle {
  const service = inject(CommandRegistryService);
  service.init(options);

  return {
    paletteOpen: service.paletteOpen.asReadonly(),
    openPalette: () => service.openPalette(),
    closePalette: () => service.closePalette(),
    togglePalette: () => service.togglePalette(),
    register: (...cmds) => service.register(...cmds),
    unregister: (id) => service.unregister(id),
    getCommands: () => service.getCommands(),
    search: (q) => service.search(q),
    handleShortcut: (e) => service.handleShortcut(e),
  };
}
