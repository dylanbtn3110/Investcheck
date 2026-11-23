# language: es
Característica: Verificar al emisor de una oferta
  Como persona que quiere comprobar quién ofrece una inversión
  quiero revisar el RUC y llegar a los registros oficiales
  para no confiar solo en quien me invita

  Escenario: Un RUC con el dígito verificador correcto tiene formato válido
    Dado que escribo el RUC 20131312955
    Cuando reviso el RUC
    Entonces veo que el formato es válido
    Y se aclara que esto no confirma que la empresa esté autorizada a captar dinero

  Escenario: Un RUC con el dígito verificador incorrecto muestra un error
    Dado que escribo el RUC 20131312956
    Cuando reviso el RUC
    Entonces veo un mensaje de error y puedo corregirlo

  Escenario: El QR de un folleto solo se acepta si contiene un RUC válido
    Dado que escaneo un código QR
    Cuando el código contiene un RUC con dígito verificador válido
    Entonces el RUC aparece en el recuadro para revisarlo
    Pero si el código no contiene un RUC válido veo un aviso y puedo escribirlo a mano

  Escenario: Sin permiso de cámara se puede escribir el RUC
    Dado que no permito el acceso a la cámara
    Cuando intento escanear el QR
    Entonces veo "Permite la cámara para escanear o escribe el RUC."
