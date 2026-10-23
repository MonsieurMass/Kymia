import {chromium,webkit} from '@playwright/test';
import {audiences,guides} from '../lib/editorial.mjs';
import {mkdir,writeFile} from 'node:fs/promises';
import assert from 'node:assert/strict';
const dir=process.env.EDITORIAL_REPORT_DIR||'docs/revision-editoriale';await mkdir(dir,{recursive:true});
const paths=['/','/services','/financement','/developpement-artistique','/label-services','/a-propos','/projets','/contact','/demarrer','/mentions-legales','/confidentialite','/cookies','/guides',...audiences.map(a=>'/pour/'+a.slug),...guides.map(g=>'/guides/'+g.slug)];
const report=[];
for(const [name,engine] of [['Chromium',chromium],['WebKit',webkit]]){
 const b=await engine.launch();try{const c=await b.newContext({viewport:{width:440,height:956},isMobile:true,hasTouch:true});const p=await c.newPage();
 for(const path of paths){const r=await p.goto('http://localhost:3100'+path);assert.equal(r.status(),200);const text=await p.locator('body').innerText();const bad=text.match(/\b(back.office|label services|funding|workflow|roadmap|check.?list|reporting|onboarding|pipeline|dashboard|single|masters|royalties|stems|splits)\b|premier parcours actif|en développement|ouverture progressive|un système qui grandit/gi)||[];assert.deepEqual(bad,[],path);assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,path);report.push({engine:name,path,french:true,overflow:false});}
 if(name==='WebKit')for(const [label,path]of [['accueil','/'],['services','/services'],['a-propos','/a-propos'],['financement','/financement']])for(const [device,width,height]of [['iphone',440,956],['ordinateur',1440,1000]]){await p.setViewportSize({width,height});for(const [stage,base]of [['avant','https://kymia-world-sprint-02.vercel.app'],['apres','http://localhost:3100']]){await p.goto(base+path);await p.evaluate(()=>document.fonts.ready);await p.screenshot({path:`${dir}/${label}-${device}-${stage}.png`,fullPage:true});}}
 }finally{await b.close()}}
await writeFile(`${dir}/controle-public.json`,JSON.stringify(report,null,2));console.log(JSON.stringify({pages:paths.length,engines:2,checks:report.length,anglicisms:0,overflow:0,captures:16}));
