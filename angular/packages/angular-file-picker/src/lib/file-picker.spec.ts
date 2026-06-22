import { TestBed } from '@angular/core/testing';
import { injectFilePicker } from './file-picker';

describe(injectFilePicker.name, () => {
  function createPicker(options?: Parameters<typeof injectFilePicker>[0]) {
    return TestBed.runInInjectionContext(() => injectFilePicker(options));
  }

  /** Helper: create a mock DragEvent with the given File objects. */
  function mockDropEvent(...files: File[]): DragEvent {
    return {
      preventDefault: vi.fn(),
      dataTransfer: {
        files: files as unknown as FileList,
      },
    } as unknown as DragEvent;
  }

  it('starts with no files, not loading, no error', () => {
    const picker = createPicker();
    expect(picker.files().length).toBe(0);
    expect(picker.loading()).toBe(false);
    expect(picker.error()).toBeNull();
  });

  it('clear() resets files and error after open', () => {
    const picker = createPicker();
    picker.open(); // triggers input creation
    expect(picker.files().length).toBe(0);
    picker.clear();
    expect(picker.files().length).toBe(0);
    expect(picker.error()).toBeNull();
  });

  it('validates file type against accept filter', async () => {
    const picker = createPicker({ accept: '.pdf', readMode: 'none' });
    const mockFile = new File(['content'], 'test.txt', { type: 'text/plain' });
    picker.acceptDrop(mockDropEvent(mockFile));
    await Promise.resolve();

    expect(picker.files().length).toBe(0);
    expect(picker.error()).toBeTruthy();
    expect(picker.error()!.toLowerCase()).toContain('not accepted');
  });

  it('validates file size against maxFileSize', async () => {
    const picker = createPicker({ maxFileSize: 5, readMode: 'none' });
    const bigContent = new Uint8Array(100).fill(65);
    const mockFile = new File([bigContent], 'big.txt', { type: 'text/plain' });
    picker.acceptDrop(mockDropEvent(mockFile));
    await Promise.resolve();

    expect(picker.files().length).toBe(0);
    expect(picker.error()).toBeTruthy();
    expect(picker.error()!.toLowerCase()).toContain('exceeds');
  });

  it('accepts multiple files that pass validation', async () => {
    const picker = createPicker({ accept: '.txt', multiple: true, readMode: 'none' });
    const f1 = new File(['a'], 'a.txt', { type: 'text/plain' });
    const f2 = new File(['b'], 'b.txt', { type: 'text/plain' });
    picker.acceptDrop(mockDropEvent(f1, f2));
    await vi.waitFor(() => {
      expect(picker.files().length).toBe(2);
    });
    expect(picker.error()).toBeNull();
    expect(picker.files()[0].name).toBe('a.txt');
    expect(picker.files()[1].name).toBe('b.txt');
  });

  it('reads text content with readMode text', async () => {
    const picker = createPicker({ readMode: 'text' });
    const mockFile = new File(['Hello World'], 'greeting.txt', { type: 'text/plain' });
    picker.acceptDrop(mockDropEvent(mockFile));
    await vi.waitFor(() => {
      expect(picker.files().length).toBe(1);
    });
    expect(picker.files()[0].content).toBe('Hello World');
  });

  it('reads data URL with readMode dataUrl', async () => {
    const picker = createPicker({ readMode: 'dataUrl' });
    const mockFile = new File(['data'], 'd.txt', { type: 'text/plain' });
    picker.acceptDrop(mockDropEvent(mockFile));
    await vi.waitFor(() => {
      expect(picker.files().length).toBe(1);
    });
    expect(picker.files()[0].content).toContain('data:text/plain;base64,');
  });

  it('sets loading during read and clears after', async () => {
    const picker = createPicker({ readMode: 'text' });
    const mockFile = new File(['test'], 'test.txt', { type: 'text/plain' });
    picker.acceptDrop(mockDropEvent(mockFile));

    expect(picker.loading()).toBe(true);
    await vi.waitFor(() => {
      expect(picker.files().length).toBe(1);
    });
    expect(picker.loading()).toBe(false);
  });

  it('handles readMode none (metadata only)', async () => {
    const picker = createPicker({ readMode: 'none' });
    const mockFile = new File(['content'], 'meta.txt', { type: 'text/plain' });
    picker.acceptDrop(mockDropEvent(mockFile));
    await vi.waitFor(() => {
      expect(picker.files().length).toBe(1);
    });
    expect(picker.files()[0].name).toBe('meta.txt');
    expect(picker.files()[0].content).toBeNull();
  });
});
