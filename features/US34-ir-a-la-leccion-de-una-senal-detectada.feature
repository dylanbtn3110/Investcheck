# language: es
@US34 @EP03
Característica: US34 - Ir a la lección de una señal detectada
  Como inversionista principiante,
  quiero ir desde el resultado a la lección relacionada con cada señal detectada
  para aprender a reconocerla en otras ofertas.
  Épica: EP03 - Resultado de riesgo

  Escenario: Lección relacionada
    Dado que el usuario está viendo una señal detectada en su resultado
    Cuando toca “Aprender sobre esta señal”
    Entonces deberá abrirse la lección relacionada en “Aprende”
    Y al volver deberá regresar a su resultado sin perder la evaluación
