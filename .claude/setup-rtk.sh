#!/usr/bin/env bash
# SessionStart hook: garante que o binario do rtk exista neste container.
# Sessoes de cloud sao efemeras, entao o binario precisa ser reinstalado a cada sessao.
# Nao falha a sessao se a instalacao nao der certo.

set -u

RTK_PIN="${RTK_VERSION:-v0.45.0}"
BIN="$HOME/.local/bin/rtk"

if [ -x "$BIN" ] || command -v rtk >/dev/null 2>&1; then
  exit 0
fi

curl -fsSL https://raw.githubusercontent.com/rtk-ai/rtk/refs/heads/master/install.sh \
  | RTK_VERSION="$RTK_PIN" sh >/dev/null 2>&1 || true

exit 0
