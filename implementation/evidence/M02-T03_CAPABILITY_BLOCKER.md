# M02-T03 Capability Blocker — controlled Codex carrier and reproducible runtime build

Date: 2026-09-12
Policy: `chatgpt_only`
Card: `M02-T03`

## Verdict

**BLOCKED before assignment/execution start.**

The current normal ChatGPT session cannot satisfy all required capabilities declared by M02-T03, so the card must not transition to `in_progress` and must not be routed to Codex.

## Refresh Gate

Current external baselines were refreshed before any carrier mutation:

- `openai/codex:main` = `944d6fd1ba4baab69dbedd205282dc72ec20abb5`.
- `ilysenko/codex-desktop-linux:main` = `249cd4b64d42434f51417fec4a318750d461b676`.
- official Linux Desktop baseline remains `26.908.40834`.
- reference patch remains available at `tekacs/codex@9ffcf8db9078eae43d4111ff94259795c1e962c9`.
- repository search found no existing owned `elmakus/codex` carrier.

No refreshed baseline evidence materially changed the accepted architecture or OpenSpec contract.

## Capability Gate

M02-T03 requires all of:

1. GitHub repository/fork/branch write capability for an owned `elmakus/codex` carrier.
2. An isolated source build environment capable of building the target Codex runtime and obtaining binary identity.
3. Durable project evidence writes.

Observed capabilities:

- durable writes to `elmakus/Codex-fix-pooling`: available;
- branch/file/Git-object writes to an already existing accessible repository: available;
- repository creation/fork action for creating the absent `elmakus/codex` carrier: **not exposed by the current GitHub connector/tool surface**;
- isolated local runtime: available, but `rustc` and `cargo` are both absent;
- therefore a reproducible Codex source build, required unit/build checks, `--version`, architecture and SHA-256 identity for the resulting candidate cannot be produced in this session.

## Why this blocks the card

The card Definition of Done requires both a controlled owned carrier and a successfully built isolated candidate whose source, toolchain, version, architecture and SHA-256 are durable and verified.

Creating only documentation or preparing a patch without the actual carrier/build would not satisfy acceptance. Reusing a stale prebuilt binary is explicitly prohibited. Under `chatgpt_only`, missing required capability means BLOCKED rather than automatic Codex handoff.

## No side effects performed

- no `elmakus/codex` repository/fork was created;
- no external Codex repository was mutated;
- no patch was applied/rebased/cherry-picked;
- no custom Codex runtime was built;
- no Community package/runtime was modified;
- no production install was touched.

## Smallest unblock condition

Resume the same M02-T03 card only in a normal ChatGPT session that has both:

1. GitHub capability to create/fork or otherwise provision the owned `elmakus/codex` carrier (or the carrier is created by the user beforehand and exposed to the connector with write access); and
2. an isolated Rust/Cargo build environment capable of cloning/materializing the selected source, building Codex for the required Linux architecture, running required build/unit checks, and hashing/inspecting the produced binary.

The card remains assigned to no executor because the Capability Gate failed before assignment.
