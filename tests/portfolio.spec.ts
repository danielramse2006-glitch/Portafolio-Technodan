import {expect,test} from '@playwright/test';
import {categories,matchesCategory,visibleProjects} from '../src/data/projects';

for(const [width,height] of [[390,844],[768,1024],[1440,900],[1920,1080]]){
  test('inicio y adaptación '+width+' × '+height,async({page})=>{
    const errors:string[]=[];
    page.on('pageerror',error=>errors.push(error.message));
    page.on('console',message=>{if(message.type()==='error')errors.push(message.text());});
    await page.setViewportSize({width,height});
    expect((await page.goto('/'))?.ok()).toBeTruthy();
    await expect(page.getByRole('heading',{level:1})).toContainText('sistemas y tecnología');
    await expect(page.getByRole('heading',{name:'Proyectos destacados.'})).toBeVisible();
    const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth);
    expect(overflow).toBe(false);
    for(const image of await page.locator('main img').all()){
      await image.scrollIntoViewIfNeeded();
      await expect.poll(()=>image.evaluate((el:HTMLImageElement)=>el.complete&&el.naturalWidth>0)).toBe(true);
      if (await image.evaluate(el=>el.closest('.mosaic-research')===null)) await expect(image).toHaveAttribute('alt',/.+/);
    }
    if(width===390||width===1440){
      await page.evaluate(()=>window.scrollTo(0,0));
      await page.screenshot({path:'artifacts/portfolio-'+(width===390?'mobile':'desktop')+'.png',fullPage:true,animations:'disabled'});
      await page.screenshot({path:'artifacts/portfolio-'+(width===390?'mobile':'desktop')+'-viewport.png',animations:'disabled'});
    }
    expect(errors).toEqual([]);
  });
}

test('menú móvil, escape y navegación',async({page})=>{
  await page.setViewportSize({width:390,height:844});
  await page.goto('/');
  const toggle=page.getByRole('button',{name:'Abrir menú'});
  await toggle.click();
  await page.keyboard.press('Escape');
  await expect(toggle).toBeFocused();
  await toggle.click();
  await page.getByRole('navigation',{name:'Principal'}).getByRole('link',{name:'Proyectos',exact:true}).click();
  await expect(page).toHaveURL(/\/proyectos$/);
  await expect(toggle).toHaveAttribute('aria-expanded','false');
});

test('todos los filtros muestran las fichas correspondientes',async({page})=>{
  await page.goto('/proyectos');
  for(const category of categories){
    const button=page.getByRole('button',{name:category,exact:true});
    await button.click();
    await expect(button).toHaveAttribute('aria-pressed','true');
    const names=visibleProjects.filter(p=>matchesCategory(p,category)).map(p=>p.name);
    await expect(page.locator('.card h3')).toHaveText(names);
  }
});

for(const project of visibleProjects){
  test('ficha '+project.id,async({page,request})=>{
    const response=await page.goto('/proyectos/'+project.id);
    expect(response?.status()).toBe(200);
    await expect(page.getByRole('heading',{level:1})).toContainText(project.name);
    await expect(page.getByRole('heading',{name:'Mi participación'})).toBeVisible();
    if(project.url){
      const link=page.locator('main a[target="_blank"]').first();
      await expect(link).toHaveAttribute('href',project.url);
      await expect(link).toHaveAttribute('rel',/noopener/);
      for(const external of await page.locator('main a[target="_blank"]').all()){
        const url=await external.getAttribute('href');
        expect(url).toMatch(/^https:/);
        await expect(external).toHaveAttribute('rel',/noopener noreferrer/);
        expect((await request.get(url!,{timeout:20000})).ok()).toBe(true);
      }
    }
    for(const item of project.images){
      expect((await request.get(item.src)).ok()).toBe(true);
    }
    if(project.images.length){
      const open=page.getByRole('button',{name:/Ampliar/}).first();
      await open.click();
      const dialog=page.getByRole('dialog');
      await expect(dialog).toBeVisible();
      if(project.images.length>1){
        await page.keyboard.press('ArrowRight');
        await expect(dialog.getByRole('status').or(dialog.locator('[aria-live]'))).toContainText('2 /');
      }
      await page.keyboard.press('Escape');
      await expect(dialog).toBeHidden();
      await expect(open).toBeFocused();
    }
  });
}

test('las once capturas aportadas aparecen primero en sus fichas',async({page})=>{
  const suppliedProjects=['cecy-bon-bakes','parea-restaurante','cafeto','bakers','liberato','el-vergel','modabelle','aesthetic-body','sazon-papatenco','aloha-spa','fisioterapia-monarca'];
  for(const id of suppliedProjects){
    await page.goto('/proyectos/'+id);
    await expect(page.locator('.detail > .visual img')).toHaveAttribute('src',/provided\.webp/);
    await expect(page.locator('.gallery-grid button').first()).toHaveAccessibleName('Ampliar Captura aportada por Daniel');
  }
});

test('propuestas Web y versiones atribuidas',async({page,request})=>{
  await page.goto('/proyectos');
  await page.getByRole('button',{name:'Bocetos',exact:true}).click();
  await expect(page.getByRole('heading',{name:'Parea Restaurante'})).toBeVisible();
  await expect(page.getByRole('heading',{name:'ModaBelle MX'})).toHaveCount(0);
  await expect(page.getByText(/En pláticas/).first()).toBeVisible();
  await page.getByRole('link',{name:/Parea Restaurante/}).click();
  await expect(page.getByRole('link',{name:'Ver propuesta'})).toHaveAttribute('href','https://technodanbocetos.vercel.app/parea/parea.html');
  expect((await request.get('/proyectos/parea')).status()).toBe(404);
});

test('contacto y rutas auxiliares',async({page,request})=>{
  await page.goto('/#contacto');
  await expect(page.locator('#contacto a[href^="mailto:"]')).toBeVisible();
  await expect(page.getByLabel('Tu nombre')).toBeVisible();
  await expect(page.getByLabel('Cuéntame sobre el proyecto')).toBeVisible();
  expect((await request.get('/sitemap.xml')).ok()).toBe(true);
  expect((await request.get('/robots.txt')).ok()).toBe(true);
  expect((await request.get('/og.png')).ok()).toBe(true);
  expect((await page.goto('/proyectos/no-existe'))?.status()).toBe(404);
  await expect(page.getByRole('heading',{name:'Página no encontrada.'})).toBeVisible();
});
