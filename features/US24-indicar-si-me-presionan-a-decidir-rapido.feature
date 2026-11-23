# language: es
@US24 @EP02
Característica: US24 - Indicar si me presionan a decidir rápido
  Como usuario,
  quiero indicar si me piden decidir con urgencia
  para que la plataforma lo considere una señal de alerta.
  Épica: EP02 - Evaluación de ofertas

  Escenario: Presión para decidir
    Dado que el usuario está en el paso 3 de la evaluación
    Cuando indica que le piden decidir con urgencia
    Entonces la respuesta deberá registrarse como señal de alerta
    Y deberá reflejarse en el nivel de riesgo del resultado
