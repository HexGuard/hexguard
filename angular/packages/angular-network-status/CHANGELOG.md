# Changelog

## 0.1.0

- Initial release.
- injectNetworkStatus() with online/offline signals.
- Configurable debounce for offline→online transition.
- connectionType signal via navigator.connection (where available).
- recentlyBackOnline signal with configurable duration.
- whenBackOnline() promise helper for retry composition.
- Proper cleanup via DestroyRef.
