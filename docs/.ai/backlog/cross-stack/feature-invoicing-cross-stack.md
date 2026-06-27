---
id: feature-invoicing-cross-stack
type: feature
status: proposed
created: 2026-06-27
package: 'HexGuard.Invoicing + @hexguard/angular-invoice'
---

# Invoicing Cross-Stack Pair

## Summary

Server-side invoice generation engine + client-side invoice management dashboard.

### .NET (`HexGuard.Invoicing`)
Invoice creation with line items/tax/discounts, automatic numbering, lifecycle management, PDF generation, payment tracking, credit notes, multi-currency.

### Angular (`@hexguard/angular-invoice`)
Invoice list with filters, create/edit with line item management, status lifecycle, payment tracking, due date warnings, bulk actions.

### Integration Contract
```typescript
interface InvoicingEndpoints {
  'POST /api/invoices': { body: CreateInvoiceRequest; response: Invoice };
  'GET /api/invoices': { params: InvoiceQuery; response: Invoice[] };
  'GET /api/invoices/{id}': { response: Invoice };
  'PUT /api/invoices/{id}': { body: UpdateInvoiceRequest; response: Invoice };
  'POST /api/invoices/{id}/send': { response: Invoice };
  'POST /api/invoices/{id}/payments': { body: PaymentRecord; response: Invoice };
  'DELETE /api/invoices/{id}': { params: { reason: string }; response: void };
  'GET /api/invoices/{id}/pdf': { response: Blob };
}
```
