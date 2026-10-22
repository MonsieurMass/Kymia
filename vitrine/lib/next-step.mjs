export const nextStepOptions={
 self_guided:{title:'Avancer avec mon plan',description:'Je conserve le diagnostic et je poursuis seul, sans relance commerciale.',action:'Aperçu uniquement — aucune relance commerciale demandée.'},
 human_review:{title:'Demander un premier examen humain',description:'Je souhaite que KYMIA examine mes réponses et vérifie la prochaine étape.',action:'Réaliser un premier examen humain et qualifier la prochaine étape.'},
 scoped_mission:{title:'Cadrer une mission avec KYMIA',description:'Je souhaite préciser le résultat, le périmètre et les conditions d’un accompagnement.',action:'Qualifier le besoin et préparer une proposition de mission cadrée.'}
};
export function resolveNextStep(data={}){if(nextStepOptions[data.nextStep])return data.nextStep;return data.contactPreference==='not_requested'?'self_guided':'human_review'}
export function nextStepLabel(data={}){return nextStepOptions[resolveNextStep(data)].title}
export function nextStepAction(data={}){return nextStepOptions[resolveNextStep(data)].action}
export function contactPreferenceFor(data={}){return resolveNextStep(data)==='self_guided'?'not_requested':'requested'}
