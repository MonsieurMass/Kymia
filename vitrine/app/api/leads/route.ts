import {NextResponse,after} from 'next/server';import {validateLead,saveLead} from '../../../lib/leads.mjs';import {LeadError} from '../../../lib/lead-schema.mjs';import {syncLead,syncPending} from '../../../lib/outbox.mjs';
export const runtime='nodejs';const limits=new Map<string,{count:number,until:number}>();
export async function POST(req:Request){
 const headers={'Cache-Control':'no-store'};
 const fail=(error:string,status:number,field='')=>NextResponse.json({error,field},{status,headers});
 const origin=req.headers.get('origin');if(!origin||origin!==new URL(req.url).origin)return fail('Origine non autorisée.',403);
 if(!(req.headers.get('content-type')||'').startsWith('application/json'))return fail('Format invalide.',415);
 const ip=req.headers.get('x-forwarded-for')?.split(',')[0]||'local',now=Date.now();for(const [key,v]of limits)if(v.until<now)limits.delete(key);
 const rate=limits.get(ip)||{count:0,until:now+60000};if(++rate.count>10)return fail('Trop de tentatives. Réessayez dans une minute.',429);limits.set(ip,rate);
 const token=req.headers.get('idempotency-key')||'';if(!/^[a-f0-9]{8}(-[a-f0-9]{4}){3}-[a-f0-9]{12}$/i.test(token))return fail('Référence invalide. Rechargez le formulaire après avoir conservé une copie.',400);
 const revision=Number(req.headers.get('x-lead-revision')||'1');
 try{
  const reader=req.body?.getReader();if(!reader)return fail('Demande vide.',400);let bytes=0,raw='';const decoder=new TextDecoder();
  while(true){const {done,value}=await reader.read();if(done)break;bytes+=value.length;if(bytes>30000){await reader.cancel();return fail('Demande trop volumineuse.',413)}raw+=decoder.decode(value,{stream:true})}raw+=decoder.decode();
  let parsed;try{parsed=JSON.parse(raw)}catch{return fail('Le contenu envoyé est invalide. Réessayez.',400)}
  const data=validateLead(parsed);const result=await saveLead(data,token,undefined,{revision});
  const state=await syncLead(result.id).catch(()=>({status:'pending'}));
  // Opportuniste en Preview : endpoint de reprise authentifié requis pour une reprise sans trafic.
  after(async()=>{try{await syncPending()}catch{console.error('KYMIA : reprise non confirmée.')}});
  return NextResponse.json({...result,delivery:state.status==='synced'?'notion':state.status==='not_configured'?'local_only':'pending'},{status:state.status==='pending'?202:result.duplicate?200:201,headers});
 }catch(e){if(e instanceof LeadError)return fail(e.message,e.status,e.field);return fail('L’enregistrement est indisponible. Vos réponses restent affichées ; réessayez sans recharger.',503);}
}
