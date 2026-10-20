export type Audience={slug:string;label:string;title:string;description:string;intro:string;pilots:string[];roles:string[];blindSpots:string[];guides:string[];service:string};
export type Guide={slug:string;title:string;description:string;category:string;lead:string;sections:[string,string[]][];audiences:string[];service:string};
export const audiences:Audience[];
export const guides:Guide[];
export const fundingLinks:[string,string][];
export function getAudience(slug:string):Audience|undefined;
export function getGuide(slug:string):Guide|undefined;
