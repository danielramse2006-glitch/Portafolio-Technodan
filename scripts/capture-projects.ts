import { chromium, type Page, type Locator } from '@playwright/test';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import sharp from 'sharp';
import targets from './capture-targets.json';

type Shot = { file: string; url: string; date: string; width: number; height: number; score: number; brokenImages: number; lowContrastImage: boolean };
const desktop = { width: 1440, height: 900 };
const mobile = { width: 390, height: 844 };
const flags = process.argv.slice(2);
const research = flags.includes('--research');
const only = flags.find(arg => arg.startsWith('--only='))?.split('=')[1];
const selected = only?.split(',');
const timestamp = () => new Date().toISOString();
const reportDir = 'artifacts/captures';
const brandError = /verify you are human|checking your browser|access denied|just a moment|attention required|deployment_not_found|no se puede acceder|too many requests/i;

async function ready(page: Page) {
  await page.evaluate(async () => {
    await Promise.race([
      Promise.all([document.fonts.ready, ...Array.from(document.images).filter(img => img.getBoundingClientRect().top < innerHeight * 1.2).map(img => img.decode().catch(() => {}))]),
      new Promise(resolve => setTimeout(resolve, 4500)),
    ]);
  });
}

async function open(page: Page, target: typeof targets[number]) {
  const response = await page.goto(target.url, { waitUntil: 'domcontentloaded', timeout: 25000 });
  if (!response?.ok()) throw new Error('HTTP ' + response?.status());
  if (new URL(page.url()).hostname.replace(/^www\./,'') !== new URL(target.url).hostname.replace(/^www\./,'')) throw new Error('Redirección fuera del dominio previsto');
  await ready(page);
  const text = await page.locator('body').innerText({ timeout: 7000 });
  const title = await page.title();
  if (brandError.test(title + ' ' + text.slice(0,600)) || await page.locator('iframe[src*="captcha"], #challenge-form').first().isVisible()) throw new Error('Restricción de acceso detectada');
  if (target.id === 'bc-boutique-cuen') {
    await page.locator('.loading-skeleton').first().waitFor({ state:'hidden', timeout:14000 }).catch(()=>{});
    await ready(page);
  }
  if (!new RegExp(target.identity,'i').test(title + ' ' + text) || text.trim().length < 24) throw new Error('Identidad o contenido insuficiente');
  return response.status();
}

async function lazyScroll(page: Page) {
  for (let y = 0; y < Math.min(await page.locator('body').evaluate(el => el.scrollHeight), 16000); y += 700) {
    await page.evaluate(value => window.scrollTo(0,value), y);
    await page.waitForTimeout(110);
  }
  await page.evaluate(() => window.scrollTo(0,0));
  await ready(page);
}

async function record(page: Page, dir: string, name: string, options: { fullPage?: boolean; clip?: Locator } = {}): Promise<Shot> {
  const { clip, fullPage } = options;
  const date = timestamp();
  const url = page.url();
  const png = clip ? await clip.screenshot({ animations:'disabled', timeout:8500 }) : await page.screenshot({ fullPage, animations:'disabled', timeout:13000 });
  const brokenImages = await page.evaluate(full => Array.from(document.images).filter(img => {
    const r = img.getBoundingClientRect();
    return r.width >= 40 && r.height >= 40 && (full || (r.bottom >= 0 && r.top < innerHeight)) && img.complete && !img.naturalWidth;
  }).length, fullPage);
  const stats = await sharp(await sharp(png).resize(200).toBuffer()).stats();
  const lowContrastImage = stats.entropy < 1.2;
  if (lowContrastImage) throw new Error('Captura casi uniforme');
  const file = name + '.webp';
  const {width,height} = await sharp(png).resize({height:16000,withoutEnlargement:true}).webp({quality:86}).toFile(join(dir,file));
  const loading = await page.locator('.loading-skeleton:visible').count();
  const priority: Record<string,number> = {desktop:22, detail:20, flow:18, full:10, mobile:5};
  const score = Math.round(Math.min(10,stats.entropy) * 6 + Math.min(width / 120,12) + (priority[name] ?? 0) - brokenImages * 14 - Math.min(loading,5)*9);
  return { file, url, date, width, height, score, brokenImages, lowContrastImage };
}

