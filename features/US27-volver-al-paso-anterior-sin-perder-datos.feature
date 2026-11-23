# language: es
@US27 @EP02
Característica: US27 - Volver al paso anterior sin perder datos
  Como usuario,
  quiero volver al paso anterior de la evaluación
  para corregir una respuesta sin empezar de nuevo.
  Épica: EP02 - Evaluación de ofertas

  Escenario: Retroceso con datos conservados
    Dado que el usuario está en el paso 2 o en uno posterior
    Cuando selecciona "Atrás"
    Entonces deberá ver el paso anterior con sus respuestas
    Y no deberá perder los datos ya ingresados
