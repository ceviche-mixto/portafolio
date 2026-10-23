# Revisión del portafolio — 9 de octubre de 2026

## Resultado

Portafolio preparado para presentar el perfil y los proyectos con mayor claridad,
conservando el diseño oscuro, los acentos verdes y la escena 3D existentes.
Los cambios están preparados localmente; no se han publicado ni enviado postulaciones.

## Base preservada

La carpeta original estaba limpia, pero en el commit `bfa9f3b`, anterior a las
mejoras de la web. Se partió de `main` de GitHub (`6bf98d5`), conservando las
correcciones previas de rendimiento, mapa y ventana técnica.

## Cambios

- Título general: «Desarrollador de software». Se retiraron «junior» y la
  ubicación personal de la presentación y los metadatos. El mapa del campus
  permanece como contexto del proyecto GRADEO, no como ubicación personal.
- GRADEO está identificado como publicado, con enlace a su demo comprobada.
  FARMAPLUS queda explícitamente como beta aún no desplegada, incluida la
  facturación electrónica en desarrollo.
- Perfil y herramientas alineados con el CV entregado y lo confirmado en el
  chat: Python, Postman y Docker básico. No se añadieron niveles avanzados nuevos.
- Descarga enlazada al CV entregado en septiembre, sin modificar el PDF. Se
  verificó que tiene una página. La interfaz inglesa indica que el PDF está en
  español, en lugar de entregar la antigua traducción desactualizada.
- Correo profesional alineado con ese CV; copiar correo muestra éxito o fallo.
  Las solicitudes de código abren un correo preparado, sin enviarlo.
- Menú móvil con sus cuatro secciones visibles y controles de al menos 44 px.
  Cuadrícula de competencias adaptable, sin alturas rígidas que recorten texto.
- Los cuatro pasos de GRADEO se muestran como una lista en móvil o con movimiento
  reducido. La secuencia animada se conserva en escritorio.
- Panel de rendimiento plegable, fuera del título; se eliminó el estado de red
  fijo que no procedía de una medición.
- Caché explícita de cinco minutos para las consultas públicas de GRADEO y
  mensajes claros cuando no hay datos o falla la conexión.
- Contenido de presentación visible desde el HTML inicial, sin depender de las
  animaciones para poder leerlo.
- Dominio canónico confirmado y ejemplo de configuración sin credenciales.

## Verificación

- `npm run check`: revisión de código, tipos y compilación correctos.
- Compilación final de producción correcta después del último ajuste visual.
- Vista previa de producción comprobada en Brave, con anchos CSS de 320, 768 y
  1280 px, sin desbordamiento horizontal del documento.
- Comprobados: navegación, estados de los proyectos, cambio español/inglés,
  confirmación al copiar correo y apertura/cierre de la ventana técnica.
  Escape cierra la ventana y devuelve el foco al botón que la abrió.
- Modo desarrollador: panel inicialmente plegado; apertura y cierre correctos,
  con métricas medidas, no números añadidos manualmente.
- La revisión automática de Impeccable detectó dos degradados de texto y un
  rebote decorativo. Se retiró el rebote. Los degradados se conservaron como
  parte del diseño previo, no como un nuevo lenguaje visual.

## Dependencias y límites

Se actualizó Next.js a 16.4.0 y se retiró el generador `shadcn` de las dependencias
de ejecución. Las variantes necesarias de Base UI se mantienen en el CSS.

`npm audit --omit=dev`: **cero vulnerabilidades notificadas en dependencias de
producción** al realizar esta revisión. Esto no equivale a una auditoría completa
de seguridad del producto.

Quedan **cinco avisos de severidad alta en dependencias de desarrollo**, en la
cadena de ESLint de Next.js (`braces`/`micromatch`/`fast-glob`). No se aplicó la
corrección forzada que propone cambiar a una versión incompatible del conjunto
de herramientas. Revisar de nuevo cuando exista una actualización compatible.

La copia local del CV contiene teléfono y ciudad. Antes de publicar ese nuevo
archivo, decidir si se mantiene ese contacto o se prepara una versión pública
con menos información personal. La web pública no ha sido alterada en esta revisión.
