# Auditoría de Portafolio — Julio 2026

> **Estado: implementada.** Las seis fases del plan están aplicadas. Los resultados
> medidos después de la implementación están en la sección 10, al final. Este
> documento conserva el diagnóstico original sin editarlo, para que el antes y el
> después se puedan comparar.

**Repositorio:** `ceviche-mixto/portafolio` · **Commit auditado:** `bfa9f3b` · **Fecha:** 29 de julio de 2026
**Stack:** Next.js 16.1.6 · React 19.2.3 · Tailwind CSS 4 · Framer Motion 12 · Zustand 5 · Supabase JS 2
**Alcance:** 1 733 líneas en 20 archivos fuente
**Método:** build de producción, ESLint, cálculo de contraste WCAG 2.1, inspección de esquema Postgres

> Versión con formato: `docs/auditoria-2026-07.html`

---

## 1. Veredicto

**Índice global ponderado: 47/100.** Suficiente como demo visual, insuficiente como herramienta para
conseguir entrevistas — y por debajo de lo que el trabajo real justifica.

El portafolio está bien hecho *como pieza visual*: la orquestación con Framer Motion, el sistema
bilingüe tipado y el Developer Mode son ideas por encima del promedio de un portafolio de estudiante.
El problema no es el acabado, son dos brechas:

1. **Conversión.** No hay enlace a GitHub, no hay email, no hay CV descargable, y GRADEO —que ocupa
   la mitad del sitio— nunca se enlaza. El sitio convence y luego no ofrece ninguna salida.
2. **Inventario.** GRADEO en producción tiene 21 tablas, 919 profesores y un sistema de moderación
   con roles, PIN y bloqueo por fuerza bruta. Existe además FARMAPLUS, un ERP de farmacia con
   facturación electrónica SUNAT, creado hace cuatro días. El portafolio no menciona nada de eso.

| Dimensión | Puntuación | Peso | Lectura |
|---|---:|---:|---|
| UI / UX y flujo | 62 | 20 % | Animación sólida, sin navegación ni CTA |
| Rendimiento | 42 | 20 % | 547 KB gz, 61 % es three.js |
| Accesibilidad | 35 | 15 % | 0 atributos ARIA, idioma incorrecto |
| Profesionalismo | 48 | 20 % | Código ficticio y métricas simuladas |
| Código y mantenibilidad | 58 | 15 % | 2 errores y 9 avisos de ESLint |
| SEO y distribución | 30 | 10 % | Sin imagen OG, sitemap ni hreflang |

---

## 2. El hallazgo principal: GRADEO ya es otro producto

El sitio cuenta GRADEO como «reseñas anónimas de profesores con triggers de agregación». Eso describe
la V1. El esquema en producción describe algo más ambicioso, y varias de las decisiones más
interesantes son justo las que no se ven.

| Capacidad real en producción | Evidencia en la base de datos | ¿Está en el portafolio? |
|---|---|---|
| Cola de moderación con estados | `reviews.status`, `approved_by`, `rejected_by`, `rejected_at` | No — el sitio implica publicación directa |
| Roles y segundo factor tipo PIN con bloqueo por intentos | `profiles.role` (owner/admin/auxiliar/user), `security_pin`, `pin_failures`, `pin_locked_until` | No |
| Rate limiting anónimo por hash de IP | `reviewer_ip_hash`, `review_logs` (86 filas) | No |
| Búsqueda difusa con pg_trgm, lista para índice | `search_professors_similarity()`, `idx_professors_name_trgm` | No |
| Valoración en 4 ejes, sólo sobre reseñas aprobadas | `update_professor_metrics()`, `rating_personality/methodology/clarity/fairness` | Se muestra una fórmula distinta e inventada |
| Alta colaborativa de profesores con aprobación | `professor_requests` (enum `request_type`) | No |
| Reporte de abusos con ciclo de resolución | `review_reports` | No |
| Modelo relacional M:N universidad / sede / carrera | 3 tablas puente + `campuses` + `careers` | Se menciona como jerarquía simple |
| Suite de herramientas de estudio | `user_notes` (editor por bloques), `user_tool_data` (semestre/horarios/pomodoro) | No |
| Enlaces de compartir con expiración | `notes_shares`, `timetable_shares`, `grades_shares`, `pomodoro_shares` | No |
| IA con cuota medida por usuario y mes | `ai_usage`, `consume_ai_credit(p_feature, p_limit)` | No |
| Lista de espera con referidos e integración Ko-fi | `waitlist_entries.referral_code/referred_by/referral_count`, `increment_waitlist_referral()` | No |
| Captación de anunciantes | `ad_inquiries` | No |

