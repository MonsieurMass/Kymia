import {mkdir,readFile,writeFile} from 'node:fs/promises';import {resolve,join} from 'node:path';import {createHash,randomBytes,createCipheriv,createDecipheriv} from 'node:crypto';import {storageMode,withRecordLock,readRecord,writeRecord} from './store.mjs';import {LeadError} from './lead-schema.mjs';export {validateLead} from './lead-schema.mjs';
async function key(storage){const mode=storageMode(storage);if(process.env.LEAD_ENCRYPTION_KEY){if(!/^[a-f0-9]{64}$/i.test(process.env.LEAD_ENCRYPTION_KEY))throw Error('Clé de chiffrement invalide');return Buffer.from(process.env.LEAD_ENCRYPTION_KEY,'hex')}if(mode==='postgres'||process.env.VERCEL)throw Error('LEAD_ENCRYPTION_KEY requis pour le stockage distant');const dir=resolve(/* turbopackIgnore: true */ storage||process.env.LEAD_STORAGE_DIR||'.local/leads');await mkdir(dir,{recursive:true,mode:0o700});const path=join(dir,'.key');try{return await readFile(path)}catch(e){if(e.code!=='ENOENT')throw e;const k=randomBytes(32);try{await writeFile(path,k,{mode:0o600,flag:'wx'});return k}catch(e){if(e.code==='EEXIST')return readFile(path);throw e}}}
function encrypt(lead,k){const iv=randomBytes(12);const c=createCipheriv('aes-256-gcm',k,iv);const data=Buffer.concat([c.update(JSON.stringify(lead)),c.final()]).toString('base64');return {iv:iv.toString('hex'),tag:c.getAuthTag().toString('hex'),data}}
export function decryptRecord(record,k){const c=createDecipheriv('aes-256-gcm',k,Buffer.from(record.iv,'hex'));c.setAuthTag(Buffer.from(record.tag,'hex'));return JSON.parse(Buffer.concat([c.update(Buffer.from(record.data,'base64')),c.final()]).toString())}
export async function saveLead(data,token,storage,options={}){
 storageMode(storage);const k=await key(storage);const revision=options.revision??1;if(!Number.isSafeInteger(revision)||revision<1||revision>10000)throw new LeadError('Révision invalide.');
 const id=createHash('sha256').update(token).digest('hex').slice(0,24),payloadHash=createHash('sha256').update(JSON.stringify(data)).digest('hex');
 return withRecordLock(id,storage,async()=>{const prior=await readRecord(id,storage);const exists=Boolean(prior?.data);const oldRevision=prior?.revision||1;
  if(exists&&revision<oldRevision)throw new LeadError('Cette version a déjà été remplacée par votre correction.', '',409);
  if(exists&&revision===oldRevision){if(prior.payloadHash!==payloadHash)throw new LeadError('Cette référence correspond à une autre demande. Réessayez après correction.','',409);return {id,revision,duplicate:true}}
  const createdAt=exists?decryptRecord(prior,k).createdAt:new Date().toISOString();
  const record={...encrypt({id,revision,createdAt,updatedAt:new Date().toISOString(),data},k),payloadHash,revision,delivery:{...(prior?.delivery||{}),status:'pending',nextAttemptAt:null,attempts:0,firstQueuedAt:prior?.delivery?.firstQueuedAt||new Date().toISOString()}};
  await writeRecord(id,record,storage);return {id,revision,duplicate:false,updated:exists};
 });
}
export async function readLead(id,storage){const r=await readRecord(id,storage);if(!r?.data)throw Error('Demande introuvable');return decryptRecord(r,await key(storage));}
