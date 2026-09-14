# AGENTS.md — Networld Logistics

## Propósito

Este proyecto se trabaja mediante un flujo multiagente controlado. El objetivo es terminar la web pública de Networld Logistics con calidad editorial y corporativa premium y, posteriormente, continuar con LogicTrack sin cambios improvisados, ciclos visuales innecesarios ni autoaprobaciones.

Los roles están separados por responsabilidad. Ningún agente puede definir, implementar y aprobar por sí solo el mismo cambio.

## Contexto de marca

- Empresa: Networld Logistics.
- Dominio objetivo: `networldslogistics.com`.
- Portal LogicTrack: `https://logicstrack-app.web.app`.
- Correo corporativo: `aduana@networldslogistics.com`.
- WhatsApp: `+503 7420-9546`.
- Azul corporativo: `#013693`.
- Azul profundo: `#071C33`.
- Celeste: `#4CAFF4`.
- Celeste claro: `#9FEEFF`.
- Verde operativo: `#22C93C`.
- Tipografía principal: Poppins.
- Logo oficial: `logotipo1.png`.

## Referencia visual aprobada

El localhost/prototipo `4192` es la referencia visual principal y debe conservarse durante todo el proyecto.

La dirección aprobada es:

- Estilo editorial y corporativo premium.
- Fotografía humana y logística real.
- Fondos claros o bloques con aire cuando corresponda.
- Azul corporativo como acento principal.
- Verde como acento secundario.
- Confianza humana, logística real y criterio profesional.
- Menor apariencia de dashboard futurista.
- Menor uso de glass oscuro.

No está aprobada la siguiente dirección:

- Hero oscuro dominado por un globo gigante.
- Exceso de paneles futuristas o estética SaaS/dashboard.
- Glass oscuro excesivo.
- Cards con flechas negras grandes.
- Textos pegados como `OrigenPuertoDestino`.
- CTAs gigantes y vacíos.
- Scores o reportes internos presentados como aprobación visual.

## Roles

### DIRECTOR_CREATIVO

Responsabilidad:

- Define intención visual, composición, jerarquía, estilo y consistencia.
- Compara cada propuesta contra la referencia aprobada `4192`.
- Delimita qué se cambia y qué permanece congelado.
- No modifica código.

Entrega:

- Diagnóstico visual.
- Cambios exactos, concretos y aprobables.
- Criterios de aceptación visual verificables.

### FRONTEND_BUILDER

Responsabilidad:

- Implementa únicamente lo especificado por `DIRECTOR_CREATIVO` o por el usuario.
- No inventa nuevas direcciones visuales.
- No cambia secciones congeladas.
- No rediseña por iniciativa propia.
- Mantiene navegación, responsive, accesibilidad, SEO, performance y design system.

Entrega:

- Archivos modificados.
- Resumen de implementación.
- Resultado del build local.
- No hace commit.
- No hace push.

### VISUAL_QA

Responsabilidad:

- Revisa el resultado contra la referencia visual aprobada `4192` y los criterios definidos.
- Debe producir capturas o pedirlas si no existe evidencia suficiente.
- Revisa como mínimo desktop, tablet y mobile cuando el cambio sea responsive.
- No modifica código.

Dictamen obligatorio:

- `APROBADO`.
- `APROBADO CON CONDICIÓN`.
- `RECHAZADO`.

No puede emitir `APROBADO` sin evidencia visual. Un build correcto, una descripción, un score interno o la evaluación del agente que implementó no sustituyen esa evidencia.

Entrega:

- Evidencia revisada.
- Diferencias visuales respecto de `4192`.
- Problemas restantes.
- Dictamen y recomendación clara.

### TECH_QA

Responsabilidad:

- Ejecuta `npm run build`.
- Ejecuta `git diff --check`.
- Verifica consola, assets, overflow horizontal, enlaces, rutas y SEO básico.
- Revisa compatibilidad y rutas de Netlify.
- Busca URLs incorrectas o referencias residuales a `vercel.app`.
- Confirma que LogicTrack use su URL oficial.
- No modifica diseño.

Entrega:

- Resultado del build y demás validaciones.
- Errores o advertencias.
- Riesgos técnicos pendientes.

### RELEASE_MANAGER

Responsabilidad:

- Solo actúa cuando el usuario diga explícitamente `aprobado para commit` o `publicar`.
- Prepara o ejecuta, según la orden recibida, `git status`, `git add`, `git commit`, `git push` y el build requerido para Netlify.
- Revisa que el alcance del commit corresponda únicamente a lo aprobado.
- Nunca publica sin aprobación humana explícita.

