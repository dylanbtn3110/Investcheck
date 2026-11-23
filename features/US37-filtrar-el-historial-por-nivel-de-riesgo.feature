# language: es
@US37 @EP06
Característica: US37 - Filtrar el historial por nivel de riesgo
  Como inversionista con experiencia,
  quiero filtrar mi historial por nivel de riesgo
  para ubicar rápido las ofertas que salieron con riesgo alto.
  Épica: EP06 - Historial y perfil

  Escenario: Filtro aplicado
    Dado que el usuario tiene evaluaciones en su historial
    Cuando selecciona el filtro “Bajo”, “Medio” o “Alto”
    Entonces deberá ver solo las evaluaciones con ese nivel, de la más reciente a la más antigua
    Y deberá poder quitar el filtro para ver todo el historial

  Escenario: Filtro sin resultados
    Dado que el usuario aplica un filtro
    Cuando no tiene evaluaciones con ese nivel
    Entonces deberá ver el mensaje “No tienes evaluaciones con este nivel”
    Y deberá ver el botón “Nueva evaluación”
