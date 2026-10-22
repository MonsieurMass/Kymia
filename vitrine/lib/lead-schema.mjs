import {fundingFields} from './funding-preview.mjs';
import {nextStepOptions} from './next-step.mjs';
export const fields={
 ...fundingFields,
 name:{label:'Nom ou nom d’artiste',max:120,required:true},email:{label:'Courriel',max:254,required:true},
 structure:{label:'Type de structure',max:60,required:true,options:['Artiste sans structure','Micro-entreprise','Association','Société','Label indépendant','Autre']},
 project:{label:'Projet',max:80,required:true,options:['EP','Album','Single','Clip','Concert','Développement de carrière','Structuration administrative','Autre']},
 need:{label:'Besoin',max:80,required:true,options:['Préparation de sortie','Financement','Montage de dossier','Back-office','Distribution','Accompagnement','Administration','Stratégie','Autre']},
 maturity:{label:'Maturité',max:80,required:true,options:['Projet en réflexion','Projet en préparation','Projet déjà lancé','Projet en exploitation']},
 description:{label:'Description du projet',max:5000,required:true},budget:{label:'Budget',max:15},calendar:{label:'Calendrier',max:200},link:{label:'Lien musical',max:2000},
 consent:{label:'Confidentialité',max:3},privacyVersion:{label:'Version de la notice',max:30},website:{label:'Site web',max:300},sourceService:{label:'Service d’entrée',max:80},
 nextStep:{label:'Suite souhaitée',max:30,options:Object.keys(nextStepOptions)}
};
export class LeadError extends Error{constructor(message,field='',status=400){super(message);this.field=field;this.status=status;}}
export function validateLead(data){
 if(!data||typeof data!=='object'||Array.isArray(data))throw new LeadError('Demande invalide.');
 const out={};for(const [name,rule] of Object.entries(fields)){
  if(data[name]!==undefined&&typeof data[name]!=='string')throw new LeadError(`${rule.label} : valeur invalide.`,name);
  const value=(data[name]||'').trim();out[name]=value;
  if(value.length>rule.max)throw new LeadError(`${rule.label} : ${rule.max} caractères maximum.`,name);
  if(rule.required&&!value)throw new LeadError(`Renseignez le champ « ${rule.label} ».`,name);
  if(rule.options&&(value||rule.required)&&!rule.options.includes(value))throw new LeadError(`Choisissez une valeur proposée pour « ${rule.label} ».`,name);
 }
 if(out.website)throw new LeadError('Demande refusée.','website');
 if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(out.email))throw new LeadError('Saisissez un courriel valide.','email');
 if(out.description.length<20)throw new LeadError('Décrivez votre projet en au moins 20 caractères.','description');
 if(out.budget&&(!/^\d+(?:\.\d{1,2})?$/.test(out.budget)||Number(out.budget)>100000000))throw new LeadError('Indiquez un budget positif inférieur ou égal à 100 000 000 €.','budget');
 if(out.link){let url;try{url=new URL(out.link)}catch{throw new LeadError('Saisissez un lien complet, par exemple https://votre-site.fr.','link')};if(!['https:','http:'].includes(url.protocol)||!url.hostname||url.username||url.password)throw new LeadError('Le lien doit être une adresse HTTP ou HTTPS sans identifiants.','link');}
 if(out.privacyVersion!=='notion-v1')throw new LeadError('La notice a changé. Rechargez le formulaire après avoir conservé votre copie.','consent');
 if(out.consent!=='yes')throw new LeadError('Confirmez la lecture de la notice de confidentialité.','consent');
 if(out.sourceService&&!['financement','label-services','developpement-artistique'].includes(out.sourceService))throw new LeadError('Service d’entrée invalide.','sourceService');
 for(const key of Object.keys(fundingFields))if(!out[key])delete out[key];
 delete out.website;return out;
}
export function serviceFromSlug(slug){return {'financement':'Financement','label-services':'Back-office','developpement-artistique':'Préparation de sortie'}[slug]||'';}
