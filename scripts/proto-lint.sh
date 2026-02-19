#!/usr/bin/env bash
set -euo pipefail

PROTO_DIR="./proto"

# Lint only proto directory
buf lint "$PROTO_DIR"

# Format only proto directory
if ! buf format "$PROTO_DIR" -w --exit-code; then
  echo "Proto files were formatted"
fi

# Enforce RPC naming rule only in proto files
if grep -rn "rpc .*[A-Z][A-Z].*[(]" "$PROTO_DIR" --include="*.proto"; then
  echo "Error: Proto RPC names cannot contain repeated capital letters"
  exit 1
fi
