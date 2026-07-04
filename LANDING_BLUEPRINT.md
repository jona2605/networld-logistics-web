# LANDING BLUEPRINT - NETWORLD LOGISTICS

## Objetivo maestro

Construir una landing premium para Networld Logistics que comunique tecnologia, control operativo e inteligencia logistica internacional. La experiencia debe sentirse como una continuidad del Hero: oscura, precisa, elegante, con sensacion de centro de operaciones global y con foco claro en conversion.

La landing no debe parecer una coleccion de secciones aisladas. Cada bloque debe avanzar una narrativa:

1. Networld entiende la complejidad logistica.
2. Networld controla los modos de transporte y procesos criticos.
3. Networld opera con visibilidad, datos y acompanamiento.
4. Networld convierte incertidumbre en operaciones claras.

---

## 1. Orden final de la landing

1. Hero
2. Servicios
3. Como trabajamos
4. Cobertura mundial
5. Diferenciadores
6. Industrias
7. KPIs / Control Center
8. Casos de uso
9. Preguntas frecuentes
10. CTA final
11. Footer

---

## 2. Arquitectura por seccion

### 1. Hero

**Objetivo de conversion**  
Capturar atencion inmediata y llevar al usuario a cotizar o planificar una operacion.

**Que debe transmitir**  
Empresa tecnologica, logistica internacional, visibilidad global, control en tiempo real y confianza.

**Estructura visual**  
Texto fuerte a la izquierda, planeta 3D al centro, dashboard operativo a la derecha, acciones principales y senales de confianza.

**Componentes necesarios**  
Navbar, HeroCopy, HeroActions, TrustRow, ThreeScene, LiveDashboard.

**Animaciones**  
Rotacion continua del planeta, rutas logisticas, hubs, vehiculos 3D, metricas con sensacion live.

**Responsive**  
Debe conservar jerarquia: primero mensaje, luego visual 3D, luego dashboard.

**Archivos que tocara**  
Actualmente congelado. Solo tocar si el usuario lo autoriza explicitamente.

**Que NO debe modificar**  
Navbar, copy principal, dashboard, layout, posicion/tamano del planeta, branding.

---

### 2. Servicios

**Objetivo de conversion**  
Explicar rapidamente que resuelve Networld y dirigir al usuario a una consulta especifica.

**Que debe transmitir**  
Capacidad integral: maritimo, aereo, terrestre, aduanas, seguimiento y asesoria como una sola operacion conectada.

**Estructura visual**  
Seccion premium tipo command center, no una grilla comun. Bloques asimetricos, indicadores activos, iconos minimalistas y CTAs discretos.

**Componentes necesarios**  
SectionHeader, ServiceUnit, ActivityIndicator, ServiceIcon, CTAButton discreto.

**Animaciones**  
Aparicion al hacer scroll, hover con glow suave, micro movimiento de iconos, indicador de actividad.

**Responsive**  
En desktop puede usar composicion editorial/asimetrica. En mobile debe convertirse en lectura vertical clara, sin perder jerarquia.

**Archivos que tocara**  
`index.html`, `css/services.css`, `js/services.js`, `css/styles.css`, `js/main.js`.

**Que NO debe modificar**  
Hero, Navbar, Dashboard, escena Three.js, tipografia global, colores del branding.

---

### 3. Como trabajamos

**Objetivo de conversion**  
Reducir incertidumbre explicando el proceso de operacion de forma clara y premium.

**Que debe transmitir**  
Metodo, control, acompanamiento y orden de principio a fin.

**Estructura visual**  
Timeline horizontal/vertical con pasos conectados, parecido a un flujo operativo de torre de control.

**Componentes necesarios**  
SectionHeader, TimelineStep, StatusPill, RouteBadge, CTAButton secundario.

**Animaciones**  
Linea de progreso sutil al hacer scroll, pasos que se activan uno por uno, pequenos pulsos de estado.

