# TP_M01-T04 Evidence — Effectiveness benchmark and quality regression matrix

Date: 2026-09-12
Executor: ChatGPT
Baseline: `openai/codex@944d6fd1ba4baab69dbedd205282dc72ec20abb5`
Inputs:
- `TP_M01-T01_BASELINE_ARCHITECTURE.md`
- `TP_M01-T03_SAFETY_CONTRACT.md`

## 1. Benchmark objective

Prove or reject that pruning is worth carrying as custom divergence by measuring the same deterministic conversation/tool history with pruning disabled and enabled, while separately enforcing safety/continuation quality.

The benchmark MUST NOT treat smaller logs, repository size or canonical-history size as a proxy for model-request savings. It measures the actual model request or a validated estimator over the exact request object.

## 2. Primary and secondary metrics

### Primary metric — estimated request tokens

Use the current baseline's request-token estimator over the built Responses request (`guardian/request_budget.rs::estimate_request_tokens`) or the same underlying request serialization/accounting path extracted into test-accessible code.

For each paired case record:

- `tokens_disabled`
- `tokens_enabled`
- `tokens_saved = tokens_disabled - tokens_enabled`
- `reduction_ratio = tokens_saved / tokens_disabled`

This is the primary effectiveness metric because it is source-grounded in current request accounting and operates on the actual request shape rather than unrelated process/log metrics.

### Secondary metrics

Record, when available:

- serialized request input bytes disabled/enabled;
- count of pruned output items;
- estimated tokens replaced per output;
- replacement-marker overhead;
- total eligible vs protected tool-output estimate;
- whether pruning changed a pre-sampling compaction decision/threshold crossing;
- provider-reported input-token usage only as corroboration, not primary truth, because server caching/accounting can differ between runs.

## 3. Paired comparison invariant

Every effectiveness pair MUST share:

- identical canonical `ContextManager`/rollout fixture;
- identical model info/context window;
- identical tools and configuration except pruning enablement/policy parameters;
- identical request-construction point;
- identical ordering and metadata;
- no model-generated stochastic continuation between disabled/enabled measurements.

Preferred unit/integration harness:

1. construct or replay deterministic canonical history;
2. snapshot/hash canonical history;
3. build disabled request;
4. reset to the identical snapshot;
5. build enabled request;
6. measure both;
7. assert canonical snapshot unchanged after each request build.

This makes the effectiveness comparison deterministic and prevents a model response from contaminating the token delta.

## 4. Deterministic fixture set

### F1 — Old verbose successful standard output

History contains old, text-only successful `FunctionCallOutput` from a replayable verbose command/read-like tool, plus enough later user turns/recent output to satisfy the recency contract.

Purpose: positive pruning/effectiveness case.

Assertions:
- disabled contains full old output;
- enabled may replace it only after all T03 gates pass;
- recent outputs remain intact;
- canonical history unchanged;
- token delta is measured.

### F2 — Old verbose successful custom output

Equivalent to F1 using `CustomToolCallOutput`.

Purpose: standard/custom consistency.

### F3 — Below minimum-benefit candidate set

Eligible old output exists but total removable estimate stays below the tested minimum gate.

Assertions:
- enabled request equals disabled request;
- savings = zero;
- proves no rewrite for negligible benefit.

### F4 — Failed output retained

Old failed standard and custom outputs contain distinctive diagnostic sentinel text.

Assertions:
- sentinel remains byte-visible in enabled request;
- outputs are not counted as removable candidates;
- continuation quality case later requires model to diagnose using the sentinel.

### F5 — `apply_patch` / mutation evidence retained

Old `apply_patch` output contains a distinctive changed-file/hunk sentinel.

Assertions:
- sentinel remains in enabled request;
- output is protected regardless of otherwise-old/large status;
- model-quality smoke later asks for exact changed artifact/fact.

### F6 — Unknown/unclassifiable tool retained

Unknown tool name and/or missing call mapping.

Assertions:
- no pruning;
- proves fail-closed classifier behavior.

### F7 — Structured/media output retained

Standard/custom output contains structured content rather than simple text.

Assertions:
- no pruning under initial contract;
- request remains structurally valid.

### F8 — Tool-search/capability evidence retained

History includes `ToolSearchOutput` with distinctive discovered-tool sentinel.

Assertions:
- no pruning under initial policy;
- later continuation can still identify discovered capability.

### F9 — Historical 40k/20k anchor

Synthetic history reproduces the reference patch's approximate protected/reclaimable shape.

Purpose:
- benchmark provenance behavior against current accounting;
- compare historical constants with model-relative candidates without assuming they remain optimal.

### F10 — Retry request reconstruction

Force/request a retry path in which `run_sampling_request` regenerates prompt input from session history.

Assertions:
- enabled policy is applied to regenerated input too;
- disabled/enabled pairing remains deterministic;
- no bypass of protection/classification.

### F11 — Near-compaction boundary

Construct a history just below/around current auto-compaction limit with large eligible old output.

Record:
- disabled context/token status;
- enabled request estimate;
- whether pruning could postpone/avoid compaction;
- subsequent compaction path still behaves correctly when pruning is insufficient.

Purpose: measure interaction, not redefine compaction.

### F12 — No eligible outputs

History contains only protected/recent/non-tool content.

Assertion: enabled request is identical to disabled request.

## 5. Threshold sweep and material-benefit decision rule

TP_M01 does not freeze final numerical thresholds. TP_M03/TP_M02 must evaluate a pre-registered sweep rather than tune after seeing desired outcomes.

Required candidate anchors:

- historical protected-output budget: `40_000` approximate tokens;
- historical minimum-benefit gate: `20_000` approximate tokens;
- model-relative alternatives derived from effective context window/current compaction threshold;
- at least one more-conservative protected-output candidate than the historical value.

