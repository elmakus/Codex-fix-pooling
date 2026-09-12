"use strict";

const childProcess = require("node:child_process");
const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");

const FEATURE_ID = "custom-codex-runtime";
const SHA256_RE = /^[0-9a-f]{64}$/;
const GIT_SHA_RE = /^[0-9a-f]{40}$/;
const ALLOWED_GATE_STATES = new Set(["PASS", "FAIL", "UNKNOWN"]);
const ALLOWED_SETTING_KEYS = new Set([
  "provider",
  "source_repository",
  "source_ref",
  "upstream_repository",
  "upstream_ref",
  "patch_source_repository",
  "patch_source_ref",
  "target_triple",
  "build_profile",
]);

function fail(message) {
  throw new Error(`${FEATURE_ID}: ${message}`);
}

function readJson(filePath, label) {
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch (error) {
    fail(`could not read ${label} at ${filePath}: ${error.message}`);
  }
}

function sha256File(filePath) {
  const hash = crypto.createHash("sha256");
  hash.update(fs.readFileSync(filePath));
  return hash.digest("hex");
}

function commandOutput(command, args) {
  const result = childProcess.spawnSync(command, args, {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  });
  return {
    status: result.status,
    stdout: result.stdout?.trim() ?? "",
    stderr: result.stderr?.trim() ?? "",
  };
}

function assertPlainObject(value, label) {
  if (value == null || typeof value !== "object" || Array.isArray(value)) {
    fail(`${label} must be an object`);
  }
  return value;
}

function requireString(value, label) {
  if (typeof value !== "string" || value.trim() === "") {
    fail(`${label} must be a non-empty string`);
  }
  return value.trim();
}

