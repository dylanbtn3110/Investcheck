# language: es
Característica: Funciones ampliadas del historial y la ayuda
  Como persona que evalúa varias ofertas
  quiero compararlas, recordarlas y exportarlas
  para decidir con calma y con mi propia información

  Escenario: Aviso de una oferta parecida a una ya evaluada (US24)
    Dado que guardé una evaluación con 3 o más señales marcadas
    Cuando evalúo otra oferta que comparte 3 o más de esas señales
    Entonces veo "Encontramos una oferta parecida a una que evaluaste"
    Y puedo abrir la comparación

  Escenario: Comparar dos evaluaciones (US27)
    Dado que tengo dos evaluaciones guardadas
    Cuando abro "Comparar evaluaciones"
    Entonces veo el nivel de riesgo y las 6 señales de cada una lado a lado

  Escenario: Necesitar dos evaluaciones para comparar (US27)
    Dado que tengo una sola evaluación guardada
    Cuando abro "Comparar evaluaciones"
    Entonces veo "Necesitas dos evaluaciones para comparar."

  Escenario: Recordatorio un día antes de la fecha límite (US25)
    Dado que guardé un recordatorio para mañana
    Cuando abro InvestCheck
    Entonces veo el aviso del recordatorio

  Escenario: Exportar el historial sin fórmulas peligrosas (US29)
    Dado que el nombre de una evaluación empieza con "="
    Cuando exporto el historial en CSV
    Entonces la celda se guarda como texto y no como fórmula

  Escenario: Buscar en el Centro de ayuda sin importar las tildes (US34)
    Dado que estoy en el Centro de ayuda
    Cuando busco "rentabilidad"
    Entonces veo las preguntas relacionadas con su lección
