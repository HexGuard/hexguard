# Changelog

## 0.1.0 — 2026-06-23

Initial release of `@hexguard/angular-page-context`.

### Features

- `injectPageContext()` — headless page-level metadata state
- `set(context)` — update title, breadcrumbs, tabs, actions simultaneously
- `title` / `breadcrumbs` / `activeTab` / `actions` signals for reactive UI binding
- `setActiveTab(id)` — switch active tab
- Route-scoped lifecycle via DestroyRef
