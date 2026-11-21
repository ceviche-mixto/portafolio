# Giancarlo Larios — Portafolio

Portafolio bilingüe (español / inglés) de **Giancarlo Larios**, desarrollador de software.

Presenta tres sistemas: **GRADEO** (reseñas anónimas de profesores con cola de moderación, en producción), **OneCtrl** (SaaS multi-negocio de un equipo, en producción, donde contribuyo como desarrollador e investigador de software) y **FARMAPLUS** (punto de venta farmacéutico con trazabilidad por lote, como demo técnica).

---

## Stack

| Capa | Tecnología |
|---|---|
| Framework | Next.js 16.4 (App Router, Turbopack, rutas estáticas) |
| Lenguaje | TypeScript |
| Estilos | Tailwind CSS 4 con tokens editoriales |
| Componentes | Server Components + islas de cliente; Base UI para acciones |
| Animación | CSS + Motion (`framer-motion`) sobre `ViewTimeline` nativo |
| Estado | Zustand (preferencia de movimiento del visitante) |
| Datos | Supabase / PostgreSQL 17, leído desde el servidor |

## Puesta en marcha

```bash
git clone https://github.com/ceviche-mixto/portafolio.git
cd portafolio
npm install
cp .env.example .env.local   # rellena los valores
npm run dev
```

Abre <http://localhost:3000> (español) o <http://localhost:3000/en> (inglés). Cada caso vive en `/proyectos/<slug>` y `/en/projects/<slug>`.

### Variables de entorno

Todas opcionales para arrancar: sin ellas el sitio funciona igual y las métricas
vivas muestran un estado de reserva en lugar de fallar.

El CV español aprobado se conserva sin modificaciones. Cada idioma enlaza su PDF:
español o su traducción inglesa de una página. Ambos permiten verlo en otra
pestaña, sin descarga forzada, o descargarlo. Los PDFs se revalidan para evitar
versiones antiguas en caché tras una publicación.

| Variable | Para qué |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Proyecto de Supabase de GRADEO |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Clave anónima (pública por diseño; las tablas tienen RLS) |
| `NEXT_PUBLIC_SITE_URL` | Dominio canónico, para `metadataBase`, sitemap e imágenes OG |

### Órdenes

| Orden | Qué hace |
|---|---|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Build de producción |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript sin emitir |
| `npm run test` | Vitest: integridad del CV, estados, accesibilidad estructural y seguridad |
| `npm run check` | Lint + tipos + pruebas + build |

---

## Decisiones que vale la pena conocer

Si vienes a leer el código, estos son los puntos donde hay algo que explicar.

**El idioma está en la URL.** `/` es español y `/en` inglés. Cada idioma tiene
su root layout en un grupo de rutas (`app/(es)`, `app/(en)`) que comparte
`RootDocument`, así que `<html lang>`, canonical y `hreflang` salen correctos del
HTML prerenderizado. `app/global-not-found.tsx` cubre las URLs inexistentes.

**El diccionario no viaja al navegador.** `src/lib/i18n.ts` lleva
`import 'server-only'`: las secciones son Server Components que leen su idioma, y
las islas de cliente (barra, idioma, control de movimiento, copiar correo)
reciben por props sólo las cadenas que usan.

**El español es la fuente de la forma de las traducciones.** En `src/lib/i18n.ts`
el tipo se deriva del objeto español y el inglés se declara con ese tipo: si
añades una clave en uno y la olvidas en el otro, falla el build en lugar de
renderizar `undefined`.

**Los casos son una colección tipada.** `src/content/projects` define cada
proyecto con textos ES/EN obligatorios, capturas, pasos de arquitectura,
decisiones (qué garantizar, qué elegí, qué coste, cómo lo comprobé) y evidencia
fechada. Las páginas `[slug]` se generan con `generateStaticParams` y
`dynamicParams = false`: un slug desconocido es un 404.

