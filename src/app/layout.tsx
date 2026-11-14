import type { Metadata } from 'next';
import Link from 'next/link';
import Header from '../components/Header';
import { description, fullName, siteUrl } from '../data/site';
import './globals.css';

export const metadata:Metadata={
  metadataBase:siteUrl,
  title:{default:'Daniel Ramos · Desarrollo web, sistemas y automatización',template:'%s | Daniel Ramos'},
  description, authors:[{name:fullName}],
  openGraph:{type:'website',locale:'es_MX',siteName:'Daniel Ramos',images:[{url:'/og.png',width:1200,height:630,alt:'Daniel Ramos · Desarrollo web, sistemas y automatización'}]},
  twitter:{card:'summary_large_image',images:['/og.png']},
};

export default function RootLayout({children}:{children:React.ReactNode}){
  return <html lang="es-MX"><head><link rel="preload" href="/fonts/instrument-sans.woff2" as="font" type="font/woff2" crossOrigin="anonymous"/></head><body><Header/>{children}<footer><div className="wrap footer-inner"><Link href="/" className="wordmark"><span className="monogram">D<span>R</span></span> Daniel Ramos</Link><span>Reynosa, Tamaulipas, México</span><Link href="/#contacto">Contacto ↗</Link></div></footer></body></html>;
}
