# Pruebas de aceptación (Gherkin)

Un archivo `.feature` por historia de usuario (US01 a US39), en español (`# language: es`).
Los escenarios son los criterios de aceptación de la sección 3.2 del informe.

- US04, US09 y US13 incluyen además tablas de `Ejemplos` con los mensajes y umbrales reales de
  `evaluar.js`, `risk.js` y `verificar.js`. Las mismas reglas se comprueban con `npm test`.
- Las historias marcadas "Por diseñar" en el informe tienen sus criterios aquí, aunque todavía no
  estén implementadas.

Si cambia un criterio en el informe, actualiza también su `.feature`.