**Responsive**  
Desktop: timeline con lectura amplia. Mobile: timeline vertical, pasos compactos y sin desbordes.

**Archivos que tocara**  
Nuevo CSS modular de seccion, nuevo JS si se requiere animacion de scroll, `index.html` para markup de la seccion.

**Que NO debe modificar**  
Hero, Servicios, Navbar, Dashboard, escena 3D.

---

### 4. Cobertura mundial

**Objetivo de conversion**  
Demostrar alcance internacional y capacidad real para conectar origenes y destinos clave.

**Que debe transmitir**  
Red global, corredores logisticos, presencia en Asia, Europa, Norteamerica, Centroamerica y Sudamerica.

**Estructura visual**  
Mapa/globo secundario o panel de rutas estilizado, con regiones, hubs y badges de corredores.

**Componentes necesarios**  
SectionHeader, RouteBadge, GlowCard, RegionList, HubMarker visual.

**Animaciones**  
Rutas que aparecen lentamente, badges activos, puntos con pulso suave.

**Responsive**  
Desktop: visual amplio con datos laterales. Mobile: regiones en tabs o lista compacta.

**Archivos que tocara**  
CSS modular de cobertura, JS si hay tabs o activacion por scroll, `index.html`.

**Que NO debe modificar**  
Hero Three.js, sistema de rutas del Hero, Servicios.

---

### 5. Diferenciadores

**Objetivo de conversion**  
Explicar por que elegir Networld frente a un operador logistico tradicional.

**Que debe transmitir**  
Tecnologia, transparencia, velocidad de respuesta, criterio experto y control documental.

**Estructura visual**  
FeatureGrid premium con tarjetas compactas, iconografia minimalista y datos de apoyo.

**Componentes necesarios**  
SectionHeader, FeatureGrid, GlowCard, StatusPill.

**Animaciones**  
Hover con elevacion minima, borde luminoso, aparicion escalonada.

**Responsive**  
Grid adaptable de 3 columnas a 1 columna.

**Archivos que tocara**  
CSS modular de diferenciadores, `index.html`, JS solo si se necesita reveal.

**Que NO debe modificar**  
Hero, Servicios, Como trabajamos.

---

### 6. Industrias

**Objetivo de conversion**  
Mostrar que Networld entiende distintos tipos de carga y necesidades por industria.

**Que debe transmitir**  
Especializacion sin saturar; experiencia en rubros que requieren control y cumplimiento.

**Estructura visual**  
Panel editorial con industrias en filas, chips o tabs, no tarjetas genericas pesadas.

**Componentes necesarios**  
SectionHeader, IndustryRow, StatusPill, FeatureGrid ligero.

**Animaciones**  
Hover con detalle expandible, transicion suave entre categorias.

**Responsive**  
Lista vertical clara en mobile.

**Archivos que tocara**  
CSS modular de industrias, JS si hay tabs, `index.html`.

**Que NO debe modificar**  
Secciones previas congeladas.

---

### 7. KPIs / Control Center

**Objetivo de conversion**  
Reforzar sensacion de plataforma operativa y capacidad de seguimiento en tiempo real.

**Que debe transmitir**  
Datos, visibilidad, rendimiento, operaciones vivas.

**Estructura visual**  
Dashboard extendido con MetricCards, estados, pequenas graficas y panel de actividad.

**Componentes necesarios**  
MetricCard, StatusPill, ActivityFeed, MiniChart, GlowCard.

**Animaciones**  
Contadores, mini graficas, actividad que cambia de forma sutil.

**Responsive**  
Metricas compactas en mobile, sin tablas anchas.

**Archivos que tocara**  
CSS modular de KPIs, JS para contadores o estados, `index.html`.

**Que NO debe modificar**  
Dashboard del Hero, excepto si el usuario aprueba sincronizacion futura.

---

### 8. Casos de uso

