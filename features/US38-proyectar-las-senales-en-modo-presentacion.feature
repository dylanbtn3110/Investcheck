# language: es
@US38 @EP07
Característica: US38 - Proyectar las señales en modo presentación
  Como docente de finanzas,
  quiero mostrar las señales de alerta en modo presentación
  para explicarlas en clase con un proyector.
  Épica: EP07 - Uso docente

  Escenario: Modo presentación activo
    Dado que el docente está en “Señales de alerta”
    Cuando selecciona “Modo presentación”
    Entonces deberá ver una señal por pantalla, a pantalla completa y con texto ampliado
    Y deberá poder avanzar o retroceder con las flechas del teclado
