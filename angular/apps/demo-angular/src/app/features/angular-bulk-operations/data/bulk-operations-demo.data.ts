import type {
  BulkOperationRequest,
  BulkOperationResponse,
} from '@hexguard/angular-bulk-operations';

/** A mock order item for the bulk operations demo. */
export interface OrderItem {
  readonly id: string;
  readonly name: string;
  readonly status: 'pending' | 'shipped' | 'cancelled';
}

/** Mock orders data. */
export function getMockOrders(): OrderItem[] {
  return [
    { id: 'ord-001', name: 'Widget A', status: 'pending' },
    { id: 'ord-002', name: 'Widget B', status: 'pending' },
    { id: 'ord-003', name: 'Widget C', status: 'shipped' },
    { id: 'ord-004', name: 'Widget D', status: 'pending' },
    { id: 'ord-005', name: 'Widget E', status: 'cancelled' },
    { id: 'ord-006', name: 'Widget F', status: 'pending' },
    { id: 'ord-007', name: 'Widget G', status: 'shipped' },
    { id: 'ord-008', name: 'Widget H', status: 'pending' },
  ];
}

/**
 * Mock API function that simulates a bulk delete operation.
 * Items with status 'shipped' fail with CANNOT_DELETE error.
 */
export async function mockBulkDelete(
  request: BulkOperationRequest<OrderItem>,
): Promise<BulkOperationResponse<OrderItem>> {
  // Simulate network delay
  await new Promise((r) => setTimeout(r, 500));

  const results = request.items.map((item) => {
    if (item.status === 'shipped') {
      return {
        item,
        succeeded: false as const,
        error: { code: 'CANNOT_DELETE', message: 'Cannot delete shipped order', field: undefined },
      };
    }
    return { item, succeeded: true as const };
  });

  const succeeded = results.filter((r) => r.succeeded).length;
  const failed = results.length - succeeded;

  return {
    status: failed === 0 ? 'completed' : succeeded > 0 ? 'partialFailure' : 'failed',
    totalCount: results.length,
    successCount: succeeded,
    failureCount: failed,
    results,
  };
}

/**
 * Mock API function that simulates a bulk approve operation.
 * Items with status 'shipped' or 'cancelled' fail with INVALID_STATUS error.
 */
export async function mockBulkApprove(
  request: BulkOperationRequest<OrderItem>,
): Promise<BulkOperationResponse<OrderItem>> {
  await new Promise((r) => setTimeout(r, 500));

  const results = request.items.map((item) => {
    if (item.status === 'shipped' || item.status === 'cancelled') {
      return {
        item,
        succeeded: false as const,
        error: {
          code: 'INVALID_STATUS',
          message: `Cannot approve order in status '${item.status}'`,
          field: 'status',
        },
      };
    }
    return { item, succeeded: true as const };
  });

  const succeeded = results.filter((r) => r.succeeded).length;
  const failed = results.length - succeeded;

  return {
    status: failed === 0 ? 'completed' : succeeded > 0 ? 'partialFailure' : 'failed',
    totalCount: results.length,
    successCount: succeeded,
    failureCount: failed,
    results,
  };
}
