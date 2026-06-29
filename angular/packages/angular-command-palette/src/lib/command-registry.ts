import { DestroyRef, inject, signal } from '@angular/core';
import type { Command, CommandRegistryHandle, CommandRegistryOptions } from './types';

// Normalize a shortcut string like 'Ctrl+Shift+N' to a comparable key pattern
function normalizeShortcut(shortcut: string): string {
  return shortcut
    .split('+')
    .map((part) => part.trim().toLowerCase())
    .sort()
    .join('+');
}

// Build a comparable pattern from a KeyboardEvent
function eventToPattern(event: KeyboardEvent): string {
  const parts: string[] = [];
  if (event.ctrlKey || event.metaKey) parts.push('ctrl');
  if (event.altKey) parts.push('alt');
  if (event.shiftKey) parts.push('shift');
  parts.push(event.key.toLowerCase());
  return parts.sort().join('+');
}

export function injectCommandRegistry(options?: CommandRegistryOptions): CommandRegistryHandle {
  const destroyRef = inject(DestroyRef);
  const initialOpen = options?.initialOpen ?? false;
  const paletteOpen = signal(initialOpen);

  // Command storage: Map<id, Command>
  const commands = new Map<string, Command>();

  // Shortcut index: Map<normalizedShortcut, commandId>
  const shortcutIndex = new Map<string, string>();

  // Global keydown listener for shortcut handling
  function onKeyDown(event: KeyboardEvent): void {
    // Always process shortcuts that involve modifier keys (Ctrl, Alt, Meta),
    // even when the user is focused on an input — plain keystrokes pass
    // through so normal typing works in search fields.
    if (event.ctrlKey || event.altKey || event.metaKey) {
      handleShortcut(event);
      return;
    }

    // Ignore plain keystrokes when user is typing in a form control
    if (
      event.target instanceof HTMLInputElement ||
      event.target instanceof HTMLTextAreaElement ||
      event.target instanceof HTMLSelectElement
    ) {
      return;
    }
    handleShortcut(event);
  }

  if (typeof document !== 'undefined') {
    document.addEventListener('keydown', onKeyDown);
  }

  destroyRef.onDestroy(() => {
    if (typeof document !== 'undefined') {
      document.removeEventListener('keydown', onKeyDown);
    }
  });

  function register(...newCommands: Command[]): void {
    for (const cmd of newCommands) {
      commands.set(cmd.id, cmd);

      // Index shortcut if present
      if (cmd.shortcut) {
        const normalized = normalizeShortcut(cmd.shortcut);
        shortcutIndex.set(normalized, cmd.id);
      }
    }
  }

  function unregister(id: string): void {
    const cmd = commands.get(id);
    if (cmd?.shortcut) {
      const normalized = normalizeShortcut(cmd.shortcut);
      shortcutIndex.delete(normalized);
    }
    commands.delete(id);
  }

  function getCommands(): Command[] {
    return Array.from(commands.values());
  }

  function search(query: string): Command[] {
    if (!query.trim()) return getCommands();
    const q = query.toLowerCase();
    return getCommands().filter((cmd) => {
      if (cmd.title.toLowerCase().includes(q)) return true;
      if (cmd.category?.toLowerCase().includes(q)) return true;
      return false;
    });
  }

  function handleShortcut(event: KeyboardEvent): boolean {
    const pattern = eventToPattern(event);
    const commandId = shortcutIndex.get(pattern);
    if (!commandId) return false;

    const cmd = commands.get(commandId);
    if (!cmd) return false;

    // Check if command is enabled
    if (cmd.enabled && !cmd.enabled()) return false;

    event.preventDefault();
    cmd.invoke();
    return true;
  }

  function openPalette(): void {
    paletteOpen.set(true);
  }

  function closePalette(): void {
    paletteOpen.set(false);
  }

  function togglePalette(): void {
    paletteOpen.update((v) => !v);
  }

  return {
    paletteOpen: paletteOpen.asReadonly(),
    openPalette,
    closePalette,
    togglePalette,
    register,
    unregister,
    getCommands,
    search,
    handleShortcut,
  };
}
