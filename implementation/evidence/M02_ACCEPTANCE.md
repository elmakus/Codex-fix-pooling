# M02 Acceptance — Best-effort MVP preparation and Codex handoff

Date: 2026-09-12
Verdict: GREEN FOR `M02_MVP_HANDOFF_READY`
Accepted implementation head: `1298fae794050c40894ad9abfa69d5556d3790dd`
Integrated review: `implementation/evidence/M02-T05_STATIC_MVP_REVIEW.md`
Cumulative handoff: `project-handoffs/M02_HANDOFF.md`

## Meaning of GREEN

M02 is accepted only as a preparation/handoff milestone. The strongest practical source-level MVP, source provenance, Community integration overlay, test requirements, static review and deterministic Codex continuation are durably prepared.

This verdict does **not** claim that any environment-dependent acceptance has passed.

## Accepted prepared state

- Runtime target refreshed to `openai/codex@c4017a87aacc7558002b7cb510025e967c1d765e`.
- Immutable reference patch remains `tekacs/codex@9ffcf8db9078eae43d4111ff94259795c1e962c9`.
- Refreshed public OpenAI source is not strictly equivalent to the frozen four-part wakeup behavior.
- Current-source runtime adaptation recipe exists at `implementation/patches/M02-T03_CODEX_C4017A87_WAKEUP_ADAPTATION.md`.
- Community target remains `ilysenko/codex-desktop-linux@249cd4b64d42434f51417fec4a318750d461b676`.
- A real source overlay for `custom-codex-runtime` exists under `implementation/community-overlay/linux-features/custom-codex-runtime/`.
- Candidate-tree `resources/codex` remains the package authority seam.
- Official package identity and stock runtime identity are captured before custom substitution.
- Only PASS admits substitution; FAIL and UNKNOWN reject the candidate.
- Feature OFF preserves the stock runtime copied from the newly verified official payload.
- No second updater, live-tree overwrite, post-install replacement hack or production installation was introduced.
- Static review corrected current manifest schema drift, architecture binding and durable rejection diagnostics before acceptance.
- One cumulative handoff tells Codex how to inspect, refresh, apply/adapt, build, test, repair, verify and persist evidence without restarting architecture discovery.

## Source/readback facts verified in ChatGPT

- selected Git refs were readable at preparation time;
- current public OpenAI source did not contain strict-equivalent wakeup plus model-guidance behavior;
- Community feature stage hooks operate inside candidate construction after official payload staging and before candidate promotion;
- current Community runtime-hook manifest shape was reconciled;
- `codex-cli` declares the `codex` binary build target.

These source/readback checks are not substitutes for compile/runtime/package tests.

## Explicit UNKNOWNs transferred to Codex

- exact current active-or-idle wake implementation compilation;
- Rust formatting/tests/build result;
- resulting custom runtime version, architecture and SHA-256;
- Community Node/shell test result;
- Community candidate/native package build and artifact identity;
- real PASS/FAIL/UNKNOWN package-mechanics execution;
- strict idle wake, active-turn push and duplicate suppression behavior;
- legitimate interactive/intermediate `write_stdin` behavior;
- exact Desktop/app-server compatibility;
- changed-baseline update persistence and re-admission;
- production suitability.

Nothing above may be promoted from UNKNOWN to PASS without execution evidence.

## Acceptance boundary

Checkpoint `M02_MVP_HANDOFF_READY` means Codex has a sufficiently complete and internally reviewed implementation package to continue efficiently. It does not authorize production installation. Installation remains a separate explicit user-authorized action after sufficient verification.

## Closure

All M02 preparation cards are eligible for durable `done` state. Later closure commits may reconcile cards, Task Board, PROJECT.md, OpenSpec task state, milestone metadata and prompt pointers, but they must not introduce unreviewed behavioral changes beyond accepted implementation head `1298fae794050c40894ad9abfa69d5556d3790dd`.
