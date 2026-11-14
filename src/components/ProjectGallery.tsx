'use client';
import Image from 'next/image';
import { useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Maximize2, X } from 'lucide-react';
import type { ProjectImage } from '../data/projects';

export default function ProjectGallery({images}:{images:ProjectImage[]}){
  const [index,setIndex]=useState(0);
  const dialog=useRef<HTMLDialogElement>(null);
  const trigger=useRef<HTMLButtonElement|null>(null);
  if (!images.length) return null;
  const image=images[index];
  const step=(delta:number)=>setIndex(current=>(current+delta+images.length)%images.length);
  return <section className="gallery" aria-labelledby="gallery-title"><h2 id="gallery-title">Galería</h2>
    <div className="gallery-grid">{images.map((item,i)=><button key={item.src} onClick={event=>{trigger.current=event.currentTarget;setIndex(i);dialog.current?.showModal();}} aria-label={'Ampliar '+item.label}>
      <div><Image src={item.src} alt={item.alt} fill sizes="(max-width: 640px) 45vw, 300px"/></div><span>{item.label}<Maximize2 size={15}/></span>
    </button>)}</div>
    <dialog ref={dialog} className="lightbox" aria-label="Galería ampliada" onClose={()=>trigger.current?.focus()} onKeyDown={event=>{if(event.key==='ArrowLeft')step(-1);if(event.key==='ArrowRight')step(1);}} onClick={event=>{if(event.target===event.currentTarget)dialog.current?.close();}}>
      <div className="lightbox-inner"><button autoFocus className="lightbox-close icon-button" aria-label="Cerrar imagen" onClick={()=>dialog.current?.close()}><X/></button>
      <Image key={image.src} src={image.src} alt={image.alt} width={image.width} height={image.height} unoptimized/>
      <div className="lightbox-controls"><button className="icon-button" aria-label="Imagen anterior" disabled={images.length===1} onClick={()=>step(-1)}><ChevronLeft/></button><p aria-live="polite">{image.label} · {index+1} / {images.length}</p><button className="icon-button" aria-label="Imagen siguiente" disabled={images.length===1} onClick={()=>step(1)}><ChevronRight/></button></div></div>
    </dialog>
  </section>;
}
