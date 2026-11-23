# language: es
@US28 @EP04
Característica: US28 - Saber dónde reportar una oferta sospechosa
  Como usuario,
  quiero conocer los canales oficiales
  para reportar una oferta sospechosa para actuar si creo que es un fraude.
  Épica: EP04 - Verificación de emisor

  Escenario: Orientación ante sospecha de fraude
    Dado que el resultado indica riesgo alto
    Cuando el usuario consulta "Qué hacer si sospecho un fraude"
    Entonces deberá ver los canales oficiales de reporte con una breve explicación
    Y deberá leer que InvestCheck no recibe ni tramita denuncias
