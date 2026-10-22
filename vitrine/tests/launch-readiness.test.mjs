import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {assertPublicLaunchReady,publicLaunchRequired,publicLaunchReadiness} from '../lib/legal.mjs';

test('la preview reste testable sans publier des mentions incomplètes',()=>{
 assert.doesNotThrow(()=>assertPublicLaunchReady({VERCEL_ENV:'preview',SITE_INDEXABLE:'false'}));
 assert.throws(()=>assertPublicLaunchReady({VERCEL_ENV:'production',SITE_INDEXABLE:'true'}),/informations légales manquantes/);
});

test('la publication indexable exige toutes les informations officielles',()=>{
 const env=Object.fromEntries(publicLaunchRequired.map(key=>[key,'Valeur vérifiée']));
 env.VERCEL_ENV='production';env.SITE_INDEXABLE='true';
 assert.equal(publicLaunchReadiness(env).ready,true);
 assert.doesNotThrow(()=>assertPublicLaunchReady(env));
});

test('l’interface publique ne montre aucun libellé de prototype',async()=>{
 const files=['../app/layout.tsx','../app/page.tsx','../app/[slug]/page.tsx','../components/ui.tsx','../lib/content.ts'];
 const text=(await Promise.all(files.map(file=>readFile(new URL(file,import.meta.url),'utf8')))).join('\n');
 assert.doesNotMatch(text,/Prévisualisation réservée|Version de travail|version locale|Document préparatoire|Vision future|viendront ici|À confirmer avant publication|Évolutions futures|Avant le lancement/i);
});
