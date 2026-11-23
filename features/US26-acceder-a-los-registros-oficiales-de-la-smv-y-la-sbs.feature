# language: es
@US26 @EP04
Característica: US26 - Acceder a los registros oficiales de la SMV y la SBS
  Como usuario,
  quiero abrir los registros oficiales de la SMV y la SBS desde la guía
  para confirmar por mi cuenta si el emisor está autorizado.
  Épica: EP04 - Verificación de emisor

  Escenario: Acceso a registros oficiales
    Dado que el usuario está en la guía para verificar al emisor
    Cuando selecciona el enlace a la SMV o a la SBS
    Entonces deberá abrirse el sitio oficial en una pestaña nueva
    Y deberá ver qué dato buscar (nombre o RUC)
