# language: es
@US04 @EP02
Característica: US04 - Registrar monto y rentabilidad
  Como inversionista principiante,
  quiero registrar el monto y la rentabilidad prometida
  para que la plataforma la compare con el sistema formal.
  Épica: EP02 - Evaluación de ofertas

  Escenario: Registro exitoso
    Dado que el usuario está en el paso 1 de la evaluación
    Cuando ingresa el monto y la rentabilidad prometida
    Entonces deberá poder indicar si la rentabilidad es mensual o anual
    Y deberá avanzar al paso 2 con el botón “Continuar”

  Escenario: Dato inválido
    Dado que el usuario ingresa un monto o una rentabilidad no válidos
    Cuando sale del campo
    Entonces deberá ver el error con ícono y texto
    Y no podrá avanzar hasta corregirlo

  Esquema del escenario: Validación del monto y de la rentabilidad
    Dado que el usuario está en el paso 1 de la evaluación
    Cuando escribe "<valor>" en el campo <campo> y sale del campo
    Entonces deberá ver el mensaje "<mensaje>"

    Ejemplos:
      | campo        | valor      | mensaje                                      |
      | monto        |            | Ingresa un monto mayor a cero.               |
      | monto        | 0          | Ingresa un monto mayor a cero.               |
      | monto        | 2000000000 | Revisa el monto: parece demasiado alto.      |
      | rentabilidad | 0          | Ingresa un porcentaje mayor a cero.          |
      | rentabilidad | 20000      | Revisa el porcentaje: parece demasiado alto. |
