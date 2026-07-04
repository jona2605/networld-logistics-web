# Hero Roadmap - Networld Logistics

## Objetivo visual del Hero

Convertir el Hero en una escena premium de logistica internacional: una plataforma tecnologica global, oscura, precisa y sofisticada, con un planeta 3D como centro operativo, rutas logisticas con profundidad cinematografica, vehiculos low-poly elegantes y un dashboard en tiempo real que refuerce la sensacion de control, trazabilidad y eficiencia.

La direccion visual debe sentirse cercana a Apple, Stripe, Linear o SpaceX: limpia, con jerarquia clara, animaciones sutiles, brillo controlado, profundidad real y una composicion que transmita confianza empresarial.

## Elementos del Hero

- Navbar premium con logo actual de Networld Logistics.
- Texto principal fuerte a la izquierda.
- Botones de accion principales.
- Tarjetas de confianza debajo del copy.
- Globo 3D central con rotacion continua.
- Atmofera, glow y profundidad alrededor del planeta.
- Hubs logisticos reales sobre ciudades y puertos.
- Rutas logisticas aereas, maritimas y regionales.
- Particulas luminosas viajando por rutas seleccionadas.
- Aviones low-poly siguiendo rutas aereas.
- Barcos portacontenedores low-poly siguiendo rutas maritimas.
- Dashboard Live Operations a la derecha.
- Mini graficas dentro del dashboard.
- Fondo dark navy con particulas y sensacion tecnologica.

## Elementos ya terminados

- Layout general aprobado: texto izquierda, planeta centro, dashboard derecha.
- Navbar, botones, copy principal y dashboard base.
- Logo actual en `img/logotipo1.png`.
- Estructura modular CSS y JS.
- Escena Three.js inicial funcionando.
- Planeta 3D con rotacion continua.
- Luces base de la escena.
- Rutas, hubs, particulas, aviones y barcos ya implementados en una primera version.
- Dashboard con operaciones recientes.
- Mejoras recientes en:
  - transicion del headline,
  - mini graficas del dashboard,
  - glow ambiental del planeta.
- Dependencias instaladas:
  - `three`,
  - `postprocessing`,
  - `gsap`,
  - `@react-three/postprocessing`.

## Elementos que faltan

- Asegurar textura local premium del planeta para no depender de una URL externa.
- Refinar materiales del planeta: tierra, oceanos, nubes, luces nocturnas y atmosfera.
- Ordenar `js/routes.js`, que actualmente concentra demasiadas responsabilidades.
- Separar logicamente:
  - hubs,
  - rutas,
  - particulas,
  - vehiculos,
  - sincronizacion visual.
- Mejorar profundidad de rutas en capas sin saturar la escena.
- Ajustar escala final de aviones y barcos.
- Mejorar orientacion de vehiculos segun tangente de ruta.
- Reducir ruido visual en hubs, rutas y puntos luminosos.
- Medir rendimiento real y mantener la escena ligera.
- Definir un sistema estable de estados para el dashboard si se sincroniza con rutas.
- Validar responsive sin romper la composicion aprobada.

## Orden de implementacion

1. Congelar layout y superficies protegidas.
   - No modificar navbar, textos, botones, dashboard ni estructura HTML salvo aprobacion explicita.

2. Estabilizar assets criticos.
   - Usar textura local del planeta.
   - Evitar fallbacks visuales de baja calidad.
   - Confirmar que la escena se vea igual sin depender de red externa.

3. Modularizar la escena 3D con cambios controlados.
   - Mantener comportamiento actual.
   - Separar responsabilidades sin redisenar la experiencia.
   - Evitar cambios visuales grandes durante la modularizacion.

4. Refinar planeta y atmosfera.
   - Mejorar materiales, contraste, nubes, luces nocturnas y glow.
   - Mantener tamano y posicion aprobados.

5. Refinar rutas logisticas.
   - Clasificar rutas por intensidad.
   - Ajustar opacidad, grosor, altura y cantidad de particulas.
   - Mantener una red organica, no uniforme.

6. Refinar vehiculos.
   - Mejorar aviones low-poly.
   - Mejorar barcos portacontenedores low-poly.
   - Asegurar orientacion correcta y movimiento elegante.

7. Refinar hubs y pulsos.
   - Diferenciar puertos, aeropuertos y centros logisticos.
   - Ajustar brillo y escala para no saturar.

8. Integrar sincronizacion visual con dashboard solo si se aprueba.
   - Cambiar estados de operaciones de manera sutil.
   - Evitar que el dashboard distraiga de la escena.

9. Optimizar rendimiento.
   - Reducir geometria innecesaria.
   - Limitar particulas visibles.
   - Revisar materiales, sombras y pixel ratio.

10. Validacion final.
    - Revisar consola.
    - Verificar 1366x768.
    - Verificar responsive.
    - Comparar antes/despues visualmente.
    - Revertir cualquier cambio que empeore la composicion.
