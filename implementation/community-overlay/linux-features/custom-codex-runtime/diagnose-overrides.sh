#!/usr/bin/env bash
set -Eeuo pipefail

log_path="${CODEX_LINUX_LAUNCHER_LOG:-}"
[ -n "$log_path" ] || exit 0
mkdir -p "$(dirname "$log_path")"

if [ -n "${CODEX_CLI_PATH:-}" ]; then
    printf '%s\n' "WARN custom-codex-runtime: explicit CODEX_CLI_PATH is set and may bypass package-selected resources/codex: $CODEX_CLI_PATH" >> "$log_path"
fi
if [ -n "${CODEX_REMOTE_CONTROL_CODEX_PATH:-}" ]; then
    printf '%s\n' "WARN custom-codex-runtime: explicit CODEX_REMOTE_CONTROL_CODEX_PATH is set and may bypass package-selected resources/codex for remote-mobile-control: $CODEX_REMOTE_CONTROL_CODEX_PATH" >> "$log_path"
fi
