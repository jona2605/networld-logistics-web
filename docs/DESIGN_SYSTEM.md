# Networld Logistics Design System

Este documento define la base visual oficial del sitio publico de Networld Logistics. La fuente tecnica de verdad es `css/design-system.css`.

## Objetivo Visual

El sitio debe sentirse como una plataforma SaaS premium de logistica internacional: oscuro, preciso, tecnologico, confiable y cercano. La interfaz debe comunicar centro operativo, inteligencia logistica, visibilidad y acompanamiento experto.

## Paleta Oficial

- Azul oscuro: `#013693` (`--primary`)
- Azul profundo: `#071C33` (`--primary-dark`)
- Celeste: `#4CAFF4` (`--primary-light`)
- Celeste claro: `#9FEEFF` (`--cyan-soft`)
- Verde operativo: `#22C93C` (`--accent`)
- Negro: `#000000` (`--black`)
- Blanco: `#FFFFFF` (`--white`)

## Texto

- Texto principal: `--text`
- Texto secundario: `--text-soft`
- Texto auxiliar: `--text-muted`
- Texto dentro de tarjetas: `--text-card`

La tipografia oficial es `Poppins`. Usar pesos altos para titulares y pesos medios para textos operativos.

## Escala Tipografica

- Hero page title: `--title-page`
- Section title: `--title-section`
- Card title: `--title-card`
- Body destacado: `--text-body`
- Body normal: `--text-base`
- Labels y badges: `--text-xs`, `--text-sm`

## Espaciado

Usar los tokens `--space-1` a `--space-12` para separacion interna. Para secciones usar:

- Desktop: `--page-section-pad`
- Mobile: `--page-section-pad-mobile`
- Landing principal: `--section-pad`

## Radios

- Contenedores grandes: `--radius`
- Paneles premium: `--radius-page`
- Paneles internos: `--radius-panel`
- Cards compactas: `--radius-card`
- Pills, badges y CTAs redondos: `--radius-chip`

## Sombras y Glow

- Paneles: `--shadow-panel`
- Cards premium: `--shadow-premium`
- Glow azul: `--glow-blue`
- Glow verde: `--glow-green`
- Nodos verdes: `--glow-dot`
- Nodos celestes: `--glow-cyan-dot`

El glow debe ser sutil. Evitar efectos cyberpunk exagerados.

## Bordes

- Borde principal: `--border-cyan`
- Borde suave: `--border-cyan-soft`
- Hover: `--border-cyan-hover`
- Estados activos: `--border-green`

## Motion

Animaciones permitidas:

- Reveal vertical suave.
- Hover con elevacion maxima de 2 a 4 px.
- Pulso leve en nodos operativos.
- Particulas o puntos sutiles en mapas/paneles.
- Contadores numericos al entrar en viewport.

Usar:

- Rapido: `--transition-fast`
- Medio: `--transition-med`
- Reveal: `--transition-reveal`
- Curva premium: `--ease-premium`

Respetar `prefers-reduced-motion`.

## Estados

### Hover

Debe mejorar profundidad: borde mas visible, glow suave, pequena elevacion. No cambiar layout.

### Focus

Usar `:focus-visible` con outline celeste. Todo link, boton, input, select y textarea debe ser navegable.

### Active

Usar verde operativo y fondo suave. No usar colores fuera de marca.

## Buenas Practicas

- No crear estilos aislados si existe un token.
- No usar valores hardcodeados para colores, sombras, radios o transiciones.
- No duplicar helpers JS de reveal, counters o pointer glow.
- No modificar el Hero 3D durante polish o design system.
- Mantener CSS modular por pagina, pero depender de `design-system.css`.
- Los componentes nuevos deben mapearse primero al sistema antes de crear reglas especificas.
