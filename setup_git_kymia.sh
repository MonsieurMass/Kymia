#!/bin/bash
# Setup Git pour Kymia + nettoyage timestamps Vite
# A exécuter une seule fois

KYMIA_DIR=~/Documents/Playground/kymia

echo "=== Nettoyage timestamps Vite ==="
cd "$KYMIA_DIR"
rm -f vite.config.js.timestamp-*.mjs
echo "OK"

echo ""
echo "=== Git init Kymia ==="
git init
git add -A
git commit -m "feat: initial commit — Kymia boutique streetwear"

echo ""
echo "=== Créer le repo GitHub puis coller l'URL ci-dessous ==="
echo "Exemple : git remote add origin https://github.com/MonsieurMass/Kymia.git && git push -u origin main"
