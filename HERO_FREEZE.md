# Hero Freeze - Networld Logistics

## Estado

El layout actual del Hero queda congelado como base aprobada.

Este documento protege la composicion existente antes de avanzar con mejoras visuales, assets o escena 3D.

## Superficies protegidas

No modificar sin aprobacion explicita:

- `index.html`
- Navbar
- Logo
- Texto principal
- Botones
- Tarjetas inferiores de confianza
- Dashboard Live Operations
- Posicion general del planeta
- Tamano general del planeta
- Composicion desktop aprobada
- Tipografia
- Colores de marca

## Archivos protegidos por defecto

- `index.html`
- `css/layout.css`
- `css/navbar.css`
- `css/hero.css`
- `css/dashboard.css`
- `css/responsive.css`

Estos archivos solo deben tocarse si el cambio solicitado afecta directamente una superficie protegida y el usuario lo aprueba.

## Archivos de trabajo preferidos para siguientes fases

- `js/scene.js`
- `js/earth.js`
- `js/routes.js`
- `js/lights.js`
- assets locales relacionados con la escena 3D

## Regla de implementacion

Cada cambio futuro debe cumplir:

1. Mantener la composicion actual.
2. No mover texto, dashboard ni navbar.
3. No agrandar ni desplazar el planeta sin aprobacion.
4. No introducir efectos que compitan con el mensaje principal.
5. Validar consola y captura visual despues de cada bloque.

## Checklist visual antes de aprobar cambios

- Navbar visible y alineado.
- Texto principal legible.
- Botones sin solaparse.
- Dashboard completo y sin cortes.
- Planeta dentro de su posicion aprobada.
- Hero sin scroll vertical inesperado en 1366x768.
- Sin errores en consola.