**Objetivo de conversion**  
Ayudar al visitante a reconocerse en escenarios concretos y avanzar a contacto.

**Que debe transmitir**  
Networld resuelve problemas reales: importaciones urgentes, consolidacion, aduanas, multimodal, trazabilidad.

**Estructura visual**  
Casos tipo workflow, con problema, accion Networld y resultado esperado.

**Componentes necesarios**  
GlowCard, RouteBadge, TimelineStep, CTAButton discreto.

**Animaciones**  
Cambio de caso por tabs o seleccion, transiciones suaves.

**Responsive**  
Casos apilados o selector compacto.

**Archivos que tocara**  
CSS modular de casos, JS si hay tabs, `index.html`.

**Que NO debe modificar**  
Secciones anteriores congeladas.

---

### 9. Preguntas frecuentes

**Objetivo de conversion**  
Eliminar fricciones antes del contacto.

**Que debe transmitir**  
Claridad, transparencia y dominio operativo.

**Estructura visual**  
Accordion premium, sobrio, con respuestas cortas y utiles.

**Componentes necesarios**  
FAQItem, StatusPill opcional, CTAButton secundario.

**Animaciones**  
Expand/collapse suave, indicador de apertura.

**Responsive**  
Una columna, lectura rapida.

**Archivos que tocara**  
CSS modular de FAQ, JS para accordion, `index.html`.

**Que NO debe modificar**  
Secciones congeladas.

---

### 10. CTA final

**Objetivo de conversion**  
Cerrar la pagina con una accion clara: cotizar o hablar con un especialista.

**Que debe transmitir**  
Confianza, urgencia moderada y acompanamiento humano.

**Estructura visual**  
Bloque inmersivo con fondo oscuro, glow controlado, frase fuerte y dos acciones.

**Componentes necesarios**  
SectionHeader compacto, CTAButton principal, CTAButton secundario, StatusPill.

**Animaciones**  
Glow respirando muy suave, botones con hover premium.

**Responsive**  
Texto centrado o alineado segun flujo, botones apilados en mobile.

**Archivos que tocara**  
CSS modular de CTA final, `index.html`.

**Que NO debe modificar**  
Hero ni CTAs existentes.

---

### 11. Footer

**Objetivo de conversion**  
Dar cierre institucional, accesos rapidos y canales de contacto.

**Que debe transmitir**  
Empresa seria, localizable y lista para operar.

**Estructura visual**  
Footer oscuro con logo, enlaces, contacto, redes o canales y linea legal.

**Componentes necesarios**  
FooterBrand, FooterLinks, ContactBlock, CTAButton pequeno.

**Animaciones**  
Hover sutil en enlaces, sin efectos pesados.

**Responsive**  
Columnas que se apilan con buen espaciado.

**Archivos que tocara**  
CSS modular de footer, `index.html`.

**Que NO debe modificar**  
Navbar ni estructura de secciones previas.

---

## 3. Sistema visual global

### Colores

- Azul oscuro: `#013693`
- Verde: `#22C93C`
- Celeste: `#4CAFF4`
- Celeste claro: `#9FEEFF`
- Negro: `#000000`
- Blanco: `#FFFFFF`

Uso recomendado:

- Fondo principal: negro/navy profundo.
- Acciones primarias: verde.
- Estados vivos: verde.
- Datos, rutas y bordes activos: celeste y celeste claro.
- Texto principal: blanco.
- Texto secundario: blanco con opacidad controlada.

### Tipografia

- Mantener la tipografia actual.
- Titulares grandes, pesados y claros.
- Texto secundario con buena lectura, sin exceso de parrafos.
- No introducir nuevas familias tipograficas sin aprobacion.

### Espaciados

- Secciones amplias, con aire premium.
- Desktop: bloques con max-width consistente.
- Mobile: reducir altura visual sin comprimir contenido.
- Evitar secciones pegadas o saltos bruscos entre fondos.

### Bordes

