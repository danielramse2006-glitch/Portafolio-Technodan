'use client';
export default function ErrorPage({reset}:{reset:()=>void}){
  return <main id="contenido" className="section work"><div className="wrap listing-head"><h1>No se pudo cargar esta página.</h1><button className="button primary" onClick={reset}>Volver a intentar</button></div></main>;
}
