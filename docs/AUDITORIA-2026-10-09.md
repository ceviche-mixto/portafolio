# Auditoría del portafolio — 9 de octubre de 2026

## Veredicto

**Implementación coherente, con observaciones.** La identidad oscura y verde,
la tipografía y los dos modos tienen continuidad. Los proyectos, sus estados,
las métricas consultadas y los enlaces dan contexto real. No hace falta reemplazar
el diseño: hace falta mostrar mejor el trabajo y cerrar detalles de interacción.

**Salud técnica: 14/20 — buena base.** Las notas son una evaluación manual
orientativa, no una certificación WCAG, prueba de penetración o puntuación Lighthouse.

| Dimensión | Nota /4 | Evidencia y límite |
|---|---:|---|
| Accesibilidad | 3 | Acciones con nombre, foco visible, Escape y devolución de foco; quedan detalles en el diálogo y terminal. No se certificó todo el contraste. |
| Rendimiento | 3 | 3D diferido y ausente en móvil, métricas cacheadas; falta acotar la espera de la base y ajustar la reserva de carga móvil. |
| Adaptación móvil | 3 | Sin desbordamiento de documento a 320, 768 y 1280 px; el cierre de terminal mide solo 24 × 24 px. |
| Sistema de tema | 2 | Paleta consistente, pero varios componentes repiten colores, radios y sombras fuera de los tokens semánticos comunes. |
| Integridad de implementación | 3 | Estados de proyectos claros y PDF original; la sección activa puede quedar atrasada y la consola decorativa no se identifica como presentación. |
| **Total** | **14/20** | **Buena base; corregir puntos débiles.** |

Valoración editorial separada: **diseño visual 8/10**, **flujo y usabilidad 7/10**,
**claridad y credibilidad 8/10**. Son juicios profesionales, no resultados de una
prueba con reclutadores. El principal límite visual es que se describen los
productos mucho más de lo que se muestran.

## Alcance y trabajo realizado

- Código local basado en `main` de GitHub (`6bf98d5`) y las mejoras locales previas.
- Vista previa de producción comprobada en Brave, no solo el servidor de desarrollo.
- Lectura de componentes, estados, traducciones, configuración y dependencias.
- Detector de Impeccable ejecutado una vez sobre `src`: dos avisos de texto con
  degradado, en HeroSection y GradeoBento. Son recursos existentes de la identidad;
  no se trataron como fallos funcionales ni se cambió la estética por ese aviso.
- Cambios implementados en esta revisión: acceso **Ver CV** en el hero y Perfil,
  descarga independiente, etiquetas españolas/inglesas y respuesta PDF `inline`.
- El PDF conserva exactamente el SHA-256 del archivo entregado por el usuario.
  No se reescribió, tradujo ni alteró su información personal.
- El visor nativo de Brave mostró correctamente una página. No se agregó un
  visor pesado, modal adicional ni permiso de carga de archivos.
- No se publicó en GitHub/Vercel, ni se enviaron mensajes o postulaciones.

La web pública fue revisada por separado y todavía muestra la versión anterior:
título de estudiante, «junior», ambos proyectos descritos como producción y el
botón de descarga sin la nueva acción de lectura. Las notas de esta auditoría
corresponden a la **versión local mejorada**, no a esa publicación pendiente.

## Pruebas y medidas

| Prueba | Resultado |
|---|---|
| `npm run check` | Lint, tipos y compilación correctos. |
| `npm audit --omit=dev` | Cero avisos en dependencias de producción de esta revisión local. No certifica la seguridad del sitio publicado. |
| Documento a 320 px CSS | Sin desbordamiento horizontal; botones de CV de 44 px de alto, organizados en dos filas. |
| Documento a 768 y 1280 px CSS | Sin desbordamiento horizontal. |
| Idioma inglés a 320 px | Texto de lectura/descarga legible y sin desbordamiento; se informa que el PDF es español. |
| Lectura del CV | HTTP 200, `application/pdf`, 60 795 bytes, `Content-Disposition: inline`. |
| Integridad del CV | SHA-256 idéntico al original; lector nativo muestra 1/1 páginas. |
| Copiar correo | Confirmación «Copied» visible y región `aria-live` actualizada. |
| Diálogo técnico | Apertura, cierre con Escape y foco devuelto al botón de origen. |
| Nombres de acciones de la página | Sin enlaces/botones vacíos sin nombre en el barrido DOM realizado. |
| Gráficos en móvil | Cero canvas a 320 px; secuencia animada oculta y cuatro pasos como lista. |
| Respuesta HTTP local caliente | Tres lecturas completas: 82,5 / 72,2 / 57,9 ms; HTTP 200. |

