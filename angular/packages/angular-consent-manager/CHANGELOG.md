# Changelog

## 0.1.0

- Initial release.
- IAB TCF v2.2 integration: `window.__tcfapi` CMP API, TC string encoder/decoder, `injectTcfApi()` facade wired to consent state, `iabPurposeIds` on categories, `tcfSupport` config option.
- Audit trail: 10 unit tests for `injectConsentAudit()` covering grant/withdraw/clear/export/disabled states.
- Demo page: audit records table with reactive display, download-as-JSON, TCF purpose visualizer, decoded TC string.
