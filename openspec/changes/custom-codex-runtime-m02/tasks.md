# Tasks — custom-codex-runtime M02

## M02-T03 — Controlled Codex carrier and reproducible runtime provenance

- [ ] Refresh strict upstream-equivalence status before creating divergence.
- [ ] If divergence is still required, create/use owned `elmakus/codex` as controlled carrier.
- [ ] Pin exact upstream baseline SHA and reference patch provenance.
- [ ] Produce isolated target runtime build using controlled build profile.
- [ ] Record source, upstream, patch/equivalence, target, toolchain, version and binary SHA-256.
- [ ] Leave production Community installation untouched.

## M02-T04 — Community feature and fail-closed candidate substitution

- [ ] Add opt-in `custom-codex-runtime` feature manifest/settings contract.
- [ ] Preserve official package verification and capture original stock `resources/codex` identity.
- [ ] Integrate controlled custom runtime acquisition/build into candidate construction.
- [ ] Implement PASS/FAIL/UNKNOWN gate handling.
- [ ] Replace candidate-tree `resources/codex` only on PASS.
- [ ] Verify final candidate runtime digest matches recorded custom runtime identity.
- [ ] Emit durable provenance/gate/package diagnostics.
- [ ] Ensure disabled feature reconstructs untouched official `resources/codex`.
- [ ] Diagnose explicit runtime overrides that bypass package-selected authority.
- [ ] Reuse existing Community update-builder/updater; add no live-tree overwrite mechanism.

## M02-T05 — Package-level verification and rollback readiness

- [ ] Verify feature-off stock candidate path.
- [ ] Verify controlled PASS fixture/candidate selects expected `resources/codex` replacement.
- [ ] Verify FAIL rejects custom-enabled candidate.
- [ ] Verify UNKNOWN rejects custom-enabled candidate.
- [ ] Read back provenance metadata and final binary identity.
- [ ] Verify candidate-construction failure leaves current package untouched in isolated test model.
- [ ] Verify disabling feature yields stock rebuild with no stale custom binary.
- [ ] Verify compatibility with existing previous-managed-package rollback mechanics where possible without production mutation.
- [ ] Record clearly that M02 evidence is package-mechanics evidence only and does not close M03/M04/M05 acceptance.

## Deferred milestones

- [ ] M03: strict wakeup semantics, idle wake, active-turn delivery, duplicate suppression and valid `write_stdin` behavior.
- [ ] M04: exact Desktop/app-server integration matrix with the selected runtime.
- [ ] M05: changed official package tuple, feature persistence, re-evaluation, patch refresh/retirement and stale-PASS invalidation.
