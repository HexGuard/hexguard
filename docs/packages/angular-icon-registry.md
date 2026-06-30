# @hexguard/angular-icon-registry — Deep Package Notes

Centralized SVG icon registry with typed icon names, alias resolution, configurable sizing, and `currentColor`-based coloring.

## Problem

Every design system needs a single source of truth for SVG icons. Teams inline SVGs directly in templates, duplicate icon markup, and lack a typed contract between icon names and their render data.

**`@hexguard/angular-icon-registry`** provides a centralized registry with `provideIcons()` for icon registration and `injectIcons()` for signal-based icon resolution.

## API

### `provideIcons(config)`

Provider factory returning `Provider[]`. Config accepts:

| Option        | Type                             | Default    | Description                         |
| ------------- | -------------------------------- | ---------- | ----------------------------------- |
| `icons`       | `Record<string, IconDefinition>` | required   | Name → definition map               |
| `defaultSize` | `string`                         | `'1.5rem'` | Default CSS size for rendered icons |

```typescript
@Component({
  providers: [provideIcons({
    icons: {
      home: { svgContent: '<path d="..." />', viewBox: '0 0 24 24' },
      settings: { svgContent: '<path d="..." />', viewBox: '0 0 24 24', aliases: ['gear'] },
    },
    defaultSize: '2rem',
  })],
})
```

### `injectIcons()`

Returns `IconRegistry`:

| Member      | Type                             | Description                                  |
| ----------- | -------------------------------- | -------------------------------------------- |
| `get(name)` | `Signal<IconRenderData \| null>` | Reactive icon data, or null if unknown       |
| `has(name)` | `boolean`                        | Whether icon or alias exists                 |
| `names()`   | `string[]`                       | All canonical icon names (excluding aliases) |

### `IconRenderData`

| Field        | Type     | Description             |
| ------------ | -------- | ----------------------- |
| `svgContent` | `string` | Raw SVG inner markup    |
| `viewBox`    | `string` | SVG viewBox attribute   |
| `size`       | `string` | CSS size value          |
| `color`      | `string` | Always `'currentColor'` |

## Design Decisions

1. **`provide*()`/`inject*()` pattern.** Icons are scoped to the provider's injector — different subtrees can have different icon sets.
2. **Alias map built at construction time.** One-time `Map<string, string>` construction — alias resolution is O(1) at runtime.
3. **Signal caching.** Repeated `get()` calls return the same signal instance — stable template references.
4. **Unknown icons return a null signal.** No runtime errors — consumers handle missing icons in templates with `@if`.
5. **No lazy loading yet.** All icons are registered eagerly at provider time. Lazy loading and SVG sprite loading are deferred to a future version.

## Code Examples

### Component with icon rendering

```typescript
@Component({
  providers: [provideIcons({ icons: { home: { svgContent: '...', viewBox: '0 0 24 24' } } })],
  template: `
    @if (icons.get('home')(); as icon) {
      <svg [attr.viewBox]="icon.viewBox" [style.width]="icon.size" [style.height]="icon.size">
        <g [innerHTML]="icon.svgContent"></g>
      </svg>
    }
  `,
})
class MyComponent {
  readonly icons = injectIcons();
}
```

### Multiple icon sets

```typescript
const APP_ICONS = provideIcons({ icons: { ... }, defaultSize: '1.5rem' });
const PAGE_ICONS = provideIcons({ icons: { ... }, defaultSize: '2rem' });

@Component({
  providers: [APP_ICONS, PAGE_ICONS], // Last registered wins
})
```

## Related Resources

- [Package README](../../angular/packages/angular-icon-registry/README.md)
- [Package Catalog](../README.md)
- [Source Code](../../angular/packages/angular-icon-registry/src/)
