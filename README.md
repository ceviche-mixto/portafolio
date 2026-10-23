# Giancarlo Larios — Portafolio

Portafolio bilingüe (español / inglés) de **Giancarlo Larios**, desarrollador de software.

**GRADEO** es una plataforma de reseñas anónimas de profesores con cola de moderación y está en producción. **FARMAPLUS** es un ERP de farmacia con facturación electrónica SUNAT en fase beta; todavía no está desplegado.

---

## Stack

| Capa | Tecnología |
|---|---|
| Framework | Next.js 16.4 (App Router, Turbopack) |
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
de producción muestran un estado de reserva en lugar de fallar.

El CV español aprobado se conserva sin modificaciones. El selector de idioma
elige el PDF correspondiente: español o su traducción inglesa de una página.
Ambos permiten verlo en otra pestaña, sin descarga forzada, o descargarlo.
También hay acceso desde el hero. Los PDFs se revalidan para evitar versiones
antiguas en caché tras una publicación.

La auditoría inicial está en `docs/AUDITORIA-2026-10-09.md`; el acabado,
pruebas y límites actuales están en `docs/ACABADO-2026-10-09.md`.
La actualización bilingüe y su guía de mantenimiento están en
`docs/PUBLICACION-2026-10-23.md`; los informes previos conservan su contexto histórico.

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

**Las métricas se consultan en el servidor.** `src/lib/gradeo-stats.ts` cachea
explícitamente las consultas públicas durante cinco minutos, aunque la página
se renderice por petición para leer la cookie de idioma. Las cifras viajan en
el HTML y el cliente de Supabase no entra en el bundle del navegador. Suspense
permite mostrar portada y CV sin esperar a la base. Hay cancelación a los tres
segundos; un fallo no se guarda como éxito en la caché, para permitir recuperación.

**CSP con nonce por petición.** `src/proxy.ts` aplica la política a los documentos
y proporciona el nonce a Next.js. En producción no se permiten scripts inline
sin nonce ni `unsafe-eval`; los estilos inline siguen permitidos para React y
la animación. Esto requiere renderizado dinámico: no convertir a exportación
estática sin rediseñar y verificar la política.

**La mini-demo no es una integración real.** Solo transforma un mensaje de
ejemplo en memoria. No escribe en una base, no envía WhatsApp/correo y no tiene
analítica. React escapa el contenido. Sin JavaScript, los pasos siguen legibles.

**Las métricas del monitor son locales.** FPS y Web Vitals describen esta visita,
no el rendimiento de todos los usuarios. No se transmiten ni persisten; algunos
Web Vitals permanecen pendientes hasta que el navegador los publica. La terminal
es una presentación identificada como tal y no ejecuta comandos.

**Casi nada de la animación usa JavaScript.** `Reveal` hace las apariciones con
IntersectionObserver y transiciones CSS; el desvanecido del hero usa
`animation-timeline`. Framer Motion queda para la secuencia de scroll de GRADEO y
el overlay de desarrollador, y ambos se cargan por separado.

**La escena 3D es opcional en tiempo de ejecución.** `HeroBackground` sólo monta
three.js si la pantalla es ancha, el visitante no pide movimiento reducido y no
está en modo ahorro de datos; además la desmonta al salir del viewport. Debajo
siempre hay un degradado, así que el hero nunca se ve vacío.

**Todo respeta `prefers-reduced-motion`**, en JS y en CSS.

**El visitante también controla el movimiento.** El botón de pausa de la barra
activa una versión tranquila: sin escena 3D, pulsos ni secuencia animada; los
cuatro pasos permanecen visibles como lista. La preferencia se guarda solo en
este navegador y nunca anula una petición de movimiento reducido del sistema.
El monitor continuo también se detiene, con su última muestra identificada.

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

CI ejecuta lint, tipos, pruebas, auditoría de dependencias de producción y build
en Node 24. Verifica también `npm audit` al actualizar dependencias; los informes
de acabado anteriores describen el estado de su fecha, no el de cada publicación.
No aplicar `audit fix --force` ni ocultar avisos.

---

*Desarrollado por Giancarlo Larios.*
