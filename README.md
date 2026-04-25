# Kymia Store

Boutique front-end React/Vite pour `Kymia`, une marque de streetwear chic orientee casquettes premium.

## Stack

- `React 18`
- `Vite 5`
- `CSS` sur-mesure
- `ESLint`

## Lancer le projet

```bash
npm install
npm run dev -- --host 127.0.0.1 --port 5173
```

Puis ouvrir [http://127.0.0.1:5173](http://127.0.0.1:5173).

## Scripts utiles

```bash
npm run dev
npm run build
npm run lint
```

## Structure

- `src/App.jsx` : application principale
- `src/App.css` : styles principaux
- `src/content/siteContent.js` : contenu marque, produits et navigation
- `src/lib/seo.js` : metadata et SEO
- `public/` : assets publics, sitemap, robots, feed

## Etat actuel

Le projet contient :

- homepage immersive et editoriale
- collection
- fiche produit
- panier et checkout front
- base SEO

## Notes

- le paiement reel et la persistance back-end ne sont pas encore branches
- certains fichiers historiques sont encore presents dans `src/` pour reference
