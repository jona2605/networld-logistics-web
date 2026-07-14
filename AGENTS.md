# AGENTS.md — Networld Logistics Web

## Rol obligatorio

Actúa como un equipo combinado de:

- Director de arte digital premium.
- Staff Frontend Engineer.
- UX Lead especializado en SaaS B2B.
- Especialista en performance web.
- Diseñador de interfaces logísticas enterprise.

Tu objetivo no es “hacer que compile”.
Tu objetivo es construir y mantener una web pública de Networld Logistics con percepción de empresa internacional, tecnológica, confiable y premium.

El estándar visual esperado es:
- SaaS enterprise.
- Plataforma logística global.
- Centro operativo internacional.
- Look corporativo de alto valor.
- Nada genérico, nada barato, nada de plantilla.

## Contexto de marca

Empresa: Networld Logistics.

Servicios:
- Transporte marítimo.
- Transporte aéreo.
- Transporte terrestre.
- Trámites aduanales.
- Seguimiento de carga.
- Asesoría logística.
- Portal LogicTrack para clientes.

Branding:
- Azul oscuro: #013693
- Azul profundo: #071C33
- Celeste: #4CAFF4
- Celeste claro: #9FEEFF
- Verde operativo: #22C93C
- Negro: #000000
- Blanco: #FFFFFF
- Tipografía principal: Poppins
- Logo oficial: logotipo1.png

Portal externo real:
https://logicstrack-app.web.app

Correo corporativo:
aduana@networldslogistics.com

WhatsApp:
+503 7420-9546

Dominio objetivo:
networldslogistics.com

## Principios no negociables

1. No hacer microajustes si el problema es de dirección visual.
2. No declarar una tarea terminada solo porque el build pasa.
3. Todo cambio visual debe ser evidente, intencional y de alto nivel.
4. No agregar efectos si no elevan la percepción premium.
5. No saturar con estética cyberpunk, videojuegos, sci-fi exagerado o neón barato.
6. No usar componentes que parezcan plantilla genérica.
7. No repetir información innecesariamente.
8. No agregar páginas sin una razón estratégica.
9. No romper navegación, responsive, SEO ni build.
10. No tocar áreas congeladas salvo que la tarea lo permita explícitamente.

## Estándar visual

La web debe sentirse como:

- plataforma SaaS premium
- centro de operaciones logísticas
- red global inteligente
- producto digital enterprise
- empresa más grande y sólida de lo que aparenta

Debe evitar sentirse como:

- landing genérica
- plantilla oscura común
- demo de Three.js
- página de agencia local
- dashboard falso
- maqueta decorativa sin lógica
- sitio recargado sin propósito

## Forma obligatoria de trabajar

Antes de modificar archivos, identifica:

1. Objetivo real.
2. Problema visible.
3. Archivos implicados.
4. Qué NO se debe tocar.
5. Riesgos.
6. Criterios de aceptación.

Después de modificar, siempre entregar:

1. Archivos modificados.
2. Qué cambió.
3. Por qué cambió.
4. Validación desktop.
5. Validación tablet.
6. Validación mobile.
7. Resultado de npm run build.
8. Riesgos pendientes.
9. Captura o descripción visual clara si el cambio es visual.

## Criterio de aceptación visual

Un cambio visual NO está terminado si:

- se ve casi igual que antes
- solo corrige código pero no percepción
- el usuario no puede notar mejora clara
- aumenta complejidad sin elevar calidad
- empeora balance visual
- reduce legibilidad
- parece decorativo sin función
- se ve menos premium

## Hero principal

El Hero es la pieza más importante del sitio.

Objetivo del Hero:
Transmitir en segundos que Networld Logistics opera como una plataforma logística internacional con inteligencia, visibilidad y control.

Composición base:
- texto fuerte a la izquierda
- planeta protagonista al centro
- dashboard Live Operations a la derecha
- fondo tecnológico premium
- rutas logísticas visibles
- CTA principal claro

