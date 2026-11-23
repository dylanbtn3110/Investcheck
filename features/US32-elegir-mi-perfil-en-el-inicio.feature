# language: es
@US32 @EP01
Característica: US32 - Elegir mi perfil en el inicio
  Como visitante,
  quiero elegir en el inicio la tarjeta que corresponde a mi perfil
  para llegar directo al contenido que me sirve.
  Épica: EP01 - Landing Page

  Escenario: Navegación por perfil
    Dado que el usuario está en la sección “Para quién es” de la página de inicio
    Cuando selecciona la tarjeta “Si estás empezando”, “Si ya inviertes” o “Si enseñas finanzas”
    Entonces deberá ser llevado a “Evaluar oferta”, “Verificar emisor” o “Aprende”, según la tarjeta elegida
    Y deberá poder volver al inicio desde el logotipo del header
