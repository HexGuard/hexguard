import { DestroyRef, inject, signal } from '@angular/core';
import type { FileHandle, FilePickerHandle, FilePickerOptions, FileReadMode } from './types';
import { DEFAULT_MAX_FILE_SIZE } from './types';

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
  const {
    accept,
    maxFileSize = DEFAULT_MAX_FILE_SIZE,
    multiple = false,
    readMode = 'text',
  } = options ?? {};

  const files = signal<readonly FileHandle[]>([], { equal: (a, b) => a === b });
  const loading = signal(false);
  const error = signal<string | null>(null);

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

  function validateFile(file: File): string | null {
    // Validate accept filter
    if (accept && accept.length > 0) {
      const acceptList = Array.isArray(accept) ? accept : [accept];
      const fileExt = '.' + file.name.split('.').pop()?.toLowerCase();
      const matches = acceptList.some((pattern) => {
        // Check exact MIME match
        if (file.type && pattern === file.type) return true;
        // Check wildcard MIME type: image/*
        if (pattern.endsWith('/*') && file.type.startsWith(pattern.slice(0, -1))) return true;
        // Check file extension: .pdf
        if (pattern.startsWith('.') && fileExt === pattern.toLowerCase()) return true;
        return false;
      });
      if (!matches) {
        return `File type "${file.type || 'unknown'}" is not accepted. Accepted: ${acceptList.join(', ')}`;
      }
    }

    // Validate file size
    if (file.size > maxFileSize) {
      const mb = (maxFileSize / (1024 * 1024)).toFixed(1);
      return `File "${file.name}" exceeds the maximum size of ${mb} MB.`;
    }

    return null;
  }

  function readFile(file: File): Promise<FileHandle> {
    return new Promise((resolve, reject) => {
      const metadata: Omit<FileHandle, 'content'> = {
        name: file.name,
        size: file.size,
        type: file.type,
      };

      if (readMode === 'none') {
        resolve({ ...metadata, content: null });
        return;
      }

      const reader = new FileReader();

      reader.onload = () => {
        resolve({ ...metadata, content: reader.result as string | ArrayBuffer | null });
      };

      reader.onerror = () => {
        reject(
          new Error(
            `Failed to read file "${file.name}": ${reader.error?.message ?? 'Unknown error'}`,
          ),
        );
      };

      switch (readMode) {
        case 'text':
          reader.readAsText(file);
          break;
        case 'dataUrl':
          reader.readAsDataURL(file);
          break;
        case 'buffer':
          reader.readAsArrayBuffer(file);
          break;
      }
    });
  }

  async function processFiles(fileList: File[]): Promise<void> {
    loading.set(true);
    error.set(null);

    try {
      // Validate each file
      for (const f of fileList) {
        const validationError = validateFile(f);
        if (validationError) {
          error.set(validationError);
          loading.set(false);
          return;
        }
      }

      // Read all files
      const results = await Promise.all(fileList.map((f) => readFile(f)));
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
