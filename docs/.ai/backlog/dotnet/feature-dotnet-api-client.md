---
id: feature-dotnet-api-client
type: feature
status: proposed
created: 2026-06-26
package: HexGuard.ApiClient
---

# HexGuard.ApiClient

## Summary

Generate typed TypeScript/Angular API client from .NET API project — reads Minimal API endpoints and generates typed service classes. **Eliminates manual HTTP client code.**

## Proposed Public API

```csharp
// CLI tool / build target
dotnet hexguard-generate-client --project MyApi.csproj --output ../client/src/app/api/

// Generated output:
// products-api.service.ts
@Injectable({ providedIn: 'root' })
export class ProductsApiService {
  constructor(private http: HttpClient) {}

  getProducts(params: QueryRequest): Observable<QueryResponse<ProductDto>> {
    return this.http.get<QueryResponse<ProductDto>>('/api/products', { params });
  }
  getProduct(id: string): Observable<ProductDto> { ... }
  createProduct(dto: CreateProductDto): Observable<ProductDto> { ... }
  updateProduct(id: string, dto: UpdateProductDto): Observable<ProductDto> { ... }
  deleteProduct(id: string): Observable<void> { ... }
}
```

## Implementation Plan

1. Create `dotnet/src/HexGuard.ApiClient/` with CLI tool.
2. Implement Minimal API route discovery and code generation.
3. Add tests.
4. Publish as NuGet + dotnet tool.
