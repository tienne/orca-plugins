#!/usr/bin/env bash
# Install a pinned CLI into a job-local directory; never launch or replace the desktop app.
set -euo pipefail

if [[ "$(uname -s)" != Darwin || "$(uname -m)" != arm64 ]]; then
  echo 'Orca release setup requires an Apple Silicon macOS runner.' >&2
  exit 1
fi
: "${RUNNER_TEMP:?RUNNER_TEMP must point to a job-local temporary directory}"
: "${GITHUB_ENV:?GITHUB_ENV must point to the job environment file}"

readonly orca_version='1.4.252'
readonly orca_sha256='92d6e4e73dbc8f2a7f22529d04f138e343078daf40bc7e6a325e09b49aab94cb'
orca_setup_dir="$(mktemp -d "$RUNNER_TEMP/orca-cli.XXXXXX")"
readonly orca_setup_dir
orca_archive="$orca_setup_dir/orca.zip"

curl --fail --location --silent --show-error --retry 3 --retry-all-errors --retry-max-time 600 --connect-timeout 30 --max-time 300 \
  "https://github.com/stablyai/orca/releases/download/v${orca_version}/Orca-${orca_version}-arm64-mac.zip" \
  --output "$orca_archive"
printf '%s  %s\n' "$orca_sha256" "$orca_archive" | shasum -a 256 --check
ditto -x -k "$orca_archive" "$orca_setup_dir"
rm "$orca_archive"

orca_cli="$orca_setup_dir/Orca.app/Contents/Resources/bin/orca"
test -x "$orca_cli"
actual_version="$("$orca_cli" --version)"
if [[ "$actual_version" != "$orca_version" ]]; then
  echo "Unexpected Orca CLI version: $actual_version" >&2
  exit 1
fi
printf 'ORCA_CLI_COMMAND=%s\n' "$orca_cli" >> "$GITHUB_ENV"
printf 'Prepared Orca CLI %s in %s\n' "$actual_version" "$orca_setup_dir"
