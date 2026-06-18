# Changelog

## 0.1.0

- Initial release.
- injectStorage<T>(key, options) with typed signal-backed storage.
- Automatic JSON serialization/deserialization.
- Optional version-based schema detection.
- Optional TTL expiry.
- Cross-tab synchronization via storage event.
- patch() for shallow merge on object types.
- Graceful fallback when localStorage is unavailable.
