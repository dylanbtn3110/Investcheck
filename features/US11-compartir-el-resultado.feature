# language: es
@US11 @EP03
Característica: US11 - Compartir el resultado
  Como usuario,
  quiero compartir el resultado de mi evaluación
  para mostrárselo a quien me hizo la oferta o a mi familia.
  Épica: EP03 - Resultado de riesgo

  Escenario: Resultado compartido
    Dado que el usuario está en la pantalla de resultado
    Cuando toca la opción compartir
    Entonces deberá poder enviar un resumen de la evaluación
    Y deberá poder guardarlo en PDF
