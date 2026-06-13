# Security Policy

## Reporting a Vulnerability

Please do not open a public issue for a suspected vulnerability.

Report vulnerabilities to `security@hexguard.dev` with:

- affected package and version
- reproduction steps or proof of concept
- impact assessment
- any suggested mitigation or fix

We will acknowledge reports as quickly as possible and coordinate remediation before public
disclosure.

## Supported Versions

Security fixes are prioritized for:

- the latest commit on `main`
- the latest published version of each public package

## Scope

For `@hexguard/angular-url-state`, the highest-priority concerns are:

- incorrect URL parsing that can crash applications
- unsafe behavior around invalid query parameters
- SSR-breaking behavior introduced into the core package
- packaging or build artifacts that expose unintended files