For every candidate policy record the complete tuple:

`(protected_recent_tokens, minimum_savings, user_turn_floor, tokens_saved, reduction_ratio, quality_matrix_result)`

### Material-benefit rule

A candidate may be considered materially beneficial only if all of the following hold:

1. it passes the complete hard safety/regression matrix;
2. measured `tokens_saved` meets or exceeds that candidate's declared minimum-benefit gate on fixtures designed to trigger pruning;
3. the reduction is not merely replacement-marker/accounting noise (`tokens_saved > 0` after exact estimator/serialization overhead);
4. savings repeat deterministically on identical fixture input;
5. benefit is visible on representative long-running tool-heavy fixtures, not only an artificial single giant output;
6. the full absolute and relative reduction distribution is reported, including cases with zero savings;
7. the selected final threshold/policy is justified before TP_M03 acceptance from that distribution and quality results; no post-hoc cherry-picking is allowed.

Custom divergence is rejected if no candidate produces a repeatable meaningful reduction while all hard quality gates remain green.

This defines the decision procedure without inventing an unsupported product percentage in TP_M01.

## 6. Hard structural regression matrix

These are deterministic pass/fail gates and do not depend on model stochasticity.

| Case | Pass criterion |
|---|---|
| Feature disabled | Exact request input equals stock baseline |
| Canonical history | Snapshot/hash unchanged by request-time pruning |
| Recent turn region | All protected recent outputs byte-equivalent |
| Recent-token budget | Outputs inside configured protection budget unchanged |
| Below minimum gate | No output rewritten |
| Failed standard output | Full diagnostic payload retained |
| Failed custom output | Full diagnostic payload retained |
| `apply_patch` | Full protected payload retained |
| Unknown/missing call mapping | Retained; no unsafe classification |
| Structured/media | Retained unless later explicitly supported |
| `ToolSearchOutput` | Retained under initial policy |
| Eligible standard/custom | Same policy semantics across both classes |
| Request validity | Call/output pairing and required metadata remain valid |
| Retry | Regenerated request receives same policy |
| Token-estimate failure/overflow | Fails closed; retains content |
| Subsequent compaction | No malformed history/request state; compaction can still execute |

Any failure is RED regardless of token savings.

## 7. Behavioral continuation / quality matrix

Run only after structural gates pass. Use fixed prompts and deterministic fixtures; pin model/config as tightly as available and archive raw request/response evidence.

### Q1 — Continue after old verbose success

Old verbose successful command output is pruned; all facts necessary for next action are either recent/protected or intentionally nonessential.

Pass: agent completes the next deterministic task correctly without asking for data that should have remained protected.

### Q2 — Diagnose prior failure

Prior failed output contains a unique error sentinel and relevant command context.

Pass: agent cites/uses the retained failure fact to select the correct next diagnostic/action. Failure payload must remain request-visible.

### Q3 — Recall patch/change evidence

Protected `apply_patch` output contains unique changed-file/hunk fact.

Pass: agent correctly identifies/verifies the changed artifact without hallucinating a different patch.

### Q4 — Standard/custom parity

Equivalent information is supplied via eligible standard vs custom output histories.

Pass: pruning classification and continuation outcome do not diverge solely because of output variant.

### Q5 — Discovered capability continuity

Protected `ToolSearchOutput` identifies a capability/tool later needed.

Pass: agent can use/identify the discovered capability after old verbose unrelated output is pruned.

### Q6 — Retry continuity

Sampling request is retried/regenerated.

Pass: protected evidence remains; eligible old output remains pruned consistently; no stock-history leakage/bypass changes policy.

### Q7 — Compaction interaction

Conversation crosses/approaches current compaction threshold after pruning.

Pass: either pruning safely avoids unnecessary compaction or normal compaction proceeds; subsequent turn remains coherent and protected evidence requirements are preserved according to the active mechanism's contract.

### Q8 — No-prune control

No output is eligible.

Pass: enabled behavior/request is stock-equivalent and continuation matches disabled control within deterministic structural assertions.

## 8. TP_M03 evidence package

For each benchmark run archive:

- exact source commit/build identity;
- exact feature/policy settings;
- fixture ID and canonical-history hash;
- model/context-window/auto-compaction settings;
- disabled and enabled request hashes;
- disabled/enabled primary token estimates;
- secondary byte/item metrics;
- list of pruned/protected item IDs and classification reason;
- hard structural matrix result;
- raw behavioral prompt/response evidence where a quality smoke is run;
- retry/compaction event evidence when applicable.

Aggregate report must include all fixtures, including zero-savings and failing cases.

## 9. Requirement coverage

- R9 measurable effectiveness: primary paired request-token delta + distribution.
- R10 quality/regression guard: hard structural gates + Q1-Q8 behavioral matrix.
- R20 effectiveness benchmark: identical-history disabled/enabled fixture contract.
- R21 continuation smoke: verbose command, retained failure, retained patch evidence and compaction interaction explicitly covered.

## 10. Independent benchmark-design review

- Metric maps to current request accounting: **yes** (`estimate_request_tokens` / actual request object).
- Comparison holds history constant: **yes**.
- Safety policy from T03 represented: **yes**, including unknown/structured/ToolSearch fail-closed cases.
- Historical 40k/20k included without freezing: **yes**.
- Quality can veto attractive token savings: **yes**.
- TP_M03 requires no invention of missing scenarios or evidence fields: **yes**.

## 11. T04 outcome

Benchmark and regression contract is complete enough for later implementation/validation. Small test instrumentation may be needed to expose the exact built request and estimator in a harness, but no new architecture is required and this is not a TP_M01 blocker.

No pruning code or benchmark harness was implemented or executed in TP_M01.
