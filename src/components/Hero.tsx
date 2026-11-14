import Link from 'next/link';
import Image from 'next/image';
import { ArrowDownRight, ArrowUpRight, MapPin } from 'lucide-react';
import { projects } from '../data/projects';
import { Dashboard } from './ProjectVisual';

export default function Hero(){
  const figure=projects.find(p=>p.id==='robut-ing')?.cover;
  const boutique = projects.find(p=>p.id==='bc-boutique-cuen')?.images.find(i=>i.src.endsWith('/mobile.webp'));
  return <section className="hero">
    <div className="hero-inner wrap">
      <div className="hero-copy">
        <p className="eyebrow hero-kicker"><span/> DESARROLLO WEB · SISTEMAS · AUTOMATIZACIÓN</p>
        <h1>Desarrollo soluciones digitales que conectan negocios, <em>sistemas y tecnología.</em></h1>
        <p className="hero-description">Desde plataformas web y comercio electrónico hasta sistemas empresariales y automatización, desarrollo soluciones adaptadas a las necesidades reales de cada proyecto.</p>
        <div className="hero-actions"><Link className="button primary" href="#proyectos">Explorar proyectos <ArrowDownRight size={19}/></Link><Link className="button secondary" href="#contacto">Hablemos de tu proyecto <ArrowUpRight size={17}/></Link></div>
        <p className="location"><MapPin size={16}/> Reynosa, Tamaulipas, México</p>
      </div>
      <div className="hero-mosaic">
        <Link href="/proyectos/quality-master-tracker" className="mosaic-main">
          <div className="mosaic-label"><span>SISTEMAS EMPRESARIALES</span><ArrowUpRight size={19}/></div>
          <Dashboard/>
          <span className="mosaic-caption">Demostración visual con datos sintéticos</span>
        </Link>
        <Link href="/proyectos/bc-boutique-cuen" className="mosaic-shop">
          <div><span className="eyebrow">E-COMMERCE</span><b>BC Boutique Cuen</b></div>
          {boutique&&<Image src={boutique.src} alt={boutique.alt} width={130} height={282} sizes="(max-width: 680px) 90px, 130px"/>}
          <ArrowUpRight size={19}/>
        </Link>
        <Link href="/proyectos/robut-ing" className="mosaic-research"><span className="eyebrow">ROBÓTICA EDUCATIVA</span><b>ROBUT-ING</b>{figure&&<Image src={figure.src} alt="" width={112} height={84} sizes="110px"/>}<ArrowUpRight size={19}/></Link>
      </div>
    </div>
  </section>;
}