async function derive(dir: string, desktopShot: Shot, mobileShot?: Shot, coverShot=desktopShot) {
  const backdrop = { r: 29, g: 33, b: 42 };
  const desktop = await sharp(join(dir,desktopShot.file)).resize(1090,680,{fit:'cover'}).toBuffer();
  const dots = Buffer.from('<svg width="1090" height="30"><rect width="1090" height="30" fill="#353a44"/><circle cx="16" cy="15" r="4" fill="#e99a52"/><circle cx="30" cy="15" r="4" fill="#a6adba"/><circle cx="44" cy="15" r="4" fill="#a6adba"/></svg>');
  const browser = await sharp({ create:{ width:1090,height:710,channels:3,background:backdrop } })
    .composite([{input:dots,top:0,left:0},{input:desktop,top:30,left:0}]).webp({quality:88}).toBuffer();
  await sharp(browser).toFile(join(dir,'browser.webp'));
  const small = await sharp(browser).resize(1110).toBuffer();
  const layers = [{ input:small, top:72,left:48 }];
  if (mobileShot) {
    const phone = await sharp(join(dir,mobileShot.file)).resize(248,536,{fit:'cover'}).extend({top:9,bottom:9,left:9,right:9,background:'#12141b'}).toBuffer();
    layers.push({input:phone,top:245,left:1114});
  }
  await sharp({create:{width:1440,height:870,channels:3,background:backdrop}}).composite(layers).webp({quality:86}).toFile(join(dir,'composition.webp'));
  await sharp(join(dir,coverShot.file)).resize(760,475,{fit:'cover'}).webp({quality:83}).toFile(join(dir,'thumbnail.webp'));
  return [
    {file:'browser.webp', sources:[desktopShot.file], url:desktopShot.url, date:desktopShot.date},
    {file:'composition.webp', sources:mobileShot?[desktopShot.file,mobileShot.file]:[desktopShot.file], url:desktopShot.url, date:desktopShot.date},
    {file:'thumbnail.webp', sources:[coverShot.file], url:coverShot.url, date:coverShot.date},
  ];
}

