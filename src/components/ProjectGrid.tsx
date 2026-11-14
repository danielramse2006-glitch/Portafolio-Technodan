'use client';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { useState } from 'react';
import { categories, matchesCategory, type Project } from '../data/projects';
import { ProjectVisual } from './ProjectVisual';

export function ProjectCard({project}:{project:Project}){
  return <article className={'card card-'+project.id}>
    <Link href={'/proyectos/'+project.id} className="card-link">
      <ProjectVisual project={project}/>
      <div className="card-content">
        <p className="eyebrow">{project.category}{project.type==='prototipo'&&' · Boceto'}{project.id==='cafeto'&&' · En pláticas'}</p>
        <h3>{project.name}</h3>
        <p>{project.description}</p>
        <ArrowUpRight className="card-arrow" size={22} aria-hidden="true"/>
      </div>
    </Link>
  </article>;
}

export default function ProjectGrid({projects, filter=false}:{projects:Project[];filter?:boolean}){
  const [category,setCategory]=useState('Todos');
  const shown=projects.filter(project=>matchesCategory(project,category));
  return <>
    {filter&&<div className="filters" role="group" aria-label="Filtrar proyectos">{categories.map(value=><button key={value} aria-pressed={category===value} onClick={()=>setCategory(value)}>{value}</button>)}</div>}
    {filter&&<p className="sr-only" role="status">{shown.length} proyectos</p>}
    <div key={category} className={'project-grid '+(filter?'all-projects':'featured-grid')}>{shown.map(project=><ProjectCard key={project.id} project={project}/>)}</div>
    {!shown.length&&<p className="empty">Aún no hay fichas publicables en esta categoría.</p>}
  </>;
}
