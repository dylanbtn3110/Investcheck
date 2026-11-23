# language: es
@US39 @EP08
Característica: US39 - Reportar una publicación de la comunidad
  Como usuario,
  quiero reportar una publicación de la comunidad que promueva una inversión o pida datos personales
  para que el equipo de moderación la revise.
  Épica: EP08 - Comunidad y simulación

  Escenario: Publicación reportada
    Dado que el usuario está leyendo una publicación en la comunidad
    Cuando selecciona “Reportar” y elige un motivo
    Entonces la publicación deberá enviarse al equipo de moderación
    Y el usuario deberá ver un mensaje de confirmación sin que su identidad se revele al autor
