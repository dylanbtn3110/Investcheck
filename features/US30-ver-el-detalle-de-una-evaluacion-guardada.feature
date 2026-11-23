# language: es
@US30 @EP06
Característica: US30 - Ver el detalle de una evaluación guardada
  Como inversionista con experiencia,
  quiero abrir una evaluación guardada
  para revisar las señales y los datos que registré.
  Épica: EP06 - Historial y perfil

  Escenario: Detalle de evaluación
    Dado que el usuario tiene evaluaciones en su historial
    Cuando selecciona una de ellas
    Entonces deberá ver el nivel de riesgo, la fecha, el monto y las señales detectadas
    Y deberá poder volver al historial
