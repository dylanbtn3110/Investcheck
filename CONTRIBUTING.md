# Guía de colaboración

## Flujo de trabajo

1. Actualiza `develop`: `git checkout develop && git pull origin develop`.
2. Trabaja en la rama `feature/*` o `docs/*` que corresponda a tu tarea.
   Si necesitas una rama nueva, créala desde `develop`: `feature/<tema-corto>`.
3. Haz commits pequeños y claros.
4. Antes de abrir un Pull Request, trae los últimos cambios: `git merge origin/develop`.
5. Abre un Pull Request hacia `develop` y pide al menos una revisión de otro integrante.
6. Cuando `develop` esté estable para una entrega, se fusiona en `main`.

## Reglas

- No se hace push directo a `main` ni a `develop`.
- Una rama, un tema. No mezcles trabajo de áreas distintas.
- Nada se diseña con valores "a mano": colores, tamaños y espaciados salen de los tokens
  (ver Style Guidelines). Si falta uno, se propone primero en `feature/design-tokens`.
- Elimina la rama `feature/*` extra que crees una vez fusionada.

## Convención de commits

Formato: `tipo(ámbito): descripción en infinitivo`

| Tipo | Uso |
|---|---|
| `feat` | Funcionalidad nueva |
| `fix` | Corrección de errores |
| `docs` | Documentación |
| `style` | Cambios visuales o de formato sin lógica |
| `refactor` | Reorganización sin cambiar comportamiento |
| `chore` | Configuración y tareas de mantenimiento |

Ejemplo: `feat(landing): agregar sección hero con botón Iniciar evaluación`