### Lo mejor que tienes no aparece en ningún sitio

Dentro de `search_professors_similarity()` está escrito por qué se usa el operador `%` de trigramas en
lugar de `similarity() > umbral`: sólo la forma con operador la reconoce el planner como respaldada por
índice; a ~900 filas Postgres todavía elige seq scan, pero la consulta queda lista para conmutar sola
cuando la tabla crezca.

Ese razonamiento es exactamente lo que un entrevistador quiere oír: conocimiento del coste real,
medición, y optimización para el crecimiento sin sobre-optimizar el presente. Hoy está enterrado en una
función SQL en lugar de ser el centro del case study.

### FARMAPLUS no existe en el sitio

Creado el 25 de julio de 2026, 23 tablas. ERP/POS de farmacia. Para un reclutador peruano es
probablemente más legible que GRADEO, porque es dominio regulado con requisitos verificables:

- **Facturación electrónica SUNAT** — `sunat_documents`, `document_series`. Cumplimiento tributario real.
- **Trazabilidad por lote y vencimiento** — `batches` (23 filas), `inventory_adjustments`.
- **Arqueo de caja** — `cash_registers`, `cash_movements`, `sale_payments`, `payment_methods`.
- **Datos farmacológicos** — `active_substances`, `product_active_substances` (M:N), `laboratories`.
- **Compras y proveedores** — `purchases`, `purchase_items`, `suppliers`.
- **Auditoría y roles** — `audit_logs`, `users`, `roles`.

GRADEO demuestra que sabes diseñar un producto; FARMAPLUS demuestra que sabes modelar un negocio con
reglas externas que no puedes negociar. Son dos argumentos distintos y hacen falta los dos.

---

## 3. Credibilidad — arreglar primero

Único bloque donde el coste de no actuar no es «peor puntuación», sino perder una entrevista concreta.
El Developer Mode invita explícitamente a un revisor técnico a mirar de cerca.

### C-01 · CRÍTICO · El snippet de «Weighted Average Logic» es ficticio

`src/features/gradeo/GradeoBento.tsx:177-185` presenta como lógica de GRADEO una función con pesos por
reseña verificada. En la base de datos no existe `isVerified` ni ninguna ponderación.

```
Portafolio — GradeoBento.tsx:177-185
  const weight = r.isVerified ? 1.5 : 1;   ← no existe en el esquema

Producción — update_professor_metrics()
  _total := (_p + _m + _c + _f) / 4.0;     ← media simple de 4 ejes
  where professor_id = _prof_id and status = 'approved';
  total_score = round(_total, 10)  -- 10 decimales para ordenar sin empates
  metrics     = round(cada eje, 1) -- 1 decimal para las barras de la UI
```

**Corrección:** mostrar el trigger real. Es mejor material: filtrar por `approved` revela la
moderación, y el contraste entre 10 decimales para ordenar y 1 para pintar es una decisión de
ingeniería concreta y defendible. La versión inventada no lo es.

### C-02 · ALTO · El HUD de rendimiento muestra números aleatorios

```
src/features/developer-mode/DeveloperOverlay.tsx:43-44
  setFps(Math.floor(58 + Math.random() * 4))
  setMemory(Math.floor(40 + Math.random() * 15))

src/features/developer-mode/DeveloperOverlay.tsx:83
  {Math.floor(Math.random() * 3) + 1}ms
  → error  react-hooks/purity  Cannot call impure function during render
```

**Corrección:** medir FPS con un contador sobre `requestAnimationFrame` y memoria con
`performance.memory`. Mismo coste de implementación, cero riesgo. Si se prefiere el efecto estético,
etiquetarlo como simulación.

### C-03 · ALTO · Tres títulos profesionales distintos en el mismo sitio

```
src/lib/i18n.ts:88   «Ingeniero de Sistemas y Computación»       (hero)
src/lib/i18n.ts:139  «Ingeniero de Sistemas de Información»      (consola dev)
src/lib/i18n.ts:147  «Estudiante de Ingeniería de Sistemas...»   (perfil)
```

El hero afirma un título de ingeniero mientras el CV dice estudiante. **Corrección:** una sola fórmula
repetida literal. Si aún estudias, «Estudiante de Ingeniería de Sistemas» con el año en curso es más
fuerte que un título ambiguo, porque es verificable.

### C-04 · MEDIO · La narrativa omite la moderación y el anti-abuso

El case study insiste en «sin muros de login, sin fricción» y describe los triggers agregando
directamente. La realidad incluye cola de moderación humana y rate limiting por hash de IP. Omitirlo
hace que el sistema parezca *más ingenuo* de lo que es.

