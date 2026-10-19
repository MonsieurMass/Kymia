import {initializeStore,listRecords,namespace,withRecordLock,writeRecord,storageMode,sql} from '../lib/store.mjs';import {queueHealth,syncPending} from '../lib/outbox.mjs';import {decryptRecord} from '../lib/leads.mjs';import {legalReadiness} from '../lib/legal.mjs';import {readFile,writeFile} from 'node:fs/promises';
const [command,path]=process.argv.slice(2);
if(command==='init'){await initializeStore();console.log('Schéma de la vitrine initialisé. Aucune donnée historique migrée.');}
else if(command==='health')console.log(JSON.stringify(await queueHealth(),null,2));
else if(command==='retry')console.log(JSON.stringify(await syncPending(),null,2));
else if(command==='legal')console.log(JSON.stringify(legalReadiness(),null,2));
else if(command==='backup'){
 if(!path)throw Error('Indiquez un fichier de sauvegarde privé.');const rows=await listRecords();await writeFile(path,JSON.stringify({format:'kymia-vitrine-encrypted-v1',namespace:namespace(),createdAt:new Date().toISOString(),rows}),{flag:'wx',mode:0o600});console.log('Sauvegarde chiffrée créée. Conservez la clé séparément.');
}else if(command==='restore'){
 if(!path||storageMode()!=='postgres')throw Error('Restauration réservée à une base PostgreSQL de destination vide.');
 const backup=JSON.parse(await readFile(path,'utf8'));if(backup.format!=='kymia-vitrine-encrypted-v1'||!Array.isArray(backup.rows))throw Error('Format invalide');
 if(namespace().startsWith('preview-')&&!String(backup.namespace).startsWith('preview-'))throw Error('Import de données réelles en Preview interdit.');
 const key=Buffer.from(process.env.LEAD_ENCRYPTION_KEY||'','hex');if(key.length!==32)throw Error('Clé requise');
 for(const row of backup.rows){if(!/^[a-f0-9]{24}$/.test(row.id)||decryptRecord(row.record,key).id!==row.id)throw Error('Sauvegarde invalide');}
 await initializeStore();if((await listRecords()).length)throw Error('Destination non vide : restauration refusée, aucun écrasement.');
 // Réservé à une destination isolée et sans trafic ; pas de restauration automatique.
 const inserted=await sql(`INSERT INTO kw_vitrine_leads(namespace,id,record) SELECT $1,item->>'id',item->'record' FROM jsonb_array_elements($2::jsonb) item WHERE NOT EXISTS(SELECT 1 FROM kw_vitrine_leads WHERE namespace=$1) RETURNING id`,[namespace(),JSON.stringify(backup.rows)]);if(inserted.rows.length!==backup.rows.length)throw Error('Restauration refusée : destination modifiée.');
 console.log('Restauration terminée dans la destination vide. Vérifier les totaux avant toute reprise.');
}else throw Error('Commande attendue : init, health, retry, legal, backup ou restore');
