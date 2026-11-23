# language: es
@US08 @EP02
Característica: US08 - Confirmar al descartar una evaluación
  Como usuario,
  quiero que se me pida confirmación al salir de una evaluación
  para no perder mis respuestas por error.
  Épica: EP02 - Evaluación de ofertas

  Escenario: Salida con confirmación
    Dado que el usuario está completando una evaluación
    Cuando toca el botón cerrar (X)
    Entonces deberá aparecer el diálogo “¿Descartar esta evaluación?”
    Y deberá poder elegir entre “Cancelar” y “Descartar”
