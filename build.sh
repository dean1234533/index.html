#!/bin/bash
# Copy all site files to dist/ so functions/ stays at the root
# Cloudflare Pages requires functions/ to be outside pages_build_output_dir
set -e

# Build the React fitness tools hub
echo "Building fitness tools hub..."
cd "fitness tool hub"
npm ci --prefer-offline
npm run build
cd ..

# Copy static site to dist/
mkdir -p dist
rsync -aq \
  --exclude='.git' \
  --exclude='node_modules' \
  --exclude='dist' \
  --exclude='.wrangler' \
  --exclude='functions' \
  --exclude='build.sh' \
  --exclude='fitness tool hub' \
  ./ dist/

# Copy built tools app into dist/tools/
mkdir -p dist/tools
cp -r "fitness tool hub/dist/." dist/tools/

echo "Build complete — $(ls dist | wc -l) items in dist/"
