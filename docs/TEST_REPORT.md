# Validación del portafolio · 13 de noviembre de 2026

## Ampliación del catálogo

El build de Next.js y la verificación de TypeScript pasaron. Playwright completó **27 de 27 pruebas en 54.5 s**. Se probaron las 19 fichas, las cuatro resoluciones, los filtros, el acceso a la propuesta de Parea y la exclusión de la referencia de moda. Los enlaces nuevos se comprobaron mediante solicitudes HTTPS de solo lectura.

## Build y navegador iniciales

- Next.js compiló las rutas estáticas, las siete fichas, robots.txt y sitemap.xml.
- Playwright completó **14 de 14 pruebas** y comprobó el servidor de producción en Chromium a 390 × 844, 768 × 1024, 1440 × 900 y 1920 × 1080.
- Las pruebas cubren el renderizado, el ancho de la página, la carga de imágenes, errores de consola, menú móvil y Escape, filtros, siete fichas, enlaces HTTPS externos, lightbox, foco, formulario de contacto visible, recursos SEO y 404.
- [Escritorio](../artifacts/portfolio-desktop.png) · [Móvil](../artifacts/portfolio-mobile.png). Las pruebas regeneran estas capturas.
- El formulario prepara un borrador en el cliente local. La prueba comprueba la interfaz y el vínculo mailto. El envío y la recepción requieren un cliente de correo configurado.

## Lighthouse del alcance inicial

La auditoría se ejecutó sobre la portada de un build de producción servido localmente. La configuración de producción se ensayó con `SITE_URL=https://portafolio.example`, un dominio reservado para pruebas. Los resultados describen el entorno local y pueden variar en Vercel.

| Auditoría móvil | Rendimiento | Accesibilidad | Buenas prácticas | SEO |
| --- | ---: | ---: | ---: | ---: |
| [Primera ejecución local](../artifacts/lighthouse-mobile.json) | 90 | 96 | 100 | 69 |
| [Configuración de producción](../artifacts/lighthouse-production.json) | 86 | 100 | 100 | 100 |
| [Build final](../artifacts/lighthouse-delivery.json) | 85 | 100 | 100 | 100 |

El SEO de la primera ejecución refleja el bloqueo de rastreo previsto al ejecutar sin dominio. El contraste de la sección de especialidades se ajustó antes de la segunda medición.

El build anterior a la ampliación del catálogo registró un desplazamiento de diseño acumulado de 0. El rendimiento móvil quedó por debajo del objetivo de 90 en esta ejecución.