function validateSettings(settings) {
  assertPlainObject(settings, "settings");
  for (const key of Object.keys(settings)) {
    if (!ALLOWED_SETTING_KEYS.has(key)) {
      fail(`unsupported setting '${key}'`);
    }
  }
  const normalized = {};
  for (const key of ALLOWED_SETTING_KEYS) {
    normalized[key] = requireString(settings[key], `settings.${key}`);
  }
  if (normalized.provider !== "managed-artifact") {
    fail("settings.provider must be 'managed-artifact'");
  }
  for (const key of ["source_repository", "upstream_repository", "patch_source_repository"]) {
    if (!/^https:\/\/github\.com\/[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+(?:\.git)?$/.test(normalized[key])) {
      fail(`settings.${key} must be an https GitHub repository URL`);
    }
  }
  if (!GIT_SHA_RE.test(normalized.upstream_ref)) {
    fail("settings.upstream_ref must be a full 40-character Git SHA");
  }
  if (!GIT_SHA_RE.test(normalized.patch_source_ref)) {
    fail("settings.patch_source_ref must be a full 40-character Git SHA");
  }
  if (!/^[A-Za-z0-9_.+-]+$/.test(normalized.target_triple)) {
    fail("settings.target_triple contains unsupported characters");
  }
  if (!/^[A-Za-z0-9_.+-]+$/.test(normalized.build_profile)) {
    fail("settings.build_profile contains unsupported characters");
  }
  return normalized;
}

function loadFeatureSettings(scriptDir) {
  const helper = path.join(scriptDir, "scripts", "lib", "linux-features.js");
  // eslint-disable-next-line import/no-dynamic-require, global-require
  const { loadEnabledLinuxFeatures } = require(helper);
  const feature = loadEnabledLinuxFeatures().find(({ id }) => id === FEATURE_ID);
  if (feature == null) {
    fail("stage hook ran while feature is not enabled");
  }
  return validateSettings(feature.settings ?? {});
}

function communitySourceInfo(scriptDir, env) {
  const stagedPath = path.join(scriptDir, ".codex-linux", "source-info.json");
  if (fs.existsSync(stagedPath)) {
    const staged = readJson(stagedPath, "packaged source provenance");
    const commit = staged.commit;
    if (typeof commit === "string" && GIT_SHA_RE.test(commit)) {
      return { commit, provenance: staged.provenance ?? "packaged-update-builder" };
    }
  }
  const override = env.CODEX_LINUX_SOURCE_COMMIT?.trim();
  if (override && GIT_SHA_RE.test(override)) {
    return { commit: override, provenance: "environment" };
  }
  const git = commandOutput("git", ["-C", scriptDir, "rev-parse", "HEAD"]);
  if (git.status === 0 && GIT_SHA_RE.test(git.stdout)) {
    return { commit: git.stdout, provenance: "git" };
  }
  return { commit: null, provenance: "unknown" };
}

function readOfficialBaseline(env, stockRuntime, communitySource) {
  const metadataPath = env.CODEX_UPSTREAM_LINUX_METADATA_JSON?.trim();
  if (!metadataPath) {
    fail("CODEX_UPSTREAM_LINUX_METADATA_JSON is required for exact official baseline binding");
  }
  const metadata = readJson(metadataPath, "verified upstream package metadata");
  const packageSha256 = requireString(metadata.sha256, "upstream metadata sha256");
  if (!SHA256_RE.test(packageSha256)) {
    fail("upstream metadata sha256 must be a SHA-256 digest");
  }
  const versionProbe = commandOutput(stockRuntime, ["--version"]);
  return {
    package: requireString(metadata.package ?? "chatgpt", "upstream metadata package"),
    version: requireString(metadata.version, "upstream metadata version"),
    architecture: requireString(metadata.architecture, "upstream metadata architecture"),
    repository: metadata.repository ?? null,
    repository_path: requireString(metadata.repositoryPath, "upstream metadata repositoryPath"),
    package_sha256: packageSha256,
    community_source_commit: communitySource.commit,
    community_source_provenance: communitySource.provenance,
    stock_runtime_sha256: sha256File(stockRuntime),
    stock_runtime_version: versionProbe.status === 0 ? versionProbe.stdout : null,
    stock_runtime_version_probe: versionProbe.status === 0 ? "PASS" : "UNKNOWN",
  };
}

function targetTripleMatchesArchitecture(targetTriple, architecture) {
  if (["amd64", "x86_64"].includes(architecture)) {
    return targetTriple.startsWith("x86_64-");
  }
  if (["arm64", "aarch64"].includes(architecture)) {
    return targetTriple.startsWith("aarch64-");
  }
  return false;
}

function validateProvenance(provenance, settings, baseline, artifactPath) {
  assertPlainObject(provenance, "runtime provenance");
  const gateState = requireString(provenance.gate_state, "provenance.gate_state");
  if (!ALLOWED_GATE_STATES.has(gateState)) {
    fail("provenance.gate_state must be PASS, FAIL, or UNKNOWN");
  }
  if (gateState !== "PASS") {
    fail(`custom runtime gate is ${gateState}; refusing substitution`);
  }

  const requiredMatches = {
    source_repository: settings.source_repository,
    source_ref: settings.source_ref,
    upstream_repository: settings.upstream_repository,
    upstream_ref: settings.upstream_ref,
    patch_source_repository: settings.patch_source_repository,
    patch_source_ref: settings.patch_source_ref,
    target_triple: settings.target_triple,
    build_profile: settings.build_profile,
  };
  for (const [key, expected] of Object.entries(requiredMatches)) {
    if (provenance[key] !== expected) {
      fail(`provenance.${key} does not match controlled feature settings`);
    }
  }
  if (!targetTripleMatchesArchitecture(settings.target_triple, baseline.architecture)) {
    fail(`settings.target_triple ${settings.target_triple} does not match official package architecture ${baseline.architecture}`);
  }

  const resolvedSource = requireString(provenance.resolved_source_commit, "provenance.resolved_source_commit");
  if (!GIT_SHA_RE.test(resolvedSource)) {
    fail("provenance.resolved_source_commit must be a full Git SHA");
  }
  const expectedArtifactSha = requireString(provenance.runtime_sha256, "provenance.runtime_sha256");
  if (!SHA256_RE.test(expectedArtifactSha)) {
    fail("provenance.runtime_sha256 must be a SHA-256 digest");
  }
  if (provenance.build_status !== "PASS") {
    fail("provenance.build_status must be PASS");
  }
  requireString(provenance.runtime_version, "provenance.runtime_version");
  requireString(provenance.toolchain, "provenance.toolchain");
  requireString(provenance.build_command, "provenance.build_command");

  const admission = assertPlainObject(provenance.admission, "provenance.admission");
  if (admission.official_package_sha256 !== baseline.package_sha256) {
    fail("provenance admission is bound to a different official package SHA-256");
  }
  if (admission.official_package_version !== baseline.version || admission.official_architecture !== baseline.architecture) {
    fail("provenance admission is bound to a different official package version/architecture");
  }
  if (baseline.community_source_commit == null) {
    fail("Community source commit is UNKNOWN; custom substitution cannot be admitted");
  }
  if (admission.community_source_commit !== baseline.community_source_commit) {
    fail("provenance admission is bound to a different Community source commit");
  }

  const actualArtifactSha = sha256File(artifactPath);
  if (actualArtifactSha !== expectedArtifactSha) {
    fail(`custom runtime digest mismatch: expected ${expectedArtifactSha}, got ${actualArtifactSha}`);
  }
  return { ...provenance, runtime_sha256: actualArtifactSha };
}

function diagnosticOutputPaths(installDir, env) {
  const outputs = [];
  if (installDir) {
    outputs.push(path.join(installDir, ".codex-linux", "custom-codex-runtime.json"));
  }
  const patchReport = env.CODEX_PATCH_REPORT_JSON?.trim();
  if (patchReport) {
    outputs.push(path.join(path.dirname(path.resolve(patchReport)), "custom-codex-runtime.json"));
  }
  return [...new Set(outputs)];
}

function writeDiagnostics(installDir, value, env = process.env) {
  for (const output of diagnosticOutputPaths(installDir, env)) {
    fs.mkdirSync(path.dirname(output), { recursive: true });
    fs.writeFileSync(output, `${JSON.stringify(value, null, 2)}\n`, "utf8");
  }
}

function writeRejectionDiagnostics(env, error) {
  let reportedGateState = "UNKNOWN";
  const provenancePath = env.CODEX_CUSTOM_CODEX_RUNTIME_PROVENANCE?.trim();
  if (provenancePath && fs.existsSync(provenancePath)) {
    try {
      const provenance = JSON.parse(fs.readFileSync(provenancePath, "utf8"));
      if (ALLOWED_GATE_STATES.has(provenance?.gate_state)) {
        reportedGateState = provenance.gate_state;
      }
    } catch {
      // Malformed provenance remains UNKNOWN and fail-closed.
    }
  }
  const installDir = env.INSTALL_DIR?.trim() ? path.resolve(env.INSTALL_DIR.trim()) : null;
  writeDiagnostics(installDir, {
    schema_version: 1,
    feature: FEATURE_ID,
    state: "REJECTED",
    gate_state: reportedGateState,
    reason: String(error?.message ?? error),
    official_metadata_path: env.CODEX_UPSTREAM_LINUX_METADATA_JSON ?? null,
    runtime_provenance_path: provenancePath || null,
    explicit_override_environment_at_build: {
      CODEX_CLI_PATH: env.CODEX_CLI_PATH ?? null,
      CODEX_REMOTE_CONTROL_CODEX_PATH: env.CODEX_REMOTE_CONTROL_CODEX_PATH ?? null,
    },
  }, env);
}

function replaceCandidateRuntime(installDir, artifactPath) {
  const target = path.join(installDir, "resources", "codex");
  const temp = `${target}.custom-runtime.tmp-${process.pid}`;
  fs.copyFileSync(artifactPath, temp);
  fs.chmodSync(temp, 0o755);
  fs.renameSync(temp, target);
  return target;
}

function main(env = process.env) {
  const scriptDir = path.resolve(requireString(env.SCRIPT_DIR, "SCRIPT_DIR"));
  const installDir = path.resolve(requireString(env.INSTALL_DIR, "INSTALL_DIR"));
  const upstreamAppDir = path.resolve(requireString(env.CODEX_UPSTREAM_APP_DIR, "CODEX_UPSTREAM_APP_DIR"));
  const artifactPath = path.resolve(requireString(env.CODEX_CUSTOM_CODEX_RUNTIME_BINARY, "CODEX_CUSTOM_CODEX_RUNTIME_BINARY"));
  const provenancePath = path.resolve(requireString(env.CODEX_CUSTOM_CODEX_RUNTIME_PROVENANCE, "CODEX_CUSTOM_CODEX_RUNTIME_PROVENANCE"));

  const stockRuntime = path.join(installDir, "resources", "codex");
  const upstreamStockRuntime = path.join(upstreamAppDir, "resources", "codex");
  for (const filePath of [stockRuntime, upstreamStockRuntime, artifactPath, provenancePath]) {
    if (!fs.existsSync(filePath) || fs.lstatSync(filePath).isSymbolicLink()) {
      fail(`required regular file is unavailable or is a symlink: ${filePath}`);
    }
  }
  const candidateStockSha = sha256File(stockRuntime);
  const upstreamStockSha = sha256File(upstreamStockRuntime);
  if (candidateStockSha !== upstreamStockSha) {
    fail("candidate stock resources/codex already differs from verified official payload before custom substitution");
  }

  const settings = loadFeatureSettings(scriptDir);
  const communitySource = communitySourceInfo(scriptDir, env);
  const baseline = readOfficialBaseline(env, stockRuntime, communitySource);
  const provenance = validateProvenance(readJson(provenancePath, "runtime provenance"), settings, baseline, artifactPath);

  const target = replaceCandidateRuntime(installDir, artifactPath);
  const finalSha = sha256File(target);
  if (finalSha !== provenance.runtime_sha256) {
    fail("final candidate resources/codex digest differs from admitted custom runtime digest");
  }

  writeDiagnostics(installDir, {
    schema_version: 1,
    feature: FEATURE_ID,
    state: "PREPARED_CANDIDATE",
    gate_state: "PASS",
    settings,
    official_baseline: baseline,
    custom_runtime: provenance,
    candidate_runtime: {
      path: "resources/codex",
      sha256: finalSha,
    },
    explicit_override_environment_at_build: {
      CODEX_CLI_PATH: env.CODEX_CLI_PATH ?? null,
      CODEX_REMOTE_CONTROL_CODEX_PATH: env.CODEX_REMOTE_CONTROL_CODEX_PATH ?? null,
    },
  }, env);
}

if (require.main === module) {
  try {
    main();
  } catch (error) {
    try {
      writeRejectionDiagnostics(process.env, error);
    } catch (diagnosticError) {
      console.error(`WARN: ${FEATURE_ID}: could not persist rejection diagnostics: ${diagnosticError.message}`);
    }
    console.error(`ERROR: ${error.message}`);
    process.exit(1);
  }
}

module.exports = {
  ALLOWED_SETTING_KEYS,
  communitySourceInfo,
  diagnosticOutputPaths,
  readOfficialBaseline,
  replaceCandidateRuntime,
  sha256File,
  targetTripleMatchesArchitecture,
  validateProvenance,
  validateSettings,
  writeDiagnostics,
  writeRejectionDiagnostics,
};
