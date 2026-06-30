# @hexguard/angular-icon-registry

**Headless icon registry for Angular.** Centralized SVG icon management with typed icon names, alias resolution, configurable sizing, and `currentColor`-based coloring — all with signal-based primitives.

**[Demo](/packages/angular-icon-registry/demo)**

---

## Problem

Every design system needs a single source of truth for SVG icons. Teams inline SVGs directly in templates, duplicate icon markup across components, and lack a typed contract between icon names and their render data.

**`@hexguard/angular-icon-registry`** provides a centralized registry with `provideIcons()` for registration and `injectIcons()` for signal-based resolution.

## Installation

```bash
pnpm add @hexguard/angular-icon-registry
```

## Quickstart

```typescript
import { provideIcons, injectIcons } from '@hexguard/angular-icon-registry';

@Component({
  providers: [
    provideIcons({
      icons: {
        home: {
          svgContent: '<path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>',
          viewBox: '0 0 24 24',
        },
        settings: { svgContent: '<path d="..."/>', viewBox: '0 0 24 24', aliases: ['gear', 'cog'] },
      },
      defaultSize: '1.5rem',
    }),
  ],
})
class MyComponent {
  readonly icons = injectIcons();
}
```

```html
@if (icons.get('home')(); as icon) {
<svg
  [attr.viewBox]="icon.viewBox"
  [style.width]="icon.size"
  [style.height]="icon.size"
  [style.color]="icon.color"
>
  <g [innerHTML]="icon.svgContent"></g>
</svg>
}
```

## API

### `provideIcons(config)`

| Option        | Type                             | Default    | Description                |
| ------------- | -------------------------------- | ---------- | -------------------------- |
| `icons`       | `Record<string, IconDefinition>` | required   | Icon name → definition map |
| `defaultSize` | `string`                         | `'1.5rem'` | Default CSS size           |

### `injectIcons()`

| Member      | Type                             | Description                  |
| ----------- | -------------------------------- | ---------------------------- |
| `get(name)` | `Signal<IconRenderData \| null>` | Reactive icon render data    |
| `has(name)` | `boolean`                        | Whether icon or alias exists |
| `names()`   | `string[]`                       | All canonical icon names     |

### `IconRenderData`

| Field        | Type     | Description           |
| ------------ | -------- | --------------------- |
| `svgContent` | `string` | Raw SVG inner markup  |
| `viewBox`    | `string` | SVG viewBox attribute |
| `size`       | `string` | CSS size value        |
| `color`      | `string` | `'currentColor'`      |

## Scope Boundaries

| Concern                         | Status      |
| ------------------------------- | ----------- |
| Centralized icon registration   | ✅          |
| Alias resolution (multi-alias)  | ✅          |
| Signal-based access             | ✅          |
| Configurable default size       | ✅          |
| Lazy loading / caching          | ❌ (future) |
| Design token sizing integration | ❌ (future) |
| Color customization per-icon    | ❌ (future) |
| Icon rotation / flip utilities  | ❌ (future) |
| SSR-compatible inline loading   | ❌ (future) |

## Improvement Proposals

### 1. Icon size should be customizable per icon instance

Currently `defaultSize` is global. Consumers should be able to override size when calling `get()`:

```typescript
icons.get('home', { size: '3rem' });
```

The `IconRegistry.get()` signature could accept an optional options object to override render-time properties.

### 2. Icon color should be settable per icon

Like size, color should be overridable from `currentColor` via the `get()` options. This enables multi-color icons without separate definitions.

### 3. Lazy loading with SVG content fetch

Add a `fetch` option that loads SVG content on-demand:

```typescript
provideIcons({
  fetch: { basePath: '/assets/icons/' },
  icons: { home: { viewBox: '0 0 24 24', svgPath: 'icons/home.svg' } },
});
```

### 4. Design token sizing

Accept a design token path instead of a raw CSS value for `defaultSize`:

```typescript
provideIcons({ icons: {...}, sizeToken: 'spacing.icon.md' })
```

This would integrate with `@hexguard/angular-design-tokens` for consistent sizing across the design system.

### 5. Icon rotation and flip utilities

Add composable transforms to `IconRenderData`:

```typescript
// Usage
icons.get('arrow', { rotate: 90, flip: 'horizontal' });
```

### 6. SSR-compatible inline sprite

Generate an SVG sprite sheet at build time and reference icons by `<use>` fragment identifiers, avoiding inline SVG duplication across server-rendered pages.
