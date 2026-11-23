# language: es
@US06 @EP02
Característica: US06 - Indicar cómo se presentó la oferta
  Como inversionista principiante,
  quiero contar cómo me presentaron la oferta
  para detectar presión de tiempo, captación por referidos o ganancia garantizada.
  Épica: EP02 - Evaluación de ofertas

  Escenario: Respuestas de presentación
    Dado que el usuario está en el paso 3 de la evaluación
    Cuando responde las preguntas de sí o no
    Entonces deberá registrar si hubo presión de tiempo, captación por referidos o ganancia garantizada
    Y cada pregunta deberá mostrar una ayuda que la explica
