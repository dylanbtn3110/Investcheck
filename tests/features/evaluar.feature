# language: es
Característica: Evaluar una oferta de inversión
  Como persona que recibió una oferta de inversión
  quiero responder unas preguntas cortas
  para saber qué señales de alerta tiene y qué debo verificar

  Escenario: Una oferta con muchas señales se clasifica como riesgo alto
    Dado que la oferta promete 10 % mensual
    Y el emisor no está registrado en la SMV ni la SBS
    Y hay presión de tiempo, captación por referidos y ganancia garantizada
    Cuando completo los 4 pasos de la evaluación
    Entonces veo el nivel "Riesgo alto" con color, ícono y texto
    Y veo qué verificar antes de decidir
    Y el resultado nunca me recomienda invertir ni dejar de invertir

  Escenario: Una oferta sin señales se clasifica como riesgo bajo
    Dado que la oferta promete 0,5 % mensual
    Y el emisor figura en el registro de la SMV
    Y no hay presión, referidos ni garantías, y recibí un contrato por escrito
    Cuando completo los 4 pasos de la evaluación
    Entonces veo el nivel "Riesgo bajo"
    Y el resumen aclara que toda inversión tiene riesgo

  Escenario: Un campo inválido muestra un error junto al campo
    Dado que estoy en el paso 1
    Cuando dejo el monto vacío y salgo del campo
    Entonces veo el mensaje "Ingresa un monto mayor a cero." con ícono y texto
    Y no puedo continuar hasta corregirlo

  Escenario: Salir a medias pide confirmación
    Dado que completé el paso 1
    Cuando cierro la evaluación
    Entonces veo el diálogo para descartar con "Cancelar" como opción principal
