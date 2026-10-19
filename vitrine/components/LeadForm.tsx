"use client";
import {useState,useRef,useEffect} from 'react';
import {fields,serviceFromSlug} from '../lib/lead-schema.mjs';
const steps=['Profil','Projet','Besoin','Maturité','Détails','Récapitulatif'];
const stepFields=[['name','email','structure'],['project'],['need'],['maturity'],['description','budget','calendar','link']];
const labels:Record<string,string>={name:'Nom',email:'Courriel',structure:'Structure',project:'Projet',need:'Besoin',maturity:'Maturité',description:'Description',budget:'Budget (€)',calendar:'Calendrier',link:'Lien musical'};
export default function LeadForm(){
 const [step,setStep]=useState(0),[data,setData]=useState<Record<string,string>>({}),[error,setError]=useState(''),[errorField,setErrorField]=useState(''),[busy,setBusy]=useState(false),[receipt,setReceipt]=useState(''),[delivery,setDelivery]=useState('local_only'),[dirty,setDirty]=useState(false),[editing,setEditing]=useState(false);
 const attempt=useRef<{id:string,payload:string,revision:number}|null>(null),inFlight=useRef(false),heading=useRef<HTMLHeadingElement>(null),errorBox=useRef<HTMLParagraphElement>(null),success=useRef<HTMLHeadingElement>(null);
 useEffect(()=>{const source=new URLSearchParams(location.search).get('service')||'';const need=serviceFromSlug(source);if(need)setData({sourceService:source,need});},[]);
 useEffect(()=>{if(!dirty||receipt)return;const message='Vos réponses ne sont pas encore envoyées. Quitter cette page les effacera.';
  const unload=(e:BeforeUnloadEvent)=>{e.preventDefault();e.returnValue='';};
  const links=(e:MouseEvent)=>{const a=(e.target as Element)?.closest?.('a');if(!a||a.target==='_blank'||e.ctrlKey||e.metaKey||e.shiftKey||e.altKey)return;const url=new URL(a.href,location.href);if(url.href===location.href||url.hash&&url.pathname===location.pathname)return;if(!window.confirm(message)){e.preventDefault();e.stopImmediatePropagation();}};
  // Navigation API couvre aussi les traversées de l’historique là où elle est disponible.
  const nav=(window as unknown as {navigation?:EventTarget}).navigation;
  const traverse=(event:Event)=>{const e=event as Event&{navigationType?:string};if(e.navigationType==='traverse'&&!window.confirm(message))e.preventDefault()};
  window.addEventListener('beforeunload',unload);document.addEventListener('click',links,true);nav?.addEventListener('navigate',traverse);
  return()=>{window.removeEventListener('beforeunload',unload);document.removeEventListener('click',links,true);nav?.removeEventListener('navigate',traverse)};
 },[dirty,receipt]);
 useEffect(()=>{if(receipt)success.current?.focus();else if(error)errorBox.current?.focus();},[receipt,error]);
 function update(key:string,value:string){setData(d=>({...d,[key]:value}));setDirty(true);setError('');setErrorField('')}
 function move(next:number){setError('');setErrorField('');setStep(next);requestAnimationFrame(()=>{heading.current?.focus({preventScroll:true});heading.current?.closest('form')?.scrollIntoView({block:'start',behavior:'instant'})})}
 function edit(group:number){setEditing(true);move(group)}
 function download(){const blob=new Blob([JSON.stringify({reference:receipt||undefined,...data},null,2)],{type:'application/json'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=receipt?'kymia-ma-demande.json':'kymia-mon-brouillon.json';a.click();URL.revokeObjectURL(url)}
 async function submit(e:React.FormEvent){
  e.preventDefault();if(inFlight.current)return;
  if(step<5){if(editing){setEditing(false);move(5)}else move(step+1);return}
  inFlight.current=true;setBusy(true);setError('');setErrorField('');
  const body={...data,privacyVersion:'notion-v1'};const payload=JSON.stringify(body,Object.keys(body).sort());
  if(!attempt.current)attempt.current={id:crypto.randomUUID(),payload,revision:1};
  else if(attempt.current.payload!==payload)attempt.current={...attempt.current,payload,revision:attempt.current.revision+1};
  try{
   const res=await fetch('/api/leads',{method:'POST',headers:{'Content-Type':'application/json','Idempotency-Key':attempt.current.id,'X-Lead-Revision':String(attempt.current.revision)},body:payload});
   let result;try{result=await res.json()}catch{throw Error('La réponse du serveur n’a pas pu être confirmée. Réessayez : votre référence sera conservée.')}
   if(!res.ok){if(result.field){setErrorField(result.field);const group=stepFields.findIndex(keys=>keys.includes(result.field));if(group>=0){setEditing(true);setStep(group)}}throw Error(result.error||'Enregistrement indisponible. Réessayez sans recharger.')}
   setDelivery(result.delivery);setReceipt(result.id);setDirty(false);
  }catch(e){setError(e instanceof Error&&!(e instanceof TypeError)?e.message:'Connexion interrompue. Réessayez sans recharger ; vos réponses et votre référence sont conservées.');}
  finally{inFlight.current=false;setBusy(false)}
 }
 const invalid=(key:string)=>({'aria-invalid':errorField===key||undefined,'aria-describedby':errorField===key?'lead-error':undefined});
 if(receipt)return <div className="lead-form success" role="status"><span className="success-mark" aria-hidden="true">↗</span><h2 ref={success} tabIndex={-1}>Votre demande est enregistrée.</h2><p>Référence : {receipt}</p><p>{delivery==='notion'?'Votre demande a été transmise à l’équipe KYMIA pour un premier examen humain.':delivery==='pending'?'Votre demande est conservée. Sa transmission à l’équipe est en attente et fera l’objet d’une nouvelle tentative.':'Votre demande est enregistrée. La transmission à l’équipe n’est pas encore active dans cet environnement.'}</p><p>Ce premier examen ne constitue pas un diagnostic automatique. Une éventuelle analyse personnalisée ou prestation sur devis fera l’objet d’une proposition distincte. Aucun courriel automatique n’est envoyé.</p><button className="button" onClick={download}>Télécharger ma copie ↓</button><a href="/">Retour à l’accueil ↗</a></div>;
 return <form onSubmit={submit} className="lead-form" aria-busy={busy}>
  <div className="form-progress" role="group" aria-label={`Étape ${step+1} sur 6`}>{steps.map((s,i)=><span key={s} className={i<=step?'active':''}/>)}</div>
  <div className="eyebrow">0{step+1} / 06 · {steps[step]}</div>
  <h2 ref={heading} tabIndex={-1}>{['Faisons connaissance.','Que préparez-vous ?','De quoi avez-vous besoin ?','Où en êtes-vous ?','Dites-nous en plus.','Vérifiez votre demande.'][step]}</h2>
  {data.sourceService&&step===0?<p className="form-context">{{financement:'Financement','label-services':'Structuration de projet','developpement-artistique':'Développement artistique'}[data.sourceService]} · Besoin modifiable à l’étape 3.</p>:null}
  {error?<p ref={errorBox} tabIndex={-1} id="lead-error" className="error" role="alert">{error}</p>:null}
  {step===0?<><label>Nom ou nom d’artiste<input required name="name" autoComplete="name" maxLength={fields.name.max} value={data.name||''} onChange={e=>update('name',e.target.value)} {...invalid('name')}/></label><label>Courriel<input required type="email" name="email" autoComplete="email" spellCheck={false} maxLength={fields.email.max} value={data.email||''} onChange={e=>update('email',e.target.value)} {...invalid('email')}/></label><label>Type de structure<select required name="structure" value={data.structure||''} onChange={e=>update('structure',e.target.value)} {...invalid('structure')}><option value="">Choisir votre situation</option>{fields.structure.options.map(s=><option key={s}>{s}</option>)}</select></label></>:null}
  {[1,2,3].includes(step)?<fieldset><legend>{steps[step]}</legend><div className="choice-grid">{fields[(['project','need','maturity'] as const)[step-1]].options.map(c=>{const key=['project','need','maturity'][step-1];return <label className="choice" key={c}><input required type="radio" name={key} value={c} checked={data[key]===c} onChange={()=>update(key,c)} {...invalid(key)}/><span>{c}</span></label>})}</div></fieldset>:null}
  {step===4?<><label>Description du projet<textarea required name="description" minLength={20} maxLength={fields.description.max} rows={5} value={data.description||''} onChange={e=>update('description',e.target.value)} placeholder="Votre vision, vos objectifs, ce qui vous manque pour avancer…" {...invalid('description')}/></label><label>Budget estimé en euros · facultatif<input name="budget" type="number" inputMode="decimal" min="0" max="100000000" step="0.01" value={data.budget||''} onChange={e=>update('budget',e.target.value)} {...invalid('budget')}/></label><label>Calendrier envisagé · facultatif<input name="calendar" maxLength={fields.calendar.max} value={data.calendar||''} onChange={e=>update('calendar',e.target.value)} {...invalid('calendar')}/></label><label>Lien musical · facultatif<input name="link" type="url" maxLength={fields.link.max} placeholder="https://votre-site.fr" value={data.link||''} onChange={e=>update('link',e.target.value)} {...invalid('link')}/></label></>:null}
  {step===5?<>{stepFields.map((keys,group)=><section className="review-group" key={group}><div className="review-heading"><h3>{steps[group]}</h3><button type="button" onClick={()=>edit(group)} aria-label={`Modifier : ${steps[group]}`}>Modifier ↗</button></div><dl className="recap">{keys.map(key=><div key={key}><dt>{labels[key]}</dt><dd>{data[key]||'Non précisé'}</dd></div>)}</dl></section>)}<label className="consent"><input name="consent" type="checkbox" required checked={data.consent==='yes'} onChange={e=>update('consent',e.target.checked?'yes':'')} {...invalid('consent')}/><span>J’ai lu la <a href="/confidentialite" target="_blank" rel="noopener noreferrer">notice de confidentialité</a> et j’accepte l’enregistrement sécurisé et la transmission de ces informations à l’équipe KYMIA via son outil de suivi Notion pour traiter ma demande.</span></label><p className="fine">Ne transmettez aucune donnée sensible. Aucun paiement ni abonnement.</p></>:null}
  <div className="honeypot" aria-hidden="true"><label>Votre site web<input name="website" tabIndex={-1} autoComplete="off" value={data.website||''} onChange={e=>update('website',e.target.value)}/></label></div>
  <div className="form-actions">{step>0?<button type="button" className="back" disabled={busy} onClick={()=>{if(editing){setEditing(false);move(5)}else move(step-1)}}>{editing?'Annuler la navigation':'← Retour'}</button>:<span/>}<button className="button" disabled={busy}>{busy?'Enregistrement…':step===5?'Envoyer ma demande':editing?'Revenir au récapitulatif':'Continuer'} <span aria-hidden="true">↗</span></button></div>
  <p className="fine">Vos réponses restent dans cette page jusqu’à l’envoi. Le premier examen est gratuit, sans résultat automatique.</p>{dirty?<button type="button" className="draft-download" onClick={download}>Conserver une copie de mes réponses ↓</button>:null}
 </form>;
}