Los tiempos HTTP son de localhost, sin limitar red ni CPU. **No son LCP, INP, CLS
ni tiempos de carga de Vercel.** No se ejecutó Lighthouse, axe ni una batería
completa de lectores de pantalla; no se inventaron esos resultados.

## Hallazgos priorizados

No se confirmaron bloqueos P0 ni problemas P1 en las pruebas realizadas. Se
documentan **7 observaciones P2 y 2 P3**; esta cuenta no garantiza que no existan
otros problemas fuera del alcance.

### P2 — Sección activa atrasada al llegar a Contacto

- Ubicación: `src/components/chrome/SiteNav.tsx:35`.
- Categoría: integridad / flujo.
- Evidencia: a 768 × 960 px, en `#contacto` y al final del documento, el menú
  mantiene «Projects» activo aunque Contacto ya está visible.
- Impacto: el indicador contradice la navegación y reduce la sensación de acabado.
- Recomendación: resolver la última sección al alcanzar el final, y calcular el
  estado desde todas las secciones visibles, no solo las entradas del último lote
  del observador. Comando sugerido: `$impeccable harden`.

### P2 — Cierre de terminal pequeño

- Ubicación: `src/features/developer-mode/DeveloperOverlay.tsx:145`.
- Categoría: responsive / accesibilidad.
- Evidencia: botón «Close terminal» de 24 × 24 px; los controles principales sí
  alcanzan 44 px.
- Impacto: cuesta acertar con el pulgar. El objetivo de 44 px es el criterio de
  comodidad de esta revisión; no se presenta por sí solo como un incumplimiento
  automático del mínimo AA de WCAG 2.2.
- Recomendación: área de pulsación de al menos 44 × 44 px, conservando un icono
  pequeño. Comando sugerido: `$impeccable adapt`.

### P2 — Detalles semánticos y de idioma del diálogo

- Ubicaciones: `src/features/gradeo/GradeoCaseStudyDialog.tsx:69` y
  `src/components/ui/dialog.tsx:73`.
- Categoría: accesibilidad / internacionalización.
- Evidencia: título H2 seguido de apartados H4; el botón de cierre conserva
  «Cerrar» cuando todo el contenido es inglés.
- Impacto: jerarquía menos clara para navegación por encabezados y etiqueta en
  idioma inesperado. No impide cerrar: Escape y devolución de foco funcionan.
- Recomendación: apartados H3 y etiqueta de cierre traducible.
  Comando sugerido: `$impeccable harden`.

### P2 — Reserva de carga de GRADEO demasiado alta en móvil

- Ubicación: `src/features/gradeo/GradeoSection.tsx:21`.
- Categoría: rendimiento / responsive.
- Evidencia de código: el componente diferido reserva `200vh` en todos los
  tamaños, pero después muestra una lista mucho más breve en móvil.
- Impacto: riesgo de espacio vacío y salto de diseño mientras llega ese módulo
  en una conexión lenta. No se midió una cifra de CLS.
- Recomendación: reserva adaptable o lista móvil renderizada desde servidor.
  Comando sugerido: `$impeccable optimize`.

### P2 — Consulta de métricas sin tiempo límite explícito

- Ubicación: `src/lib/gradeo-stats.ts:39` y `src/app/page.tsx`.
- Categoría: rendimiento / recuperación de errores.
- Evidencia de código: la página espera las consultas; hay caché, control de
  errores y valores de reserva, pero no cancelación por tiempo límite propio.
- Impacto: una consulta lenta durante arranque o regeneración puede retrasar la
  página completa. Las lecturas calientes realizadas fueron rápidas; no se
  provocó una caída de Supabase para probar el peor caso.
- Recomendación: cancelación acotada y reserva útil sin bloquear la presentación.
  Comando sugerido: `$impeccable harden`.

### P2 — Falta CSP como capa adicional de protección

- Ubicación: `next.config.ts:28`.
- Categoría: seguridad.
- Evidencia: las respuestas locales incluyen `nosniff`, `X-Frame-Options: DENY`,
  Referrer-Policy, Permissions-Policy y HSTS; no incluyen CSP ni X-Powered-By.
- Impacto: falta limitar por política qué recursos y scripts puede ejecutar el
  navegador. La ausencia de CSP **no demuestra por sí sola una vulnerabilidad XSS**.
