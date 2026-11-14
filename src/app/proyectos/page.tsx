import ProjectGrid from '../../components/ProjectGrid';
import { visibleProjects } from '../../data/projects';
export const metadata={title:'Proyectos',description:'Proyectos de desarrollo web, e-commerce, sistemas, automatización y robótica de Daniel Ramos.',alternates:{canonical:'/proyectos'}};
export default function Work(){
  return <main id="contenido" className="section work"><div className="wrap">
    <div className="listing-head"><p className="eyebrow">PORTAFOLIO</p><h1>Proyectos<span>.</span></h1><p>Tiendas, aplicaciones empresariales y prototipos de integración.</p></div>
    <ProjectGrid projects={visibleProjects} filter/>
  </div></main>;
}
