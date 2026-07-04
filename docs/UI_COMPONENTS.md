# Networld Logistics UI Components

Los componentes reutilizables viven en `css/design-system.css`. Las paginas actuales conservan sus clases existentes, pero el sistema ya mapea esas clases a primitivas reutilizables para evitar cambios visuales.

## Shell

Clase: `.ui-shell`

Uso: contenedor max-width `1280px`, centrado y con z-index de contenido.

Equivalentes actuales:

- `.services-page-shell`
- `.about-shell`
- `.resources-shell`
- `.portal-shell`
- `.contact-shell`

## Botones

Clases:

- `.ui-button`
- `.ui-button--primary`
- `.ui-button--secondary`

Equivalentes actuales:

- `.primary-action`
- `.secondary-action`
- `.nav-cta`

Estados:

- Hover: elevacion sutil, glow controlado.
- Focus: outline celeste visible.
- Active: mantener color de marca, no deformar layout.

## Cards

Clases:

- `.ui-card`
- `.ui-panel`

Equivalentes actuales:

- `.service-page-card`
- `.article-card`
- `.calculator-card`
- `.metric-card`
- `.info-grid article`
- `.about-command`
- `.intel-panel`
- `.operations-panel`
- `.portal-access-panel`

Reglas:

- Usar `--radius-page` para paneles grandes.
- Usar `--radius-card` para cards compactas.
- Usar `--shadow-panel` en estado normal.
- Usar `--shadow-premium` + `--glow-blue` en hover.

## Inputs

Clase: `.ui-input`

Equivalentes actuales:

- `.smart-form input`
- `.smart-form select`
- `.smart-form textarea`
- `.resource-search input`

Estados:

- Focus con borde celeste y sombra suave.
- No usar fondos blancos.
- Labels en celeste claro o verde operativo.

## Etiquetas y Badges

Clases:

- `.ui-tag`
- `.ui-badge`

Equivalentes actuales:

- `.service-page-status`
- `.article-meta span`
- `.article-meta small`
- `.guide-stack strong`
- `.calculator-card > span`

Uso:

- Categorias.
- Estados operativos.
- Chips informativos.
- Indicadores de disponibilidad.

## Timeline

Componente conceptual para:

- `.services-timeline`
- `.client-timeline`
- `.growth-timeline`
- `.case-timeline`

Reglas:

- Linea con gradiente celeste a verde.
- Nodos pequenos.
- Animacion suave solo cuando aporta contexto.
- En mobile debe pasar a estructura vertical o cards apiladas.

## Contadores

Clase: `.ui-counter`

Helpers:

- `animateNumber`
- `initPageMotion`

Uso actual:

- Recursos: `data-resource-count`
- Nosotros: `data-about-count`
- Contacto: `data-contact-count`

Reglas:

- Animar una sola vez.
- No usar valores exagerados.
- Mantener legibilidad sobre fondo oscuro.

## Dashboard Widgets

Componente conceptual para:

- Hero dashboard.
- Paneles laterales de paginas internas.
- LogicTrack access panel.
- Operations Center.

Reglas:

- Cabecera con nodo verde activo.
- Readouts en filas o celdas.
- Bordes finos.
- Grid o radar sutil.
- No saturar con demasiadas lineas.

## CTA

Componente conceptual para:

- `.services-final-card`
- `.about-final-card`
- `.resources-final-card`
- `.portal-final-card`
- `.contact-final-card`

Reglas:

- Titulo grande.
- Texto breve.
- Uno o dos botones maximo.
- Glow interno muy sutil.
- Fondo consistente con panel premium.

## JS Compartido

Archivo: `js/reveal.js`

Helpers:

- `observeReveal`
- `bindPointerGlow`
- `animateNumber`
- `initPageMotion`

Buenas practicas:

- No duplicar reveal por pagina.
- No duplicar counters por pagina.
- Usar `initPageMotion` para nuevas paginas internas.
- Mantener scripts especificos solo para interacciones propias como filtros, formularios o accordions.
