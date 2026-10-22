import {fundingNotes} from './funding-preview.mjs';
import {contactPreferenceFor,nextStepAction,nextStepLabel,resolveNextStep} from './next-step.mjs';
// Serveur uniquement. Schéma du pipeline KYMIA vérifié dans Notion.
export const KYMIA_DATA_SOURCE_ID = '8953abce-3d9d-826b-b387-879e4c24d7bf';
export function notionConfig(env = process.env) {
  if(env.KYMIA_NOTION_MODE==='disabled'||env.KYMIA_TEST_MODE==='true')return null;
  const token = env.NOTION_TOKEN?.trim();
  if(env.VERCEL_ENV==='preview'&&token&&(!env.NOTION_DATA_SOURCE_ID||env.NOTION_DATA_SOURCE_ID===KYMIA_DATA_SOURCE_ID||env.KYMIA_NOTION_MODE!=='preview'))throw Error('La Preview exige un CRM de test isolé.');
  return token ? { token, dataSourceId: env.NOTION_DATA_SOURCE_ID || KYMIA_DATA_SOURCE_ID } : null;
}
const rich = (value) => Array.from({length:Math.ceil(value.length/1800)},(_,i)=>({type:'text',text:{content:value.slice(i*1800,(i+1)*1800)}}));
export const leadMarker = id => `KYMIA-WEB:${id}`;
export function mapLeadToNotion({id,createdAt,data:d,orientation},dataSourceId=KYMIA_DATA_SOURCE_ID) {
  const segment=d.structure==='Association'?'Association':d.structure==='Label indépendant'?'Label':d.structure==='Artiste sans structure'?'Artiste':'Autre';
  const step=resolveNextStep(d),contactPreference=contactPreferenceFor(d);
  const notes=[leadMarker(id),'Source : formulaire KYMIA WORLD',`Reçue le : ${createdAt}`,`Artiste / contact : ${d.name}`,`Projet : ${d.project}`,`Structure : ${d.structure}`,`Service demandé : ${d.need}`,`Maturité : ${d.maturity}`,`Suite choisie : ${nextStepLabel(d)}`,`Description : ${d.description}`,`Budget du projet : ${d.budget ? d.budget+' €':'Non précisé'}`,`Calendrier : ${d.calendar||'Non précisé'}`,`Lien musical : ${d.link||'Non précisé'}`,`Contact souhaité : ${contactPreference==='not_requested'?'NON — aperçu uniquement, ne pas relancer':'OUI — '+(step==='scoped_mission'?'mission à cadrer':'premier examen humain demandé')}`,fundingNotes(d,orientation),'Notice de confidentialité acceptée lors de l’envoi.'].join('\n');
  return {parent:{type:'data_source_id',data_source_id:dataSourceId},properties:{
    'Opportunité':{title:rich(`${d.name} — ${d.project}`)},
    'Contact':{rich_text:rich(d.email)},
    'Offre envisagée':{rich_text:rich(`${d.need} — ${nextStepLabel(d)}`)},
    'Phase':{status:{name:'À qualifier'}},
    'Segment':{select:{name:segment}},
    'Source acquisition':{select:{name:'Inbound'}},
    'Prochaine action':{rich_text:rich(nextStepAction(d))},
    'Notes':{rich_text:rich(notes)}
  }};
}
export async function notionRequest(config,path,body,{fetcher=fetch,method='POST'}={}) {
  const response=await fetcher('https://api.notion.com/v1/'+path,{method,headers:{Authorization:`Bearer ${config.token}`,'Notion-Version':'2025-09-03','Content-Type':'application/json'},...(body?{body:JSON.stringify(body)}:{}),signal:AbortSignal.timeout(12000)});
  if(!response.ok){const e=new Error('notion_http_'+response.status);e.status=response.status;e.retryAfter=Math.min(3600,Math.max(60,Number(response.headers.get('retry-after'))||60));throw e;}
  return response.json();
}
export async function deliverToNotion(lead,config,fetcher=fetch,knownPageId) {
  async function update(pageId){const payload=mapLeadToNotion(lead,config.dataSourceId);delete payload.properties.Phase;delete payload.properties['Source acquisition'];if(lead.data.contactPreference||lead.data.nextStep){const existing=await notionRequest(config,`pages/${pageId}`,null,{fetcher,method:'GET'});const action=(existing.properties?.['Prochaine action']?.rich_text||[]).map(x=>x.plain_text||x.text?.content||'').join('');const owned=['Examiner la demande et préparer un premier échange avec l’artiste.','Aperçu uniquement — aucune relance commerciale demandée.','Réaliser un premier examen humain et qualifier la prochaine étape.','Qualifier le besoin et préparer une proposition de mission cadrée.'];if(!owned.includes(action))delete payload.properties['Prochaine action'];}else delete payload.properties['Prochaine action'];await notionRequest(config,`pages/${pageId}`,{properties:payload.properties},{fetcher,method:'PATCH'});return {pageId,recovered:true};}
  if(knownPageId)return update(knownPageId);
  // Recherche avant chaque création, y compris après une réponse réseau ambiguë.
  const existing=await notionRequest(config,`data_sources/${config.dataSourceId}/query`,{filter:{property:'Notes',rich_text:{contains:leadMarker(lead.id)}},page_size:2},{fetcher});
  if(existing.results?.length){if((lead.revision||1)>1)return update(existing.results[0].id);return {pageId:existing.results[0].id,recovered:true};}
  const page=await notionRequest(config,'pages',mapLeadToNotion(lead,config.dataSourceId),{fetcher});
  if(!page.id)throw Error('notion_missing_page_id');
  return {pageId:page.id,recovered:false};
}
export async function verifyNotionAccess(config,fetcher=fetch) {
  const source=await notionRequest(config,`data_sources/${config.dataSourceId}`,null,{fetcher,method:'GET'});
  const types={'Opportunité':'title','Contact':'rich_text','Offre envisagée':'rich_text','Phase':'status','Segment':'select','Source acquisition':'select','Prochaine action':'rich_text','Notes':'rich_text'};
  for(const [name,type] of Object.entries(types))if(source.properties?.[name]?.type!==type)throw Error('Schéma incompatible : '+name);
  if(!source.properties.Phase.status.options.some(o=>o.name==='À qualifier'))throw Error('Statut À qualifier absent.');
  return {dataSourceId:source.id,ready:true};
}
