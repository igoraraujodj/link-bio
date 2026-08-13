#!/usr/bin/env bash
# PreToolUse(Bash) hook: entrega o comando ao rtk para reescrita/compressao.
# Se o rtk nao estiver disponivel, sai com 0 e o comando roda normalmente.

set -u

RTK="$(command -v rtk 2>/dev/null || true)"
[ -n "$RTK" ] || RTK="$HOME/.local/bin/rtk"

[ -x "$RTK" ] || exit 0

exec "$RTK" hook claude
