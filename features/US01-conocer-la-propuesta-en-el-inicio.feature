# language: es
@US01 @EP01
Característica: US01 - Conocer la propuesta en el inicio
  Como inversionista principiante,
  quiero entender en el inicio qué hace InvestCheck
  para decidir si evaluar la oferta que recibí.
  Épica: EP01 - Landing Page

  Escenario: Visualización del inicio
    Dado que el usuario ingresa al sitio web
    Cuando se carga la página de inicio
    Entonces deberá ver el mensaje principal y el botón “Iniciar evaluación”
    Y deberá leer que la plataforma es educativa y no es un bróker
