# Diseño en Figma

Archivo con los wireframes y mockups de InvestCheck:
**[InvestCheck · Wireframes y Mockups](https://www.figma.com/design/yETPw2HjwXGq8x1DsaYlKU)**
(equipo de Figma *Invescheck*).

## Estructura

| Página | Contenido |
|---|---|
| Portada | Índice, cómo leer el archivo y principios de diseño |
| Foundations | Variables (color, espaciado, radio), estilos de texto, elevaciones y componentes base |
| Web · Desktop | Inicio, Evaluar (paso 1 y resultado), Aprende, Señales de alerta, Verificar emisor y Nosotros, a 1440 px |
| Web · Móvil | Inicio, Evaluar (pasos 1 a 4 y resultado) y Aprende, a 360 px |
| Android | Inicio, Evaluación, diálogo de descarte, Resultado, Historial, Aprende y Perfil (Material Design 3, 360×800) |

Cada pantalla es una columna: arriba su **wireframe** (escala de grises) y debajo su **mockup**
(alta fidelidad). Ambos llevan el mismo nombre.

## Relación con el código

- Las variables de color de Figma (`color/primary`, `color/risk-high`, …) usan los mismos valores
  y nombres que `assets/css/tokens.css` y `tokens.json`. Si cambia uno, cambiar el otro.
- Los estilos de texto siguen la escala de las Style Guidelines (`Web/H1`, `Movil/H1`,
  `Cuerpo/Body`, …).
- Los íconos son Material Symbols Rounded; las fuentes, Plus Jakarta Sans e Inter.
- El sitio web publicado sigue estos diseños; las pantallas de Android aún no tienen código.

## Pendiente

- Fotografías de personas peruanas cotidianas (propias o con licencia). No usar personas públicas
  ni inversionistas conocidos.
- Versión iOS (la guía la documenta solo de forma comparativa).
- Prototipo navegable (flujos entre pantallas).
