# TP_M02 Capability Gate Blocker

> Supersession note — 2026-09-12: **SUPERSEDED AS A STATIC-AUTHORING BLOCKER.** The project execution strategy was explicitly changed after this record was created. Lack of local Rust/Cargo/container capability no longer blocks writing a `BEST_EFFORT / STATICALLY_REVIEWED / UNCOMPILED / UNTESTED` patch. This record remains authoritative evidence that ChatGPT cannot claim compile/test success. Downstream Codex validation/build/install is now routed through `project-handoffs/TP_M02_CODEX_EXECUTION_HANDOFF.md`. The historical text below is preserved rather than deleted.

Date: 2026-09-12
Milestone: `TP_M02 — Pruning feature implementation`
Execution policy at time of record: `chatgpt_only`
Historical gate verdict: **BLOCKED FOR CODING UNDER THE THEN-CURRENT STRATEGY**

## Required execution capability

The first pruning implementation card was originally required to:

- materialize/fetch an exact `openai/codex@53ff712a48379ce8df605e292afd6046ca88ae9b` source worktree or equivalent exact-source checkout;
- edit/apply the project-owned patch carrier without mutating upstream repositories;
- compile/check affected Rust crates;
- run the required focused unit/integration/config/R19 tests;
- obtain durable command/test evidence and read back the resulting patch/project Git state.

Under the then-current `chatgpt_only` strategy, all of those capabilities had to be available to the executing normal ChatGPT session or through an equivalent test/CI lane that the same session could invoke and verify.

## Historical capability evidence

The original normal ChatGPT session command probe was:

```text
git=git version 2.47.3
cargo=
rustc=
rustup=
docker=
podman=
```

Available:

- Git command line;
- GitHub repository read/write/readback connector;
- public source inspection.

Unavailable:

- `cargo`;
- `rustc`;
- `rustup`;
- Docker;
- Podman;
- an already-established equivalent Rust CI/test execution lane for this project.

The later best-effort authoring session again found no `cargo`, `rustc`, `rustfmt`, Docker or Podman executable. That repeated absence is now treated as a validation limitation rather than an authoring stop.

## Historical blocker rationale

The old TP_M02 Definition of Done tied implementation authoring to immediate Rust semantic/config/integration testing. Starting implementation without such a lane would have violated that older Capability Gate interpretation.

The blocker was always operational capability only. It did not invalidate:

- TP_M01 `NOT_EQUIVALENT`;
- the accepted safety contract;
- `REIMPLEMENT_EQUIVALENT_BEHAVIOR`;
- the TP_M02 behavior design.

## Superseding decision

The approved strategy now deliberately separates:

1. ChatGPT exact-source static authoring + adversarial review; from
2. downstream Codex critical inspection, drift repair, formatting, compilation, tests, CE update/integration/install and smoke.

Therefore this file must not be used to route back to an obsolete T00 Rust-lane authoring blocker.

## Current resume/routing condition

Static authoring is complete. The next executor is Codex from:

`project-handoffs/TP_M02_CODEX_EXECUTION_HANDOFF.md`

Final compile/runtime/install acceptance remains blocked until downstream executable evidence exists. No final milestone GREEN is implied by this supersession.
