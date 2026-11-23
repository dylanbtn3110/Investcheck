# language: es
@US29 @EP05
Característica: US29 - Repetir el quiz y comparar resultados
  Como inversionista principiante,
  quiero repetir el quiz después de las lecciones
  para comprobar cuánto mejoré.
  Épica: EP05 - Aprendizaje

  Escenario: Segundo intento del quiz
    Dado que el usuario ya completó el quiz y las lecciones
    Cuando vuelve a realizar el quiz
    Entonces deberá ver su nota anterior junto a la nueva
    Y deberá ver qué preguntas respondió mal para repasarlas
