# TP_M02-T06 — Freeze patch provenance and integrated acceptance package

- Decision state: `ACCEPTED`
- Execution status: `PLANNED`
- Executor: `null`
- Milestone: `TP_M02`
- Priority: `HIGH`
- Complexity: `MEDIUM`
- Phase: `verification / milestone close preparation`

## Dependencies

- `TP_M02-T05`

## Expected code locations

- project-owned patch carrier and provenance metadata
- `implementation/evidence/TP_M02-*`
- `implementation/TASK_BOARD.yaml`
- future `project-handoffs/TP_M02_HANDOFF.md` only after GREEN integrated acceptance

## Canonical sources

- Requirements: R1, R2, R13, R14, R19
- Master Plan: TP_M02 acceptance / `TP_M02_PATCH_GREEN`
- JIT OpenSpec: `openspec/changes/tp-m02-tool-output-pruning/`
- Prior TP_M02 card evidence

## OpenSpec

- Required/candidate: `required`
- Change: `openspec/changes/tp-m02-tool-output-pruning/`

## Outcome

Assemble the exact intended-final TP_M02 implementation state, provenance and deterministic verification package required for a fresh independent milestone acceptance review.

## Scope

### Included

- record exact upstream base SHA;
- record exact project patch/change commits and reproducible carrier identity;
- record exact changed upstream paths represented by the patch carrier;
- consolidate exact T01-T05 test commands/results/evidence pointers;
- verify OpenSpec implementation task consistency;
- verify no unrelated `tekacs/custom-cli` changes or Community/package behavior entered TP_M02;
- verify no runtime install/substitution/deployment occurred;
- prepare branch state for required fresh independent TP_M02 acceptance review.

### Excluded

- TP_M03 effectiveness/quality acceptance;
- Community/Desktop integration;
- production runtime build/install/substitution;
- declaring milestone GREEN without independent review.

## Constraints

- provenance must distinguish behavior-equivalent reimplementation from historical direct rebase/cherry-pick;
- exact tested upstream/source state and project change state must be recoverable;
- this card cannot self-approve `TP_M02_PATCH_GREEN`.

## Acceptance

- complete exact provenance package exists;
- all preceding required cards are DONE with result pointers;
- all R19/OpenSpec tests are durably referenced and GREEN;
- intended-final implementation head is explicit;
- no unreviewed scope drift is present;
- a fresh independent normal ChatGPT review can decide TP_M02 acceptance solely from durable repository/source evidence.

## Required tests / checks

- read back exact project branch HEAD and patch carrier state;
- verify patch applies/is represented against exact recorded upstream base using the T00 lane;
- rerun only the integrated deterministic test set needed to establish intended-final state when prior evidence is not sufficient/current;
- OpenSpec task/spec consistency check;
- git diff/path-scope audit.

## External write/readback needs

Project Git only. All final provenance/evidence/Task Board writes must be read back before requesting independent milestone review.

## Independent review

`REQUIRED` at milestone acceptance after this card: fresh normal ChatGPT chat reviews intended-final branch/patch state, OpenSpec, exact tests and safety evidence. GREEN is required before checkpoint `TP_M02_PATCH_GREEN` may be recorded.

## Refresh Gate

Before execution reconcile exact upstream main/base, project branch, completed dependencies, OpenSpec and all result pointers. Material upstream drift does not silently change the already-tested base; it must be classified according to Refresh Gate before acceptance/publication claims.

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
