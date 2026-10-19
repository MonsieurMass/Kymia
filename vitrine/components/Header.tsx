"use client";
import Link from 'next/link';
import {useState,useEffect,useRef} from 'react';
import {usePathname} from 'next/navigation';
const links=[['/services','Expertises'],['/a-propos','La vision'],['/projets','Projets'],['/contact','Contact']];
export default function Header(){
 const [open,setOpen]=useState(false),path=usePathname();
 const toggle=useRef<HTMLButtonElement>(null),header=useRef<HTMLElement>(null);
 useEffect(()=>setOpen(false),[path]);
 useEffect(()=>{if(!open)return;const outside=(e:PointerEvent)=>{if(!header.current?.contains(e.target as Node))setOpen(false)};const escape=(e:KeyboardEvent)=>{if(e.key==='Escape'){setOpen(false);toggle.current?.focus()}};const resize=()=>{if(window.innerWidth>760)setOpen(false)};document.addEventListener('pointerdown',outside);document.addEventListener('keydown',escape);window.addEventListener('resize',resize);return()=>{document.removeEventListener('pointerdown',outside);document.removeEventListener('keydown',escape);window.removeEventListener('resize',resize)}},[open]);
 return <header ref={header}>
  <Link href="/" className="brand" aria-label="KYMIA WORLD — accueil">KYMIA<span>WORLD</span></Link>
  <button ref={toggle} className="menu-toggle" aria-expanded={open} aria-controls="main-nav" onClick={()=>setOpen(value=>!value)}>{open?'Fermer −':'Menu +'}</button>
  <nav id="main-nav" className={open?'open':''} aria-label="Navigation principale" onClick={e=>{if((e.target as Element).closest('a'))setOpen(false)}}>
   {links.map(([href,label])=><Link key={href} aria-current={path===href?'page':undefined} href={href}>{label}</Link>)}
   <Link aria-current={path==='/demarrer'?'page':undefined} className="nav-cta" href="/demarrer">Présenter mon projet <span aria-hidden="true">↗</span></Link>
  </nav>
 </header>;
}
