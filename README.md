# InvestCheck — revisa antes de invertir

Plataforma educativa que ayuda a personas sin formación financiera avanzada a evaluar el riesgo de una oportunidad de inversión antes de comprometer su dinero. No es un bróker ni recomienda productos: su valor es la claridad.

Curso **1ASI0385 – IHC y Tecnologías Móviles** (NRC 6373, ciclo 2026-10) · Universidad Peruana de Ciencias Aplicadas.

## Equipo

- Aguirre Gereda, Dylan José
- Llamocca Pachas, Amir Efraín
- Orellana Gutiérrez, Daniel Esteban
- Rada Orellana, Fernando Julián
- Rojas Camán, Christopher

## Componentes del proyecto

| Componente | Descripción |
|---|---|
| Design system | Tokens (`tokens.css` / `tokens.json`), marca, fuentes e íconos según las Style Guidelines |
| Landing Page | Sitio web responsivo (mobile-first) |
| Web app | Evaluación de ofertas por pasos, resultado de riesgo y lecciones |
| App móvil | Android (Material Design 3) como plataforma principal |
| Documentación | Informes del trabajo final (TB) |

## Sitio web

Sitio estático (HTML, CSS y JavaScript, sin dependencias ni paso de compilación).

| Página | Qué hace |
|---|---|
| `index.html` | Landing Page: hero, problema, cómo funciona, ejemplo de resultado, señales, FAQ |
| `evaluar.html` | Evaluación en 4 pasos, resultado de riesgo con 6 señales e historial local |
| `aprende.html` | 8 lecciones con progreso y quiz de autoevaluación |
| `senales.html` | Las 6 señales: qué son, por qué importan y qué hacer |
| `verificar.html` | Cómo verificar al emisor en SMV, SBS y SUNAT, y revisor de formato de RUC |
| `nosotros.html` | Misión, visión, valores, hallazgos de entrevistas y equipo |

```
assets/css/   tokens.css · base.css · components.css
assets/js/    main.js · risk.js · evaluar.js · verificar.js · aprende.js
assets/img/   isotipo, logotipo y favicon en SVG
tokens.json   mismos tokens que tokens.css, para Figma y las apps
tests/        pruebas con node:test
```

**Probar en local:** `npm start` y abrir http://localhost:8000. **Pruebas:** `npm test` (Node 20 o superior).

**Publicar en GitHub Pages:** Settings → Pages → *Deploy from a branch* → rama `main`, carpeta `/ (root)`. El sitio usa rutas relativas, así que funciona bajo `/Investcheck/`.

Notas para el equipo:

- El header y el footer están repetidos en cada `.html`. Si cambias un enlace de navegación, cámbialo en las seis páginas.
- Los datos del usuario (borrador, historial, avance de lecciones) viven solo en `localStorage`; no hay servidor.
- Tipografías e íconos se cargan desde Google Fonts (Plus Jakarta Sans, Inter y Material Symbols Rounded).
- `risk.js` define cómo se calcula el nivel de riesgo. Si se cambian los umbrales, actualizar también `senales.html` y `nosotros.html`.
- No hay fotografías de personas. Cuando el equipo tenga fotos propias o con licencia, agregarlas con texto alternativo (ver `assets/img/README.md`).

## Estrategia de ramas

Ver [CONTRIBUTING.md](CONTRIBUTING.md) para el flujo completo.

| Rama | Propósito |
|---|---|
| `main` | Versión estable, lista para entregar. Solo recibe merges desde `develop` |
| `develop` | Integración del trabajo del equipo |
| `feature/design-tokens` | `tokens.css` / `tokens.json`: color, tipografía, espaciado, radios |
| `feature/brand-assets` | Logotipo, isotipo, fuentes (Plus Jakarta Sans, Inter) e íconos |
| `feature/landing-page` | Landing Page web (hero, navegación, secciones) |
| `feature/web-evaluation-flow` | Formulario de evaluación por pasos y tarjeta de resultado de riesgo |
| `feature/web-learn` | Sección "Aprende": lecciones y señales de alerta |
| `feature/risk-scoring` | Lógica de puntuación de riesgo y señales de alerta |
| `feature/registry-verification` | Consulta/enlace a registros oficiales SMV y SBS |
| `feature/android-app` | App Android: navegación inferior, evaluación, resultado, historial, perfil |
| `docs/trabajo-final` | Informes y entregables del curso (TB1, TB2, …) |
