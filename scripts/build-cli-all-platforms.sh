#!/bin/bash
set -eu

npm run protos
npm run protos-go

mkdir -p dist-standalone/extension
cp package.json dist-standalone/extension

# Extract version information for ldflags
CORE_VERSION=$(node -p "require('./package.json').version")
CLI_VERSION=$(node -p "require('./cli/package.json').version")
COMMIT=$(git rev-parse --short HEAD 2>/dev/null || echo "unknown")
DATE=$(date -u '+%Y-%m-%dT%H:%M:%SZ')
BUILT_BY="${USER:-unknown}"

# Build ldflags to inject version info
LDFLAGS="-X 'github.com/blu/cli/pkg/cli/global.Version=${CORE_VERSION}' \
         -X 'github.com/blu/cli/pkg/cli/global.CliVersion=${CLI_VERSION}' \
         -X 'github.com/blu/cli/pkg/cli/global.Commit=${COMMIT}' \
         -X 'github.com/blu/cli/pkg/cli/global.Date=${DATE}' \
         -X 'github.com/blu/cli/pkg/cli/global.BuiltBy=${BUILT_BY}'"

cd cli

# Define target platforms for cross-compilation
PLATFORMS=(
  "darwin/arm64"
  "darwin/amd64"
  "linux/amd64"
  "linux/arm64"
)

# Build binaries for all platforms
for platform in "${PLATFORMS[@]}"; do
  GOOS=${platform%/*}
  GOARCH=${platform#*/}
  
  echo "Building for $GOOS/$GOARCH..."
  
  # Build blu binary
  OUTPUT_NAME="bin/blu-${GOOS}-${GOARCH}"
  if [ "$GOOS" = "windows" ]; then
    OUTPUT_NAME="${OUTPUT_NAME}.exe"
  fi
  
  GO111MODULE=on GOOS=$GOOS GOARCH=$GOARCH go build -ldflags "$LDFLAGS" -o "$OUTPUT_NAME" ./cmd/blu
  echo "  ✓ $OUTPUT_NAME built"
  
  # Build blu-host binary
  OUTPUT_NAME="bin/blu-host-${GOOS}-${GOARCH}"
  if [ "$GOOS" = "windows" ]; then
    OUTPUT_NAME="${OUTPUT_NAME}.exe"
  fi
  
  GO111MODULE=on GOOS=$GOOS GOARCH=$GOARCH go build -ldflags "$LDFLAGS" -o "$OUTPUT_NAME" ./cmd/blu-host
  echo "  ✓ $OUTPUT_NAME built"
done

echo ""
echo "All platform binaries built successfully!"

# Copy binaries to dist-standalone/bin
cd ..
mkdir -p dist-standalone/bin
cp cli/bin/blu-* dist-standalone/bin/
echo 'Copied all platform binaries to dist-standalone/bin/'