import { DestroyRef, inject, signal } from '@angular/core';
import type { FileHandle, FilePickerHandle, FilePickerOptions, FileReadMode } from './types';
import { DEFAULT_MAX_FILE_SIZE } from './types';
import { FilePickerService } from './file-picker-service';

/**
 * Creates a headless file picker with signal-based state.
 *
 * Provides programmatic file selection, client-side type/size validation,
 * content reading (text, data URL, ArrayBuffer), and drag-and-drop support.
 *
 * @example
 * ```typescript
 * const picker = injectFilePicker({ accept: 'image/*', multiple: true });
 *
 * // Trigger file dialog
 * picker.open();
 *
 * // In template:
 * // @for (f of picker.files(); track f.name) {
 * //   <img [src]="f.content" />
 * // }
 * ```
 *
 * @example
 * ```typescript
 * // Drag-and-drop zone
 * <div (dragover)="$event.preventDefault()" (drop)="picker.acceptDrop($event)">
 *   Drop files here
 * </div>
 * ```
 */
export function injectFilePicker(options?: FilePickerOptions): FilePickerHandle {
  const service = inject(FilePickerService);
  const {
    accept,
    maxFileSize = DEFAULT_MAX_FILE_SIZE,
    multiple = false,
    readMode: initialReadMode = 'text',
  } = options ?? {};

  const files = signal<readonly FileHandle[]>([], { equal: (a, b) => a === b });
  const loading = signal(false);
  const error = signal<string | null>(null);
  const readMode = signal<FileReadMode>(initialReadMode);

  const destroyRef = inject(DestroyRef);
  let inputEl: HTMLInputElement | null = null;

  function createInput(): HTMLInputElement {
    const el = document.createElement('input');
    el.type = 'file';
    el.style.display = 'none';
    if (accept && accept.length > 0) {
      el.accept = Array.isArray(accept) ? accept.join(',') : (accept as string);
    }
    el.multiple = multiple;
    el.addEventListener('change', () => {
      const fileList = el.files;
      if (fileList) {
        void processFiles(Array.from(fileList));
      }
      el.value = '';
    });
    document.body.appendChild(el);
    destroyRef.onDestroy(() => {
      el.remove();
    });
    return el;
  }

  async function processFiles(fileList: File[]): Promise<void> {
    loading.set(true);
    error.set(null);

    try {
      // Validate each file
      for (const f of fileList) {
        const validationError = service.validateFile(f, accept, maxFileSize);
        if (validationError) {
          error.set(validationError);
          loading.set(false);
          return;
        }
      }

      // Read all files
      const results = await Promise.all(fileList.map((f) => service.readFile(f, readMode())));
      files.set(results);
    } catch (err) {
      error.set(err instanceof Error ? err.message : String(err));
    } finally {
      loading.set(false);
    }
  }

  return {
    files: files.asReadonly(),
    loading: loading.asReadonly(),
    error: error.asReadonly(),
    readMode: readMode as unknown as FilePickerHandle['readMode'],
    open() {
      if (!inputEl) {
        inputEl = createInput();
      }
      inputEl.click();
    },
    clear() {
      files.set([]);
      error.set(null);
    },
    acceptDrop(event: DragEvent) {
      event.preventDefault();
      // Try files first, then items (some browsers populate one vs the other)
      let files: File[] | undefined;
      const dt = event.dataTransfer;
      if (dt?.files && dt.files.length > 0) {
        files = Array.from(dt.files);
      } else if (dt?.items && dt.items.length > 0) {
        files = Array.from(dt.items)
          .filter((item) => item.kind === 'file')
          .map((item) => item.getAsFile())
          .filter((f): f is File => f !== null);
      }
      if (files && files.length > 0) {
        void processFiles(files);
      }
    },
  };
}
