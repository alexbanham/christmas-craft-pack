#!/usr/bin/env bash
# Promote testing -> stable. Always a real merge commit: GitHub Pages keys deployments by commit SHA,
# so a fast-forward (stable == testing SHA) would be treated as already deployed and never go live.
set -euo pipefail
cd "$(dirname "$0")/.."
git fetch -q origin
VER=$(git show origin/testing:pack.toml | grep -m1 '^version' | cut -d'"' -f2)
git checkout -q stable && git merge -q --ff-only origin/stable
git merge --no-ff -m "Promote v$VER to stable" origin/testing
git push -q origin stable
git checkout -q testing
echo "stable -> v$VER pushed; Pages redeploys in ~1 min"