- Recomendación: diseñar una política compatible con Next.js, probarla primero
  en modo de reporte y comprobar estilos, 3D, mapa y PDF antes de exigirla.
  Si se usan nonces, considerar su impacto sobre renderizado y caché.
  Referencia: [guía oficial de CSP de Next.js](https://nextjs.org/docs/app/guides/content-security-policy).
  Comando sugerido: `$impeccable harden`.

### P2 — Aviso pendiente en herramientas de desarrollo

- Ubicación: `package-lock.json`, cadena ESLint de Next.js.
- Evidencia: `npm audit` informa cinco paquetes de desarrollo afectados por el
  aviso de `braces` propagado por micromatch, fast-glob y el plugin/configuración
  de ESLint. No son cinco vulnerabilidades independientes del sitio público.
- La cadena no pertenece a las dependencias de producción de esta revisión.
  Referencia: [aviso GHSA-vfj7-8cjw-p6xm](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm).
- Impacto: riesgo operativo al procesar patrones no confiables en herramientas;
  no se detectó un punto de entrada público equivalente en este portafolio.
- Recomendación: seguir una actualización compatible y comprobarla en CI. No
  aplicar automáticamente el cambio mayor/downgrade que propone `audit fix --force`.
  Comando sugerido: `$impeccable harden`.

### P3 — Tokens visuales incompletamente utilizados

- Ubicaciones: `src/app/globals.css`, CVSection, ProjectsSection y GradeoBento.
- Categoría: sistema de tema.
- Impacto: ajustar superficies y profundidad exige editar varios componentes;
  no es una petición para eliminar el tema oscuro o agregar modo claro.
- Recomendación: compartir tokens semánticos de superficie, texto secundario,
  borde, radio y elevación. Comando sugerido: `$impeccable extract`.

### P3 — Consola ilustrativa sin etiqueta de contexto

- Ubicación: `src/features/developer-mode/DeveloperOverlay.tsx:151`.
- Categoría: integridad / claridad.
- Evidencia: la terminal escribe comandos y mensajes de presentación desde
  traducciones, mientras el monitor sí toma mediciones reales.
- Impacto: puede confundirse una presentación animada con un registro operativo.
- Recomendación: identificarla como consola de presentación, o convertirla en
  navegación real de proyectos/CV, sin fingir que ejecuta comandos del sistema.
  Comando sugerido: `$impeccable clarify`.

## Seguridad: límites de la conclusión

Las cabeceras verificadas son buenas capas básicas; [OWASP documenta su propósito](https://cheatsheetseries.owasp.org/cheatsheets/HTTP_Headers_Cheat_Sheet.html).
La configuración privada `.env.local` no aparece en los archivos versionados;
solo figura el ejemplo sin secretos. La lectura de `src` no encontró uso de
`eval`, `new Function`, `dangerouslySetInnerHTML` ni claves de servicio Supabase.

No se probaron ataques contra producción ni se verificaron políticas RLS,
permisos o autenticación del backend de GRADEO/FARMAPLUS: pertenecen a otra
auditoría. Tampoco se certificó TLS mediante las pruebas de localhost. Los datos
de contacto del CV quedan tal como el usuario indicó; no se rehízo el documento.

## Qué añadir con intención

1. **Producto real antes que decoración.** Capturas de GRADEO y de FARMAPLUS con
   etiqueta beta; recorrido breve «problema / mi decisión / resultado comprobable».
   Reemplazar el mapa por una captura útil sería más valioso para un reclutador.
2. **Mini-demo de automatización.** Un visitante prueba una consulta de ejemplo y
   ve cómo pasa a un registro y una notificación. Si es una simulación local,
   indicarlo claramente y no guardar ni enviar datos. Conecta con la oferta del
   plan comercial sin presentarla como un cliente que ya existe.
3. **Una voz propia.** Tres notas breves sobre una decisión difícil, algo que
   cambiaste y qué aprendiste. Basadas en tu experiencia, sin inventar resultados.
   Humanizan más que contadores de visitas, badges o un chatbot genérico.

Conservar: acciones claras, estados honestos, tipografía, jerarquía, modo técnico
opcional, 3D solo donde aporta y el CV como archivo único. La calidad se siente
en estos detalles, no en acumular animaciones.

## Orden recomendado

1. `$impeccable harden`: navegación activa, idioma del diálogo, consultas y CSP.
2. `$impeccable adapt`: cierre de terminal.
3. `$impeccable optimize`: reserva de carga móvil y medición real en el despliegue.
4. `$impeccable shape`: priorizar capturas y mini-demo con contenido comprobado.
5. `$impeccable polish`: última pasada de espaciado, foco y microinteracciones.

Estos pasos pueden hacerse por separado o juntos. Repetir `$impeccable audit`
después de corregirlos para comparar resultados. Ninguna idea creativa adicional
se presentó como una funcionalidad que ya existe.
