"use strict";

const assert = require("node:assert/strict");
const crypto = require("node:crypto");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const test = require("node:test");

const {
  replaceCandidateRuntime,
  sha256File,
  targetTripleMatchesArchitecture,
  validateProvenance,
  validateSettings,
  writeRejectionDiagnostics,
} = require("./stage.js");

const BASE_SETTINGS = {
  provider: "managed-artifact",
  source_repository: "https://github.com/elmakus/codex",
  source_ref: "background-exec-wakeup-c4017a87",
  upstream_repository: "https://github.com/openai/codex",
  upstream_ref: "c4017a87aacc7558002b7cb510025e967c1d765e",
  patch_source_repository: "https://github.com/tekacs/codex",
  patch_source_ref: "9ffcf8db9078eae43d4111ff94259795c1e962c9",
  target_triple: "x86_64-unknown-linux-gnu",
  build_profile: "release",
};

const BASELINE = {
  version: "26.908.40834",
  architecture: "amd64",
  package_sha256: "a".repeat(64),
  community_source_commit: "249cd4b64d42434f51417fec4a318750d461b676",
};

function withTempDir(callback) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "custom-codex-runtime-"));
  try {
    return callback(root);
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
}

function writeArtifact(root, contents = "custom-runtime\n") {
  const artifact = path.join(root, "codex-custom");
  fs.writeFileSync(artifact, contents, { mode: 0o755 });
  return artifact;
}

function provenanceFor(artifact, overrides = {}) {
  return {
    gate_state: "PASS",
    build_status: "PASS",
    source_repository: BASE_SETTINGS.source_repository,
    source_ref: BASE_SETTINGS.source_ref,
    resolved_source_commit: "b".repeat(40),
    upstream_repository: BASE_SETTINGS.upstream_repository,
    upstream_ref: BASE_SETTINGS.upstream_ref,
    patch_source_repository: BASE_SETTINGS.patch_source_repository,
    patch_source_ref: BASE_SETTINGS.patch_source_ref,
    target_triple: BASE_SETTINGS.target_triple,
    build_profile: BASE_SETTINGS.build_profile,
    toolchain: "rustc test fixture",
    build_command: "cargo build --release -p codex-cli --bin codex",
    runtime_version: "codex test-fixture",
    runtime_sha256: sha256File(artifact),
    admission: {
      official_package_version: BASELINE.version,
      official_architecture: BASELINE.architecture,
      official_package_sha256: BASELINE.package_sha256,
      community_source_commit: BASELINE.community_source_commit,
    },
    ...overrides,
  };
}

test("controlled settings accept the frozen source contract", () => {
  assert.deepEqual(validateSettings(BASE_SETTINGS), BASE_SETTINGS);
});

test("settings reject arbitrary local-path expansion", () => {
  assert.throws(
    () => validateSettings({ ...BASE_SETTINGS, runtime_path: "/tmp/codex" }),
    /unsupported setting 'runtime_path'/,
  );
});

test("settings reject non-pinned upstream and patch refs", () => {
  assert.throws(() => validateSettings({ ...BASE_SETTINGS, upstream_ref: "main" }), /full 40-character Git SHA/);
  assert.throws(() => validateSettings({ ...BASE_SETTINGS, patch_source_ref: "latest" }), /full 40-character Git SHA/);
});

test("target triple must match official package architecture", () => {
  assert.equal(targetTripleMatchesArchitecture("x86_64-unknown-linux-gnu", "amd64"), true);
  assert.equal(targetTripleMatchesArchitecture("aarch64-unknown-linux-gnu", "arm64"), true);
  assert.equal(targetTripleMatchesArchitecture("aarch64-unknown-linux-gnu", "amd64"), false);
});

test("PASS provenance bound to the exact baseline admits the exact artifact", () => {
  withTempDir((root) => {
    const artifact = writeArtifact(root);
    const validated = validateProvenance(provenanceFor(artifact), BASE_SETTINGS, BASELINE, artifact);
    assert.equal(validated.runtime_sha256, sha256File(artifact));
  });
});

test("architecture mismatch rejects admission", () => {
  withTempDir((root) => {
    const artifact = writeArtifact(root);
    assert.throws(
      () => validateProvenance(provenanceFor(artifact), BASE_SETTINGS, { ...BASELINE, architecture: "arm64" }, artifact),
      /does not match official package architecture/,
    );
  });
});

