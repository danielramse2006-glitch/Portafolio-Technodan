import type { MetadataRoute } from 'next';
import { siteUrl } from '../data/site';
export default function robots():MetadataRoute.Robots{
  const publicSite=siteUrl.protocol==='https:' && process.env.VERCEL_ENV!=='preview';
  return publicSite?{rules:{userAgent:'*',allow:'/'},sitemap:new URL('/sitemap.xml',siteUrl).href}:{rules:{userAgent:'*',disallow:'/'}};
}