- Bordes finos con opacidad baja.
- Radio sobrio, preferiblemente entre 8px y 18px segun componente.
- No usar tarjetas excesivamente redondeadas.

### Sombras

- Sombras oscuras y profundas.
- Evitar sombras claras tradicionales.
- Usar sombras para profundidad, no decoracion exagerada.

### Glow

- Glow azul/celeste para tecnologia.
- Glow verde para actividad/estado.
- Siempre sutil; evitar estetica cyberpunk exagerada.

### Estilo de tarjetas

- Tarjetas tipo panel operativo.
- Fondos oscuros con borde tenue.
- Brillo contextual solo en hover o estado activo.
- Evitar grillas genericas sin narrativa.

### Microinteracciones

- Hover con movimiento minimo.
- Indicadores activos con pulso suave.
- Aparicion al scroll, sin animaciones agresivas.
- Transiciones cortas y fluidas.

---

## 4. Componentes reutilizables

### SectionHeader

Encabezado de seccion con eyebrow, titulo y descripcion breve. Debe permitir alineacion izquierda o centrada segun la narrativa.

### GlowCard

Panel premium con borde tenue, fondo oscuro y glow contextual en hover. Base para servicios, diferenciadores, casos e industrias.

### MetricCard

Tarjeta compacta de metrica con numero, etiqueta, estado y posible mini grafica.

### TimelineStep

Paso de proceso con numero/estado, titulo, descripcion y conexion visual hacia el siguiente paso.

### RouteBadge

Badge para rutas, origen/destino, tipo de transporte o corredor logistico.

### CTAButton

Boton principal o secundario consistente con el Hero. Debe mantener jerarquia clara y accesibilidad.

### StatusPill

Indicador pequeno de estado: En curso, En transito, En preparacion, En proceso, Activo, Monitoreado.

### FeatureGrid

Sistema flexible para listar beneficios o capacidades sin caer en tarjetas genericas repetitivas.

---

## 5. Reglas de trabajo

1. Trabajar una seccion por vez.
2. Validar visualmente antes de avanzar.
3. No tocar secciones congeladas.
4. No rehacer lo que ya funciona.
5. No cambiar branding, colores ni tipografia sin aprobacion.
6. No modificar Hero salvo orden explicita.
7. No modificar Servicios salvo orden explicita.
8. Mantener CSS modular por seccion.
9. Mantener JS modular por funcionalidad.
10. Evitar dependencias nuevas si no son necesarias.
11. Si algo rompe el layout, revertir esa parte antes de continuar.
12. Cada cambio debe mejorar conversion, claridad o calidad visual.
13. Validar en desktop antes de entregar.
14. Revisar responsive antes de cerrar fases grandes.

---

## 6. Sprints

### Sprint 1: corregir Servicios para que se vea igual en preview y navegador real

Objetivo: asegurar que la seccion Servicios cargue, se anime y se visualice igual en el navegador real y en la validacion automatizada.

Estado esperado: Servicios estable, sin diferencias entre preview y navegador, sin dependencia accidental de la escena 3D.

### Sprint 2: construir Como trabajamos

Objetivo: crear una seccion de proceso premium que explique el flujo operativo de Networld Logistics.

Entregable: timeline/flujo visual con pasos claros, animacion sutil y CTA discreto.

### Sprint 3: construir Cobertura mundial

Objetivo: mostrar alcance internacional, hubs y corredores logisticos reales.

Entregable: seccion visual de cobertura con regiones, rutas y badges logisticos.

### Sprint 4: construir Diferenciadores

Objetivo: explicar por que Networld es una alternativa mas tecnologica, clara y confiable.

Entregable: FeatureGrid premium con beneficios concretos y microinteracciones.

### Sprint 5: responsive y optimizacion

Objetivo: revisar consistencia completa de la landing en desktop, tablet y mobile.

Entregable: ajustes finales de responsive, rendimiento, accesibilidad visual y limpieza de consola.
