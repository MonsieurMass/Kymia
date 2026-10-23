// Les valeurs enregistrées restent stables pour les demandes et les connexions existantes.
export function publicLabel(value){return {'Back-office':'Gestion administrative','Single':'Titre','Projet en exploitation':'Projet déjà diffusé','Maturité':'Avancement','Profil':'Vos coordonnées','Structuration administrative':'Organisation administrative'}[value]||value;}
