# Networld Approved Homepage

Esta carpeta es la copia de trabajo editable de la dirección visual aprobada en el prototipo `4190`. La organización de archivos cambió para facilitar el mantenimiento, pero el render y el comportamiento siguen siendo idénticos a la referencia.

## Estructura

```text
networld-approved-homepage/
├─ index.html
├─ css/
│  ├─ base.css
│  ├─ layout.css
│  ├─ components.css
│  ├─ sections.css
│  └─ responsive.css
├─ js/
│  ├─ main.js
│  ├─ services.js
│  ├─ interactions.js
│  └─ logictrack-preview.js
├─ assets/
├─ README.md
└─ design-qa.md
```

## Responsabilidades

- `index.html`: estructura semántica y contenido de la página.
- `css/base.css`: variables de marca, reset y tipografía global.
- `css/layout.css`: contenedores, secciones y primitivas de layout.
- `css/components.css`: botones, etiquetas, navegación y componentes reutilizables.
- `css/sections.css`: estilos específicos de todas las secciones de la homepage.
- `css/responsive.css`: breakpoints de tablet, mobile y reducción de movimiento.
- `js/main.js`: preparación del contenido y evidencia operativa de la página.
- `js/services.js`: tabs e imágenes de servicios.
- `js/interactions.js`: menú móvil, escenarios e interacciones de entrada.
- `js/logictrack-preview.js`: interacción accesible de la maqueta representativa de LogicsTrack; su diseño visual debe sincronizarse con la aplicación real antes de producción.
- `assets/`: fotografías, logotipo y recursos visuales.
- `design-qa.md`: evidencia de paridad visual y técnica.

## Ejecutar localmente

Desde esta carpeta:

```powershell
npm run dev -- --host 127.0.0.1 --port 4192 --strictPort
```

La vista persistente está disponible en `http://127.0.0.1:4192/`.

Esta copia no sustituye la página de producción ni modifica el prototipo congelado de `4190`.

## Hero aprobado y congelado

El hero actualmente servido en `4192` tiene aprobación humana y es la fuente visual vigente. No debe modificarse sin una solicitud explícita del usuario.

Elementos congelados:

- layout y relación con el header;
- tratamiento, composición y recorte del globo;
- secuencia de introducción;
- panel de evidencia operacional;
- headline y supporting copy;
- estructura de CTAs;
- transición editorial inferior;
- comportamiento responsive.

## Services aprobado y congelado

La sección “Seis disciplinas. Una operación.” actualmente servida en `4192` tiene aprobación humana y no debe modificarse sin una solicitud explícita del usuario.

Elementos congelados:

- composición fotografía + lista editorial;
- orden de las seis disciplinas;
- estrategia de contenido basada en decisión, riesgo, información y conexión operativa;
- copy de los seis estados;
- fotografías asignadas;
- interacción seleccionada y navegación por teclado;
- jerarquía, contraste contextual y ritmo de titulares;
- comportamiento responsive.

## Process aprobado y congelado

La sección “Seis hitos. Cero puntos ciegos.” actualmente servida en `4192` tiene aprobación humana y no debe modificarse sin una solicitud explícita del usuario.

Elementos congelados:

- seis hitos y orden operativo;
- fotografía documental y lenguaje visual oscuro;
- activación por hover, focus, click/tap y teclado;
- rail dinámico de decisión, validación, evidencia y riesgo;
- copy operacional de los seis estados;
- bloque de inteligencia aduanal y sus advertencias regulatorias;
- transición rápida y comportamiento de movimiento reducido;
- jerarquía del hito activo y comportamiento responsive.

## LogicsTrack — APPROVED IN CONCEPT / PENDING REAL APP VISUAL SYNC

La estructura narrativa y funcional de la sección LogicsTrack está aprobada en concepto, pero su interfaz visual todavía no es una representación final del portal real. La maqueta actualmente servida en `4192` es temporal y representativa; no debe interpretarse como una reproducción exacta de datos o pantallas de clientes.

**Official public product name: LogicsTrack. All future homepage and application references must preserve this exact naming.**

Se preservan como dirección aprobada:

- estructura general de la sección;
- copy y posicionamiento de LogicsTrack como capa de visibilidad;
- interacciones entre resumen, documentos, alertas y mensajes;
- ubicación y destinos de los CTAs;
- relación entre evidencia tecnológica, coordinación humana y responsabilidad operativa;
- composición general de product showcase.

Nota obligatoria de implementación: antes de publicar en producción, reemplazar o adaptar la maqueta actual utilizando el diseño visual final de la aplicación real de LogicsTrack. El sitio público no debe presentar una interfaz que difiera materialmente del portal que utilizan los clientes.

Objetivo futuro:

1. mejorar y aprobar la interfaz real de LogicsTrack;
2. sincronizar después esta sección pública con el diseño final de la aplicación;
3. conservar durante esa sincronización la estructura de storytelling de producto ya aprobada aquí.

LogicsTrack no está congelado visualmente. Cualquier trabajo futuro debe limitarse a la sincronización con la aplicación real, salvo aprobación explícita para cambiar la dirección conceptual.
