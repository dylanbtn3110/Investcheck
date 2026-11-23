# language: es
@US18 @EP06
Característica: US18 - Borrar el historial
  Como usuario,
  quiero borrar mi historial con confirmación
  para controlar mis datos.
  Épica: EP06 - Historial y perfil

  Escenario: Borrado con confirmación
    Dado que el usuario está en Perfil
    Cuando toca “Borrar historial”
    Entonces deberá pedirse confirmación
    Y solo al confirmar deberá eliminarse el historial
