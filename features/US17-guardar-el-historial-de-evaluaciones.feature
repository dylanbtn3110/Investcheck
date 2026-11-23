# language: es
@US17 @EP06
Característica: US17 - Guardar el historial de evaluaciones
  Como inversionista con experiencia,
  quiero guardar mi historial de evaluaciones
  para compararlas en el tiempo.
  Épica: EP06 - Historial y perfil

  Escenario: Evaluación guardada
    Dado que el usuario completó una evaluación
    Cuando se muestra el resultado
    Entonces la evaluación deberá guardarse en el dispositivo
    Y deberá aparecer en el historial con nivel, fecha, monto y señales
