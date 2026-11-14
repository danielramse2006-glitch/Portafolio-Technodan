import type { MetadataRoute } from 'next';
import { visibleProjects } from '../data/projects';
import { siteUrl } from '../data/site';
export default function sitemap():MetadataRoute.Sitemap{
  return [{url:new URL('/',siteUrl).href},{url:new URL('/proyectos',siteUrl).href},...visibleProjects.map(project=>({url:new URL('/proyectos/'+project.id,siteUrl).href,lastModified:project.reviewedAt}))];
}