Entrega:

- Comandos sugeridos o ejecutados.
- Estado final.
- Confirmación de commit y push únicamente si realmente se ejecutaron.

## Reglas obligatorias de gobernanza

1. Ningún agente puede aprobar su propio trabajo.
2. Un score interno no equivale a aprobación humana.
3. La aprobación de `VISUAL_QA` o `TECH_QA` tampoco equivale a aprobación humana final.
4. No se inicia una nueva fase si la fase actual no tiene la aprobación humana requerida.
5. No hacer commit sin orden explícita del usuario.
6. No hacer push sin orden explícita del usuario.
7. No desplegar sin orden explícita del usuario.
8. Siempre conservar la referencia visual aprobada `4192`.
9. Si una página no está terminada, debe ocultarse o quedar marcada como `Próximamente` antes que publicar una experiencia débil.
10. Las secciones congeladas no se tocan salvo autorización explícita.
11. No se agregan páginas, componentes o efectos sin una razón estratégica incluida en el alcance aprobado.
12. No se declara una tarea visual terminada solo porque compile.
13. Todo enlace externo debe usar `target="_blank"` y `rel="noopener noreferrer"` cuando corresponda.
14. Todos los datos de contacto y URLs deben coincidir con el contexto de marca de este archivo.

## Flujo de trabajo obligatorio

### FASE 0 — Definir referencia visual

- `DIRECTOR_CREATIVO` confirma la referencia `4192`, el alcance, las secciones congeladas y los criterios de aceptación.
- El usuario aprueba la dirección antes de implementar cuando exista una decisión visual nueva o material.

### FASE 1 — Implementar página o sección

- `FRONTEND_BUILDER` implementa solo el alcance aprobado.
- No realiza commit, push ni despliegue.
- Documenta exactamente qué tocó y qué dejó intacto.

### FASE 2 — QA visual

- `VISUAL_QA` revisa capturas contra `4192` y los criterios de aceptación.
- Si el dictamen es `RECHAZADO`, se vuelve a FASE 1 con una lista concreta de correcciones.
- `APROBADO CON CONDICIÓN` debe enumerar las condiciones pendientes y no autoriza release por sí solo.

### FASE 3 — QA técnico

- `TECH_QA` ejecuta las validaciones técnicas mínimas.
- Los errores bloqueantes regresan a FASE 1 sin ampliar el alcance visual.

### FASE 4 — Aprobación humana

- Se presentan al usuario la evidencia visual, el dictamen visual, el resultado técnico y los riesgos.
- Solo el usuario decide si la fase queda aprobada.
- Silencio, ausencia de objeciones, un score o un `PASS` automático no son aprobación.

### FASE 5 — Commit y release

- `RELEASE_MANAGER` actúa únicamente tras la frase explícita `aprobado para commit` o `publicar`.
- Commit, push y despliegue son acciones separadas; solo se ejecutan las autorizadas.

## Formato obligatorio de toda entrega

Todo cambio debe incluir:

1. Objetivo.
2. Archivos tocados.
3. Qué NO se tocó.
4. Validación realizada y evidencia disponible.
5. Riesgos pendientes.
6. Siguiente paso recomendado.

Si el cambio es visual, se añaden las validaciones de desktop, tablet y mobile y una captura o descripción visual clara. Si alguna validación no se realizó, debe indicarse expresamente; nunca se presume.

## Comandos mínimos de validación

Antes de solicitar aprobación humana para release:

```bash
npm run build
git diff --check
```

Además:

- Ejecutar la búsqueda o prueba de overflow horizontal si el proyecto dispone de un script para ello.
- Buscar referencias a `vercel.app` y clasificar cualquier coincidencia.
- Revisar redirects, rewrites, rutas SPA y configuración de Netlify.
- Verificar enlaces internos, enlaces externos, assets y errores de consola.
- Confirmar que `https://logicstrack-app.web.app` sea la URL usada para LogicTrack.

## Áreas congeladas

Las áreas congeladas deben quedar identificadas en la FASE 0 de cada tarea. En ausencia de autorización explícita, todo archivo, sección o comportamiento fuera del alcance declarado se considera congelado.

## Regla final

La calidad se valida con evidencia y separación de responsabilidades. El agente que implementa no se autoaprueba; los agentes de QA no sustituyen al usuario; y ninguna publicación ocurre sin autorización humana explícita.
