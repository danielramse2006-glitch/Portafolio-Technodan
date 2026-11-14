import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import { visibleProjects } from '../../../data/projects';
import { ProjectVisual } from '../../../components/ProjectVisual';
import ProjectGallery from '../../../components/ProjectGallery';

type Props={params:Promise<{slug:string}>};
const find=(slug:string)=>visibleProjects.find(project=>project.id===slug);
export const dynamicParams=false;
export const generateStaticParams=()=>visibleProjects.map(project=>({slug:project.id}));
export async function generateMetadata({params}:Props):Promise<Metadata>{
  const project=find((await params).slug);
  if(!project) return {title:'Proyecto no encontrado'};
  const url='/proyectos/'+project.id;
  return {title:project.name,description:project.description,alternates:{canonical:url},openGraph:{title:project.name,description:project.description,url,images:[project.cover?.src||'/og.png']}};
}
export default async function Detail({params}:Props){
  const project=find((await params).slug);
  if(!project) notFound();
  return <main id="contenido" className="section work"><article className="wrap detail">
    <Link href="/proyectos" className="text-link back"><ArrowLeft size={17}/> Todos los proyectos</Link>
    <div className="detail-title"><p className="eyebrow">{project.category} / {project.type}</p><h1>{project.name}<span>.</span></h1><p>{project.description}</p></div>
    <ProjectVisual project={project} priority/>
    <div className="case-layout">
      <div className="case-copy">
        {[['Contexto',project.context],['Necesidad',project.need],['Solución',project.solution],['Mi participación',project.role],['Resultados documentados',project.result]].filter(([,copy])=>copy).map(([label,copy])=><section key={label}><h2>{label}</h2><p>{copy}</p></section>)}
        {project.features.length>0&&<section><h2>Funcionalidades verificadas</h2><ul>{project.features.map(value=><li key={value}>{value}</li>)}</ul></section>}
        {!!project.reportedFeatures?.length&&<section><h2>Alcance reportado</h2><ul>{project.reportedFeatures.map(value=><li key={value}>{value}</li>)}</ul></section>}
      </div>
      <aside className="case-meta" aria-label="Datos del proyecto">
        <h2>Ficha técnica</h2><p className="status">{project.status}</p>
        {project.technologies.length>0&&<><h3>Tecnologías verificadas</h3><ul>{project.technologies.map(value=><li key={value}>{value}</li>)}</ul></>}
        {project.reportedTechnologies.length>0&&<><h3>Tecnologías reportadas</h3><ul>{project.reportedTechnologies.map(value=><li key={value}>{value}</li>)}</ul></>}
        <h3>Evidencia</h3><p>{project.evidence}</p>
        {project.url&&<a className="text-link" href={project.url} target="_blank" rel="noopener noreferrer">{project.id==='robut-ing'?'Ver publicación':project.type==='prototipo'?'Ver propuesta':'Visitar sitio'} <ArrowUpRight size={17}/></a>}
        {project.id==='robut-ing'&&<a className="text-link" href={project.links[0]} target="_blank" rel="noopener noreferrer">Leer artículo (PDF) <ArrowUpRight size={17}/></a>}
      </aside>
    </div>
    <ProjectGallery images={project.images}/>
  </article></main>;
}
