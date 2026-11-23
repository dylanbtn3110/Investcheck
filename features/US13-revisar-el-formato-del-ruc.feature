# language: es
@US13 @EP04
Característica: US13 - Revisar el formato del RUC
  Como usuario,
  quiero revisar si un RUC está bien formado
  para detectar datos falsos.
  Épica: EP04 - Verificación de emisor

  Escenario: RUC válido
    Dado que el usuario ingresa un RUC
    Cuando tiene 11 dígitos, prefijo y dígito verificador válidos
    Entonces deberá indicarse que el formato es correcto
    Y que un formato correcto no implica autorización

  Escenario: RUC inválido
    Dado que el usuario ingresa un RUC mal formado
    Cuando solicita la revisión
    Entonces deberá mostrarse el motivo del error

  Esquema del escenario: Motivo de un RUC mal formado
    Dado que el usuario está en "Verificar emisor"
    Cuando escribe el RUC "<ruc>" y toca "Revisar RUC"
    Entonces deberá ver el mensaje "<mensaje>"

    Ejemplos:
      | ruc         | mensaje                                                                      |
      | 2013131295  | El RUC debe tener 11 dígitos y solo números.                                 |
      | 2013131295A | El RUC debe tener 11 dígitos y solo números.                                 |
      | 30131312955 | Los RUC comienzan con 10, 15, 17 o 20. Revisa que lo hayas copiado completo. |
      | 20131312956 | El último dígito no coincide. Puede haber un error al escribirlo o al copiarlo. |
