---
id: feature-experimentation-cross-stack
type: feature
status: proposed
created: 2026-06-27
package: 'HexGuard.Experimentation + @hexguard/angular-experiment'
---

# Experimentation / A/B Testing Cross-Stack Pair

## Summary

Server-side experiment engine + client-side experiment variant activation state.

### .NET (`HexGuard.Experimentation`)
Experiment definition, variant assignment (hash-based sticky), exposure/conversion tracking, result aggregation, override for internal testing.

### Angular (`@hexguard/angular-experiment`)
Variant resolution signal, exposure tracking, experiment override via query param, conversion event helpers. Integrates with feature flags for gradual rollouts.

### Integration Contract
```typescript
interface ExperimentEndpoints {
  'GET /api/experiments/assign': { params: { key: string; userId: string }; response: VariantAssignment };
  'POST /api/experiments/exposure': { body: { key: string; variant: string }; response: void };
  'POST /api/experiments/conversion': { body: { key: string; metric: string; value?: number }; response: void };
}
```
