# language: es
@US35 @EP04
Característica: US35 - Detectar la suplantación de una entidad autorizada
  Como usuario,
  quiero saber cómo comprobar que quien me contacta pertenece de verdad a la entidad autorizada que menciona
  para no caer en una suplantación.
  Épica: EP04 - Verificación de emisor

  Escenario: Consulta sobre suplantación
    Dado que el usuario está en “Verificar emisor”
    Cuando abre la sección “¿Y si usan el nombre de una entidad real?”
    Entonces deberá ver los pasos para comparar el RUC, la página web y los teléfonos con los datos oficiales de la entidad
    Y deberá leer que debe confirmar la oferta por los canales oficiales de la entidad antes de entregar dinero