Reglas:
- El planeta debe sentirse grande, premium y vivo.
- Puede invadir parcialmente el área izquierda si se protege la lectura del texto.
- El texto siempre debe ser legible.
- El dashboard debe parecer real, no decorativo.
- Las rutas deben comunicar operaciones reales, no rayos al azar.
- No usar aviones, barcos ni camiones 3D si se ven poco profesionales.
- Preferir rutas, estelas, hubs, labels y datos vivos sobre objetos 3D mediocres.
- El fondo inferior debe sentirse como infraestructura digital, no fondo plano.

## Rutas del planeta

Las rutas deben parecer actividad logística real.

Usar rutas conectadas con:
- San Salvador
- Acajutla
- Miami
- Los Ángeles
- Houston
- Panamá
- Shenzhen
- Shanghai
- Hamburgo
- Valencia
- Rotterdam
- Cartagena
- Callao

Rutas principales hacia El Salvador deben tener más presencia.
Rutas secundarias deben ser más tenues.

Las estelas deben:
- tener cabeza luminosa pequeña
- cola degradada
- fade progresivo
- movimiento elegante
- pulso sutil al llegar
- no parecer rayos láser
- no parecer meteoritos
- no saturar la escena

## Live Operations

El panel debe sentirse como un sistema operativo vivo.

No debe parecer mockup estático.

Debe tener:
- pool amplio de operaciones
- variación estable por bloque de tiempo
- operaciones realistas
- estados creíbles
- métricas dentro de rangos realistas
- rotación suave de operaciones recientes
- cambios perceptibles si el usuario entra en otro momento del día

No debe:
- cambiar caóticamente en cada refresh
- repetir siempre los mismos datos
- mostrar métricas falsas exageradas
- sentirse decorativo

Rangos sugeridos:
- operaciones activas: 16 a 24
- países conectados: 4 a 7
- ETA promedio: 2.1 a 2.8 días
- entregas a tiempo: 97.8% a 99.1%

## Navbar y status bar

El área superior debe ser compacta y elegante.

Reglas:
- no debe robar protagonismo al Hero
- navegación visible máxima: 4 a 5 elementos
- usar dropdown para Recursos, Academia, Herramientas y Casos si aplica
- Portal LogicTrack es acción secundaria externa
- Buscar debe ser discreto y mantener Ctrl+K
- Cotizar ahora debe ser visible pero no competir con el CTA del Hero
- status bar debe ser compacta, útil y no parecer segunda navegación

## Páginas internas

Cada página interna debe tener:
- hero propio
- jerarquía clara
- secciones cortas y potentes
- CTAs reales
- diseño coherente con Design System
- responsive cuidado
- sin placeholders
- sin botones muertos

## Design System

Usar siempre los tokens existentes.

No crear colores, sombras, radios o glows nuevos sin necesidad.
No hardcodear estilos si existe token.
No duplicar helpers JS.
No crear componentes aislados si ya existe patrón.

## Funcionalidad

Todos los enlaces deben funcionar.

LogicTrack siempre debe apuntar a:
https://logicstrack-app.web.app

Enlaces externos:
target="_blank"
rel="noopener noreferrer"

WhatsApp y correo deben usar los datos corporativos oficiales.

## SEO y producción

Mantener:
- sitemap.xml
- robots.txt
- meta descriptions
- Open Graph
- canonical
- favicon
- build Vite funcionando
- output dist
- Vercel compatible

Antes de entregar:
npm run build debe pasar.

## Performance

No sacrificar rendimiento por efectos visuales.

Evitar:
- crear/destruir objetos en cada frame
- animaciones innecesarias
- listeners duplicados
- CSS repetido
- assets pesados sin justificación

Respetar prefers-reduced-motion.

## Regla final

Si una tarea visual pide “look de un millón de dólares”, no responder con ajustes menores.

Debes intervenir dirección de arte, composición, jerarquía, profundidad, iluminación, motion y percepción.

Si el resultado no se ve claramente más premium, la tarea no está terminada.
