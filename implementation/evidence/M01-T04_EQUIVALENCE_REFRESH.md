# M01-T04 Evidence — Upstream equivalence, refresh lifecycle, and patch carrier

Date: 2026-09-12
Executor: ChatGPT

## Reference behavior

Authoritative patch: `tekacs/codex@9ffcf8db9078eae43d4111ff94259795c1e962c9` (`wake model when background exec commands complete`).

Strict equivalence requires all four R4 surfaces:

1. a unified-exec command that yielded and later exits produces model-visible completion input that can wake an idle session;
2. the same pushed completion can be delivered into an active turn;
3. a command that already returned its terminal result inline does not generate a duplicate pushed completion;
4. model-facing `exec_command` / `write_stdin` guidance tells the model not to empty-poll solely for completion while preserving polling for interaction/intermediate output.

The reference implementation adds an `ExecCompletion` contextual user fragment, wake-on-exit gating, delivery through the active-or-idle pushed-input path, duplicate suppression through the gate state, guidance changes, and regression tests.

## Baselines kept separate

### Exact official Desktop bundled runtime

T02 could not deterministically map the signed Desktop `26.908.40834` bundled runtime to a public `openai/codex` source commit because the exact binary could not be downloaded/executed in the current isolated environment and Community metadata does not record a Codex Git revision.

Therefore the strict equivalence verdict for the **exact bundled runtime** is:

**UNKNOWN**

Per R9/A5, UNKNOWN is not sufficient to retire the patch.

### Current public `openai/codex:main`

Execution-time refresh moved public `main` from T02's observed `89c8bcf37d64be69e4c8286f4541c1a84ed312a4` to:

`944d6fd1ba4baab69dbedd205282dc72ec20abb5`

The intervening commit concerns voice caption handling and does not implement the reference wakeup behavior.

## Four-part current-public-main equivalence matrix

### 1. Idle-session wake from yielded unified-exec completion

Verdict: **NOT PROVEN / absent by source search; strict matrix = FAIL**.

Current source does emit ordinary command completion/end events for unified exec and can retain late completion information. That is not equivalent to injecting model-visible input into an idle session.

Searches for the reference mechanisms/markers (`exec.completion`, `wake_on_exit`, `inject_or_start` in this context) do not find a corresponding current-main implementation.

### 2. Active-turn pushed completion delivery

Verdict: **NOT PROVEN / strict matrix = FAIL**.

Current upstream has mechanisms for asynchronous context in other domains and normal exec-end notifications/history, but no evidence was found that a yielded unified-exec process exit injects the reference model-visible completion fragment into an active turn.

A normal `ExecCommandEnd`/history event is not treated as equivalent to model input.

### 3. Duplicate suppression when original call returns terminal result inline

Verdict: **NOT PROVEN / strict matrix = FAIL**.

Because the model-visible pushed completion path itself is not established, there is no corresponding proven wake-gate/duplicate-suppression contract equivalent to the reference patch.

Late analytics/event de-duplication is not sufficient evidence: it solves a different consumer/path.

### 4. Tool guidance against empty polling

Verdict: **FAIL**.

Current public source still exposes the ordinary `exec_command` description (`Runs a command in a PTY, returning output or a session ID for ongoing interaction.`) and current tests/source still contain explicit stdin polling behavior. Searches do not find the reference guidance telling the model to wait for a separate runtime completion notification.

This single failure is already enough to conclude current public main is not strictly equivalent even if another internal completion event were later found.

## Telemetry/event lookalikes are not equivalence

OpenAI upstream contains work such as `Track plugin metrics for background unified exec commands (#38276)` (`96e8afbfb88198cac64c4bc8fa88d027e98b2af8`). That work keeps analytics state alive until a background command exits and avoids duplicate analytics events.

It must **not** be used as retirement evidence for this patch. Metrics/command history events are not model-visible pushed input and do not prove idle-session wake or active-turn continuation.

