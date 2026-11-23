# language: es
@US09 @EP03
Característica: US09 - Ver el nivel de riesgo
  Como usuario,
  quiero ver el nivel de riesgo con las señales detectadas
  para entender por qué sale bajo, medio o alto.
  Épica: EP03 - Resultado de riesgo

  Escenario: Resultado generado
    Dado que el usuario completó los cuatro pasos
    Cuando solicita el resultado
    Entonces deberá ver el nivel de riesgo con color, ícono y texto y el conteo “n de 6 señales”
    Y cada señal deberá explicar su motivo en lenguaje simple, sin recomendar invertir o no

  Esquema del escenario: Nivel de riesgo según las señales detectadas
    Dado que el usuario completó los 4 pasos de la evaluación
    Cuando la oferta presenta <señales> señales de alerta
    Entonces deberá ver "<nivel>" con el ícono <ícono>
    Y deberá leer "<señales> de 6 señales de alerta detectadas"

    Ejemplos:
      | señales | nivel        | ícono        |
      | 0       | Riesgo bajo  | check_circle |
      | 1       | Riesgo medio | error        |
      | 2       | Riesgo medio | error        |
      | 3       | Riesgo alto  | cancel       |
      | 6       | Riesgo alto  | cancel       |

  Escenario: Rentabilidad irreal y emisor no regulado
    Dado que la oferta promete 2 % mensual o más
    Y el emisor no figura en la SMV ni en la SBS
    Cuando el usuario ve el resultado
    Entonces deberá ver "Riesgo alto" aunque solo haya 2 señales de alerta
