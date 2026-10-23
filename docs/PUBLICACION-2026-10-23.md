# CV bilingüe y preparación de publicación - 23 de octubre de 2026

## Cambios

- Next.js y eslint-config-next fijados en 16.4.3. El parche sustituye 16.4.0,
  afectado por avisos de seguridad. No se desactivaron comprobaciones del build.
- CV español aprobado conservado byte a byte; PDF inglés residual sustituido
  por una traducción del mismo contenido. Ambos tienen una página.
- Hero y Perfil usan el PDF del idioma seleccionado. Vista nativa en pestaña
  nueva y descarga explícita con nombre ES/EN. Los PDFs revalidan su caché y los
  enlaces incluyen una versión de publicación para no reutilizar la caché antigua.
- Canonical conservado; retirados los hreflang duplicados. El idioma cambia
  por cookie, no mediante dos URLs localizadas independientes.

## Validación local

- `npm run check`: lint, TypeScript, 5 archivos / 32 pruebas y build correctos.
- `npm audit`: cero vulnerabilidades reportadas, incluidas dependencias de
  desarrollo, en la fecha de esta comprobación. No es garantía permanente.
- Brave: ES -> EN -> ES actualiza los tres enlaces del CV, sin desbordamiento
  horizontal a 320, 768 px y ancho de escritorio. Acciones del CV de 44 px de alto.
- PDFs: HTTP 200, `Content-Disposition: inline`, caché con revalidación; enlaces
  internos y representación visual revisados. Se mantiene inglés básico A2.
- Detector Impeccable: dos avisos de texto con degradado (Hero y métrica GRADEO).
  Se conservan como parte de la identidad visual existente; no son un bloqueo
  funcional. No se rediseñó el portafolio para satisfacer una regla estética.
- Escaneo de archivos publicables sin patrones de secretos conocidos; `.env.local`
  queda ignorado. No es auditoría completa del historial ni prueba de penetración.

SHA-256 esperados:

```text
ES D74B4920FFF1C2BB1F5B1DB03C25E23EF9029652F270BD20E214C5A081E770A4
EN B905255E1A0FD5C9A8571E0D57966BA44FF8E868CD81854FC4E3A10066BD0638
```

## Cómo mantenerlo sin cambiar la arquitectura

1. Editar el CV en Overleaf y exportar una sola página por idioma. Mantener los
   mismos hechos, fechas y nivel de idiomas; traducir no implica añadir experiencia.
2. Reemplazar los archivos `public/cv/giancarlo-larios-cv-es.pdf` y
   `public/cv/giancarlo-larios-cv-en.pdf`. No modificar los nombres sin actualizar
   `src/lib/site.ts`, `next.config.ts` y las pruebas. Al reemplazar documentos,
   incrementar también la versión de los enlaces en `src/lib/site.ts`.
3. Editar textos de interfaz en `src/lib/i18n.ts` e identidad/enlaces en
   `src/lib/site.ts`; las claves ES/EN deben coincidir.
4. Ejecutar `npm run check`, `npm audit` y revisar ambos PDFs renderizados.
5. Publicar mediante Git y comprobar en el dominio real: idioma, vista/descarga,
   hashes de los documentos, enlaces finales, consola y diseño móvil. Un push
   correcto no demuestra por sí solo que Vercel haya terminado el despliegue.

Una pestaña del portafolio que estaba abierta antes del despliegue necesita
recargarse para recibir los enlaces nuevos; no es necesario borrar la caché.

## Consejos de los vídeos y límites

Los vídeos propuestos recomiendan revisar funciones reales, accesibilidad,
permisos, consumo y mantenimiento. Se aplican aquí mediante pruebas, documentación,
parche de dependencias y revisión de publicación; no justifican migrar a WordPress
ni contratar servicios para este portafolio. Sus cifras comerciales o legales no
se usan como evidencia técnica.

No se cambiaron permisos/RLS de GRADEO, facturación, plan Vercel ni reglas de
firewall. La demo permanece local y no envía comunicaciones. La revisión no
certifica WCAG, cumplimiento legal, resistencia a ataques ni costes ilimitados.

Fuentes de contraste:

- [Aviso de Next.js](https://github.com/advisories/GHSA-673q-mjm6-r5xr)
- [Mitigación DDoS de Vercel](https://vercel.com/docs/vercel-firewall/ddos-mitigation)
- [Sitios multilingües: Google](https://developers.google.com/search/docs/specialty/international/managing-multi-regional-sites)
