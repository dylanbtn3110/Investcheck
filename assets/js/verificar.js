/* InvestCheck — revisión de formato de RUC.
   Comprueba longitud, prefijo y dígito verificador. NO consulta la SUNAT ni confirma que la
   empresa exista o esté autorizada a captar dinero: eso se verifica en los portales oficiales. */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else {
    root.InvestCheckRuc = factory();
    if (typeof document !== 'undefined') document.addEventListener('DOMContentLoaded', root.InvestCheckRuc.mount);
  }
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  var WEIGHTS = [5, 4, 3, 2, 7, 6, 5, 4, 3, 2];
  var TYPES = {
    '10': 'persona natural',
    '20': 'persona jurídica (empresa)',
    '15': 'otro tipo de contribuyente',
    '17': 'otro tipo de contribuyente'
  };

  function checkDigit(first10) {
    var sum = 0;
    for (var i = 0; i < 10; i++) sum += Number(first10.charAt(i)) * WEIGHTS[i];
    return (11 - (sum % 11)) % 10;
  }

  function validateRuc(input) {
    var ruc = String(input == null ? '' : input).replace(/\s/g, '');
    if (!/^\d{11}$/.test(ruc)) return { ok: false, reason: 'format' };
    var prefix = ruc.slice(0, 2);
    if (!TYPES[prefix]) return { ok: false, reason: 'prefix' };
    if (checkDigit(ruc.slice(0, 10)) !== Number(ruc.charAt(10))) return { ok: false, reason: 'digit' };
    return { ok: true, type: TYPES[prefix] };
  }

  var MESSAGES = {
    format: 'El RUC debe tener 11 dígitos y solo números.',
    prefix: 'Los RUC comienzan con 10, 15, 17 o 20. Revisa que lo hayas copiado completo.',
    digit: 'El último dígito no coincide. Puede haber un error al escribirlo o al copiarlo.'
  };

  function mount() {
    var form = document.getElementById('ruc-form');
    if (!form) return;
    var input = document.getElementById('ruc-input');
    var field = document.getElementById('ruc-field');
    var msg = field.querySelector('.msg');
    var out = document.getElementById('ruc-result');

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var r = validateRuc(input.value);
      out.textContent = '';
      if (!r.ok) {
        field.classList.add('has-error');
        input.setAttribute('aria-invalid', 'true');
        msg.textContent = MESSAGES[r.reason];
        input.focus();
        return;
      }
      field.classList.remove('has-error');
      input.setAttribute('aria-invalid', 'false');
      var box = document.createElement('div');
      box.className = 'note';
      var strong = document.createElement('strong');
      strong.textContent = 'El formato es válido (' + r.type + ').';
      var p = document.createElement('p');
      p.appendChild(strong);
      p.appendChild(document.createTextNode(' Esto no confirma que la empresa exista ni que esté autorizada a captar dinero. Consúltala en la SUNAT, la SMV y la SBS.'));
      var ic = document.createElement('span');
      ic.className = 'icon';
      ic.setAttribute('aria-hidden', 'true');
      ic.textContent = 'info';
      box.appendChild(ic);
      box.appendChild(p);
      out.appendChild(box);
    });

    input.addEventListener('input', function () {
      input.value = input.value.replace(/[^\d]/g, '').slice(0, 11);
      if (field.classList.contains('has-error') && /^\d{11}$/.test(input.value)) {
        field.classList.remove('has-error');
        input.setAttribute('aria-invalid', 'false');
      }
    });
  }

  return { validateRuc: validateRuc, checkDigit: checkDigit, mount: mount };
});
