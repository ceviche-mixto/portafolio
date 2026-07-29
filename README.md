# Giancarlo Larios — Portafolio

Portafolio bilingüe (español / inglés) de **Giancarlo Larios**, estudiante de
Ingeniería de Sistemas y Computación en la USAT, Chiclayo.

Presenta dos sistemas en producción: **GRADEO**, una plataforma de reseñas
anónimas de profesores con cola de moderación, y **FARMAPLUS**, un ERP de
farmacia con facturación electrónica SUNAT.

---

## Stack

| Capa | Tecnología |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack) |
| Lenguaje | TypeScript |
| Estilos | Tailwind CSS 4 |
| Componentes | Base UI |
| Animación | CSS + Framer Motion (sólo donde hace falta, en carga diferida) |
| 3D | three.js vía React Three Fiber (diferido y condicional) |
| Estado | React Context (idioma) + Zustand (modo) |
| Datos | Supabase / PostgreSQL 17, leído desde el servidor |

## Puesta en marcha

```bash
git clone https://github.com/ceviche-mixto/portafolio.git
cd portafolio
npm install
cp .env.example .env.local   # rellena los valores
npm run dev
```

Abre <http://localhost:3000>.

### Variables de entorno

Todas opcionales para arrancar: sin ellas el sitio funciona igual y las métricas
en vivo caen en valores de reserva en lugar de fallar.

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
| `npm run check` | Lint + tipos + build, todo seguido |

---

## Decisiones que vale la pena conocer

Si vienes a leer el código, estos son los puntos donde hay algo que explicar.

**El idioma se guarda en cookie, no en localStorage.** El servidor necesita
conocerlo para emitir el `<html lang>` correcto y los metadatos en el idioma que
verá el visitante. `src/lib/language.ts` tiene la parte compartida y
`language-server.ts` la lectura con `next/headers`, separados para que el cliente
no arrastre módulos de servidor.

**El español es la fuente de la forma de las traducciones.** En `src/lib/i18n.ts`
el tipo se deriva del objeto español y el inglés se declara con ese tipo: si
añades una clave en uno y la olvidas en el otro, falla el build en lugar de
renderizar `undefined`.

**Las cifras del sitio no se escriben a mano.** La copia usa marcadores como
`{professors}` que se rellenan con el recuento real (`useGradeoCopy`). Un número
incrustado en el texto es correcto el día que se escribe y falso un mes después.

**Las métricas se consultan en el servidor.** `src/lib/gradeo-stats.ts` corre en
el servidor con revalidación de cinco minutos, así que el número real viaja en el
HTML y las credenciales de GRADEO no entran en el bundle del navegador.

**Casi nada de la animación usa JavaScript.** `Reveal` hace las apariciones con
IntersectionObserver y transiciones CSS; el desvanecido del hero usa
`animation-timeline`. Framer Motion queda para la secuencia de scroll de GRADEO y
el overlay de desarrollador, y ambos se cargan por separado.

**La escena 3D es opcional en tiempo de ejecución.** `HeroBackground` sólo monta
three.js si la pantalla es ancha, el visitante no pide movimiento reducido y no
está en modo ahorro de datos; además la desmonta al salir del viewport. Debajo
siempre hay un degradado, así que el hero nunca se ve vacío.

**Todo respeta `prefers-reduced-motion`**, en JS y en CSS.

---

## Estructura

```
src/
├── app/                    layout, página, sitemap, robots, OG, error, 404
├── components/
│   ├── 3d/                 escena del hero y su portero de montaje
│   ├── chrome/             barra, anclas, skip link, enlaces sociales
│   ├── cv/                 perfil y experiencia
│   ├── i18n/               proveedor de idioma
│   ├── motion/             Reveal (aparición en CSS)
│   ├── project/            enlaces de proyecto reutilizables
│   └── ui/                 primitivas (Base UI)
├── features/
│   ├── contact/            contacto y pie
│   ├── developer-mode/     overlay con métricas medidas
│   ├── gradeo/             bento, case study, scrollytelling
│   ├── hero/               portada
│   └── projects/           GRADEO y FARMAPLUS
├── hooks/
├── lib/                    i18n, idioma, datos, identidad y enlaces
└── store/                  modo desarrollador (persistido)
```

`src/lib/site.ts` es la única fuente de verdad de identidad y enlaces externos.
Si algo del sitio apunta hacia fuera, su URL está ahí.

---

## Auditoría

`docs/AUDITORIA-2026-07.md` contiene la auditoría de UI/UX, rendimiento y
profesionalismo que originó la versión actual, con las mediciones antes y después.

---

*Desarrollado por Giancarlo Larios.*
