# .NET Samples

Place sample applications or reference hosts here when a .NET package needs a realistic verification surface.

Use samples to prove package behavior without turning them into long-lived deployed services by default.

Current guidance:

- Prefer one shared sample API with package-scoped folders over many separate per-package demo hosts.
- Keep each package slice under `Packages/<PackageName>/` so frontend demos can share the same backend process.
- Expose scenario-style endpoints when they make docs and end-to-end validation easier to understand.
