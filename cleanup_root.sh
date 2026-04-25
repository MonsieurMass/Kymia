#!/bin/bash
set -e
TOKEN="${VERCEL_TOKEN:?Définir la variable VERCEL_TOKEN avant de lancer ce script}"
KYMIA_DIR=~/Documents/Playground/kymia

echo "=== 1. Nettoyage racine kymia/ ==="
cd "$KYMIA_DIR"
rm -f App.jsx App.css
rm -f deploy.sh deploy_full.sh deploy_log.txt deploy_vercel.html
rm -rf dist-check/ dist-build/
rm -f src/App-refactored.jsx
echo "OK — racine propre"

echo ""
echo "=== 2. Build Kymia ==="
pkill -f "vite" 2>/dev/null || true
sleep 1
npm run build

echo ""
echo "=== 3. Premier deploy Kymia → Vercel (projet 'kymia') ==="
cd "$KYMIA_DIR/dist"
VERCEL_TOKEN="$TOKEN" npx vercel --prod --yes --name kymia 2>&1 | tee "$KYMIA_DIR/deploy-kymia.log"

echo ""
echo "=== Terminé — URL Kymia dans deploy-kymia.log ==="
