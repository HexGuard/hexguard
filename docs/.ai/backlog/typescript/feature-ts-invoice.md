---
id: feature-ts-invoice
type: feature
status: proposed
created: 2026-06-27
package: '@hexguard/ts-invoice'
---

# @hexguard/ts-invoice

## Summary

Zero-dependency invoice calculation utilities — line item totals, tax computation, discount application, and currency formatting. Pure functions for invoice math.

## Proposed Public API

```typescript
// Line item calculations
export function calculateLineItemTotal(quantity: number, unitPrice: number, discountPercent?: number): number;
export function calculateSubtotal(items: { quantity: number; unitPrice: number; discountPercent?: number }[]): number;
export function calculateTax(subtotal: number, taxRates: { name: string; rate: number; isCompound?: boolean }[]): TaxBreakdown;
export function calculateTotal(subtotal: number, taxBreakdown: TaxBreakdown, discount?: Discount): number;

// Models
export interface TaxBreakdown { rates: { name: string; amount: number }[]; totalTax: number; }
export interface Discount { type: 'percent' | 'fixed'; value: number; description?: string; }

// Invoice number generation
export function generateInvoiceNumber(format: string, lastNumber: number): string;
// format: "INV-{YYYY}-{NNNNN}" → "INV-2026-00042"

// Due date calculation
export function calculateDueDate(issuedAt: Date, paymentTerms: PaymentTerms): Date;
export type PaymentTerms = 'on_receipt' | 'net_15' | 'net_30' | 'net_60' | 'net_90' | { customDays: number };

// Currency
export function formatCurrency(amount: number, currency: string, locale?: string): string;
export function parseCurrency(formatted: string, currency: string): number;
export function convertCurrency(amount: number, from: string, to: string, rates: Record<string, number>): number;

// Status helpers
export function getInvoiceStatus(invoice: { dueDate: Date; paidAmount: number; total: number; status: string }): InvoiceStatus;
export type InvoiceStatus = 'draft' | 'sent' | 'partial' | 'paid' | 'overdue' | 'cancelled';
export function isOverdue(dueDate: Date, paidAmount: number, total: number): boolean;
```

## Implementation Plan
1. Create `ts/packages/ts-invoice/` with zero dependencies.
2. Implement all calculation, formatting, and status functions.
3. Handle edge cases: zero amounts, full discounts, compound tax.
4. Add tests. Publish to npm.
