# language: es
@US33 @EP02
Característica: US33 - Indicar por qué medio recibí la oferta
  Como inversionista principiante,
  quiero indicar por qué medio me llegó la oferta
  para recibir consejos de verificación adecuados a ese medio.
  Épica: EP02 - Evaluación de ofertas

  Escenario: Medio seleccionado
    Dado que el usuario está en el paso 3 de la evaluación
    Cuando selecciona el medio por el que recibió la oferta (WhatsApp, redes sociales, llamada, correo o en persona)
    Entonces el medio elegido deberá aparecer en el resumen del paso 4
    Y el resultado deberá mostrar un consejo de verificación para ese medio

  Escenario: Medio no indicado
    Dado que el usuario no recuerda o no quiere indicar el medio
    Cuando deja la pregunta sin responder y toca “Continuar”
    Entonces deberá poder avanzar al paso 4
    Y el resumen deberá mostrar “No indicado”
