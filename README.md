# Giancarlo Larios — Portafolio

Portafolio bilingüe (español / inglés) de **Giancarlo Larios**, desarrollador de software.

**GRADEO** es una plataforma de reseñas anónimas de profesores con cola de moderación y está en producción. **FARMAPLUS** es un ERP de farmacia con facturación electrónica SUNAT en fase beta; todavía no está desplegado.

---

## Stack

| Capa | Tecnología |
|---|---|
| Framework | Next.js 16.4 (App Router, Turbopack, rutas estáticas) |
| Lenguaje | TypeScript |
| Estilos | Tailwind CSS 4 con tokens editoriales |
| Componentes | Server Components + islas de cliente; Base UI para acciones |
| Animación | CSS + Framer Motion (sólo donde hace falta, en carga diferida) |
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

Abre <http://localhost:3000> (español) o <http://localhost:3000/en> (inglés).

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
las islas de cliente (barra, control de movimiento, copiar correo, caso técnico)
reciben por props sólo las cadenas que usan.

**El español es la fuente de la forma de las traducciones.** En `src/lib/i18n.ts`
el tipo se deriva del objeto español y el inglés se declara con ese tipo: si
añades una clave en uno y la olvidas en el otro, falla el build en lugar de
renderizar `undefined`.

**La portada usa un recuento fechado.** `GRADEO_SNAPSHOT` guarda las cifras de
producción con su fecha, así la portada es estática y no depende de la base. La
lectura viva de `src/lib/gradeo-stats.ts` usa `unstable_cache`: la consulta no
usa `fetch` y su entrada debe sobrevivir a un despliegue, y `'use cache'` exigiría
activar `cacheComponents` en todo el sitio.

**CSP estática.** La política vive en `next.config.ts`, sin nonce por petición,
que obligaría a renderizar cada página por petición. Next inserta scripts inline
con los datos de RSC que los hashes SRI no cubren, así que `script-src` admite
inline, pero sólo desde el propio origen y sin `unsafe-eval`.

**Solicitar código no concede acceso ni envía mensajes.** Abre un desplegable
nativo con el correo visible, copia con confirmación y recuperación de errores,
y un enlace opcional para redactar un correo con proyecto y asunto preparados.
Los repositorios privados no se publican automáticamente.

**Casi nada de la animación usa JavaScript.** `Reveal` hace las apariciones con
IntersectionObserver y transiciones CSS; el desvanecido del hero usa
`animation-timeline`. Framer Motion queda para la secuencia de scroll de GRADEO,
que se carga por separado.

**Todo respeta `prefers-reduced-motion`**, en JS y en CSS.

**El visitante también controla el movimiento.** El botón de pausa de la barra
activa una versión tranquila: sin pulsos ni secuencia animada; los cuatro pasos
permanecen visibles como lista. La preferencia se guarda solo en este navegador
y nunca anula una petición de movimiento reducido del sistema.

---

## Estructura

```
src/
├── app/
│   ├── (es)/               layout raíz, portada, error y OG en español
│   ├── (en)/en/            lo mismo en inglés
│   └── …                   404 global, sitemap, robots, estilos
├── components/
│   ├── chrome/             barra, skip link, enlaces sociales
│   ├── cv/                 perfil y experiencia
│   ├── mode-switcher/      idioma y control de movimiento
│   ├── motion/             Reveal (aparición en CSS)
│   ├── project/            enlaces de proyecto reutilizables
│   ├── site/               documento, portada y fuentes compartidos
│   └── ui/                 variantes de botón, Button, Dialog, copiar correo
├── features/
│   ├── contact/            contacto y pie
│   ├── gradeo/             bento, caso técnico, ciclo de una reseña
│   ├── hero/               portada
│   └── projects/           GRADEO y FARMAPLUS
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
