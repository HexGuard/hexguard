import { Injectable } from '@angular/core';
import type { FileHandle, FileReadMode } from './types';

/**
 * Singleton service providing the core file-picker validation and reading logic.
 *
 * Each `injectFilePicker()` call creates its own state (files, loading, error,
 * DOM input element) but delegates type/size validation and content reading
 * to this service for centralized error handling and testability.
 */
@Injectable({ providedIn: 'root' })
export class FilePickerService {
  /**
   * Validates a file against the given accept filter and max size.
   *
   * @param file - The file to validate.
   * @param accept - Accepted MIME types or extensions.
   * @param maxFileSize - Maximum file size in bytes.
   * @returns An error message if invalid, or `null` if valid.
   */
  validateFile(
    file: File,
    accept: string | readonly string[] | undefined,
    maxFileSize: number,
  ): string | null {
    // Validate accept filter
    if (accept && accept.length > 0) {
      const acceptList = Array.isArray(accept) ? accept : [accept];
      const fileExt = '.' + file.name.split('.').pop()?.toLowerCase();
      const matches = acceptList.some((pattern) => {
        if (file.type && pattern === file.type) return true;
        if (pattern.endsWith('/*') && file.type.startsWith(pattern.slice(0, -1))) return true;
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

  /**
   * Reads a file's content according to the given read mode.
   *
   * @param file - The file to read.
   * @param readMode - The mode to use for reading.
   * @returns A promise resolving to a `FileHandle` with the file's content.
   */
  readFile(file: File, readMode: FileReadMode): Promise<FileHandle> {
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
}
