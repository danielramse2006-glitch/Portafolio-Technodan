import Link from 'next/link';
import { ArrowUpRight, CircuitBoard, Layers3, ShoppingBag } from 'lucide-react';
import Hero from '../components/Hero';
import ProjectGrid from '../components/ProjectGrid';
import Contact from '../components/Contact';
import { featuredProjects } from '../data/projects';

export const metadata={alternates:{canonical:'/'}};

const specialties=[
  {icon:ShoppingBag,title:'Web y comercio electrónico',body:'Sitios comerciales y tiendas con catálogo, flujos de compra e integraciones.'},
  {icon:Layers3,title:'Sistemas empresariales',body:'Aplicaciones para inventario, seguimiento de procesos y herramientas internas de gestión.'},
  {icon:CircuitBoard,title:'Automatización e IoT',body:'Integración de software con sensores, microcontroladores, cámaras y equipos de campo.'},
];

export default function Home(){
  return <main id="contenido">
    <Hero/>
    <section id="proyectos" className="work section"><div className="wrap">
      <div className="section-head"><div><p className="eyebrow">PORTAFOLIO</p><h2>Proyectos destacados<span>.</span></h2></div><Link href="/proyectos" className="text-link">Ver todos los proyectos <ArrowUpRight size={18}/></Link></div>
      <ProjectGrid projects={featuredProjects}/>
    </div></section>
    <section id="sobre-mi" className="about section"><div className="wrap about-inner">
      <div><p className="eyebrow">SOBRE MÍ</p><h2>Soy Daniel Ramos<span>.</span></h2></div>
      <div><p className="about-lead">Desarrollador independiente en Reynosa, Tamaulipas.</p><p>Trabajo en proyectos comerciales e industriales, desde la interfaz que usa un cliente hasta las herramientas internas y los equipos que sostienen la operación.</p><p className="stack">Python · Flask · JavaScript · SQL Server · MySQL · APIs REST · ESP32</p></div>
    </div></section>
    <section className="specialties" aria-label="Especialidades"><div className="wrap specialty-grid">{specialties.map(({icon:Icon,title,body})=><article key={title}><Icon size={34} strokeWidth={1.5}/><h2>{title}</h2><p>{body}</p></article>)}</div></section>
    <Contact/>
  </main>;
}
