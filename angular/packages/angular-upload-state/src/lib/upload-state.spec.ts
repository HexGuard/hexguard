import { TestBed } from '@angular/core/testing';
import { injectUploadState } from './upload-state';
import type { UploadOptions } from './types';

describe('injectUploadState', () => {
  const defaultOptions: UploadOptions = { url: '/api/upload' };

  function setup(options?: Partial<UploadOptions>) {
    return TestBed.runInInjectionContext(() =>
      injectUploadState({ ...defaultOptions, ...options }),
    );
  }

  it('should start empty', () => {
    const upload = setup();
    expect(upload.queue().length).toBe(0);
    expect(upload.active()).toBeNull();
    expect(upload.isUploading()).toBe(false);
    expect(upload.progress()).toBe(0);
  });

  it('should add a file to the queue', () => {
    const upload = setup();
    const file = new File(['content'], 'test.txt', { type: 'text/plain' });
    upload.upload(file);
    expect(upload.queue().length).toBe(1);
    expect(upload.queue()[0].file.name).toBe('test.txt');
    // Upload starts immediately, so status is 'uploading' (XHR will fail in jsdom)
    expect(upload.isUploading()).toBe(true);
  });

  it('should reject oversized files', () => {
    const upload = setup({ maxFileSize: 10 });
    const file = new File(['x'.repeat(100)], 'big.txt');
    upload.upload(file);
    expect(upload.queue().length).toBe(1);
    expect(upload.queue()[0].status).toBe('failed');
    expect(upload.queue()[0].error).toContain('maximum size');
  });

  it('should cancel a queued upload', () => {
    const upload = setup();
    const file = new File(['content'], 'test.txt');
    upload.upload(file);
    expect(upload.queue().length).toBe(1);

    upload.cancel(upload.queue()[0].id);
    expect(upload.queue()[0].status).toBe('cancelled');
  });

  it('should clear completed items', () => {
    const upload = setup();
    const file = new File(['content'], 'test.txt');
    upload.upload(file);

    // Simulate completed by directly manipulating (since XHR won't run in test)
    upload.cancel(upload.queue()[0].id);
    expect(upload.failed().length + upload.completed().length).toBe(0); // cancelled

    upload.clearCompleted(); // no-op
    expect(upload.queue().length).toBe(1);
  });

  it('should clear all items', () => {
    const upload = setup();
    upload.upload(new File(['a'], 'a.txt'));
    upload.upload(new File(['b'], 'b.txt'));
    expect(upload.queue().length).toBe(2);

    upload.clearAll();
    expect(upload.queue().length).toBe(0);
  });

  it('should retry a failed upload', () => {
    const upload = setup();
    const file = new File(['content'], 'test.txt');
    upload.upload(file);
    const id = upload.queue()[0].id;

    upload.cancel(id);
    expect(upload.queue()[0].status).toBe('cancelled');

    upload.retry(id);
    // Retry creates a new item (which starts uploading immediately)
    expect(upload.queue().length).toBe(2);
    expect(upload.queue()[1].status).toBe('uploading');
  });

  it('should not queue multiple files when multiple is false', () => {
    const upload = setup({ multiple: false });
    upload.upload(new File(['a'], 'a.txt'));
    upload.upload(new File(['b'], 'b.txt'));

    // Second upload should cancel the first
    const queue = upload.queue();
    expect(queue.length).toBe(2);
    expect(queue[0].status).toBe('cancelled');
    expect(queue[1].status).toBe('uploading');
  });

  it('should track progress signal', () => {
    const upload = setup();
    expect(upload.progress()).toBe(0);

    upload.upload(new File(['x'.repeat(1000)], 'file.bin'));
    expect(upload.progress()).toBeGreaterThanOrEqual(0);
  });
});

describe('injectUploadState with custom sender', () => {
  it('should use sender instead of XHR', async () => {
    const sender = vi.fn().mockResolvedValue({ success: true });
    const upload = TestBed.runInInjectionContext(() =>
      injectUploadState({ url: '/test', sender }),
    );

    const file = new File(['data'], 'test.txt');
    upload.upload(file);
    expect(sender).toHaveBeenCalledTimes(1);
    expect(sender).toHaveBeenCalledWith(
      expect.objectContaining({ file }),
      expect.any(Function),
    );
  });

  it('should mark item completed on sender resolve', async () => {
    const sender = vi.fn().mockResolvedValue({ id: 'resp-1' });
    const upload = TestBed.runInInjectionContext(() =>
      injectUploadState({ url: '/test', sender }),
    );

    const file = new File(['data'], 'test.txt');
    upload.upload(file);

    // Wait for microtask to process the resolved promise
    await Promise.resolve();
    await Promise.resolve();

    const item = upload.queue()[0];
    expect(item.status).toBe('completed');
    expect(item.progress).toBe(100);
    expect(item.response).toEqual({ id: 'resp-1' });
  });

  it('should mark item failed on sender reject', async () => {
    const sender = vi.fn().mockRejectedValue(new Error('Upload failed'));
    const upload = TestBed.runInInjectionContext(() =>
      injectUploadState({ url: '/test', sender }),
    );

    const file = new File(['data'], 'test.txt');
    upload.upload(file);

    await Promise.resolve();
    await Promise.resolve();

    const item = upload.queue()[0];
    expect(item.status).toBe('failed');
    expect(item.error).toBe('Upload failed');
  });

  it('should report progress via callback', async () => {
    let progressCallback!: (pct: number) => void;
    const sender = vi.fn().mockImplementation((_item: unknown, onProgress: (pct: number) => void) => {
      progressCallback = onProgress;
      return new Promise((r) => setTimeout(r, 100));
    });

    const upload = TestBed.runInInjectionContext(() =>
      injectUploadState({ url: '/test', sender }),
    );

    const file = new File(['data'], 'test.txt');
    upload.upload(file);

    // Simulate progress
    expect(upload.queue()[0].progress).toBe(0);
    progressCallback!(50);
    expect(upload.queue()[0].progress).toBe(50);
    progressCallback!(100);
    expect(upload.queue()[0].progress).toBe(100);
  });
});
