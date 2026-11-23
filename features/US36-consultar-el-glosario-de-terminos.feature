# language: es
@US36 @EP05
Característica: US36 - Consultar el glosario de términos
  Como inversionista principiante,
  quiero consultar un glosario en lenguaje simple
  para entender los términos financieros que aparecen en las ofertas y en las lecciones.
  Épica: EP05 - Aprendizaje

  Escenario: Término encontrado
    Dado que el usuario está en el glosario
    Cuando escribe un término en el buscador
    Entonces deberá ver su definición en lenguaje simple con un ejemplo
    Y deberá ver el enlace a la lección donde se explica

  Escenario: Término no encontrado
    Dado que el usuario busca un término que no está en el glosario
    Cuando realiza la búsqueda
    Entonces deberá ver el mensaje “No encontramos ese término”
    Y deberá ver términos parecidos que sí están disponibles
