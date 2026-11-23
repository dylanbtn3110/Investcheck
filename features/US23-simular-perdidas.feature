# language: es
@US23 @EP08
Característica: US23 - Simular pérdidas
  Como usuario,
  quiero simular cuánto podría perder
  para entender si una inversión afecta mi vida diaria.
  Épica: EP08 - Comunidad y simulación

  Escenario: Simulación generada
    Dado que el usuario ingresa un monto y un porcentaje de pérdida
    Cuando solicita la simulación
    Entonces deberá ver el impacto en soles
    Y no deberá recibir sugerencias de dónde invertir
