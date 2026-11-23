# language: es
@US05 @EP02
Característica: US05 - Registrar al emisor de la oferta
  Como usuario,
  quiero indicar quién me ofrece la inversión
  para saber si figura en la SMV o la SBS.
  Épica: EP02 - Evaluación de ofertas

  Escenario: Registro del emisor
    Dado que el usuario está en el paso 2 de la evaluación
    Cuando ingresa el nombre o RUC de quien ofrece la inversión
    Entonces deberá indicar si figura en los registros de la SMV o la SBS
    Y deberá avanzar al paso 3
