'use client';
import {useState} from 'react';
import Link from 'next/link';

const paths=[
 {slug:'developpement-artistique',label:'Je prépare une sortie',result:'Un plan de préparation de sortie',items:['Vérifier les masters, visuels, crédits et autorisations.','Fixer la date cible et les validations du rétroplanning.','Identifier les personnes responsables de chaque livraison.']},
 {slug:'financement',label:'Je cherche un financement',result:'Des premières pistes et leurs prérequis',items:['Identifier la structure qui porte officiellement le projet.','Poser le budget, le calendrier et les dépenses prévues.','Repérer les pièces déjà disponibles et celles à obtenir.']},
 {slug:'label-services',label:'Je veux mieux m’organiser',result:'Un plan pour structurer votre back-office',items:['Créer une source unique pour les informations du projet.','Attribuer chaque action à une personne et une échéance.','Conserver les décisions, validations et pièces au même endroit.']}
] as const;

export default function QuickOrientation(){
 const [selected,setSelected]=useState(0);const path=paths[selected];
 function download(){const text=[`# ${path.result}`,'',...path.items.map(item=>`- [ ] ${item}`),'',`Continuer : ${location.origin}/demarrer?service=${path.slug}`].join('\n');const url=URL.createObjectURL(new Blob([text],{type:'text/markdown;charset=utf-8'}));const a=document.createElement('a');a.href=url;a.download=`kymia-${path.slug}-checklist.md`;a.click();URL.revokeObjectURL(url)}
 return <section className="quick-orientation section" id="orientation"><div className="quick-orientation-intro"><div className="eyebrow">Orientation rapide · 30 secondes</div><h2>QU’EST-CE QUI VOUS<br/><em>BLOQUE AUJOURD’HUI ?</em></h2><p>Choisissez votre situation. Vous obtenez immédiatement une première checklist, puis un parcours adapté si vous souhaitez aller plus loin.</p></div><div className="quick-orientation-tool"><div className="quick-paths" role="group" aria-label="Choisir votre besoin">{paths.map((item,index)=><button type="button" key={item.slug} className={index===selected?'active':''} aria-pressed={index===selected} onClick={()=>setSelected(index)}><span>0{index+1}</span>{item.label}</button>)}</div><div className="quick-result" aria-live="polite"><span className="eyebrow">Votre point de départ</span><h3>{path.result}</h3><ul>{path.items.map(item=><li key={item}>{item}</li>)}</ul><div className="quick-actions"><Link prefetch={false} className="button" href={`/demarrer?service=${path.slug}`}><span>Commencer ce parcours</span><span className="ui-arrow" aria-hidden="true"/></Link><button type="button" className="text-link" onClick={download}>Télécharger la checklist</button></div><p className="fine">Sans compte et sans paiement. Le plan complet apparaît avant vos coordonnées.</p></div></div></section>
}
