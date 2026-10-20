import Link from 'next/link';
import {notFound} from 'next/navigation';
import {audiences,getAudience,getGuide} from '../../../lib/editorial.mjs';
import {Button,ContactCTA} from '../../../components/ui';
type GuideData={slug:string;title:string;description:string;category:string};
type AudienceData={slug:string;label:string;title:string;description:string;intro:string;pilots:string[];roles:string[];blindSpots:string[];guides:string[];service:string};

export function generateStaticParams(){return audiences.map(a=>({slug:a.slug}))}
export async function generateMetadata({params}:{params:Promise<{slug:string}>}){const {slug}=await params;const audience=getAudience(slug) as AudienceData|undefined;if(!audience)return {};return {title:audience.label+' — organiser son projet musical',description:audience.description,alternates:{canonical:'/pour/'+slug}}}

export default async function AudiencePage({params}:{params:Promise<{slug:string}>}){const {slug}=await params;const audience=getAudience(slug) as AudienceData|undefined;if(!audience)notFound();const related=audience.guides.map(slug=>getGuide(slug) as GuideData|undefined).filter((guide):guide is GuideData=>Boolean(guide));return <>
 <section className="page-intro section audience-intro"><div className="eyebrow">KYMIA pour les {audience.label.toLowerCase()}</div><h1>{audience.title}</h1><p>{audience.intro}</p><Button href={'/demarrer?service='+audience.service}>Structurer mon projet</Button></section>
 <section className="section editorial-system"><div className="section-heading"><div><div className="eyebrow">Le système à piloter</div><h2>LA MUSIQUE.<br/>ET TOUT CE QUI L’ENTOURE.</h2></div><p>Un rôle peut être tenu par plusieurs personnes, ou plusieurs rôles par une même personne. Les responsabilités, elles, doivent rester claires.</p></div><ol className="system-list">{audience.pilots.map((item,index)=><li key={item}><span>0{index+1}</span><strong>{item}</strong></li>)}</ol></section>
 <section className="section role-section"><div><div className="eyebrow">L’équipe invisible</div><h2>DES MÉTIERS.<br/><em>UN MÊME PROJET.</em></h2></div><div className="role-grid">{audience.roles.map((role,index)=><article key={role}><span>{String(index+1).padStart(2,'0')}</span><h3>{role}</h3></article>)}</div></section>
 <section className="section blindspots"><div className="eyebrow">Les angles morts fréquents</div><div>{audience.blindSpots.map((item,index)=><article key={item}><span>0{index+1}</span><p>{item}</p></article>)}</div></section>
 <section className="section guide-related"><div className="section-heading"><div><div className="eyebrow">Pour passer à l’action</div><h2>LES GUIDES<br/>À OUVRIR MAINTENANT.</h2></div><Link prefetch={false} className="text-link arrow-link" href="/guides">Voir tous les guides</Link></div><div className="guide-grid">{related.map((guide,index)=><Link prefetch={false} className="guide-card" href={'/guides/'+guide.slug} key={guide.slug}><span>{guide.category} · 0{index+1}</span><h3>{guide.title}</h3><p>{guide.description}</p><b>Lire le guide</b></Link>)}</div></section>
 <ContactCTA/>
 </>}