**Corrección:** convertir el anonimato en el conflicto central — cómo aceptar reseñas sin identificar a
nadie y aun así frenar el abuso. Guardar el *hash* de la IP y no la IP es la decisión que demuestra
criterio.

### C-05 · MEDIO · El repositorio no arranca recién clonado

```
package.json:2           "name": "app-temp"
README.md                «Next.js 14+»   → el proyecto usa 16.1.6
src/lib/supabase.ts:3-6  process.env.NEXT_PUBLIC_SUPABASE_URL!   ← el «!» oculta que falta
sin .env.example         → createClient(undefined) lanza al importar
```

**Corrección:** `.env.example`, sección de configuración en el README, nombre real en `package.json`, y
validación de entorno que falle con un mensaje legible en lugar de un `!`.

### C-07 · MEDIO · El portafolio consulta las tablas de GRADEO desde el navegador

El bundle incluye la URL y la anon key del proyecto GRADEO. Con RLS activa en las 21 tablas no hay fuga
de datos, pero acopla los dos proyectos: un cambio de esquema en GRADEO rompe el portafolio en
silencio, y cada visita golpea la base de producción.

**Corrección:** un route handler cacheado en el portafolio como única frontera. Resuelve también P-04.

---

## 4. Conversión: el sitio no tiene salida

### U-01 · CRÍTICO · No hay ningún enlace a GitHub, pero Instagram aparece dos veces

```
src/app/page.tsx:63,71    hero    → LinkedIn, Instagram
src/app/page.tsx:186,194  footer  → LinkedIn, Instagram
GitHub: 0 apariciones en todo el repositorio
```

Para un portafolio de desarrollador, GitHub es el enlace que un revisor técnico busca primero.
Destacar Instagram por encima del código invierte la señal.

### U-02 · CRÍTICO · No hay forma de contactarte

Ni email, ni formulario, ni WhatsApp, ni una frase de disponibilidad. El sitio termina en un footer con
dos iconos sociales y un aviso de copyright.

**Corrección:** sección de contacto antes del footer con email visible, `mailto:`, botón de copiar, y
una línea explícita de lo que buscas («disponible para prácticas / junior, Chiclayo o remoto»).

### U-03 · CRÍTICO · GRADEO se describe en profundidad y nunca se enlaza

Bento grid, case study modal y 200 vh de scrollytelling dedicados a GRADEO, sin un solo enlace a la
aplicación ni al repositorio.

**Corrección:** botones «Ver en vivo» y «Código» junto al título y repetidos al cierre del case study.

### U-04 · ALTO · No hay sección de proyectos

GRADEO es el único proyecto. FARMAPLUS no aparece, y no existe una estructura donde añadir el siguiente
sin rediseñar la página.

**Corrección:** sección «Proyectos» con una tarjeta por proyecto (problema en una frase, stack, rol,
métrica verificable, enlaces). GRADEO conserva su tratamiento extendido como destacado.

### U-05 · ALTO · Hay sección de CV pero no se puede descargar

**Corrección:** PDF en `/public` con botón de descarga en la cabecera de la sección, versión ES y EN.

### U-06 · ALTO · Sin navegación en una página de scroll muy largo

Entre hero, CV, bento, case study y 200 vh de scrollytelling no hay barra de navegación ni anclas.

**Corrección:** nav sticky discreta con anclas (Perfil · Proyectos · GRADEO · Contacto) y enlace
«saltar al contenido».

### U-07 · MEDIO · Idioma y modo se pierden al recargar

```
src/store/useLanguageStore.ts · src/store/useModeStore.ts
  → 0 usos del middleware «persist» de zustand
```

**Corrección:** `persist` en ambos stores; para el idioma, además cookie para que el servidor emita el
`<html lang>` correcto (ver A-01).

### U-08 · MEDIO · Una celda del bento está vacía para la audiencia principal

En modo reclutador —el modo por defecto— `GradeoBento.tsx:164-168` pinta una caja punteada cuyo único
contenido es pedir que actives el Developer Mode.

**Corrección:** que la celda muestre algo útil en modo reclutador y se transforme en el widget técnico
al cambiar de modo. La invitación va en el propio switch, no ocupando una tarjeta.

### U-09 · MEDIO · Dos pasos del scrollytelling no ilustran lo que dicen

```
GradeoBento.tsx:235  paso 2 «Edge Payload Routing» → icono de estrella
GradeoBento.tsx:253  paso 4 «Data Aggregation»    → icono de candado
```

