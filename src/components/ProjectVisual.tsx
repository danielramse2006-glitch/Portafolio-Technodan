import Image from 'next/image';
import { Activity, Aperture, Box, Boxes, CircuitBoard, Cpu, ScanLine, Users } from 'lucide-react';
import type { Project } from '../data/projects';

export function Dashboard(){
  const lines = [['Seguimiento PPAP','En revisión','orange'],['Calibración de equipos','Al día','green'],['Desviaciones','Abierta','orange'],['Quejas de cliente','Cerrada','green']];
  return <div className="dashboard">
    <div className="dash-top"><span className="dash-logo"><Activity size={16}/></span><div>Quality Master Tracker<small>Panel de seguimiento</small></div><span className="dash-dot"/></div>
    <div className="dash-main">
      <div className="dash-title">Resumen de calidad <span>JUL · 2026</span></div>
      <div className="dash-kpis">{[['24','Expedientes PPAP'],['08','Calibraciones'],['03','Desviaciones']].map(([n,l])=><div key={l}><small>{l}</small><b>{n}</b></div>)}</div>
      <div className="dash-records"><b>Seguimiento de procesos</b>{lines.map(([label,value,color])=><div key={label}><span>{label}</span><small className={color}>{value}</small></div>)}</div>
    </div>
  </div>;
}

export function ProjectVisual({project,priority=false}:{project:Project;priority?:boolean}){
  const {id,cover,name}=project;
  if(cover) return <div className={'visual photo '+id}><Image src={cover.src} alt={cover.alt} fill sizes="(max-width: 720px) 95vw, (max-width: 1080px) 48vw, 680px" preload={priority}/><span className="visual-note">{cover.label}</span></div>;
  if(id==='quality-master-tracker') return <div className="visual quality"><Dashboard/><span className="visual-note">Demostración visual con datos sintéticos</span></div>;
  const icons = id==='inventario-inge-tel'?[Box,Boxes,Box]:id==='inge-tel-control-acceso'?[Aperture,CircuitBoard,ScanLine]:id==='robut-ing'?[Cpu,CircuitBoard,Activity]:id==='ab-premiere'?[Users,ScanLine,Activity]:[Box,Aperture,Box];
  return <div className={'visual illustration '+id} aria-label={'Ilustración editorial de '+name}>
    <div className="art-line" aria-hidden="true">{icons.map((Icon,index)=><span key={index}><Icon strokeWidth={1.25}/></span>)}</div>
    <span className="visual-note">Ilustración editorial</span>
  </div>;
}
