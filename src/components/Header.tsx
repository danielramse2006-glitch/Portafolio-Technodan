'use client';
import Link from 'next/link';
import { ArrowUpRight, Menu, X } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Header(){
  const [open,setOpen] = useState(false);
  const path = usePathname();
  useEffect(()=>{
    if (!open) return;
    const close = (event:KeyboardEvent)=>{ if(event.key==='Escape'){setOpen(false);document.getElementById('menu-toggle')?.focus();} };
    window.addEventListener('keydown',close);
    return ()=>window.removeEventListener('keydown',close);
  },[open]);
  return <header className="header">
    <a href="#contenido" className="skip">Saltar al contenido</a>
    <div className="wrap nav-inner">
      <Link href="/" className="wordmark" onClick={()=>setOpen(false)}><span className="monogram">D<span>R</span></span> Daniel Ramos</Link>
      <button id="menu-toggle" className="nav-toggle" aria-label={open?'Cerrar menú':'Abrir menú'} aria-controls="menu" aria-expanded={open} onClick={()=>setOpen(!open)}>{open?<X/>:<Menu/>}</button>
      <nav id="menu" aria-label="Principal" data-open={open}>
        <Link href="/" aria-current={path==='/'?'page':undefined} onClick={()=>setOpen(false)}>Inicio</Link>
        <Link href="/proyectos" aria-current={path.startsWith('/proyectos')?'page':undefined} onClick={()=>setOpen(false)}>Proyectos</Link>
        <Link href="/#sobre-mi" onClick={()=>setOpen(false)}>Sobre mí</Link>
        <Link href="/#contacto" className="nav-contact" onClick={()=>setOpen(false)}>Contacto <ArrowUpRight size={15}/></Link>
      </nav>
    </div>
  </header>;
}
