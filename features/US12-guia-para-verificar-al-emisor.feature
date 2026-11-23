# language: es
@US12 @EP04
Característica: US12 - Guía para verificar al emisor
  Como inversionista con experiencia,
  quiero una guía
  para verificar al emisor en la SMV, la SBS y la SUNAT para comprobar rápido si está autorizado.
  Épica: EP04 - Verificación de emisor

  Escenario: Consulta de la guía
    Dado que el usuario ingresa a “Verificar emisor”
    Cuando revisa la página
    Entonces deberá ver los pasos con enlaces a la SMV, la SBS y la SUNAT
    Y deberá leer que tener RUC no significa estar autorizado
