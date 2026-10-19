export async function register(){
 if(process.env.NEXT_RUNTIME==='nodejs'&&process.env.NEXT_PHASE!=='phase-production-build'){
  const {initializeStore}=await import('./lib/store.mjs');
  // Le schéma distant est initialisé explicitement par npm run storage:init.
  if(!process.env.VERCEL&&process.env.KYMIA_NOTION_WORKER==='true'&&process.env.KYMIA_TEST_MODE!=='true'){
   const {syncPending,queueHealth}=await import('./lib/outbox.mjs');let running=false;
   const tick=async()=>{if(running)return;running=true;try{const h=await queueHealth();if(h.accessErrors)console.error('KYMIA : demandes en attente, accès Notion à vérifier.');await syncPending()}catch{console.error('KYMIA : reprise indisponible.')}finally{running=false}};
   void tick();setInterval(()=>void tick(),30000).unref();
  }
 }
}
