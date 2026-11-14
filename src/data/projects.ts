import registry from './projects.json';

export type ProjectImage = { src:string; alt:string; label:string; width:number; height:number };
export type Project = {
  id:string; name:string; category:string; description:string; type:string; url:string|null;
  links:string[]; evidence:string; status:string; technologies:string[]; reportedTechnologies:string[];
  features:string[]; reportedFeatures?:string[]; tags?:string[]; cover:ProjectImage|null;
  images:ProjectImage[]; additionalImages:ProjectImage[]; reviewedAt:string;
  restrictions:string; confidence:string; visible:boolean; featured:boolean; context:string;
  need:string; solution:string; role:string; result:string;
};

export const projects: Project[] = registry;
export const visibleProjects = projects.filter(project => project.visible);
const featuredOrder = ["quality-master-tracker","inventario-inge-tel","bc-boutique-cuen","inge-tel-control-acceso","robut-ing","modabelle","cecy-bon-bakes","fisioterapia-monarca"];
export const featuredProjects = visibleProjects.filter(project => project.featured)
  .sort((a,b) => featuredOrder.indexOf(a.id) - featuredOrder.indexOf(b.id));
export const categories = ['Todos','Páginas web','E-commerce','Sistemas','Automatización','IoT','Bocetos'];

export function matchesCategory(project:Project, category:string) {
  return category === 'Todos' || project.category === category || project.tags?.includes(category) ||
    (category === 'Páginas web' && project.category === 'E-commerce');
}
