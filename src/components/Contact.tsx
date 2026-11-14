'use client';
import { ArrowUpRight, Mail } from 'lucide-react';
import { email } from '../data/site';

export default function Contact(){
  return <section id="contacto" className="contact"><div className="wrap contact-inner">
    <div><p className="eyebrow">CONTACTO</p><h2>Hablemos de tu proyecto.</h2><p>Cuéntame qué necesitas, para quién y en qué plazo. Podemos empezar con una tienda, un sistema interno o una integración.</p><a href={'mailto:'+email} className="email"><Mail size={19}/>{email}</a></div>
    <form onSubmit={event=>{
      event.preventDefault();
      const form=new FormData(event.currentTarget);
      const subject='Cotización · '+form.get('service');
      const body='Hola Daniel,\n\n'+form.get('message')+'\n\nNombre: '+form.get('name');
      window.location.href='mailto:'+email+'?subject='+encodeURIComponent(subject)+'&body='+encodeURIComponent(body);
    }}>
      <label>Tu nombre<input required name="name" autoComplete="name" maxLength={100}/></label>
      <label>Tipo de proyecto<select name="service"><option>Desarrollo web y e-commerce</option><option>Sistemas empresariales</option><option>Automatización e IoT</option><option>Otro proyecto</option></select></label>
      <label>Cuéntame sobre el proyecto<textarea required name="message" rows={3} maxLength={1500}/></label>
      <button className="button primary">Preparar correo <ArrowUpRight size={18}/></button>
      <small>Se abrirá un borrador en tu aplicación de correo.</small>
    </form>
  </div></section>;
}
