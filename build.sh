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
# --delete-excluded removes anything left in dist/ from earlier builds. The excludes keep
# source scripts, config, old site copies and helper pages off the public site.
rsync -aq --delete --delete-excluded \
  --exclude='.git' \
  --exclude='node_modules' \
  --exclude='dist' \
  --exclude='.wrangler' \
  --exclude='functions' \
  --exclude='build.sh' \
  --exclude='fitness tool hub' \
  --exclude='*.py' --exclude='*.cjs' --exclude='__pycache__' --exclude='*.pyc' \
  --exclude='.github' --exclude='.vercel' --exclude='.21st' --exclude='.gitignore' --exclude='.DS_Store' \
  --exclude='README.md' --exclude='package.json' --exclude='package-lock.json' --exclude='vercel.json' --exclude='wrangler.jsonc' \
  --exclude='area_unindexed.json' \
  --exclude='/api' --exclude='/vids' --exclude='/instagram-exports' --exclude='/untitled folder' \
  --exclude='/workout:nutrition gen' --exclude='/workout:nutrition gen home' \
  --exclude='/instagram-posts.html' --exclude='/online_video_modal.html' \
  ./ dist/

# Copy built tools app into dist/tools/
mkdir -p dist/tools
cp -r "fitness tool hub/dist/." dist/tools/

echo "Build complete — $(ls dist | wc -l) items in dist/"
