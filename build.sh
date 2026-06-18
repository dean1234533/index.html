#!/bin/bash
# Copy all site files to dist/ so functions/ stays at the root
# Cloudflare Pages requires functions/ to be outside pages_build_output_dir
set -e
mkdir -p dist
for item in *; do
  if [[ "$item" != "dist" && "$item" != "functions" && "$item" != ".git" && "$item" != ".wrangler" && "$item" != "node_modules" && "$item" != "build.sh" ]]; then
    cp -r "$item" dist/
  fi
done
echo "Build complete — $(ls dist | wc -l) items in dist/"