**Corrección:** enrutamiento en el Edge como nodos con un paquete viajando; agregación como la fila del
profesor recalculándose. El candado encaja mejor en el anonimato.

---

## 5. Rendimiento

Medido sobre un build de producción real (`next build`, Turbopack) del commit `bfa9f3b`.

| Medición | Valor | Lectura |
|---|---:|---|
| JS de cliente, total comprimido | 547,0 KB | ≈ 2,7 × el presupuesto habitual de 200 KB |
| JS de cliente, sin comprimir | 2,1 MB | — |
| Chunk mayor (three.js) | 333,5 KB | 61 % del total, para una esfera decorativa |
| Peticiones a terceros en la carga inicial | 2 | HDRI en raw.githack.com + iframe de OpenStreetMap |
| Animaciones CSS infinitas simultáneas | 9 | CPU ocupada de forma permanente |
| Rutas prerenderizadas | 2 | `/` y `/_not-found` |

### P-01 · CRÍTICO · three.js pesa 333 KB comprimidos y se carga siempre

```
src/app/page.tsx:5        import estático de HeroCanvas
src/components/3d/HeroCanvas.tsx:40-49
  · sin dynamic import        · sin límite de dpr
  · sin control de frameloop  · sin desmontaje fuera del viewport
```

three.js, fiber y drei entran en el bundle inicial de todos los visitantes —incluidos móviles y quienes
prefieren movimiento reducido— para renderizar una esfera de fondo al 50 % de opacidad. Además
`useFrame` sigue ejecutándose a 60 fps cuando el hero ya salió de pantalla.

**Corrección:** `next/dynamic` con `ssr: false`, montaje condicionado a visibilidad y a
`prefers-reduced-motion`, `dpr={[1, 1.5]}`, loop pausado fuera del viewport, degradado CSS de fallback.
En móvil, quedarse en el degradado.

### P-02 · CRÍTICO · El hero depende de un CDN de terceros para iluminarse

```
src/components/3d/HeroCanvas.tsx:47   <Environment preset="city" />
  → potsdamer_platz_1k.hdr
  → https://raw.githack.com/pmndrs/drei-assets/456060a2.../hdri/
```

Dependencia externa en la ruta crítica del hero. **Corrección:** quitar `Environment` — ya hay
`ambientLight` y `directionalLight`, y el material apenas usa el mapa de entorno. Si se quiere
conservar el reflejo, alojar el `.hdr` en `/public` y pasarlo con `files`.

### P-03 · ALTO · Cada frame de scroll re-renderiza toda la página

```
src/app/page.tsx:25-38
  const [gradeoProgress, setGradeoProgress] = useState(0)
  useMotionValueEvent(rawGradeoProgress, "change", latest =>
    setGradeoProgress(latest))          ← estado en el componente raíz
  ...
  if (gradeoProgress > 0.15) scrollyLayer = 1   ← sólo importa el umbral
```

**Corrección:** calcular la capa dentro del callback y llamar a `setState` sólo cuando cambia respecto a
la anterior: de ~60 renders por segundo a 4 en todo el recorrido.

### P-04 · ALTO · Las métricas «en vivo» llegan después de la hidratación

```
src/app/page.tsx:1                          "use client"  (raíz de la página)
src/features/gradeo/GradeoBento.tsx:14-31   useState("...") + useEffect → fetch
src/features/gradeo/GradeoBento.tsx:112-133 segunda consulta tras hidratación
```

**Corrección:** Server Component o route handler con `revalidate: 300` que devuelva conteos y top-5 ya
resueltos. Renderiza el número real en el HTML, quita el salto de layout y saca las credenciales de
GRADEO del bundle.

### P-05 · MEDIO · El mapa incrustado es un tercero en la carga inicial

`GradeoBento.tsx:76-83` tiene `loading="lazy"` —correcto— pero está cerca del viewport inicial.
**Corrección:** captura estática por defecto, iframe sólo al interactuar.

### P-06 · MEDIO · `next.config.ts` está vacío

Sin cabeceras de caché ni de seguridad. **Corrección:** cabeceras de seguridad básicas y política de
caché explícita para estáticos.

---

## 6. Accesibilidad

Dimensión más baja y más rápida de arreglar. En todo el código fuente hay **cero** atributos
`aria-label`, `aria-pressed`, `aria-live` o `title`.

### A-01 · CRÍTICO · El documento se declara en inglés mientras muestra español

```
src/app/layout.tsx:36              <html lang="en" ...>
src/store/useLanguageStore.ts:10   language: 'es'   ← por defecto
```