**Las cifras llevan fecha.** La evidencia de cada caso indica cuándo y dónde se
consultó. La página de GRADEO añade una lectura viva (ISR cada cinco minutos)
desde `src/lib/gradeo-stats.ts`, que usa `unstable_cache`: la consulta no usa
`fetch` y su entrada debe sobrevivir a un despliegue, y `'use cache'` exigiría
activar `cacheComponents` en todo el sitio. Sin respuesta muestra «no
disponible», que es distinto de cero.

**Las capturas no muestran datos personales.** Las de GRADEO se tomaron en
producción con los nombres de docentes y el texto de las reseñas sustituidos.
FARMAPLUS se representa con un esquema de su interfaz con datos ficticios.

**Datos estructurados y tarjetas.** Cada página publica JSON-LD (`Person` y una
entidad por proyecto, en `src/lib/structured-data.ts`). La imagen Open Graph de
la portada se genera en build con Geist (`src/assets/fonts`, licencia OFL) y la
paleta editorial; cada caso usa su captura. El sitemap lista las 8 URLs con
fechas de revisión del contenido, no del build.

**CSP estática.** La política vive en `next.config.ts`, sin nonce por petición,
que obligaría a renderizar cada página por petición. Next inserta scripts inline
con los datos de RSC que los hashes SRI no cubren, así que `script-src` admite
inline, pero sólo desde el propio origen y sin `unsafe-eval`.

**Solicitar código no concede acceso ni envía mensajes.** Abre un desplegable
nativo con el correo visible, copia con confirmación y recuperación de errores,
y un enlace opcional para redactar un correo con proyecto y asunto preparados.
Los repositorios privados no se publican automáticamente.

**El movimiento ligado al scroll corre en el compositor.** El hero, las imágenes
del listado y el realce del diagrama de cada caso usan `scroll(animate(...))` de
Motion con rangos preset (`entry`/`exit`), que se traducen a un `ViewTimeline`
nativo: no hay JavaScript por frame ni estilos inline. `useScroll` mediría el
layout en cada frame, así que no se usa. La entrada de la guía cobalto y el zoom
de las tarjetas son CSS. Todo el contenido llega visible en el HTML.

**Todo respeta `prefers-reduced-motion`**, en JS y en CSS.

**El visitante también controla el movimiento.** El botón de pausa de la barra
activa una versión tranquila. La preferencia se guarda solo en este navegador y
nunca anula una petición de movimiento reducido del sistema.

---

## Estructura

```
src/
├── app/
│   ├── (es)/               layout raíz, portada, casos (/proyectos/[slug]), error y OG
│   ├── (en)/en/            lo mismo en inglés (/en/projects/[slug])
│   └── …                   404 global, sitemap, robots, estilos
├── components/
│   ├── case-study/         artículo del caso, flujo de arquitectura, lectura viva
│   ├── chrome/             barra, skip link, enlaces sociales
│   ├── mode-switcher/      idioma y control de movimiento
│   ├── motion/             hero y listado ligados al scroll
│   ├── project/            tarjeta, figura, estado y enlaces de proyecto
│   ├── site/               documento, portada y fuentes compartidos
│   └── ui/                 variantes de botón, Button, copiar correo
├── content/projects/       colección tipada: GRADEO, OneCtrl, FARMAPLUS
├── features/
│   ├── contact/            contacto y pie
│   ├── engineering/        enfoque de ingeniería
│   ├── hero/               hero con captura de GRADEO
│   ├── projects/           trabajo seleccionado
│   └── trajectory/         trayectoria y CV
├── hooks/
├── lib/                    i18n, idioma, metadatos, datos, identidad y enlaces
└── store/                  preferencia de movimiento (persistida)
```

`src/lib/site.ts` es la única fuente de verdad de identidad y enlaces externos.
Si algo del sitio apunta hacia fuera, su URL está ahí.

---

## Mantenimiento

CI ejecuta lint, tipos, pruebas, auditoría de dependencias de producción y build
en Node 24. Verifica también `npm audit` al actualizar dependencias. No aplicar
`audit fix --force` ni ocultar avisos.

---

*Desarrollado por Giancarlo Larios.*
