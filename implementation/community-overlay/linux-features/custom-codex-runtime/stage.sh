#!/usr/bin/env bash
set -Eeuo pipefail

feature_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
exec node "$feature_dir/stage.js"
