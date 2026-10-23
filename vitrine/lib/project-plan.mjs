import {publicLabel} from './public-labels.mjs';
import {nextStepLabel} from './next-step.mjs';
const priorities={
 'Préparation de sortie':['Lister les enregistrements définitifs, visuels, crédits et autorisations déjà disponibles.','Fixer une date cible puis construire le rétroplanning de validation.','Identifier qui valide chaque élément avant la livraison au distributeur.'],
 'Financement':['Confirmer le porteur juridique, ses affiliations et les droits sur le projet.','Mettre le budget et le calendrier en face des critères des dispositifs repérés.','Choisir la prochaine session réaliste avant d’engager une dépense.'],
 'Montage de dossier':['Choisir le dispositif prioritaire et relire son règlement à jour.','Réunir les pièces du porteur, le budget et les justificatifs du projet.','Attribuer un responsable et une date de validation à chaque pièce.'],
 'Back-office':['Créer un dossier maître avec les informations de référence du projet.','Transformer les sujets ouverts en tâches avec responsable et échéance.','Installer un point de suivi court pour documenter décisions et blocages.'],
 'Distribution':['Vérifier les enregistrements définitifs, métadonnées, crédits, territoires et ayants droit.','Comparer les conditions du distributeur avant toute transmission.','Préparer la date de livraison et les contrôles précédant la mise en ligne.'],
 'Accompagnement':['Définir le résultat attendu et les décisions que KYMIA doit faciliter.','Découper l’objectif en étapes observables et datées.','Choisir les spécialistes nécessaires seulement après cadrage du périmètre.'],
 'Administration':['Centraliser contrats, affiliations, coordonnées et pièces de référence.','Lister les formalités ouvertes avec leur responsable et leur échéance.','Mettre en place une validation avant chaque transmission externe.'],
 'Stratégie':['Choisir un objectif prioritaire pour les 90 prochains jours.','Relier chaque action à un indicateur simple et vérifiable.','Prévoir une revue mensuelle pour arrêter, corriger ou accélérer.'],
 'Autre':['Formuler le résultat concret attendu.','Lister les informations et personnes nécessaires pour décider.','Définir la première action, son responsable et son échéance.']
};
const projectLabel={EP:'Le format EP est identifié.','Album':'Le format album est identifié.','Single':'Vous préparez la sortie d’un titre.','Clip':'Vous préparez un clip.','Concert':'Vous préparez un concert.','Développement de carrière':'L’objectif porte sur le développement de carrière.','Structuration administrative':'Le besoin de structuration administrative est posé.'};
export function projectPlan(data){
 if(!data?.project||!data?.need||!data?.maturity||!data?.description)return null;
 const framed=[projectLabel[data.project]||`Le projet « ${publicLabel(data.project)} » est identifié.`,`Le besoin prioritaire est défini : ${publicLabel(data.need)}.`,`Le stade déclaré est clair : ${publicLabel(data.maturity)}.`];
 if(data.budget)framed.push(`Un budget de travail est indiqué : ${data.budget} €.`);
 if(data.calendar)framed.push(`Une première échéance est indiquée : ${data.calendar}.`);
 if(data.link)framed.push('Un lien de référence est disponible pour examiner le projet.');
 const gaps=[];
 if(!data.budget)gaps.push('Chiffrer une première enveloppe, même provisoire.');
 if(!data.calendar)gaps.push('Fixer une date cible ou une fenêtre de réalisation.');
 if(!data.link)gaps.push('Ajouter un lien d’écoute, une maquette ou une référence lorsque disponible.');
 if(String(data.description).trim().length<80)gaps.push('Préciser le résultat attendu, le principal blocage et les personnes déjà impliquées.');
 if(['Financement','Montage de dossier'].includes(data.need)&&!data.producerEntity)gaps.push('Identifier la personne ou la structure qui portera officiellement la demande.');
 const signals=[String(data.description).trim().length>=80,Boolean(data.budget),Boolean(data.calendar),Boolean(data.link),!['Financement','Montage de dossier'].includes(data.need)||data.producerEntity==='yes'];
 const readinessScore=signals.filter(Boolean).length;
 const readiness={score:readinessScore,total:signals.length,label:readinessScore>=4?'Base solide':readinessScore>=2?'À structurer':'Fondations à poser',summary:readinessScore>=4?'Les repères essentiels sont déjà présents pour préparer un examen humain.':readinessScore>=2?'Le projet est compréhensible ; quelques informations concrètes renforceront la prochaine décision.':'Le besoin est identifié ; le budget, le calendrier et les références permettront maintenant de le cadrer.'};
 while(gaps.length<3)gaps.push(['Confirmer les personnes autorisées à décider et valider.','Rassembler les pièces et informations qui font foi.','Définir ce qui marquera la fin de cette première mission.'][gaps.length]);
 return {version:'plan-projet-2026-10-22-v2',title:`${publicLabel(data.project)} · ${publicLabel(data.need)}`,notice:'Ce récapitulatif reprend vos réponses et propose des prochaines étapes. Un examen humain reste nécessaire pour vérifier les pièces et les conditions d’une aide.',readiness,sections:[{id:'framed',number:'01',title:'Ce que vous avez déjà précisé',items:framed.slice(0,4)},{id:'gaps',number:'02',title:'Les points à compléter',items:gaps.slice(0,3)},{id:'actions',number:'03',title:'Vos prochaines actions',items:priorities[data.need]||priorities.Autre}]};
}
export function projectPlanMarkdown(data,{reference}={}){
 const plan=projectPlan(data);if(!plan)return '';
 const lines=['# Mon plan de projet KYMIA','',reference?`Référence : ${reference}`:'Plan personnel — demande non transmise',`Projet : ${plan.title}`,`Avancement : ${publicLabel(data.maturity)}`,`Préparation déclarée : ${plan.readiness.score}/${plan.readiness.total} — ${plan.readiness.label}`,data.nextStep?`Suite choisie : ${nextStepLabel(data)}`:'','',plan.notice,''].filter((line,index,all)=>line!==''||all[index-1]!=='');
 for(const section of plan.sections){lines.push(`## ${section.number} — ${section.title}`,...section.items.map(item=>`- ${item}`),'')}
 lines.push('## Informations fournies',`- Description : ${data.description}`,`- Budget : ${data.budget?data.budget+' €':'À préciser'}`,`- Calendrier : ${data.calendar||'À préciser'}`,`- Lien : ${data.link||'À préciser'}`,'','Ce document ne confirme aucune prestation, éligibilité, distribution ou obtention de financement.');
 return lines.join('\n');
}
