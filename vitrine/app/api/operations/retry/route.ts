import {NextResponse} from 'next/server';import {authorized} from '../../../../lib/operations.mjs';import {syncPending,queueHealth} from '../../../../lib/outbox.mjs';
export const runtime='nodejs';export const maxDuration=60;
export async function POST(req:Request){if(!authorized(req))return NextResponse.json({error:'Accès refusé.'},{status:401});try{const result=await syncPending();return NextResponse.json({result,health:await queueHealth()},{headers:{'Cache-Control':'no-store'}})}catch{return NextResponse.json({error:'Reprise indisponible.'},{status:503})}}