test("FAIL and UNKNOWN reject custom substitution", () => {
  withTempDir((root) => {
    const artifact = writeArtifact(root);
    for (const gate_state of ["FAIL", "UNKNOWN"]) {
      assert.throws(
        () => validateProvenance(provenanceFor(artifact, { gate_state }), BASE_SETTINGS, BASELINE, artifact),
        new RegExp(`gate is ${gate_state}`),
      );
    }
  });
});

test("stale official-baseline admission is rejected", () => {
  withTempDir((root) => {
    const artifact = writeArtifact(root);
    const provenance = provenanceFor(artifact);
    provenance.admission = { ...provenance.admission, official_package_sha256: "c".repeat(64) };
    assert.throws(
      () => validateProvenance(provenance, BASE_SETTINGS, BASELINE, artifact),
      /different official package SHA-256/,
    );
  });
});

test("artifact digest mismatch is rejected", () => {
  withTempDir((root) => {
    const artifact = writeArtifact(root);
    const provenance = provenanceFor(artifact, { runtime_sha256: "d".repeat(64) });
    assert.throws(
      () => validateProvenance(provenance, BASE_SETTINGS, BASELINE, artifact),
      /custom runtime digest mismatch/,
    );
  });
});

test("candidate replacement changes only resources/codex and final digest matches artifact", () => {
  withTempDir((root) => {
    const installDir = path.join(root, "candidate");
    fs.mkdirSync(path.join(installDir, "resources"), { recursive: true });
    fs.writeFileSync(path.join(installDir, "resources", "codex"), "official-stock\n", { mode: 0o755 });
    fs.writeFileSync(path.join(installDir, "resources", "sentinel"), "keep\n");
    const artifact = writeArtifact(root, "custom-admitted\n");

    const target = replaceCandidateRuntime(installDir, artifact);
    assert.equal(target, path.join(installDir, "resources", "codex"));
    assert.equal(sha256File(target), sha256File(artifact));
    assert.equal(fs.readFileSync(path.join(installDir, "resources", "sentinel"), "utf8"), "keep\n");
  });
});

test("rejection diagnostics survive outside a disposable candidate", () => {
  withTempDir((root) => {
    const installDir = path.join(root, "candidate");
    const transactionDir = path.join(root, "reports", "transactions", "test");
    const provenancePath = path.join(root, "provenance.json");
    fs.mkdirSync(transactionDir, { recursive: true });
    fs.writeFileSync(provenancePath, JSON.stringify({ gate_state: "FAIL" }));

    writeRejectionDiagnostics({
      INSTALL_DIR: installDir,
      CODEX_PATCH_REPORT_JSON: path.join(transactionDir, "patch-report.json"),
      CODEX_CUSTOM_CODEX_RUNTIME_PROVENANCE: provenancePath,
    }, new Error("synthetic rejection"));

    const candidateDiagnostic = JSON.parse(fs.readFileSync(path.join(installDir, ".codex-linux", "custom-codex-runtime.json"), "utf8"));
    const transactionDiagnostic = JSON.parse(fs.readFileSync(path.join(transactionDir, "custom-codex-runtime.json"), "utf8"));
    assert.equal(candidateDiagnostic.state, "REJECTED");
    assert.equal(transactionDiagnostic.gate_state, "FAIL");
    assert.match(transactionDiagnostic.reason, /synthetic rejection/);
  });
});

test("fixture digest helper is deterministic", () => {
  assert.equal(
    crypto.createHash("sha256").update("abc").digest("hex"),
    "ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad",
  );
});

// When this overlay is copied into ilysenko/codex-desktop-linux, repository-level
// framework tests must additionally assert:
// 1. disabled feature => enabledLinuxFeatureStageHooks does not select this hook;
// 2. enabled feature => exactly this stage hook + prelaunch diagnostic hook are staged;
// 3. candidate starts with resources/codex byte-identical to CODEX_UPSTREAM_APP_DIR/resources/codex;
// 4. full stage hook PASS fixture replaces candidate runtime and emits diagnostics;
// 5. full stage hook FAIL/UNKNOWN fixtures return non-zero and leave no promotable candidate.
