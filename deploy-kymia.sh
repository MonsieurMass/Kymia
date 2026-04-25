#!/bin/bash
set -e
# Deploy Kymia — boutique streetwear
# Usage: bash deploy-kymia.sh

PROJECT_DIR=~/Documents/Playground/kymia
TOKEN="${VERCEL_TOKEN:?Définir la variable VERCEL_TOKEN avant de lancer ce script}"

echo "=== Build Kymia ==="
cd "$PROJECT_DIR"
pkill -f "vite" 2>/dev/null || true
sleep 1
npm run build

echo "=== Deploy Kymia → Vercel ==="
cd "$PROJECT_DIR/dist"
VERCEL_TOKEN="$TOKEN" npx vercel --prod --yes 2>&1 | tee "$PROJECT_DIR/deploy-kymia.log"

echo "=== Done ==="
