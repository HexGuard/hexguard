import type { Signal } from '@angular/core';

export interface Command {
  /** Unique command identifier. */
  readonly id: string;
  /** Display title. */
  readonly title: string;
  /** Optional keyboard shortcut (e.g. 'Ctrl+Shift+N'). */
  readonly shortcut?: string;
  /** Optional category for grouping. */
  readonly category?: string;
  /** Optional icon identifier. */
  readonly icon?: string;
  /** Signal controlling whether the command is enabled. */
  readonly enabled?: Signal<boolean>;
  /** Callback invoked when the command is executed. */
  readonly invoke: () => void;
}

export interface CommandRegistryOptions {
  /** Whether palette state is initially open — default false. */
  readonly initialOpen?: boolean;
}

export interface CommandRegistryHandle {
  /** Signal indicating whether the command palette is open. */
  readonly paletteOpen: Signal<boolean>;

  /** Open the command palette. */
  openPalette(): void;

  /** Close the command palette. */
  closePalette(): void;

  /** Toggle the command palette open/closed. */
  togglePalette(): void;

  /** Register one or more commands. */
  register(...commands: Command[]): void;

  /** Unregister a command by ID. */
  unregister(id: string): void;

  /** Get all currently registered commands. */
  getCommands(): Command[];

  /** Search commands by query string (matches title and category). */
  search(query: string): Command[];

  /**
   * Handle a keyboard event — returns true if a shortcut was matched
   * and the corresponding command was invoked.
   */
  handleShortcut(event: KeyboardEvent): boolean;
}
