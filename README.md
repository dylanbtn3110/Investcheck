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
