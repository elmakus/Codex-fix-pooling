# TP_M02-T00 — Establish verifiable exact-upstream Rust patch/test lane

- Decision state: `ACCEPTED`
- Execution status: `BLOCKED`
- Executor: `null`
- Milestone: `TP_M02`
- Priority: `HIGH`
- Complexity: `MEDIUM`
- Phase: `capability correction / implementation preparation`

## Dependencies

- `TP_M01_DISCOVERY_GREEN`

## Expected code locations

- project-owned patch-carrier support paths in `elmakus/Codex-fix-pooling`
- ephemeral exact-source checkout/worktree for `openai/codex@53ff712a48379ce8df605e292afd6046ca88ae9b`
- optional project CI workflow only if required to provide the test lane

## Required capabilities

- exact Git source checkout/materialization
- Rust/Cargo compile and test execution, or equivalent triggerable/readable CI
- durable test/log/status readback attributable to exact tested SHA

## Canonical sources

- Requirements: R13, R14, R17 in `requirements/REQUIREMENTS.md`
- Accepted decisions: TP_M01 acceptance/safety/strategy evidence
- Master Plan: TP_M02, verification strategy, no production deployment
- Latest cumulative handoff: `project-handoffs/TP_M01_HANDOFF.md`

## OpenSpec

- Required/candidate: `required`
- Change: `openspec/changes/tp-m02-tool-output-pruning/`

## Outcome

Create and verify the execution/evidence lane required for normal ChatGPT to implement TP_M02 against exact current upstream source without modifying public upstream repositories or installing/deploying a custom runtime.

## Scope

### Included

- choose/finalize the durable project-owned patch carrier path;
- materialize or otherwise test against exact upstream `53ff712a...`;
- prove affected Rust crates can be checked/tested;
- prove ChatGPT can obtain exact command/status/log evidence and readback;
- record baseline compile/test command set to be used by later cards.

### Excluded

- any pruning behavior implementation;
- feature/config changes for pruning;
- custom runtime build/package/install/deployment;
- Community Desktop mutation;
- executor-policy change.

## Constraints

- `execution_policy: chatgpt_only`;
- do not modify `openai/codex`, `tekacs/codex` or `ilysenko/codex-desktop-linux` remotes;
- no second project repository/fork without explicit topology decision;
- patch carrier must preserve exact upstream-base provenance;
- this card is corrective capability work, not pruning coding.

## Acceptance

- exact upstream base `53ff712a...` can be materialized reproducibly;
- project-owned carrier location and apply/rebuild method are durable;
- `cargo`/Rust or equivalent CI successfully runs a baseline focused command set;
- ChatGPT can read back exact success/failure evidence;
- no pruning source diff exists at card close;
- blocker `implementation/blockers/TP_M02_CAPABILITY_GATE.md` is reconciled as resolved.

## Required tests / checks

At minimum establish successful baseline ability to run:

- Rust formatting/check path appropriate to changed crates;
- focused core/features/config test command(s);
- one `codex-rs/core/tests/suite/` test target or equivalent integration harness;
- Git diff/status proving no pruning behavior change during T00.

Exact commands are selected from the materialized current source and recorded in evidence.

## External write/readback needs

If repository CI is used, any workflow/config write must be read back; each triggered build/status/log used for acceptance must be attributable to exact commit/source state. Otherwise project Git writes only.

## Refresh Gate

Before execution compare current project branch/HEAD, current upstream `main`, Community baseline, latest handoff, this card, OpenSpec, capability blocker and available execution tools. If upstream has materially advanced again, perform bounded Refresh Gate reconciliation before establishing the lane.

## Blocker / escalation

Current blocker: the preparation session exposes no `cargo`, `rustc`, `rustup`, Docker or Podman and no pre-existing equivalent CI lane. Under `chatgpt_only`, remain BLOCKED until the user/session environment supplies a valid path. Do not route to Codex.

## Result

- result_commit:
- result_pr:
- evidence:
- tests_summary:

## Definition of Done

- [ ] Included scope complete
- [ ] Acceptance satisfied
- [ ] Required tests/checks executed
- [ ] Tests green or authorized exception recorded
- [ ] Relevant OpenSpec satisfied
- [ ] No hidden blocker
- [ ] Result durable in Git
- [ ] Task Board reconciled
- [ ] Executor/result pointers recorded
- [ ] Evidence identifies exact verification
- [ ] Material external writes read back/verified where required
- [ ] No unassigned TODO in accepted scope
