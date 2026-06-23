import { Observable, Subject } from 'rxjs';
import { DEFAULT_MAX_FILE_SIZE, type FileHandle, type FileReadMode } from './types';

/**
 * Creates an observable-based file picker, allowing consumers to
 * pipe file selection events through RxJS operators.
 *
 * Opens a native file dialog on subscribe. Emits the selected files
 * as `FileHandle[]`. Validates type and size before reading.
 *
 * @param options.accept - Accepted file types (MIME or extension).
 * @param options.maxFileSize - Maximum file size in bytes.
 *   Default `10_485_760` (10 MB).
 * @param options.multiple - Allow multiple file selection.
 * @param options.readMode - How to read file contents: `'text'`,
 *   `'dataUrl'`, `'buffer'`, or `'none'`. Default `'text'`.
 * @returns A cold `Observable<readonly FileHandle[]>` — every
 *   subscriber triggers a new file dialog. Emits once on selection.
 *
 * @example
 * ```ts
 * import { fromFileSelection } from '@hexguard/angular-file-picker';
 *
 * fromFileSelection({ accept: 'image/*' })
 *   .subscribe(files => console.log('Selected:', files));
 * ```
 */
export function fromFileSelection(options?: {
  readonly accept?: string | readonly string[];
  readonly maxFileSize?: number;
  readonly multiple?: boolean;
  readonly readMode?: FileReadMode;
}): Observable<readonly FileHandle[]> {
  const {
    accept,
    maxFileSize = DEFAULT_MAX_FILE_SIZE,
    multiple = false,
    readMode = 'text',
  } = options ?? {};

  return new Observable<readonly FileHandle[]>((subscriber) => {
    const inputEl = document.createElement('input');
    inputEl.type = 'file';
    inputEl.style.display = 'none';
    if (accept && accept.length > 0) {
      inputEl.accept = Array.isArray(accept) ? accept.join(',') : (accept as string);
    }
    inputEl.multiple = multiple;

    inputEl.addEventListener('change', () => {
      const fileList = inputEl.files;
      if (fileList) {
        const files = Array.from(fileList);

        // Validate
        const acceptList = accept ? (Array.isArray(accept) ? accept : [accept]) : [];

        for (const file of files) {
          if (acceptList.length > 0) {
            const fileExt = '.' + file.name.split('.').pop()?.toLowerCase();
            const matches = acceptList.some((pattern) => {
              if (file.type && pattern === file.type) return true;
              if (pattern.endsWith('/*') && file.type.startsWith(pattern.slice(0, -1))) return true;
              if (pattern.startsWith('.') && fileExt === pattern.toLowerCase()) return true;
              return false;
            });
            if (!matches) {
              subscriber.error(new Error(`File type "${file.type || 'unknown'}" is not accepted.`));
              return;
            }
          }
          if (file.size > maxFileSize) {
            subscriber.error(new Error(`File "${file.name}" exceeds the maximum size.`));
            return;
          }
        }

        // Read files
        Promise.all(
          files.map(
            (file) =>
              new Promise<FileHandle>((resolve, reject) => {
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
                reader.onload = () =>
                  resolve({
                    ...metadata,
                    content: reader.result as string | ArrayBuffer | null,
                  });
                reader.onerror = () => reject(new Error(`Failed to read file "${file.name}".`));
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
              }),
          ),
        )
          .then((handles) => subscriber.next(handles))
          .catch((err) => subscriber.error(err));
      }
      inputEl.value = '';
    });

    document.body.appendChild(inputEl);
    inputEl.click();

    return () => {
      inputEl.remove();
    };
  });
}
