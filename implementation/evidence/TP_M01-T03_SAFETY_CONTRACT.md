# TP_M01-T03 Evidence — Protected-output and threshold safety contract

Date: 2026-09-12
Executor: ChatGPT
Baseline: `openai/codex@944d6fd1ba4baab69dbedd205282dc72ec20abb5`
Inputs:
- `TP_M01-T01_BASELINE_ARCHITECTURE.md`
- `TP_M01-T02_PRUNING_EQUIVALENCE.md` (`NOT_EQUIVALENT`)

## 1. Safety objective

A future pruning implementation may remove model-request payload only when doing so has low diagnostic/durability risk and meaningful context benefit. Canonical thread/history state is not destroyed merely to obtain token savings.

Default posture: **unknown or ambiguous output is protected**. Eligibility is proven, not assumed.

## 2. Canonical-history invariant

Normal pruning MUST operate on a derived request payload, not on the canonical `ContextManager`/rollout solely for context savings.

Testable invariant:

1. capture canonical history before request construction;
2. build request payload;
3. apply pruning to the derived payload;
4. verify the outbound/model-visible payload may differ only in eligible output bodies;
5. verify canonical history/rollout remains byte/semantic-equivalent except for unrelated normal session events;
6. on retry/rebuilt request input, apply the same classification/pruning rules again rather than relying on one initial transform.

Compaction remains a separate upstream mechanism and may legitimately rewrite/reset model history under its own contract. Pruning must not hide behind compaction semantics to weaken this invariant.

## 3. Current representation trace

Current relevant `ResponseItem` categories:

- `FunctionCall` / `FunctionCallOutput`
- `CustomToolCall` / `CustomToolCallOutput`
- `ToolSearchCall` / `ToolSearchOutput`
- model/user/developer messages, reasoning, web search/image-generation items and compaction items are not pruning candidates for this feature.

Standard/custom outputs both carry `FunctionCallOutputPayload`; payloads can be plain text or structured content and carry optional `success` metadata. `FunctionCallOutput.call_id` is optional; custom output call ID is required. Tool name can be present on output and/or recovered from its paired call.

Current `apply_patch` is represented through custom-tool machinery in current tests/source and can produce an output named `apply_patch`, so protection cannot assume only the historical standard-call path.

## 4. Protected-output candidate policy

### 4.1 Always protected

The following MUST NOT be pruned by TP_M02 unless a later accepted decision explicitly changes this contract with new evidence:

1. **Failed outputs**
   - any `FunctionCallOutput` or `CustomToolCallOutput` with `success == Some(false)`;
   - rationale: failure text is often the only diagnostic evidence needed for later correction.

2. **Unknown success where safety classification depends on success**
   - `success == None` is not treated as success by default;
   - it may become eligible only for an explicitly classified tool/output family whose success semantics are independently known.

3. **`apply_patch` and equivalent direct mutation evidence**
   - paired call or output name `apply_patch` is protected;
   - if a current/future tool directly mutates files, Git state, configuration or another durable target and its output is the primary model-visible mutation record, default to protected until explicit classification exists.

4. **Unclassifiable output**
   - missing/unresolvable call identity or name when name is needed for safety classification;
   - unknown new output variant;
   - malformed pairings where normal history normalization cannot provide a trusted call/output relationship.

5. **Structured/media output not safely reducible to text**
   - payloads containing images/audio/structured content stay protected initially;
   - historical `d70b903` effectively reasons about text token cost; TP_M02 must not silently replace richer payloads without dedicated tests.

6. **Current-turn / recent-turn region**
   - no pruning inside the current user-turn region;
   - candidate baseline retains the historical semantic floor of crossing at least two user-input boundaries before an output becomes age-eligible;
   - T04 may validate a more conservative policy but must not reduce this floor without explicit quality evidence.

7. **Newest protected output budget**
   - even outside the turn-recency region, retain a configurable budget of the newest otherwise-eligible output content before older output can be pruned;
   - historical `40k` is the starting benchmark input, not a frozen value.

8. **Tool discovery / capability evidence (`ToolSearchOutput`)**
   - protected for the first implementation unless T04/TP_M02 produces dedicated evidence that clearing older search-result inventories does not break later tool reasoning;
   - rationale: these outputs can affect what capabilities the model believes were discovered/available.

9. **Outputs marked or classified as durable evidence by future tool metadata/policy**
   - the classifier must have a fail-closed extension point; newly introduced tool classes are not automatically eligible.

### 4.2 Initially eligible family

A tool output may become a pruning candidate only when ALL applicable conditions hold:

- item is a text-only `FunctionCallOutput` or `CustomToolCallOutput`;
- call identity/name is trusted enough for safety classification;
- `success == Some(true)` OR the tool family has an accepted success-independent safe policy;
- tool is classified as non-durability-sensitive/replayable diagnostic noise (for example verbose successful read/exec-like output, subject to T04 quality tests);
- output is outside the protected user-turn region;
- output is older than the newest protected-output token budget;
- aggregate candidate savings exceeds the minimum-benefit gate;
- replacement preserves call/output structural validity and success metadata;
- canonical history is unchanged.

