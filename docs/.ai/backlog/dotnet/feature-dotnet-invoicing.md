---
id: feature-dotnet-invoicing
type: feature
status: proposed
created: 2026-06-27
package: 'HexGuard.Invoicing'
---

# HexGuard.Invoicing

## Summary

Invoice generation engine for .NET — create, number, calculate, and manage invoices with line items, tax, and payment tracking. Backend for billing portals and marketplace payouts.

## Goals

- Invoice creation with line items, tax rates, discounts
- Automatic invoice numbering (configurable format)
- Tax calculation with multiple tax rates per invoice
- Invoice status lifecycle (draft → sent → paid → overdue → cancelled)
- Partial payment tracking
- Due date enforcement and overdue detection
- PDF generation via template engine
- Multi-currency support
- Credit notes and refunds

## Non-Goals

- No payment processing (webhook integration only)
- No accounting system integration
- No rendered invoice UI

## Proposed Public API

```csharp
public interface IInvoicingService
{
    Task<Invoice> CreateAsync(CreateInvoiceRequest request, CancellationToken ct = default);
    Task<Invoice?> GetAsync(string invoiceId, CancellationToken ct = default);
    Task<IReadOnlyList<Invoice>> QueryAsync(InvoiceQuery query, CancellationToken ct = default);
    Task<Invoice> UpdateAsync(string invoiceId, UpdateInvoiceRequest request, CancellationToken ct = default);
    Task<Invoice> SendAsync(string invoiceId, CancellationToken ct = default);
    Task<Invoice> RecordPaymentAsync(string invoiceId, PaymentRecord payment, CancellationToken ct = default);
    Task<Invoice> CancelAsync(string invoiceId, string reason, CancellationToken ct = default);
    Task<Invoice> CreateCreditNoteAsync(string invoiceId, CreditNoteRequest request, CancellationToken ct = default);
    Task<Stream> GeneratePdfAsync(string invoiceId, CancellationToken ct = default);
}

public sealed record CreateInvoiceRequest(
    string ClientId,
    string Currency,
    IReadOnlyList<LineItemRequest> LineItems,
    IReadOnlyList<TaxRate> TaxRates,
    DateTimeOffset DueDate,
    string? Notes = null,
    decimal? DiscountPercent = null
);

public sealed record Invoice(
    string Id,
    string Number,
    InvoiceStatus Status,
    ClientInfo Client,
    IReadOnlyList<LineItem> LineItems,
    decimal Subtotal,
    decimal TaxAmount,
    decimal Total,
    decimal PaidAmount,
    string Currency,
    DateTimeOffset IssuedAt,
    DateTimeOffset DueDate,
    IReadOnlyList<PaymentRecord> Payments
);

public enum InvoiceStatus { Draft, Sent, Partial, Paid, Overdue, Cancelled }
```

## Implementation Plan
1. Create `dotnet/src/HexGuard.Invoicing/` with `.csproj`.
2. Implement invoice creation, numbering, tax calculation, lifecycle, PDF generation.
3. Add payment tracking and credit notes.
4. Add xunit tests. Register in `HexGuard.slnx`.
