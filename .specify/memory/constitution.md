<!--
SYNC IMPACT REPORT
==================
Version change: (uninitialized template) → 1.0.0
Modified principles: N/A — initial creation from template
Added sections:
  - Core Principles (5 principles)
  - Technology Standards
  - Quality Gates
  - Governance
Removed sections: N/A
Templates updated:
  - .specify/templates/plan-template.md — Constitution Check gates added
  - .specify/templates/spec-template.md — no structural changes required
  - .specify/templates/tasks-template.md — no structural changes required
Deferred TODOs: None
-->

# [PROJECT_NAME] Constitution

## Core Principles

### I. User-Centric Design

Every feature MUST be designed around the needs of [TARGET_USERS] — not around
internal technical convenience.

- All UI/UX decisions MUST be validated against a concrete user scenario before
  implementation begins.
- Features that add complexity without clear user value MUST be rejected.
- The app MUST be usable by non-technical users with no domain expertise.

**Rationale**: The primary risk for a consumer-facing tool is building something
that developers find elegant but users find confusing. User value is the north star.

### II. Data Accuracy

[DOMAIN_DATA] are the core data of this application — they MUST be correct or
explicitly flagged as approximate.

- Domain data MUST reference a validated source or be clearly marked as
  user-supplied estimates.
- Calculations MUST use validated formulas with appropriate unit handling.
- Cost data MUST display currency, date context, and data source so users can
  assess reliability.
- No silent data coercion: unit mismatches MUST surface as errors, not silently convert.

**Rationale**: Errors in domain calculations or cost estimation translate directly
to wasted money and failed projects for real users. Data quality is non-negotiable.

### III. Test-First (NON-NEGOTIABLE)

Tests MUST be written and confirmed to fail before any implementation code is written.

- Red-Green-Refactor cycle is mandatory for all features.
- User story acceptance scenarios from the spec MUST map to automated tests.
- No implementation task is "done" until its corresponding tests pass.

**Rationale**: Projects with complex domain logic benefit from tests as a safety
net that allows confident iteration. Silent regressions are costly.

### IV. Incremental Delivery

Each feature MUST deliver standalone, demonstrable value before the next feature begins.

- Every spec MUST identify a P1 user story that constitutes the MVP slice.
- The P1 story MUST be shippable independently — subsequent stories add to it, not
  complete it.
- Design for incremental extension: data models and APIs MUST accommodate known future
  requirements without over-engineering for unknowns.

**Rationale**: Incremental delivery keeps the project shippable and learnable,
preventing scope creep from overwhelming the team.

### V. Simplicity

The simplest solution that satisfies the requirement MUST be chosen. Complexity requires
explicit justification.

- YAGNI applies: do not build for hypothetical future requirements.
- Each introduced abstraction, pattern, or dependency MUST justify its cost in the
  Complexity Tracking section of the plan.
- Third-party dependencies MUST be evaluated for: maintenance health, bundle size
  impact, and licensing compatibility.

**Rationale**: Applications accumulate features that can overwhelm a codebase.
Simplicity keeps the system maintainable as scope grows.

## Technology Standards

The technology stack ships with sensible defaults (Vite + TypeScript + Biome + Vitest +
Playwright) but can be swapped per project. The following constraints apply regardless
of stack:

- The application MUST be web-accessible (browser-based or PWA); native-only delivery
  is not acceptable for v1.
- Data persistence MUST support export (JSON or CSV) so users are never locked in.
- External API integrations MUST degrade gracefully when unavailable — the app MUST
  remain functional with cached or user-supplied data.
- All third-party services MUST be documented in the feature plan with a fallback
  strategy.

## Quality Gates

The following gates MUST be satisfied before any feature is considered complete:

1. **Spec gate**: A feature spec with at least one independently testable P1 user story
   exists and has been reviewed.
2. **Plan gate**: A plan.md Constitution Check section confirms compliance with all five
   Core Principles.
3. **Test gate**: All acceptance scenarios defined in the spec have corresponding
   automated tests that passed on the final implementation.
4. **Data gate**: Any new domain data introduced by the feature is sourced, validated,
   and documented.
5. **Simplicity gate**: The Complexity Tracking table in plan.md is empty, OR every
   entry has a justified rationale.

## Governance

This constitution supersedes all other project conventions. When a conflict arises
between this document and any other guideline, the constitution takes precedence.

**Amendment procedure**:
1. Propose the amendment in a PR with a description of the change and its rationale.
2. The amendment MUST be reflected in the Sync Impact Report (HTML comment at top of
   this file).
3. Version MUST be incremented per semantic versioning rules defined below.
4. Dependent templates (`.specify/templates/`) MUST be checked for alignment and
   updated in the same PR.

**Versioning policy**:
- MAJOR: Removal or redefinition of a Core Principle, or removal of a Quality Gate.
- MINOR: New principle, new quality gate, or new mandatory section added.
- PATCH: Wording clarifications, typo fixes, non-semantic refinements.

**Compliance review**:
- Every plan.md MUST include a Constitution Check section confirming compliance.
- Code review MUST verify that no Quality Gate is bypassed without a documented
  exception in the Complexity Tracking table.

**Version**: 1.0.0