async function main() {
  await mkdir(reportDir,{recursive:true});
  const browser = await chromium.launch({ channel:process.env.PLAYWRIGHT_CHANNEL || undefined, headless:true });
  const results = [];
  try {
    for (const target of targets.filter(t => (t.publish || research) && (!selected || selected.includes(t.id)))) {
      const dir = target.publish ? join('public','projects',target.id) : join(reportDir,target.id);
      await mkdir(dir,{recursive:true});
      const errors: string[] = [];
      const shots: Shot[] = [];
      const requestFailures = new Set<string>();
      const context = await browser.newContext({ viewport:desktop,locale:'es-MX',reducedMotion:'reduce' });
      const page = await context.newPage();
      page.on('requestfailed', request => { if (['document','fetch','xhr'].includes(request.resourceType())) requestFailures.add(request.resourceType()+': '+request.failure()?.errorText); });
      const attempt = async (name: string, capture: () => Promise<Shot>) => {
        try { const shot = await capture(); shots.push(shot); console.log(target.id, shot.file, shot.score); }
        catch (error) { errors.push(name + ': ' + String(error).split('\n')[0]); }
      };
      let status: number | undefined;
      let derived: Awaited<ReturnType<typeof derive>> = [];
      try {
        status = await open(page,target);
        await attempt('desktop', () => record(page,dir,'desktop'));
        await lazyScroll(page);
        await attempt('full', () => record(page,dir,'full',{fullPage:true}));
        if (target.section || target.sectionText) await attempt('detail', async () => {
          let section = target.section ? page.locator(target.section).first() : page.locator('section').filter({has:page.getByRole('heading',{name:new RegExp(target.sectionText!,'i')})}).first();
          if (!(await section.count()) && target.id === 'robut-ing') section = page.getByText(/Robot humanoide bípedo de bajo costo/i).first();
          if (!(await section.count()) && target.sectionText) {
            const heading=page.getByRole('heading',{name:new RegExp(target.sectionText,'i')}).first();
            if (!(await heading.count())) throw new Error('Sección no localizada');
            await heading.evaluate(el=>el.scrollIntoView({block:'center',behavior:'instant'}));
            await ready(page);
            return record(page,dir,'detail');
          }
          if (!(await section.count())) throw new Error('Sección no localizada');
          await section.scrollIntoViewIfNeeded();
          return record(page,dir,'detail',{clip:section});
        });
        if (target.flow) await attempt('flow', async () => {
          const link = page.locator(target.flow).filter({visible:true}).first();
          if (!await link.count()) throw new Error('Recorrido público no localizado');
          const href = await link.getAttribute('href');
          if (!href || new URL(href,page.url()).origin !== new URL(page.url()).origin) throw new Error('Enlace fuera del sitio');
          if (target.id === 'bc-boutique-cuen' && href.startsWith('#')) {
            await page.locator(href).first().scrollIntoViewIfNeeded();
          } else {
            await link.click();
            await page.waitForLoadState('domcontentloaded');
          }
          await ready(page);
          if (target.id === 'bc-boutique-cuen') await attempt('catalog', () => record(page,dir,'catalog'));
          if (target.id === 'bc-boutique-cuen') {
            await page.locator('a[href*="/producto/"]').filter({visible:true}).first().waitFor({timeout:14000}).catch(()=>{});
          }
          if (target.product) {
            const item = page.locator(target.product).first();
            if (await item.count() && !new URL(page.url()).pathname.startsWith('/producto/')) {
              const itemHref=await item.getAttribute('href');
              if(!itemHref) throw new Error('Enlace de producto vacío');
              const productUrl=new URL(itemHref,page.url());
              if(productUrl.origin!==new URL(target.url).origin) throw new Error('Ficha fuera del sitio');
              const response=await page.goto(productUrl.href,{waitUntil:'domcontentloaded',timeout:15000});
              if(!response?.ok()) throw new Error('Ficha HTTP '+response?.status());
            }
            await page.locator('#productPageContent:has(h1)').waitFor({state:'visible',timeout:14000});
            await ready(page);
            if (!new URL(page.url()).pathname.startsWith('/producto/')) throw new Error('Ficha de producto no localizada');
          }
          return record(page,dir,'flow');
        });
        const phone = await browser.newContext({ viewport:mobile,isMobile:true,hasTouch:true,locale:'es-MX',reducedMotion:'reduce' });
        try {
          const small = await phone.newPage();
          await attempt('mobile', async () => { await open(small,target); return record(small,dir,'mobile'); });
        } finally { await phone.close(); }
        const primary = shots.find(s => s.file === 'desktop.webp');
        if (primary) derived = await derive(dir,primary,shots.find(s => s.file === 'mobile.webp'),shots.find(s => s.file === (target.id === 'bc-boutique-cuen' ? 'detail.webp' : 'desktop.webp')));
      } catch (error) { errors.push(String(error).split('\n')[0]); }
      finally { await context.close(); }
      const candidate = shots.filter(s=>s.brokenImages===0).sort((a,b)=>b.score-a.score)[0]?.file ?? null;
      const result = { id:target.id, source:target.url, date:timestamp(), status, candidate, shots, derived, errors, requestFailures:[...requestFailures] };
      results.push(result);
      await writeFile(join(dir,'manifest.json'),JSON.stringify(result,null,2)+'\n');
      console.log(target.id, errors.length ? errors : 'OK');
    }
  } finally { await browser.close(); }
  const log = join(reportDir,'run.json');
  const earlier = only ? JSON.parse(await readFile(log,'utf8').catch(()=>'[]')) as typeof results : [];
  await writeFile(log,JSON.stringify([...earlier.filter(r=>!selected?.includes(r.id)),...results],null,2)+'\n');
  if (!results.length || results.some(r => !r.shots.length)) process.exitCode = 1;
}

main().catch(error => { console.error(error); process.exitCode = 1; });
