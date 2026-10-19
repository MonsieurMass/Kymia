import {NextResponse} from 'next/server';import {authorized} from '../../../../lib/operations.mjs';import {queueHealth} from '../../../../lib/outbox.mjs';
export const runtime='nodejs';
export async function GET(req:Request){if(!authorized(req))return NextResponse.json({error:'Accès refusé.'},{status:401});try{const health=await queueHealth();return NextResponse.json(health,{status:health.accessErrors?503:200,headers:{'Cache-Control':'no-store'}})}catch{return NextResponse.json({error:'Supervision indisponible.'},{status:503})}}
