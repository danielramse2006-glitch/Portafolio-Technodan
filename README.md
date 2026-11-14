# Daniel Ramos · Portafolio profesional

Portafolio en español con Next.js App Router, React y TypeScript. Incluye portada, especialidades, galería filtrable, casos individuales, lightbox y una sección que prepara el correo de cotización en el cliente del visitante.

## Ejecutar

Requisitos: Node.js 24 y pnpm 11.

```sh
pnpm install --frozen-lockfile
pnpm dev
```

Abre http://localhost:3000. Para probar producción:

```sh
pnpm build
pnpm start
```

## Catálogo y capturas

- [Registro completo](src/data/projects.json) con casos visibles, candidatos, fuentes, medios y restricciones.
- [Automatización de capturas](scripts/capture-projects.ts) y [sitios configurados](scripts/capture-targets.json).
- [Auditoría](docs/PROJECT_AUDIT.md), [capturas](docs/CAPTURE_REPORT.md), [pruebas](docs/TEST_REPORT.md) y [publicación en Vercel](docs/DEPLOYMENT.md).

Las fichas visibles se generan con `generateStaticParams`. Los candidatos están disponibles en el registro de investigación. Para habilitar una ficha, completa el contexto, la participación, el alcance y los permisos de las imágenes, actualiza `visible` y vuelve a compilar. Los resultados de investigación descargados por Playwright viven en `artifacts/captures`, excluidos de Git y de Vercel.

## Comprobar y capturar

```sh
pnpm exec playwright install chromium
pnpm typecheck
pnpm build
pnpm test
pnpm capture
pnpm capture --research
pnpm capture --only=cecy-bon-bakes,modabelle
```

Las pruebas usan el build de producción y generan capturas en `artifacts/`. `PLAYWRIGHT_CHANNEL=chrome` permite usar Chrome instalado. Las capturas públicas son WebP y las fuentes locales Instrument Sans y Geist Mono se distribuyen bajo OFL.
