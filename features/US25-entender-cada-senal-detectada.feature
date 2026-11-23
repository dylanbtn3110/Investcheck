# language: es
@US25 @EP03
Característica: US25 - Entender cada señal detectada
  Como inversionista principiante,
  quiero leer una explicación breve de cada señal detectada
  para entender por qué el resultado indica ese nivel de riesgo.
  Épica: EP03 - Resultado de riesgo

  Escenario: Explicación de una señal
    Dado que el usuario ve su resultado
    Cuando selecciona una señal de la lista
    Entonces deberá ver una explicación breve en lenguaje sencillo
    Y no deberá aparecer ningún término técnico sin definir
