---
id: feature-blazor-head-management
type: feature
status: proposed
created: 2026-06-29
package: 'HexGuard.Blazor.HeadManagement'
---

# HexGuard.Blazor.HeadManagement

## Summary

Dynamic `<head>` management for Blazor — set page title, meta tags, link tags, scripts, and structured data from any component. Equivalent to React Helmet or Angular's Title/Meta services.

## Pain Point

Blazor has no built-in way to manage `<head>` content per page: setting the page title requires `NavigationManager` + JS interop, Open Graph meta tags need manual `<HeadContent>` in every page, and there's no structured data injection. SEO, social sharing, and analytics suffer as a result — especially in WASM where the initial HTML has no dynamic content.

## Goals

- Set page title from any component
- Add/update/remove `<meta>` tags (description, og:title, og:image, twitter:card)
- Add/update/remove `<link>` tags (canonical, hreflang, stylesheet)
- Inject `<script>` tags (analytics, structured data JSON-LD)
- Route-level head configuration via attribute
- SSR-safe (works during pre-rendering)
- Automatic cleanup on component disposal

## Non-Goals

- No rendered head UI
- No SEO analysis or scoring
- No sitemap generation

## Proposed Public API

```csharp
// Head service
public interface IHeadManager
{
    void SetTitle(string title);
    void SetMeta(string name, string content);
    void SetMetaProperty(string property, string content); // og:, twitter:
    void RemoveMeta(string name);
    void SetLink(string rel, string href, string? type = null, string? hreflang = null);
    void RemoveLink(string rel);
    void AddScript(string src, bool async = false, bool defer = false);
    void AddInlineScript(string script);
    void SetJsonLd(string jsonLd);
    void Reset(); // clear all head changes for this component
}

// Route-level attribute
[Head(Title = "Products - My Store")]
[HeadMeta("description", "Browse our product catalog")]
[HeadMetaProperty("og:title", "Products - My Store")]
[HeadMetaProperty("og:image", "https://example.com/products-og.jpg")]
public partial class ProductsPage { }

// Usage in component
@inject IHeadManager Head
@implements IDisposable

protected override void OnInitialized()
{
    Head.SetTitle($"Product: {Product.Name}");
    Head.SetMeta("description", Product.Description);
    Head.SetJsonLd(JsonLdSerializer.Serialize(new
    {
        @type = "Product",
        name = Product.Name,
        offers = new { price = Product.Price }
    }));
}

void IDisposable.Dispose() => Head.Reset();
```

## Implementation Plan
1. Create `dotnet/src/HexGuard.Blazor.HeadManagement/` with `.csproj` (RCL).
2. Implement title, meta, link, script management, JSON-LD injection.
3. Add route-level attribute, SSR safety, auto-cleanup.
4. Add xunit + bUnit tests. Register in `HexGuard.slnx`.
