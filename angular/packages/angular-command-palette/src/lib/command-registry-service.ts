import { DestroyRef, Injectable, inject, signal } from '@angular/core';
import type { Command, CommandRegistryOptions } from './types';

function normalizeShortcut(shortcut: string): string {
  return shortcut
    .split('+')
    .map((part) => part.trim().toLowerCase())
    .sort()
    .join('+');
}

function eventToPattern(event: KeyboardEvent): string {
  const parts: string[] = [];
  if (event.ctrlKey || event.metaKey) parts.push('ctrl');
  if (event.altKey) parts.push('alt');
  if (event.shiftKey) parts.push('shift');
  parts.push(event.key.toLowerCase());
  return parts.sort().join('+');
}

/**
 * Singleton service managing the global command registry and keyboard shortcut
 * dispatch.
 *
 * All `injectCommandRegistry()` calls share the same command pool, shortcut
 * index, palette-open state, and global `keydown` listener.
 */
@Injectable({ providedIn: 'root' })
export class CommandRegistryService {
  readonly paletteOpen = signal(false);

  private readonly commands = new Map<string, Command>();
  private readonly shortcutIndex = new Map<string, string>();

  constructor() {
    const destroyRef = inject(DestroyRef);

    if (typeof document !== 'undefined') {
      document.addEventListener('keydown', this._onKeyDown);
      destroyRef.onDestroy(() => {
        document.removeEventListener('keydown', this._onKeyDown);
      });
    }
  }

  /** Initialize palette state from options (only takes effect on first call). */
  init(options?: CommandRegistryOptions): void {
    if (options?.initialOpen) {
      this.paletteOpen.set(true);
    }
  }

  register(...newCommands: Command[]): void {
    for (const cmd of newCommands) {
      this.commands.set(cmd.id, cmd);
      if (cmd.shortcut) {
        const normalized = normalizeShortcut(cmd.shortcut);
        this.shortcutIndex.set(normalized, cmd.id);
      }
    }
  }

  unregister(id: string): void {
    const cmd = this.commands.get(id);
    if (cmd?.shortcut) {
      const normalized = normalizeShortcut(cmd.shortcut);
      this.shortcutIndex.delete(normalized);
    }
    this.commands.delete(id);
  }

  getCommands(): Command[] {
    return Array.from(this.commands.values());
  }

  search(query: string): Command[] {
    if (!query.trim()) return this.getCommands();
    const q = query.toLowerCase();
    return this.getCommands().filter((cmd) => {
      if (cmd.title.toLowerCase().includes(q)) return true;
      if (cmd.category?.toLowerCase().includes(q)) return true;
      return false;
    });
  }

  handleShortcut(event: KeyboardEvent): boolean {
    const pattern = eventToPattern(event);
    const commandId = this.shortcutIndex.get(pattern);
    if (!commandId) return false;

    const cmd = this.commands.get(commandId);
    if (!cmd) return false;

    if (cmd.enabled && !cmd.enabled()) return false;

    event.preventDefault();
    cmd.invoke();
    return true;
  }

  openPalette(): void {
    this.paletteOpen.set(true);
  }

  closePalette(): void {
    this.paletteOpen.set(false);
  }

  togglePalette(): void {
    this.paletteOpen.update((v) => !v);
  }

  private _onKeyDown = (event: KeyboardEvent): void => {
    if (event.ctrlKey || event.altKey || event.metaKey) {
      this.handleShortcut(event);
      return;
    }

    if (
      event.target instanceof HTMLInputElement ||
      event.target instanceof HTMLTextAreaElement ||
      event.target instanceof HTMLSelectElement
    ) {
      return;
    }
    this.handleShortcut(event);
  };
}
