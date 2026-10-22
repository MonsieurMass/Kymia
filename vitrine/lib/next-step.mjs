export const nextStepOptions={
 self_guided:{title:'Conserver mon orientation gratuite',description:'Je télécharge le résultat et je poursuis seul, sans relance commerciale.',action:'Aperçu uniquement — aucune relance commerciale demandée.'},
 human_review:{title:'Demander le diagnostic KYMIA',description:'Je souhaite une analyse humaine payante. Le contenu et le tarif me seront présentés avant toute commande.',action:'Qualifier le besoin et préparer une proposition de diagnostic payant.'},
 scoped_mission:{title:'Demander le montage du dossier SACEM',description:'Je souhaite recevoir une proposition distincte pour préparer et suivre le dossier, sans garantie d’obtention.',action:'Vérifier le diagnostic et préparer un devis de montage de dossier SACEM.'}
};
export function resolveNextStep(data={}){if(nextStepOptions[data.nextStep])return data.nextStep;return data.contactPreference==='not_requested'?'self_guided':'human_review'}
export function nextStepLabel(data={}){return nextStepOptions[resolveNextStep(data)].title}
export function nextStepAction(data={}){return nextStepOptions[resolveNextStep(data)].action}
export function contactPreferenceFor(data={}){return resolveNextStep(data)==='self_guided'?'not_requested':'requested'}
