# Codex execution kickoff — M02 best-effort MVP

Use current `main` of `elmakus/chatgpt-codex-project-workflow` and start at `CHATGPT.md`.

Project repo: `elmakus/Codex-fix-pooling`
Branch: `main`
Completed preparation checkpoint: `M02_MVP_HANDOFF_READY`
Accepted implementation head: `1298fae794050c40894ad9abfa69d5556d3790dd`
Durable start pointer: `project-handoffs/M02_HANDOFF.md`
Acceptance evidence: `implementation/evidence/M02_ACCEPTANCE.md`

This is the maximum best-effort MVP ChatGPT could prepare without the target build/runtime environment. Do not restart the project. Inspect and use the prepared implementation, adapt only where real build/source/runtime evidence requires it, then finish build/test/debug/verification.

Recover durable state from `PROJECT.md`, `implementation/TASK_BOARD.yaml`, the M02 handoff, active OpenSpec, and the T03/T04/T05 evidence linked there. Verify project branch/HEAD and run the workflow Refresh Gate before editing. Refresh both `openai/codex` and `ilysenko/codex-desktop-linux`; do not assume remembered external HEADs.

Execute the ordered continuation in `project-handoffs/M02_HANDOFF.md`:

1. inspect prepared runtime and Community material;
2. refresh strict upstream equivalence and exact external baselines;
3. apply/adapt the runtime wakeup change only where current source requires it;
4. build/test the runtime and record exact source/toolchain/version/architecture/SHA-256 provenance;
5. apply the prepared `custom-codex-runtime` Community overlay to the exact refreshed Community source;
6. run source, candidate/package, PASS/FAIL/UNKNOWN, wakeup, app-server and Desktop tests;
7. repair concrete incompatibilities while preserving the frozen invariants;
8. verify changed-baseline/update and rollback readiness where the environment permits;
9. persist exact commands, logs, identities, PASS/FAIL/UNKNOWN evidence, result commits/PRs, OpenSpec reconciliation and durable project state.

Do not weaken these frozen invariants merely to obtain a green build: official package verification remains first; stock `resources/codex` is captured before custom substitution; package authority is candidate-tree `resources/codex`; the feature is opt-in/default-off; only PASS admits custom substitution; FAIL/UNKNOWN fail closed; no normal live-tree overwrite, post-install replacement, second updater or background replacement service; feature-off stock reconstruction is distinct from package rollback; explicit runtime overrides are diagnosed; new official package tuples invalidate old admission evidence.

The prepared runtime recipe deliberately leaves the current active-or-idle turn-start API binding UNKNOWN because historical `Session::inject_or_start` has drifted. Resolve that against current source and prove idle wake, active-turn push and duplicate suppression with tests rather than guessing.

Do not mark any unexecuted check PASS. If a build/test fails, preserve the exact command, failure/logs and source location, make the smallest evidence-driven repair consistent with the frozen contract, and continue. Escalate strategically only if refreshed evidence truly contradicts the frozen architecture or requires user authorization.

Do not install or modify the production ChatGPT Community installation during this execution unless the user separately gives explicit authorization after sufficient verification.
