# TP_M02 Capability Gate Blocker

Date: 2026-09-12
Milestone: `TP_M02 — Pruning feature implementation`
Execution policy: `chatgpt_only`
Gate verdict: **BLOCKED FOR CODING**

## Required execution capability

The first pruning implementation card must be able to:

- materialize/fetch an exact `openai/codex@53ff712a48379ce8df605e292afd6046ca88ae9b` source worktree or equivalent exact-source checkout;
- edit/apply the project-owned patch carrier without mutating upstream repositories;
- compile/check affected Rust crates;
- run the required focused unit/integration/config/R19 tests;
- obtain durable command/test evidence and read back the resulting patch/project Git state.

Under `chatgpt_only`, all of those capabilities must be available to the executing normal ChatGPT session or through an equivalent test/CI lane that the same session can invoke and verify.

## Current-session capability evidence

Current normal ChatGPT session command probe:

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

Unavailable in this session:

- `cargo`;
- `rustc`;
- `rustup`;
- Docker;
- Podman;
- any already-established equivalent Rust CI/test execution lane for this project.

This session intentionally does not install/build a toolchain or custom runtime because the approved task is execution preparation only and explicitly prohibits build/install/deployment work.

## Why this blocks coding

TP_M02 Definition of Done requires Rust semantic/config/integration tests and R19 coverage. Starting implementation without a path to run those checks would violate the current Project Workflow Capability Gate and `chatgpt_only` execution policy.

The blocker is operational capability only. It does **not** invalidate:

- TP_M01 `NOT_EQUIVALENT`;
- the accepted safety contract;
- `REIMPLEMENT_EQUIVALENT_BEHAVIOR`;
- the TP_M02 JIT OpenSpec;
- the bounded implementation design.

## Bounded corrective work

`TP_M02-T00 — Establish verifiable exact-upstream Rust patch/test lane`

The card resolves this blocker without writing pruning behavior. It may be satisfied by either:

1. a fresh normal ChatGPT session/environment that exposes the required Rust/Cargo execution capabilities and exact-source test path; or
2. a repository-owned CI/test lane that normal ChatGPT can trigger through allowed project-repository writes and whose exact results/logs/status can be read back and attributed to the tested SHA.

No executor change is authorized. Do not route to Codex. Do not change `execution_policy` automatically.

## Resume condition

Resume TP_M02 only after T00 records durable evidence that an exact-source Rust compile/test lane is usable by ChatGPT and Task Board/Card state is reconciled. Then `TP_M02-T01` may become READY.
