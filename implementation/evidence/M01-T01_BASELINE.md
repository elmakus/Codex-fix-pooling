# M01-T01 Evidence — Official package and bundled Codex baseline

Date: 2026-09-12
Executor: ChatGPT
Scope: research/discovery only; no external source repository or production/runtime state was modified.

## Audited Community source baseline

- Repository: `ilysenko/codex-desktop-linux`
- Audited commit: `249cd4b64d42434f51417fec4a318750d461b676`
- Commit subject: `Repair official Linux 26.908.40834 drift (#1471)`
- Recorded official Linux release identity in that commit: `d46153659a7cfa05b113fe80952feec0b7b43676e17f7fd23128c1951e4e59c8`

The execution-time Refresh Gate confirmed that this remains `main` for the audited source baseline.

## Exact official Linux package tuple

Source: `nix/upstream-linux-packages.json` at the audited commit.

Common version:

- `26.908.40834`

amd64:

- repository path: `pool/main/c/chatgpt/chatgpt_26.908.40834_amd64.deb`
- SHA-256: `da37b8e7bcefaaea019c478cacbe6c73ee1ddd15e0e1ebb3c7ef0a42dd818ac2`
- SRI: `sha256-2je457zvquoBnEeMrL5sc+4d3RXg4euzx+8KQt2BisI=`

arm64:

- repository path: `pool/main/c/chatgpt/chatgpt_26.908.40834_arm64.deb`
- SHA-256: `bae5c5ca585625a116a8877dedc455e4c27ca02063ea93dbd6a0506ed6a12d31`
- SRI: `sha256-uuXFylhWJaEWqId97cRV5MJ8oCBj6pPb1qBQbtahLTE=`

The architecture-specific packages are distinct immutable inputs. Compatibility work must therefore record architecture and must not infer identical bundled-runtime bytes merely from the shared Desktop package version.

## Trust and acquisition chain

At the audited commit, `scripts/lib/upstream-linux-package.js` defines the unattended acquisition/trust path:

1. repository default: `https://persistent.oaistatic.com/codex-app-prod/linux/deb`;
2. pinned OpenAI signing-key fingerprint: `3BFA0E4AE8B8CC16A2D9BA684A3B4A566C4660E4`;
3. download `dists/stable/InRelease`;
4. verify the clear-signed `InRelease` with `gpgv` and the pinned key;
5. read the signed SHA-256/size entry for `main/binary-<arch>/Packages`;
6. download that `Packages` file and verify its size/SHA-256 against `InRelease`;
7. select exactly one `Package: chatgpt` entry matching the requested architecture;
8. obtain Version, Filename, SHA256 and Size from that verified Packages entry;
9. download the `.deb` from the selected repository path;
10. verify the downloaded `.deb` size and SHA-256 against the verified Packages metadata.

`scripts/lib/upstream-linux-package.sh` then additionally validates with `dpkg-deb` that:

- Package is exactly `chatgpt`;
- Version is syntactically valid;
- Architecture equals the requested `amd64` or `arm64`.

This proves that the Community build consumes a package tied to OpenAI's signed stable APT metadata rather than an unverified URL/version guess.

## Extraction and origin of `resources/codex`

`scripts/lib/upstream-linux-package.sh::extract_upstream_linux_package` extracts the verified `.deb` with:

```sh
dpkg-deb -x "$package_path" "$WORK_DIR/upstream-package"
```

The official app root is then:

```text
$WORK_DIR/upstream-package/usr/lib/chatgpt
```

The extraction gate requires these official payload files, including executable:

```text
/usr/lib/chatgpt/resources/codex
```

`stage_official_linux_payload` performs:

```sh
cp -a "$upstream_app_dir/." "$INSTALL_DIR/"
```

Therefore Community `resources/codex` originates directly from the verified official package's `/usr/lib/chatgpt/resources/codex`. There is no second Codex download or source build in the normal default staging path.

`install.sh::build_from_upstream_package` confirms the order:

1. resolve verified package;
2. extract verified package;
3. stage entire official app payload;
4. apply ASAR/feature processing and Community-specific launcher/branding;
5. write build metadata.

The default package checks also require `$APP_DIR/resources/codex` to remain executable before packaging.

## Runtime identity signals available without production mutation

The current Community source does **not** establish an OpenAI Codex source commit merely from Desktop version metadata. T02 must not infer such a mapping.

For a safely downloaded/extracted official package, the following identity signals are reproducible without installing or mutating production state:

```sh
# Package identity / provenance
dpkg-deb -f chatgpt_<version>_<arch>.deb Package Version Architecture
sha256sum chatgpt_<version>_<arch>.deb

# Extract to isolated directory
mkdir extracted
dpkg-deb -x chatgpt_<version>_<arch>.deb extracted

# Bundled runtime identity
extracted/usr/lib/chatgpt/resources/codex --version
sha256sum extracted/usr/lib/chatgpt/resources/codex
file extracted/usr/lib/chatgpt/resources/codex
```

The repository itself demonstrates that `-V` / `--version` is a supported passthrough for the bundled CLI in `linux-features/shared-app-server-socket/attached-cli.sh`.

For compatibility evidence, the minimum runtime identity tuple carried forward to T02 should be:

- official Desktop package version;
- architecture;
- official `.deb` repository path;
- official `.deb` SHA-256;
- bundled `resources/codex --version` output when artifact execution is available;
- bundled `resources/codex` SHA-256 when artifact bytes are available;
- exact audited `codex-desktop-linux` commit.

A package SHA-256 is sufficient to bind the exact bundled binary bytes indirectly because `resources/codex` is proven to be copied from that package, but it is not itself a source-revision mapping.

## Architecture observations

- Supported official package architectures are exactly `amd64` and `arm64` in this path.
- Both use Desktop version `26.908.40834` at this baseline.
- They have different repository paths and different package SHA-256 values.
- The source path preserves the architecture-specific official runtime; no cross-architecture Codex substitution occurs in the default flow.
- Any later source-commit/protocol compatibility mapping must therefore record which architecture artifact was inspected even if the reported CLI semantic version happens to match.

## Isolated artifact-inspection attempt

A read-only attempt was made in an isolated `/mnt/data` workspace to download the official amd64 `.deb` and run the commands above. The execution environment could not resolve `persistent.oaistatic.com` (DNS unavailable), so no artifact bytes were acquired and no runtime command was executed.

This does not require production-state access and does not block T01 acceptance because the exact official package identity, trust chain, bundled-runtime origin, and reproducible runtime-identity procedure are established from current authoritative source. T02 must obtain the actual `--version`/runtime digest if they are needed to prove a deterministic source-revision mapping; it must not guess them.

## T01 conclusions

1. Exact audited Community baseline is pinned.
2. Exact official Desktop package tuple is pinned for both architectures.
3. Signed trust chain from OpenAI APT metadata to the selected `.deb` is explicit and fail-closed.
4. Community `resources/codex` is proven to originate from the verified official package and be staged by whole-tree copy.
5. Desktop package version is **not** evidence of a Codex source commit.
6. T02 has an unambiguous artifact identity tuple and reproducible read-only commands for deeper source/protocol mapping.
7. No production/runtime state was modified.
