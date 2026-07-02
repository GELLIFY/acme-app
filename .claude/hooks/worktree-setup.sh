#!/usr/bin/env sh
# Auto-install deps in fresh worktrees. No-op when node_modules already exists.
# Near-instant on first run: enableGlobalVirtualStore symlinks from the shared store.
[ -d node_modules ] && exit 0
echo "[worktree-setup] node_modules missing → pnpm install" >&2
pnpm install
