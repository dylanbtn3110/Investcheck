/* InvestCheck — herramientas extra de verificación (US46 QR, US47 nombre comercial, US48 sanciones).
   No consulta ningún registro por su cuenta ni guarda datos: lleva al usuario a las consultas oficiales. */
(function () {
  'use strict';

  var Core = window.InvestCheckCore;
  var SUNAT_URL = 'https://e-consultaruc.sunat.gob.pe/cl-ti-itmrconsruc/jcrS00Alias';

  /* ---------- US47: buscar por nombre en la SUNAT ---------- */
  var nameForm = document.getElementById('name-form');
  if (nameForm) {
    var nameInput = document.getElementById('name-input');
    var nameField = document.getElementById('name-field');
    var nameStatus = document.getElementById('name-status');
    nameForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = nameInput.value.trim();
      nameField.classList.toggle('has-error', !name);
      nameInput.setAttribute('aria-invalid', String(!name));
      if (!name) { nameInput.focus(); return; }
      var finish = function (copied) {
        nameStatus.textContent = (copied ? 'Copiamos “' + name + '”. ' : 'Escribe “' + name + '” en la SUNAT. ') +
          'En la consulta elige “Por Nombre o Razón Social”. Si no hay coincidencias, revisa la ortografía o busca por RUC.';
        window.open(SUNAT_URL, '_blank', 'noopener');
      };
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(name).then(function () { finish(true); }, function () { finish(false); });
      else finish(false);
    });
  }

  /* ---------- US46: escanear un QR ---------- */
  var startBtn = document.getElementById('qr-start');
  if (!startBtn) return;
  var stopBtn = document.getElementById('qr-stop');
  var box = document.getElementById('qr-box');
  var video = document.getElementById('qr-video');
  var status = document.getElementById('qr-status');
  var stream = null;
  var timer = null;

  function stop() {
    if (timer) { window.clearInterval(timer); timer = null; }
    if (stream) { stream.getTracks().forEach(function (t) { t.stop(); }); stream = null; }
    box.hidden = true;
  }

  function useRuc(ruc) {
    stop();
    var input = document.getElementById('ruc-input');
    input.value = ruc;
    status.textContent = 'Leímos el RUC ' + ruc + '. Lo pusimos en el recuadro para que lo revises.';
    document.getElementById('ruc-form').requestSubmit ? document.getElementById('ruc-form').requestSubmit() : null;
    input.scrollIntoView({ behavior: 'smooth', block: 'center' });
    input.focus({ preventScroll: true });
  }

  startBtn.addEventListener('click', function () {
    if (!('BarcodeDetector' in window) || !navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      status.textContent = 'Tu navegador no puede escanear códigos QR. Escribe el RUC a mano en el recuadro de arriba.';
      return;
    }
    var detector = new window.BarcodeDetector({ formats: ['qr_code'] });
    navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } }).then(function (s) {
      stream = s;
      video.srcObject = s;
      box.hidden = false;
      video.play();
      status.textContent = 'Apunta la cámara al código QR.';
      timer = window.setInterval(function () {
        detector.detect(video).then(function (codes) {
          if (!codes.length) return;
          var ruc = Core && Core.extractRuc(codes[0].rawValue);
          if (ruc) useRuc(ruc);
          else status.textContent = 'Leímos un código, pero no contiene un RUC válido. Escríbelo a mano.';
        }).catch(function () {});
      }, 500);
    }, function () {
      status.textContent = 'Permite la cámara para escanear o escribe el RUC.';
    });
  });
  stopBtn.addEventListener('click', function () { stop(); status.textContent = 'Cámara detenida. Puedes escribir el RUC a mano.'; });
  window.addEventListener('pagehide', stop);
})();
