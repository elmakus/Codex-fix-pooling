# Pre-implementation plan audit — 2026-09-12

## Verdict

**GREEN after P1 planning correction.** No blocker requires a new user architecture decision before M01 Execution Prep.

## Audited authority and fresh public baselines

- Workflow authority: `elmakus/chatgpt-codex-project-workflow:main`.
- Project plan before correction: `planning/MASTER_PLAN.md` at project `main` commit `e2be0300015ee6c32217af02b05504abf91e0b55`.
- `ilysenko/codex-desktop-linux` audited current main: `249cd4b64d42434f51417fec4a318750d461b676` (2026-09-11), carrying official Linux release `26.908.40834` in its latest repair commit.
- `openai/codex` observed current main during audit: `89c8bcf37d64be69e4c8286f4541c1a84ed312a4` (2026-09-12).
- Reference patch: `tekacs/codex@9ffcf8db9078eae43d4111ff94259795c1e962c9`.

## Findings

### P1 — M01 scope was too narrow for a safe M02 handoff — corrected

The original M01 named bundled-runtime identity, source mapping, upstream equivalence, compatibility inputs and patch-carrier choice, but did not explicitly require several facts that the later feature design depends on:

1. exact acquisition/staging path by which the verified official package's `resources/codex` reaches Community output;
2. Desktop/app-server protocol inventory and drift-sensitive surfaces;
3. current `CODEX_CLI_PATH` semantics;
4. current feature framework and packaged update-builder/update-manager persistence constraints;
5. explicit patch refresh lifecycle per new official baseline;
6. a concrete minimum pre-M02 acceptance/test matrix.

These omissions could have allowed M01 to become GREEN while M02 still depended on unverified architecture assumptions. `planning/MASTER_PLAN.md` was corrected to make them explicit acceptance requirements.

### P1 — compatibility gate semantics needed stronger identity and UNKNOWN handling — corrected

A human-readable Desktop/Codex version is insufficient as the sole compatibility key. The corrected plan binds compatibility to exact official package identity plus bundled-runtime identity and requires a source-revision mapping verdict. If deterministic mapping is unavailable, the project must document a safe alternative proof; unresolved ambiguity is `UNKNOWN`, and both `FAIL` and `UNKNOWN` prohibit substitution.

### P1 — patch carrier ownership was left too open for a maintainable refresh loop — corrected without forcing implementation

Directly building an arbitrary moving `tekacs/codex` branch would make baseline rebases, CI, provenance and retirement dependent on another maintainer's branch state. The plan now prefers an owned `elmakus/codex` fork as the controlled patch carrier unless M01 produces evidence for another choice. `tekacs/codex@9ffcf8d` remains the authoritative provenance of the original fix. No fork/rebase/cherry-pick is authorized or performed in M01 discovery.

### Current upstream equivalence is not established

Fresh inspection of `openai/codex` main found the ordinary unified-exec tool description still present rather than the reference patch's explicit runtime-completion/no-empty-polling guidance. This is evidence that strict equivalence is not presently established. It is not sufficient by itself for a final equivalence verdict because R4 requires behavioral checks for idle wake, active-turn delivery and duplicate suppression as well. M01 owns the complete verdict against its exact acquired baseline.

### Update persistence architecture is promising but must be treated as a contract to verify

Current `codex-desktop-linux` documentation states that the packaged update-builder extracts the official payload, applies only locally enabled features, rejects enabled-feature drift, builds a candidate beside the active install, promotes atomically after app exit, and retains the immediately previous managed package for rollback. This strongly supports the proposed feature architecture, but M01 must trace the actual current source/config snapshot path before M02 relies on it.

### `CODEX_CLI_PATH` is a real existing seam, not yet the selected mechanism

Current source/docs show default use of bundled `resources/codex`, Nix support for an alternate CLI package via `CODEX_CLI_PATH`, and preservation of an explicit `CODEX_CLI_PATH` by the shared-app-server-socket feature. This proves an alternate CLI path is supported in parts of the system, but does not yet decide whether M02 should redirect via environment or stage/replace the package resource. That remains a post-M01 design choice.

## Milestone/dependency audit

M01 → M02 → M03 → M04 → M05 → M06 remains a sensible high-level order. M01 must finish before feature contract/design because the safe substitution contract depends on baseline identity and protocol evidence. Patch behavior verification remains separate from Desktop integration verification, which prevents a Desktop failure from being confused with a broken patch. Update persistence remains after feature and Desktop integration are green because it exercises the refresh lifecycle. Release/upstreamability remains last.

No new milestone is needed.

## Fail-closed and rollback audit

The plan now makes `UNKNOWN` a first-class compatibility result that prohibits substitution. Existing Community update architecture already provides candidate-before-promotion and previous-package rollback semantics; M02/M05 must integrate with those semantics rather than invent a second updater or post-install binary mutation path.

## OpenSpec audit

No OpenSpec is required for M01 because it is research/discovery and defines no new implemented behavior. Re-evaluate immediately before M02. The feature settings/provenance/compatibility contract and updater behavior are likely OpenSpec candidates once M01 has identified actual source seams.

## Overengineering audit

No additional compatibility service, generic DAG engine, external metadata database, independent updater, or generalized arbitrary-binary injection framework is justified. The minimal target remains one opt-in Community feature, one controlled patch carrier, baseline-relative refresh, deterministic compatibility evidence, and existing package/update infrastructure.

## Result

The corrected plan is suitable for M01 Execution Prep. No strategic user decision is required before preparing or executing M01 discovery.
