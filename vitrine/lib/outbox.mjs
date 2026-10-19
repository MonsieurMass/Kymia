import {readLead} from './leads.mjs';import {notionConfig,deliverToNotion} from './notion.mjs';import {withRecordLock,readRecord,writeRecord,listRecords} from './store.mjs';
export async function syncLead(id,{storage,config=notionConfig(),fetcher=fetch,now=Date.now()}={}){
 if(!config)return {status:'not_configured'};
 return withRecordLock(id,storage,async()=>{const record=await readRecord(id,storage);if(!record?.data)return {status:'missing'};const prior=record.delivery||{status:'pending',attempts:0};const revision=record.revision||1;
  if(prior.status==='synced'&&(prior.revision||1)===revision)return prior;
  if(prior.status==='requires_consent')return prior;
  if(prior.nextAttemptAt&&Date.parse(prior.nextAttemptAt)>now)return prior;
  const attempts=(prior.attempts||0)+1;const pending={...prior,status:'pending',attempts,nextAttemptAt:new Date(now+60000).toISOString()};await writeRecord(id,{...record,delivery:pending},storage);
  try{const lead=await readLead(id,storage);if(lead.data.privacyVersion!=='notion-v1'){const state={status:'requires_consent',attempts};await writeRecord(id,{...record,delivery:state},storage);return state}
   const result=await deliverToNotion(lead,config,fetcher,prior.pageId);const state={firstQueuedAt:prior.firstQueuedAt,status:'synced',pageId:result.pageId,revision,attempts,syncedAt:new Date().toISOString()};await writeRecord(id,{...record,delivery:state},storage);return state;
  }catch(e){const seconds=e.retryAfter||Math.min(3600,60*2**Math.min(attempts-1,6));const state={...pending,errorCode:e.status?'notion_http_'+e.status:'delivery_unconfirmed',nextAttemptAt:new Date(now+seconds*1000).toISOString()};await writeRecord(id,{...record,delivery:state},storage);return state;}
 });
}
export async function syncPending({storage,config=notionConfig(),fetcher=fetch}={}){if(!config)return {configured:false,synced:0,pending:0};const deadline=Date.now()+40000;const result={configured:true,synced:0,pending:0,requiresConsent:0};for(const {id,record} of (await listRecords(storage)).slice(0,100)){if(Date.now()>deadline)break;if(record?.delivery?.status==='synced')continue;const state=await syncLead(id,{storage,config,fetcher});if(state.status==='synced')result.synced++;else if(state.status==='requires_consent')result.requiresConsent++;else result.pending++}return result;}
export async function queueHealth(storage){const rows=await listRecords(storage);const states=rows.filter(r=>r.record?.data).map(r=>r.record.delivery||{status:'pending'});const pending=states.filter(s=>s.status==='pending');return {total:states.length,synced:states.filter(s=>s.status==='synced').length,pending:pending.length,requiresConsent:states.filter(s=>s.status==='requires_consent').length,accessErrors:pending.filter(s=>['notion_http_401','notion_http_403','notion_http_404'].includes(s.errorCode)).length,oldestPendingAt:pending.map(s=>s.firstQueuedAt).filter(Boolean).sort()[0]||null};}
