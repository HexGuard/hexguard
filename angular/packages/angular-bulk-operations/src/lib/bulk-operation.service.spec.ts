import type { BulkOperationResponse, BulkOperationResult } from './types';

describe('BulkOperationService', () => {
  // We test the service logic by constructing it directly (no DI needed).

  async function createService(
    mockResponse: BulkOperationResponse<string, void>,
    shouldThrow = false,
  ) {
    const { BulkOperationService } = await import('./bulk-operation.service');
    return new BulkOperationService<string, void>({
      executeFn: async () => {
        if (shouldThrow) throw new Error('Network error');
        return mockResponse;
      },
    });
  }

  it('starts with idle state', async () => {
    const { BulkOperationService } = await import('./bulk-operation.service');
    const service = new BulkOperationService<string, void>({
      executeFn: async () => ({
        status: 'completed',
        totalCount: 0,
        successCount: 0,
        failureCount: 0,
        results: [],
      }),
    });

    expect(service.inProgress()).toBe(false);
    expect(service.results()).toEqual([]);
    expect(service.summary()).toBeNull();
    expect(service.error()).toBeNull();
  });

  it('executes and updates results on all-success', async () => {
    const mockResponse: BulkOperationResponse<string, void> = {
      status: 'completed',
      totalCount: 2,
      successCount: 2,
      failureCount: 0,
      results: [
        { item: 'a', succeeded: true },
        { item: 'b', succeeded: true },
      ],
    };

    const service = await createService(mockResponse);
    const result = await service.execute({ items: ['a', 'b'] });

    expect(result.status).toBe('completed');
    expect(service.results().length).toBe(2);
    expect(service.summary()?.succeeded).toBe(2);
    expect(service.summary()?.failed).toBe(0);
    expect(service.inProgress()).toBe(false);
  });

  it('executes and updates results on partial-failure', async () => {
    const mockResponse: BulkOperationResponse<string, void> = {
      status: 'partialFailure',
      totalCount: 2,
      successCount: 1,
      failureCount: 1,
      results: [
        { item: 'a', succeeded: true },
        { item: 'b', succeeded: false, error: { code: 'ERR', message: 'Failed' } },
      ],
    };

    const service = await createService(mockResponse);
    await service.execute({ items: ['a', 'b'] });

    expect(service.summary()?.succeeded).toBe(1);
    expect(service.summary()?.failed).toBe(1);
    expect(service.results()[1].error?.code).toBe('ERR');
  });

  it('executes and updates results on all-failure', async () => {
    const mockResponse: BulkOperationResponse<string, void> = {
      status: 'failed',
      totalCount: 2,
      successCount: 0,
      failureCount: 2,
      results: [
        { item: 'a', succeeded: false, error: { code: 'ERR', message: 'Failed A' } },
        { item: 'b', succeeded: false, error: { code: 'ERR', message: 'Failed B' } },
      ],
    };

    const service = await createService(mockResponse);
    await service.execute({ items: ['a', 'b'] });

    expect(service.summary()?.failed).toBe(2);
    expect(service.summary()?.succeeded).toBe(0);
  });

  it('deduplicates concurrent execute calls', async () => {
    let callCount = 0;
    const { BulkOperationService } = await import('./bulk-operation.service');
    const service = new BulkOperationService<string, void>({
      executeFn: async () => {
        callCount++;
        // Simulate async work
        await new Promise((r) => setTimeout(r, 10));
        return {
          status: 'completed',
          totalCount: 1,
          successCount: 1,
          failureCount: 0,
          results: [{ item: 'a', succeeded: true }],
        };
      },
    });

    // Fire two concurrent execute calls
    const [r1, r2] = await Promise.all([
      service.execute({ items: ['a'] }),
      service.execute({ items: ['b'] }),
    ]);

    // The second call should have been deduplicated
    expect(callCount).toBe(1);
    expect(r1.results[0].item).toBe('a');
    expect(r2.results[0].item).toBe('a');
    expect(service.inProgress()).toBe(false);
  });

  it('handles execution error', async () => {
    const service = await createService(
      { status: 'completed', totalCount: 0, successCount: 0, failureCount: 0, results: [] },
      true,
    );

    await expect(service.execute({ items: ['a'] })).rejects.toThrow('Network error');
    expect(service.error()).toBe('Network error');
    expect(service.inProgress()).toBe(false);
    expect(service.results()).toEqual([]);
  });

  it('clears results', async () => {
    const mockResponse: BulkOperationResponse<string, void> = {
      status: 'completed',
      totalCount: 1,
      successCount: 1,
      failureCount: 0,
      results: [{ item: 'a', succeeded: true }],
    };

    const service = await createService(mockResponse);
    await service.execute({ items: ['a'] });
    expect(service.results().length).toBe(1);

    service.clearResults();
    expect(service.results()).toEqual([]);
    expect(service.summary()).toBeNull();
  });

  it('retryFailed returns null when no failures', async () => {
    const mockResponse: BulkOperationResponse<string, void> = {
      status: 'completed',
      totalCount: 1,
      successCount: 1,
      failureCount: 0,
      results: [{ item: 'a', succeeded: true }],
    };

    const service = await createService(mockResponse);
    await service.execute({ items: ['a'] });

    const retryResult = await service.retryFailed((failed) => ({
      items: failed.map((r) => r.item),
    }));
    expect(retryResult).toBeNull();
  });

  it('retryFailed executes with only failed items', async () => {
    let retryRequestItems: string[] | null = null;

    const { BulkOperationService } = await import('./bulk-operation.service');
    const service = new BulkOperationService<string, void>({
      executeFn: async (request) => {
        retryRequestItems = [...request.items];
        return {
          status: 'completed',
          totalCount: request.items.length,
          successCount: request.items.length,
          failureCount: 0,
          results: request.items.map((item) => ({ item, succeeded: true })),
        };
      },
    });

    const firstResponse: BulkOperationResponse<string, void> = {
      status: 'partialFailure',
      totalCount: 2,
      successCount: 1,
      failureCount: 1,
      results: [
        { item: 'a', succeeded: true },
        { item: 'b', succeeded: false, error: { code: 'ERR', message: 'Failed' } },
      ],
    };

    // Set initial results directly
    (service as any)._results.set(firstResponse.results);

    await service.retryFailed((failed) => ({
      items: failed.map((r) => r.item),
    }));

    expect(retryRequestItems).toEqual(['b']);
  });
});