This is deliberately stricter than “old successful output is disposable.”

## 5. Tool-family classification model

TP_M02 should avoid a brittle blacklist-only design. Recommended semantic classes:

- `PROTECTED_FAILURE`
- `PROTECTED_MUTATION_EVIDENCE`
- `PROTECTED_DISCOVERY_OR_CAPABILITY`
- `PROTECTED_STRUCTURED_OR_UNKNOWN`
- `ELIGIBLE_REPLAYABLE_VERBOSE`
- `UNKNOWN_PROTECTED`

Tool-name rules may seed classification (`apply_patch` is a mandatory protected seed), but unknown names/classes fail closed. A future explicit allowlist or metadata-based classifier is safer than assuming every newly added function/custom tool is eligible.

## 6. Threshold analysis

Historical values:

- protected newest-output budget: `40_000` approximate tokens;
- minimum candidate savings: `20_000` approximate tokens.

These values came from the historical patch and are **not frozen** because current Codex now has:

- model-specific context windows;
- server token usage plus local post-model estimates;
- per-tool truncation before outputs enter request history;
- automatic compaction thresholds;
- token-budget mode;
- local and remote compaction paths;
- context-window overflow recovery that may rewrite tool outputs during compaction.

Therefore fixed historical constants can be too aggressive for small windows and too conservative for large windows.

### Required threshold decision inputs for TP_M02/T04

1. exact model context window used by the fixture;
2. current auto-compaction threshold/limit and configured scope;
3. current request-context estimate before pruning;
4. total eligible tool-output estimate;
5. newest eligible-output estimate retained by the protection budget;
6. candidate removable estimate;
7. actual/estimated outbound request reduction after replacement overhead;
8. number of user-turn boundaries crossed;
9. whether upstream per-tool truncation already reduced candidate payload materially;
10. whether pruning changes when compaction would otherwise trigger;
11. task continuation/diagnostic outcome on identical histories.

### Candidate threshold shape

Do not freeze implementation values in TP_M01. TP_M02 should support a policy equivalent to:

- `protected_recent_tokens = max(absolute_floor, fraction_of_effective_context_window)` or another evidence-backed model-relative rule;
- `minimum_savings = max(absolute_floor, fraction_of_effective_context_window)` OR a paired absolute/relative gate;
- candidate must also be outside the user-turn recency floor.

The historical `40k/20k` pair MUST be included as one T04 benchmark point because it is provenance behavior. T04 should compare it with model-relative alternatives.

No final percentages/floors are accepted here; selecting them without benchmark evidence would be premature.

## 7. Fail-closed ambiguity rules

Pruning MUST be disabled/skipped for the affected output/request when:

- tool/output category cannot be safely classified;
- call/output pairing needed for classification is missing or ambiguous;
- token estimate overflows/fails in a way that could understate protected or removable content;
- structured content cannot be safely represented by the replacement contract;
- canonical-history/request boundary cannot be verified;
- current model context/threshold inputs are unavailable for a policy that depends on them;
- a retry/request regeneration path would bypass pruning classification;
- tests do not cover a newly introduced output class.

Fail-closed means “retain content,” not “drop content more aggressively.”

## 8. Semantic tests derivable for TP_M02

Minimum future test set:

1. disabled feature => request identical;
2. below minimum-benefit => request identical;
3. current and immediately preceding protected turn regions remain intact;
4. newest protected-output budget remains intact;
5. old successful allowlisted verbose output becomes replaceable only after all gates pass;
6. failed standard output remains intact;
7. failed custom output remains intact;
8. `apply_patch` output remains intact whether represented through standard/custom path or output-name metadata;
9. unknown tool/output class remains intact;
10. missing call mapping remains intact;
11. structured/media output remains intact unless explicitly supported;
12. `ToolSearchOutput` remains intact under initial policy;
13. standard/custom eligible text outputs follow the same threshold semantics;
14. replacement preserves success/identity metadata needed for valid request structure;
15. canonical history remains unchanged after request preparation;
16. retry/regenerated prompt receives the same pruning policy;
17. interaction with subsequent compaction remains valid.

These cover R6 and the semantic cases required by R19.

## 9. Independent safety review

Second-pass review questions and result:

- Does policy protect all R6 categories? **Yes**: failures, apply-patch/mutation evidence, recent output, only-model-visible/durability-sensitive output and new/unknown classes fail closed.
- Does policy cover both current standard/custom output forms? **Yes**.
- Does it account for new `ToolSearchOutput`? **Yes; protected initially**.
- Does it mistake current compaction/recovery for safe ordinary pruning? **No**.
- Does threshold reasoning use current context/accounting architecture rather than only 40k/20k? **Yes**.
- Does any unresolved ambiguity prevent safe TP_M01 continuation? **No**; ambiguities are converted into protected/fail-closed behavior. Numeric threshold selection remains intentionally deferred to evidence from T04/TP_M02.

## 10. T03 outcome

Safety contract is sufficiently explicit for T04 and later TP_M02 design. No final numeric threshold is frozen. Unknown categories remain protected, so the remaining threshold uncertainty is not itself a safety blocker for continuing discovery.

No pruning implementation or runtime mutation was performed.
