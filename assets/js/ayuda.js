/* InvestCheck — Centro de ayuda (US34) y contacto con soporte (US35).
   El mensaje de soporte no se guarda en ningún lado: se abre como un "issue" en GitHub o se copia. */
(function () {
  'use strict';

  var Core = window.InvestCheckCore;
  var ISSUES_URL = 'https://github.com/dylanbtn3110/Investcheck/issues/new';

  var FAQ = [
    { q: '¿Qué es la rentabilidad y por qué importa?', a: 'Es lo que ganas por tu dinero, como porcentaje. Una rentabilidad muy alta y sin riesgo no existe: cuanto más alta la promesa, mayor suele ser el riesgo.', lesson: 'rentabilidad', tags: 'ganancia interes retorno anualizada mensual' },
    { q: '¿Cómo se compara una rentabilidad mensual con una anual?', a: 'Un 2 % mensual equivale a cerca de 27 % al año. InvestCheck convierte ambas a la misma medida para que puedas compararlas.', lesson: 'rentabilidad', tags: 'anualizada equivalente porcentaje' },
    { q: '¿Qué es el riesgo de una inversión?', a: 'Es la posibilidad de ganar menos de lo esperado o de perder parte de tu dinero. Toda inversión tiene riesgo.', lesson: 'riesgo', tags: 'perder perdida' },
    { q: '¿Qué significa liquidez?', a: 'Es qué tan rápido puedes convertir tu inversión en dinero sin perder valor. Pregunta siempre cómo y cuándo podrías retirar.', lesson: 'liquidez', tags: 'retirar retiro plazo' },
    { q: '¿Por qué no debo poner todo mi dinero en una sola oferta?', a: 'Diversificar reparte el riesgo: si una oferta falla, no pierdes todo.', lesson: 'diversificacion', tags: 'diversificar repartir' },
    { q: '¿Qué comisiones debo preguntar?', a: 'Pide por escrito todos los costos: de entrada, de administración y de salida. Los costos reducen lo que realmente ganas.', lesson: 'comisiones', tags: 'costos cobros' },
    { q: '¿Cuál es la diferencia entre interés simple y compuesto?', a: 'El simple se calcula siempre sobre el monto inicial. El compuesto también sobre los intereses ya ganados.', lesson: 'interes', tags: 'compuesto simple calculo' },
    { q: '¿Qué es un esquema piramidal?', a: 'Un esquema donde las ganancias de unos salen del dinero de quienes entran después. Suele pedirte traer a más personas.', lesson: 'piramide', tags: 'ponzi estafa referidos fraude' },
    { q: '¿Qué hacen la SMV y la SBS?', a: 'Son los reguladores que autorizan y supervisan quién puede captar dinero del público. Consultar sus registros es el paso clave antes de invertir.', lesson: 'regulacion', tags: 'regulador autorizado registro supervisa' },
    { q: '¿Cómo reviso si una empresa está autorizada?', a: 'Busca su nombre en los portales de la SMV y la SBS, y su RUC en la SUNAT. Tener RUC no significa estar autorizado a captar dinero.', href: 'verificar.html', hrefText: 'Ir a Verificar emisor', tags: 'ruc sunat emisor empresa verificar' },
    { q: '¿Qué pasa con mis datos?', a: 'Tus respuestas se guardan solo en tu navegador. Puedes exportarlas o borrarlas cuando quieras desde Evaluar oferta.', href: 'evaluar.html#historial', hrefText: 'Ir al historial', tags: 'privacidad datos borrar guardar' }
  ];

  var list = document.getElementById('faq-list');
  var search = document.getElementById('faq-search');
  var count = document.getElementById('faq-count');
  var empty = document.getElementById('faq-empty');
  if (!list || !Core) return;

  function render(items) {
    list.textContent = '';
    items.forEach(function (it) {
      var d = document.createElement('details');
      d.className = 'accordion';
      var s = document.createElement('summary');
      s.appendChild(document.createTextNode(it.q));
      var ch = document.createElement('span');
      ch.className = 'icon chevron';
      ch.setAttribute('aria-hidden', 'true');
      ch.textContent = 'expand_more';
      s.appendChild(ch);
      var body = document.createElement('div');
      body.className = 'accordion-body';
      var p = document.createElement('p');
      p.textContent = it.a;
      body.appendChild(p);
      var a = document.createElement('a');
      a.className = 'btn btn-tertiary';
      a.href = it.lesson ? 'aprende.html#' + it.lesson : it.href;
      a.textContent = it.lesson ? 'Ver la lección' : it.hrefText;
      body.appendChild(a);
      d.appendChild(s);
      d.appendChild(body);
      list.appendChild(d);
    });
    empty.hidden = items.length > 0;
    count.textContent = items.length === FAQ.length && !search.value.trim()
      ? FAQ.length + ' preguntas'
      : (items.length ? items.length + (items.length === 1 ? ' resultado' : ' resultados') : 'Sin resultados');
  }

  search.addEventListener('input', function () { render(Core.searchFaq(search.value, FAQ)); });
  render(FAQ);

  /* ---------- Soporte (US35) ---------- */

  var form = document.getElementById('support-form');
  var msg = document.getElementById('support-msg');
  var mail = document.getElementById('support-mail');
  var field = document.getElementById('support-field');
  var status = document.getElementById('support-status');

  function buildMessage() {
    var text = msg.value.trim();
    var email = mail.value.trim();
    return text + (email ? '\n\nCorreo para responderme: ' + email : '');
  }

  function valid() {
    var ok = msg.value.trim().length > 0;
    field.classList.toggle('has-error', !ok);
    msg.setAttribute('aria-invalid', String(!ok));
    if (!ok) msg.focus();
    return ok;
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!valid()) return;
    var url = ISSUES_URL + '?title=' + encodeURIComponent('Soporte desde InvestCheck') + '&body=' + encodeURIComponent(buildMessage());
    window.open(url, '_blank', 'noopener');
    status.textContent = 'Gracias. Abrimos tu mensaje en GitHub para que lo envíes. Te respondemos pronto.';
  });

  document.getElementById('support-copy').addEventListener('click', function () {
    if (!valid()) return;
    var text = buildMessage();
    var done = function () { status.textContent = 'Mensaje copiado. Puedes pegarlo donde prefieras.'; };
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(done, function () { status.textContent = 'No pudimos copiar. Selecciona el texto del mensaje y cópialo manualmente.'; });
    else status.textContent = 'Tu navegador no permite copiar desde aquí. Selecciona el texto y cópialo manualmente.';
  });
})();
