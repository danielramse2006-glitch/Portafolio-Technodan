# Publicación en Vercel

El proyecto está configurado para Vercel mediante el preset Next.js en `vercel.json`. La entrega se verificó en local.

1. Confirma el correo profesional y el material que se puede publicar. El correo visible procede de la autoría del artículo de ROBUT-ING y se configura en `src/data/site.ts`.
2. Sube el repositorio a un proveedor Git autorizado e impórtalo en Vercel. Selecciona la raíz del repositorio y Node.js 24. Usa pnpm 11 según `packageManager`. Si el entorno requiere Corepack para seleccionar esa versión, activa `ENABLE_EXPERIMENTAL_COREPACK=1` conforme a la guía de Vercel.
3. Configura `SITE_URL` con la URL HTTPS canónica en producción. El valor alternativo es `VERCEL_PROJECT_PRODUCTION_URL` cuando Vercel expone las variables del sistema. En local se usa `http://localhost:3000`. `robots.txt` bloquea el rastreo del entorno Preview y del dominio local.
4. Ejecuta `pnpm install --frozen-lockfile` y `pnpm build` si configuras manualmente los comandos. Next.js administra su directorio de salida e imágenes.
5. Revisa el dominio, `/sitemap.xml`, `/robots.txt`, las fichas y el enlace de contacto antes de promover la versión.

La solicitud de cotización se prepara con `mailto:`. Requiere un cliente de correo configurado. El sitio no necesita una base de datos, un proveedor de envío ni secretos.

Referencias de Vercel: [Builds](https://vercel.com/docs/builds), [configuración del build](https://vercel.com/docs/builds/configure-a-build) y [entornos](https://vercel.com/docs/deployments/environments).
