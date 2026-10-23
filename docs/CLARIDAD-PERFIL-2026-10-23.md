# Perfil profesional y solicitud de código

Revisión solicitada por Giancarlo el 23 de octubre de 2026, posterior a la
publicación del CV bilingüe.

## Decisiones

- La presentación web dice «Desarrollador de software» / «Software developer».
  Se retiraron «estudiante» y la universidad del perfil de la página. Los PDFs
  no se modificaron: la formación académica sigue dentro del CV.
- No había «junior», «aprendiendo a desarrollar» o equivalentes como título
  actual. Se mantienen la experiencia histórica de prácticas y Docker básico:
  son hechos concretos, no etiquetas del nivel profesional actual.
- GRADEO conserva sus referencias a estudiantes como público del producto;
  no describen al autor. FARMAPLUS conserva el estado beta/no desplegado.
- Se retiró la simulación genérica de consultas: no guardaba ni enviaba nada.
  GRADEO y FARMAPLUS son la evidencia principal; no se necesita una demo ficticia.
  Componente, traducciones y pruebas exclusivas de esa demo se eliminaron; son
  recuperables en el historial Git, sin pérdida de datos de usuarios.

## Solicitar código

Antes era un `mailto:` directo. Ese protocolo depende de una aplicación o
manejador de correo del visitante; sin configuración puede abrir una pestaña
vacía o no ofrecer una respuesta visible. No era un enlace a un repositorio,
no enviaba una solicitud y no concedía acceso.

Ahora el control abre un desplegable nativo dentro de la misma página:

1. Explica que el código no es público y se coordina una revisión técnica.
2. Muestra el correo seleccionable y un botón para copiarlo con confirmación.
3. Si falla el portapapeles, indica cómo copiar la dirección manualmente.
4. «Redactar correo» / «Compose email» es opcional, sin `target=_blank`, con
   asunto y cuerpo preparados para el proyecto correcto. Explica que necesita
   una aplicación de correo. Nada se envía automáticamente.

Sin JavaScript se pueden abrir el desplegable y el enlace de correo; la
dirección permanece visible y seleccionable. La copia automática requiere
JavaScript y permiso del navegador. No se añadieron servicios, seguimiento,
formularios de envío ni acceso público al código.

Impeccable guio la claridad de etiquetas y el uso de divulgación progresiva,
conservando tipografía, tema y componentes existentes. Las pruebas cubren ES/EN,
proyecto correcto, apertura/cierre, enlace de correo, copia, fallo de permisos,
enlaces públicos y accesibilidad estructural (sin certificación WCAG).

## Verificación local

`npm run check` completado: lint, TypeScript, 6 archivos / 38 pruebas y build
de producción correctos. Brave: apertura/cierre nativos, teclado Enter, copia
real con confirmación y traducción del desplegable abierto. A 320 px se comprobó
ausencia de desbordamiento (305 px útiles) y control de solicitud de 44 px de alto.
No se pulsó «Redactar correo» para evitar abrir aplicaciones o enviar mensajes
durante la prueba; destinatario, asunto y cuerpo se verificaron en el enlace.
