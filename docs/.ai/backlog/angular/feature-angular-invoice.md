---
id: feature-angular-invoice
type: feature
status: proposed
created: 2026-06-27
package: '@hexguard/angular-invoice'
---

# @hexguard/angular-invoice

## Summary

Headless invoice state — list, detail, create, send, payment tracking, and status management. For billing portals, freelancer platforms, and marketplace payout systems.

## Goals

- Invoice list with filters (status, date range, client)
- Invoice detail with line items, tax, totals
- Invoice creation with line item management
- Invoice status lifecycle (draft → sent → paid → overdue → cancelled)
- Payment tracking with partial payment support
- Due date tracking with overdue detection
- Bulk actions (send, mark paid, export)

## Non-Goals

- No PDF rendering (server-side generation only)
- No payment processing
- No accounting ledger

## Proposed Public API

```typescript
export function injectInvoices(config: {
  endpoint: string;
  currency?: string;
  taxRates?: TaxRate[];
}): {
  readonly invoices: Signal<Invoice[]>;
  readonly selected: Signal<Invoice | null>;
  readonly summary: Signal<InvoiceSummary>;
  readonly filters: Signal<InvoiceFilters>;
  readonly isLoading/error/submitting: Signal<boolean>;
  create(invoice: NewInvoice): Promise<Invoice>;
  update(id: string, changes: Partial<Invoice>): Promise<void>;
  send(id: string): Promise<void>;
  markPaid(id: string, payment: PaymentRecord): Promise<void>;
  cancel(id: string): Promise<void>;
  setFilters(f: Partial<InvoiceFilters>): void;
  // Line items
  readonly draftLineItems: Signal<LineItem[]>;
  addLineItem(item: NewLineItem): void;
  removeLineItem(index: number): void;
  readonly computedTotals: Signal<{ subtotal: number; tax: number; total: number }>;
};

export interface Invoice {
  id: string; number: string; status: InvoiceStatus; client: ClientInfo;
  lineItems: LineItem[]; subtotal: number; tax: number; total: number;
  currency: string; issuedAt: Date; dueDate: Date; paidAt?: Date;
  payments: PaymentRecord[];
}
export type InvoiceStatus = 'draft' | 'sent' | 'partial' | 'paid' | 'overdue' | 'cancelled';
export interface InvoiceSummary { totalOutstanding: number; overdue: number; paidThisMonth: number; count: number; }
```

## Implementation Plan
1. Scaffold `angular/packages/angular-invoice/`.
2. Implement invoice CRUD, line item management, status lifecycle, computed totals with signals.
3. Add filters, bulk actions, payment tracking.
4. Add tests. Register in workspace.