Un lector de pantalla aplicará pronunciación inglesa a texto español. **Corrección:** idioma en cookie,
leído en el layout de servidor, `<html lang={lang}>`.

### A-02 · CRÍTICO · Cuatro enlaces de sólo icono sin nombre accesible

`page.tsx:63, 71, 186, 194`. Incumple WCAG 2.4.4 y 4.1.2. **Corrección:**
`aria-label="LinkedIn (abre en una pestaña nueva)"` y equivalente en cada uno.

### A-03 · ALTO · Sin respeto por `prefers-reduced-motion`

Nueve animaciones infinitas (`animate-pulse`, `animate-ping`, `animate-bounce`), transformaciones
ligadas al scroll, un bucle 3D y un efecto de máquina de escribir, sin vía de desactivación.
WCAG 2.3.3. **Corrección:** `useReducedMotion` de Framer Motion y variantes `motion-safe:` de Tailwind.

### A-04 · ALTO · Contraste insuficiente en 17 usos de texto

Ratios sobre `bg-zinc-950` (#09090B); AA exige 4,5:1 para texto normal.

```
text-zinc-400  →  7,76:1   correcto
text-zinc-500  →  4,12:1   insuficiente   · 15 usos
text-zinc-600  →  2,57:1   muy por debajo ·  2 usos
                            page.tsx:88 (indicador de scroll)
                            GradeoBento.tsx:166 (aviso del Developer Mode)
Colores de acento (emerald, blue, yellow, green, red): todos correctos
```

**Corrección:** texto informativo a `zinc-400`; `zinc-500` sólo para elementos decorativos no
textuales. El aviso del Developer Mode es el peor caso: es una instrucción y es lo más difícil de leer
de la página.

### A-05 · MEDIO · Iframe sin `title`

`GradeoBento.tsx:76`. **Corrección:** `title="Mapa del campus USAT, Chiclayo"`. WCAG 4.1.2.

### A-06 · MEDIO · Los dos switches no comunican su estado

`ModeSwitcher.tsx:17`, `LanguageSwitcher.tsx:15`. Ambos son `<button>` sin `aria-pressed`; el de idioma
sólo contiene «ES» o «EN». **Corrección:** `aria-pressed` en el de modo; `aria-label="Cambiar a inglés"`
y `lang` en las etiquetas del de idioma.

### A-07 · MEDIO · El scrollytelling es invisible para lectores de pantalla

`page.tsx:128-155` intercambia título y descripción con `AnimatePresence` sin región activa que lo
anuncie. Toda la explicación arquitectónica no llega, y no hay alternativa por teclado.
**Corrección:** `aria-live="polite"` en el contenedor y los 4 pasos también como lista estática
accesible (puede ir en `sr-only`).

---

## 7. Código, SEO y distribución

### D-01 · ALTO · ESLint: 2 errores y 9 avisos

```
errores
  DeveloperOverlay.tsx:83  react-hooks/purity  Math.random en render
  DeveloperOverlay.tsx:15  prefer-const        'timeout' nunca se reasigna
avisos (imports y variables sin usar)
  GradeoCaseStudy.tsx:11,13   DialogClose, X
  DeveloperOverlay.tsx:7      Maximize2
  ModeSwitcher.tsx:4          motion
  LanguageSwitcher.tsx:4,7    motion, cn
  GradeoBento.tsx:13          lang
```

**Corrección:** dejarlo en cero y añadir `lint` como paso de CI.

### D-02 · MEDIO · Tres `dangerouslySetInnerHTML` para cadenas traducidas

`page.tsx:57`, `GradeoBento.tsx:166`, `GradeoCaseStudy.tsx:56`. Con traducciones estáticas no es una vía
de XSS, pero es innecesario y dificulta que las traducciones dejen de ser estáticas más adelante.
**Corrección:** dividir las cadenas en partes tipadas y componer con JSX.

### S-01 · ALTO · Compartir el enlace no genera tarjeta visual

`layout.tsx:20-28` tiene `openGraph` con título y descripción, pero sin `metadataBase` ni `images`. En
LinkedIn o WhatsApp aparece como texto plano. **Corrección:** `metadataBase` e imagen OG generada con
`next/og`, una por idioma.

### S-02 · ALTO · Metadatos sólo en inglés en un sitio que abre en español

Sin `alternates.languages`. **Corrección:** `generateMetadata` según la cookie de idioma y hreflang.

### S-03 · MEDIO · Sin sitemap, robots, analítica ni páginas de error propias

Faltan `sitemap.ts`, `robots.ts`, analítica, y `error.tsx` / `loading.tsx` / `not-found.tsx`.

### Nota aparte, no es del portafolio

El linter de Supabase reporta **27 avisos en GRADEO**: `pg_trgm` instalada en el schema `public`, 14
políticas RLS con `WITH CHECK (true)` en INSERT (varias intencionales para el flujo anónimo, pero
`reviews` tiene tres políticas de inserción solapadas que conviene consolidar), funciones
`SECURITY DEFINER` ejecutables por `anon`, y la protección contra contraseñas filtradas desactivada en
Auth.

No afecta a la puntuación de esta auditoría, pero si vas a presentar GRADEO como muestra de
arquitectura, conviene resolverlo antes de que alguien lo revise. Y una vez resuelto, «encontré y
corregí 27 hallazgos del linter de mi base de datos» es material de entrevista.

---

## 8. Plan de implementación

Seis fases ordenadas por retorno sobre esfuerzo, no por dificultad. Las dos primeras suman unas 9 horas
y son las que cambian si el sitio consigue una entrevista. Cada fase es entregable por separado y deja
el sitio en un estado desplegable.

| Fase | Objetivo | Esfuerzo | Resuelve |
|---|---|---:|---|
| F0 | Credibilidad | 2–3 h | C-01…C-05, D-01 |
| F1 | Conversión | 4–6 h | U-01…U-07 |
| F2 | Rendimiento | 5–7 h | P-01…P-06, C-07 |
| F3 | Accesibilidad | 3–4 h | A-01…A-07 |
| F4 | Contenido: GRADEO V2 y proyectos | 6–8 h | U-04, U-08, U-09, C-04 |
| F5 | Distribución | 2–3 h | S-01…S-03, D-02 |
| | **Total** | **22–31 h** | |

### F0 · Credibilidad — 2–3 h, primero

Lo más barato y lo que más riesgo elimina. Mientras el sitio muestre código inventado, todo lo demás se
apoya en algo frágil.

- Sustituir el snippet ponderado por la lógica real de `update_professor_metrics()`: media de 4 ejes,
  sólo reseñas aprobadas, 10 decimales para ordenar y 1 para pintar.
- HUD con FPS reales vía `requestAnimationFrame` y memoria vía `performance.memory`; si no hay dato,
  mostrar `n/d` en lugar de inventarlo.
- Unificar el título profesional en las tres cadenas de `i18n.ts`.
- `.env.example`, validación de entorno con error legible, `name` real en `package.json`, README con la
  versión correcta de Next y sección de configuración.
- ESLint a cero.

**Aceptación:** `npx eslint .` sin salida; ningún dato simulado presentado como medición;
`git clone && npm i && npm run dev` funciona siguiendo sólo el README.

### F1 · Conversión — 4–6 h

Aquí el sitio pasa de demo a herramienta. Ninguna mejora de rendimiento importa si quien se convence no
encuentra cómo escribirte.

- GitHub en hero y footer, con `aria-label`, por delante de Instagram.
- Sección de contacto: email visible, `mailto:`, botón de copiar, línea de disponibilidad concreta.
- Botones «Ver en vivo» y «Código» en GRADEO, arriba y al cierre del case study.
- CV en PDF (ES y EN) con botón de descarga.
- Nav sticky con anclas y enlace de salto al contenido.
- `persist` en ambos stores, más cookie de idioma para el `lang` del servidor.

**Aceptación:** desde cualquier punto del sitio, contactar o ver el código está a dos clics o menos;
recargar conserva idioma y modo.

### F2 · Rendimiento — 5–7 h

Un portafolio que se presenta como «alto rendimiento» y envía 547 KB de JavaScript se contradice solo.

- `HeroCanvas` con `next/dynamic` (`ssr: false`), montaje condicionado a visibilidad y a
  `prefers-reduced-motion`, `dpr` limitado, loop pausado fuera del viewport, degradado CSS de fallback.
- Quitar `Environment preset` o alojar el HDRI en `/public`.
- Umbralizar el `setState` del scroll: de ~60 renders/s a 4 en todo el recorrido.
- Estadísticas por route handler con `revalidate: 300`; retirar el cliente de Supabase del bundle.
- Mapa como imagen estática con iframe bajo demanda.
- Cabeceras de seguridad y caché en `next.config.ts`.

**Aceptación:** JS de cliente inicial por debajo de 200 KB comprimidos (desde 547); cero peticiones a
terceros en la carga inicial; sin salto de layout en las tarjetas de métricas.

### F3 · Accesibilidad — 3–4 h

El mayor salto de puntuación por hora invertida: casi todo son atributos y una decisión de color.

- `<html lang>` dinámico desde la cookie de F1.
- `aria-label` en los cuatro enlaces sociales; `title` en el iframe; `aria-pressed` en los switches.
- `useReducedMotion` y variantes `motion-safe:` en las nueve animaciones infinitas.
- Texto informativo de `zinc-500`/`600` a `zinc-400`.
- `aria-live="polite"` en el scrollytelling y los cuatro pasos como lista accesible.
- Estado de foco visible propio sobre fondo oscuro.

**Aceptación:** cero violaciones de axe-core; Lighthouse de accesibilidad ≥ 95; sitio recorrible
completo sólo con teclado.

### F4 · Contenido: GRADEO V2 y proyectos — 6–8 h

La fase de mayor techo. No añade tecnología: hace visible el trabajo ya hecho.

- Reescribir el case study alrededor del conflicto real: aceptar reseñas anónimas y aun así frenar el
  abuso — hash de IP en lugar de IP, cola de moderación, roles con PIN y bloqueo por intentos.
- Elevar la búsqueda con `pg_trgm` a hallazgo destacado, con el razonamiento sobre planner e índice.
- Segundo acto de GRADEO: la suite de estudio (notas por bloques, horarios, notas del semestre,
  pomodoro), los enlaces compartibles con expiración y la IA con cuota por usuario y mes.
- Mencionar el motor de crecimiento: lista de espera con referidos y captación de anunciantes.
- Nueva sección «Proyectos» con FARMAPLUS: SUNAT, lotes y vencimientos, arqueo de caja, auditoría.
  Tarjeta con problema, stack, rol, métrica y enlaces.
- Reemplazar la celda muerta del bento y corregir los dos iconos que contradicen su paso.

**Aceptación:** cada afirmación técnica del sitio es verificable contra el repositorio o el esquema;
FARMAPLUS presente con enlaces; añadir un proyecto nuevo no exige rediseñar nada.

### F5 · Distribución — 2–3 h

- `metadataBase` e imagen OG con `next/og`, una por idioma.
- `generateMetadata` por idioma y alternativas hreflang.
- `sitemap.ts`, `robots.ts`, analítica.
- `error.tsx`, `loading.tsx` y `not-found.tsx` con la identidad del sitio.
- Retirar los `dangerouslySetInnerHTML` a favor de composición tipada.

**Aceptación:** la tarjeta previsualiza correctamente en LinkedIn y WhatsApp en ambos idiomas; los
metadatos coinciden con el idioma que verá el visitante.

---

## 9. Cómo se midió

Todo lo cuantitativo es reproducible sobre el commit `bfa9f3b`:

- **Bundle** — `next build` con Turbopack; tamaños por `gzip -c` sobre `.next/static/chunks`. La
  identificación de three.js se confirmó buscando símbolos de la librería en el chunk de 1 225,8 KB.
- **HDRI remoto** — rastreado desde `Environment preset="city"` hasta
  `presetsObj.city = 'potsdamer_platz_1k.hdr'` y la constante `CUBEMAP_ROOT` en
  `node_modules/@react-three/drei/core/useEnvironment.js:8`.
- **Contraste** — luminancia relativa y ratios según WCAG 2.1 sobre los valores de la paleta zinc de
  Tailwind, contra `bg-zinc-950` y `bg-zinc-900`.
- **Lint** — `npx eslint .` con la configuración del proyecto.
- **ARIA, animaciones, persistencia** — recuento directo sobre `src/`.
- **GRADEO y FARMAPLUS** — inspección de esquema en Postgres 17 vía Supabase (sólo lectura): tablas,
  columnas, claves, enums, definiciones de funciones y linter de la plataforma. No se modificó nada.

Los conteos de datos (919 profesores, 85 reseñas, 86 registros de log, 16 notas) son del 29 de julio de
2026 y cambiarán. La afirmación de «más de 900 profesores» que ya está en el sitio es correcta.

---

## 10. Resultados medidos tras la implementación

Mismo método que la sección 9, sobre el árbol ya modificado.

### Rendimiento

| Medición | Antes | Después |
|---|---:|---:|
| JS de primera visita | 547,0 KB gz | **197,5 KB gz** (−64 %) |
| three.js en la carga inicial | 333,5 KB gz | **0** (chunk aparte, sólo si se monta la escena) |
| Framer Motion en la carga inicial | ~100 KB gz | **0** (sólo con la secuencia de scroll o el modo desarrollador) |
| Base UI en la carga inicial | 34 KB gz | **0** (se pide al abrir el case study) |
| Supabase en el bundle del navegador | presente | **ausente** (sólo servidor) |
| Peticiones a terceros en la carga inicial | 2 | **0** |
| CSS de primera visita | — | 12,6 KB gz |

El JS diferido suma 264 KB gz, y sólo se descarga cuando corresponde: la escena 3D
únicamente en pantallas anchas sin movimiento reducido ni ahorro de datos, y el
diálogo del case study al pulsarlo.

### Accesibilidad

| Medición | Antes | Después |
|---|---:|---:|
| Violaciones axe-core (WCAG 2.1 A/AA) | no medido | **0** |
| — en modo reclutador | | 0 |
| — en modo desarrollador | | 0 |
| — con el case study abierto | | 0 |
| Atributos ARIA y `title` en `src/` | 0 | **17** |
| `<html lang>` frente al idioma real | `en` con UI en español | **`es-PE`, desde cookie** |
| Archivos con soporte de movimiento reducido | 0 | **9** |
| Usos de texto por debajo de AA | 17 | **0** |
| Primer elemento enfocable | primer enlace social | **«Saltar al contenido»** |

### Credibilidad y código

| Medición | Antes | Después |
|---|---:|---:|
| Problemas de ESLint | 2 errores, 9 avisos | **0** |
| Errores de TypeScript | 0 | 0 |
| `Math.random()` presentado como medición | 3 | **0** (FPS y heap reales) |
| Código ficticio (`isVerified`) | 1 | **0** (se muestra el trigger real) |
| Títulos profesionales distintos | 3 | **1** |
| Cifras incrustadas a mano en la copia | 6 | **0** (marcadores rellenados con el recuento real) |
| `dangerouslySetInnerHTML` | 3 | **0** |
| Componentes sin usar | 3 | **0** |

### Conversión y distribución

| Medición | Antes | Después |
|---|---:|---:|
| Enlaces a GitHub | 0 | 4 |
| Vías de contacto | 0 | correo visible, `mailto:` y copiar |
| CV descargable | no | 2 PDF (ES / EN) |
| Enlaces a los proyectos | 0 | GRADEO y FARMAPLUS |
| Proyectos presentados | 1 | 2 |
| Navegación | ninguna | barra fija con 4 anclas |
| Idioma y modo tras recargar | se perdían | persisten |
| Imagen Open Graph | ninguna | generada por idioma con `next/og` |
| `sitemap.xml` / `robots.txt` | no | sí |

### Dos fallos preexistentes encontrados al implementar

Ninguno estaba en el diagnóstico original; aparecieron al revisar el resultado en
el navegador.

1. **El sitio nunca se renderizó con Geist.** `globals.css` declaraba
   `--font-sans: var(--font-sans)`, una referencia circular, y las variables de
   fuente estaban en `<body>` mientras `font-sans` se aplicaba a `<html>`, donde
   todavía no existen. El resultado era Times New Roman en todo el sitio. Se
   corrigieron las dos cosas.
2. **`live: true` sin comprobar el error.** `supabase-js` no lanza ante un fallo de
   red: devuelve `{ count: null, error }`. La primera versión del código nuevo
   habría anunciado «en vivo desde producción» mostrando guiones. Ahora se
   comprueba `error` y el estado se deriva de que haya datos.

### Lo que queda pendiente y depende de ti

Todo está centralizado en `src/lib/site.ts`, marcado con `REVISAR`:

- **Dominio definitivo** (`SITE_URL`). Hasta que se defina, las URL absolutas de
  Open Graph y el sitemap apuntan a un dominio de ejemplo.
- **Nombres reales de los repositorios** de GRADEO y FARMAPLUS.
- **URL de producción** de ambos. Mientras sean `null`, el botón «Ver en vivo» no
  se renderiza en lugar de enlazar a algo roto.
- **Correo público.** Está puesto el de tu cuenta; decide si es el que quieres en
  un portafolio dirigido a reclutadores.
- **Los PDF del CV** se generaron a partir de los datos que ya estaban en el
  repositorio. Revísalos antes de usarlos en una candidatura.

Nada de eso rompe el sitio: todo degrada a un estado correcto.

### Nota sobre la verificación de datos en vivo

El entorno donde se implementó esto bloquea las salidas a `*.supabase.co` (el proxy
responde 403), así que la ruta HTTP a las métricas en vivo no se pudo ejercitar
aquí. Sí se validó la semántica de las consultas contra la base directamente:
919 profesores, 82 reseñas aprobadas de 85 totales —lo que confirma que la cola de
moderación está en uso— y 24 profesores con valoración. El comportamiento sin
conexión se comprobó y es el previsto: «más de 900» en la copia y «—» en las
tarjetas, sin errores en la consola del visitante.