## Overall verdicts

- Exact official Desktop `26.908.40834` bundled runtime: **UNKNOWN** because source/runtime mapping is unavailable in current evidence.
- Current public `openai/codex:main@944d6fd1ba4baab69dbedd205282dc72ec20abb5`: **NOT EQUIVALENT** to the strict four-part reference contract.
- Patch retirement: **NOT ALLOWED** on current evidence.

## Refresh algorithm for every future official Desktop baseline

The refresh order is intentionally fail-closed.

### Step 1 — Bind exact official baseline

Record:

- Desktop package version;
- architecture;
- signed repository path;
- official `.deb` SHA-256;
- bundled runtime `--version` and SHA-256 when bytes are available;
- exact Community source commit used to perform the rebuild.

### Step 2 — Try deterministic source mapping

Attempt the T02 version/tag/asset-digest procedure.

Result must be one of:

- deterministic source commit;
- safely derivable candidate requiring additional binary verification;
- unavailable.

Never invent a commit from date/version proximity.

### Step 3 — Check strict upstream equivalence before patching

Against the exact mapped source when available, otherwise against the candidate source to be built, check all four reference semantics and tests.

Outcomes:

- `EQUIVALENT`: do not apply custom divergence; use stock/equivalent runtime and record retirement evidence for that baseline.
- `NOT_EQUIVALENT`: patch is still required.
- `UNKNOWN`: patch cannot be retired; later substitution still requires full compatibility proof.

### Step 4 — Select controlled source baseline

Prefer the exact mapped public source commit when obtainable. If mapping is unavailable, choose a documented public source candidate only if the later exact Desktop compatibility gate can prove it safe; source similarity alone never authorizes replacement.

### Step 5 — Refresh patch on owned carrier

Use the owned carrier to rebase/refresh the minimal change set onto the selected OpenAI source baseline.

Rules:

- no blind reuse of an old binary;
- no automatic conflict resolution that changes semantics silently;
- patch/rebase conflict => FAIL/BLOCK;
- record upstream base SHA, patch commit(s), resulting carrier SHA and binary identity.

### Step 6 — Run patch-level semantic tests

Require all four behavior surfaces plus direct regression tests for wake gating/pushed completion/duplicate suppression/guidance.

### Step 7 — Run exact Desktop compatibility gate

Only after patch behavior is green, run the T05 protocol/Desktop matrix against the exact official Desktop baseline.

### Step 8 — Stage candidate only on PASS

`PASS` permits package-level custom-runtime selection. `FAIL` or `UNKNOWN` leaves custom substitution disabled/rejected for that candidate.

## Patch carrier decision

Decision: **use an owned `elmakus/codex` fork as the controlled patch carrier for implementation**, while retaining `tekacs/codex@9ffcf8d` as immutable source provenance for the original change.

Reasons:

- control over branch/tag/rebase lifecycle;
- durable provenance independent of a third-party fork moving or disappearing;
- ability to keep the carrier baseline aligned with the exact OpenAI source chosen for each Desktop refresh;
- clear separation between original patch authorship/source and our maintenance branch;
- safer automation/audit because source base + patch commits + build output can all be pinned in owned state.

This does **not** justify a permanent fork divergence. The owned fork is a maintenance carrier that should converge back to upstream whenever strict equivalence is proven.

Directly building `tekacs/codex` remains useful as a research/reference input but is not the preferred long-lived production carrier.

No fork was created, rebased or modified during M01.

## T04 conclusion

There is no evidence allowing the custom patch to be retired. Current public OpenAI main is not strictly equivalent, while the exact Desktop-bundled runtime remains UNKNOWN because its source revision is not mapped. The project should therefore enter M02 assuming a controlled divergence may still be required, carried in `elmakus/codex`, with equivalence checked before every refresh and substitution authorized only after patch semantics plus exact Desktop compatibility are green.
