import {chromium,webkit} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import assert from 'node:assert/strict';

const results=[];
for(const [name,engine] of [['Chromium',chromium],['WebKit',webkit]]){
 const browser=await engine.launch();
 try{
  const context=await browser.newContext({viewport:{width:440,height:956},isMobile:true,hasTouch:true,acceptDownloads:true});
  const page=await context.newPage();
  await page.goto('http://localhost:3100/');
  const tool=page.locator('#orientation');await tool.waitFor();
  await page.getByRole('button',{name:/Je cherche un financement/}).click();
  await page.getByRole('heading',{name:'Des premières pistes et leurs prérequis'}).waitFor();
  assert.equal(await tool.locator('li').count(),3);
  const downloadEvent=page.waitForEvent('download');
  await page.getByRole('button',{name:'Télécharger la checklist'}).click();
  const download=await downloadEvent;
  assert.equal(download.suggestedFilename(),'kymia-financement-checklist.md');
  const href=await page.getByRole('link',{name:'Commencer ce parcours'}).getAttribute('href');
  assert.equal(href,'/demarrer?service=financement');
  await page.getByRole('link',{name:'Commencer ce parcours'}).click();
  await page.locator('form[data-ready=true]').waitFor();
  await page.getByRole('radio',{name:'EP',exact:true}).check();
  await page.getByRole('button',{name:'Continuer'}).click();
  assert.equal(await page.getByRole('radio',{name:'Financement',exact:true}).isChecked(),true);
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
  await page.goto('http://localhost:3100/financement');
  assert.equal(await page.locator('.service-starter li').count(),3);
  assert.match(await page.locator('.service-result').innerText(),/résultat immédiat/i);
  const axe=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa','wcag22aa']).analyze();
  assert.deepEqual(axe.violations.map(item=>item.id),[]);
  results.push({engine:name,orientation:true,download:true,prefill:true,serviceChecklist:true,overflow:false,axe:0});
  await context.close();
 }finally{await browser.close()}
}
console.log(JSON.stringify(results,null,2));
