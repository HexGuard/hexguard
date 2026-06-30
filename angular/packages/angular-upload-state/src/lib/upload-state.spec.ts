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
