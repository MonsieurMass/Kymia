// Orientation publique fondée sur les critères SACEM publiés. Aucun verdict automatique.
export const FUNDING_VERSION='sacem-autoproduction-2026-10-22-v1';
const yn=[['yes','Oui'],['no','Non'],['unknown','Je ne sais pas']];
export const fundingFields={
 sacemMember:{label:'Êtes-vous membre de la Sacem ?',max:10,choices:yn},
 authorComposerMajority:{label:'Êtes-vous auteur-compositeur majoritaire sur cet enregistrement ?',max:10,choices:yn},
 selfProductionRank:{label:'S’agit-il de votre 1er, 2e ou 3e enregistrement autoproduit ?',max:12,choices:[['first_three','Oui'],['later','Non, c’est au moins le 4e'],['unknown','Je ne sais pas']]},
 trackCount:{label:'Le projet final comprend-il au moins 5 titres ?',max:10,choices:yn},
 recordingFinalized:{label:'L’enregistrement est-il finalisé ?',max:10,choices:yn},
 releaseWindow:{label:'Où en est la sortie intégrale du projet ?',max:24,choices:[['not_released','Pas encore sorti'],['within_6_months','Sorti depuis 6 mois ou moins'],['over_6_months','Sorti depuis plus de 6 mois'],['unknown','Je ne sais pas']]},
 professionalEnvironment:{label:'Avez-vous un entourage professionnel pour ce projet ?',max:10,choices:yn},
 structuredStrategy:{label:'Avez-vous une stratégie structurée pour la communication et la scène ?',max:10,choices:yn},
 physicalOnly:{label:'La sortie est-elle uniquement physique ?',max:10,choices:yn},
 physicalCopies:{label:'Si elle est uniquement physique, au moins 250 exemplaires sont-ils réservés à la vente ?',max:10,choices:yn},
 contactPreference:{label:'Souhaitez-vous être recontacté ?',max:20,choices:[['requested','Oui'],['not_requested','Non']]}
};
for(const field of Object.values(fundingFields))field.options=field.choices.map(([value])=>value);
const source='https://www.createursediteurs.sacem.fr/actualites-agenda/actualites/magsacem/autoproduction-nouvelles-regles-du-je';
export function isFundingRequest(data){return ['Financement','Montage de dossier'].includes(data.need)||data.sourceService==='sacem-autoproduction'}
export function fundingPreview(data,{today=new Date().toISOString().slice(0,10)}={}){
 if(!isFundingRequest(data))return null;
 const blockers=[],unknown=[];
 const answer=(key,negative,missing)=>{if(data[key]==='no')blockers.push(negative);else if(data[key]!=='yes')unknown.push(missing)};
 answer('sacemMember','Le programme vise les créateurs membres de la Sacem.','Confirmer l’adhésion du demandeur à la Sacem.');
 answer('authorComposerMajority','La demande doit être portée par l’auteur-compositeur dont le répertoire est majoritaire sur l’enregistrement.','Vérifier qui détient la majorité du répertoire présent sur l’enregistrement.');
 if(data.selfProductionRank==='later')blockers.push('L’aide publiée concerne le 1er, le 2e ou le 3e enregistrement autoproduit.');
 else if(data.selfProductionRank!=='first_three')unknown.push('Confirmer le rang de cet enregistrement dans votre discographie autoproduite.');
 answer('trackCount','Le projet doit comporter au moins 5 titres.','Confirmer le nombre définitif de titres.');
 answer('recordingFinalized','L’enregistrement doit être finalisé avant le dépôt.','Confirmer que l’enregistrement est finalisé.');
 if(data.releaseWindow==='over_6_months')blockers.push('La demande est à déposer après la sortie intégrale et dans les 6 mois qui suivent.');
 else if(!['not_released','within_6_months'].includes(data.releaseWindow))unknown.push('Confirmer la date de sortie intégrale pour vérifier la fenêtre de dépôt.');
 answer('professionalEnvironment','Un environnement professionnel est demandé : management, édition, spectacle, salle ou dispositif d’accompagnement.','Identifier l’accompagnateur professionnel et la preuve de son implication.');
 if(data.structuredStrategy!=='yes')unknown.push('Structurer la stratégie de communication et de scène qui sera examinée avec attention.');
 if(data.physicalOnly==='yes'){
  if(data.physicalCopies==='no')blockers.push('Pour une sortie uniquement physique, au moins 250 exemplaires doivent être réservés à la vente.');
  else if(data.physicalCopies!=='yes')unknown.push('Confirmer le tirage réservé à la vente pour la sortie physique.');
 }
 const stale=today<'2026-10-22'||today>'2026-11-22';
 const status=stale?'recheck':blockers.length?'prerequisites':unknown.length?'needs_info':'human_review';
 const label={recheck:'Règlement à revérifier',prerequisites:'Prérequis à construire',needs_info:'Informations à confirmer',human_review:'Profil à vérifier avec KYMIA'}[status];
 const opportunities=[{id:'SACEM-AUTO-2026',name:'Sacem — Aide à l’autoproduction',source,checkedAt:'2026-10-22',status,label,reason:'Le programme soutient la sortie digitale ou physique d’un projet autoproduit en musiques actuelles.',referenceAmount:'Montant forfaitaire publié : 5 000 €. Ce montant n’est ni acquis ni garanti.',blockers,missing:unknown,timing:'Le dossier se dépose après la sortie intégrale du projet et jusqu’à 6 mois après. Le calendrier de la session et le règlement doivent être reconfirmés avant tout dépôt.'}];
 return {version:FUNDING_VERSION,generatedAt:today,coverage:'Premier parcours KYMIA : aide Sacem à l’autoproduction. Les autres aides seront ajoutées après vérification et mise en production de leur parcours.',notice:'Résultat indicatif fondé sur vos réponses. Seule la Sacem décide de la recevabilité et de l’attribution de l’aide.',opportunities,nextSteps:blockers.length?['Corriger les prérequis identifiés avant d’engager un montage de dossier.','Conserver les preuves : sortie, titres, accords des coauteurs et entourage professionnel.']:['Faire vérifier les réponses et les pièces par une personne.','Préparer la biographie, la note d’intention, le budget et la recommandation professionnelle demandés.']};
}
export function fundingNotes(data,preview){if(!preview)return '';return ['APERÇU INDICATIF — '+preview.version,preview.coverage,...preview.opportunities.map(p=>`${p.name} : ${p.label}. ${p.referenceAmount} ${[...p.blockers,...p.missing].join(' ')} Source : ${p.source}`),...preview.nextSteps,preview.notice].join('\n');}
