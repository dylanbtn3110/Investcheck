/* InvestCheck — lecciones con progreso y quiz de autoevaluación.
   El avance se guarda solo en el navegador (localStorage). */
(function () {
  'use strict';

  var store = window.InvestCheckStorage;
  var LESSONS_KEY = 'investcheck.lessons';
  var QUIZ_KEY = 'investcheck.quiz';

  /* ---------- Lecciones ---------- */

  var lessons = Array.prototype.slice.call(document.querySelectorAll('[data-lesson]'));
  var done = store.get(LESSONS_KEY, []);
  if (!Array.isArray(done)) done = [];

  function paintLesson(node) {
    var id = node.getAttribute('data-lesson');
    var isDone = done.indexOf(id) > -1;
    node.classList.toggle('lesson-done', isDone);
    var status = node.querySelector('[data-status]');
    status.querySelector('.icon').textContent = isDone ? 'check_circle' : 'radio_button_unchecked';
    status.querySelector('.status-text').textContent = isDone ? 'Completada' : 'Pendiente';
    var btn = node.querySelector('[data-complete]');
    btn.setAttribute('aria-pressed', String(isDone));
    btn.textContent = isDone ? 'Completada · deshacer' : 'Marcar como completada';
  }

  function paintProgress() {
    var total = lessons.length;
    var count = lessons.filter(function (n) { return done.indexOf(n.getAttribute('data-lesson')) > -1; }).length;
    document.getElementById('progress-text').textContent = count + ' de ' + total + ' lecciones completadas';
    var bar = document.getElementById('progress-bar');
    bar.setAttribute('aria-valuenow', count);
    bar.firstElementChild.style.width = Math.round((count / total) * 100) + '%';
  }

  lessons.forEach(function (node) {
    paintLesson(node);
    node.querySelector('[data-complete]').addEventListener('click', function () {
      var id = node.getAttribute('data-lesson');
      var i = done.indexOf(id);
      if (i > -1) done.splice(i, 1); else done.push(id);
      store.set(LESSONS_KEY, done);
      paintLesson(node);
      paintProgress();
    });
  });
  paintProgress();

  /* Abre la lección que viene en la URL (#liquidez) */
  function openFromHash() {
    var id = decodeURIComponent((location.hash || '').slice(1));
    if (!id) return;
    var target = document.querySelector('[data-lesson="' + id + '"]');
    if (target) {
      target.open = true;
      target.scrollIntoView({ block: 'start' });
    }
  }
  openFromHash();
  window.addEventListener('hashchange', openFromHash);

  /* ---------- Quiz ---------- */

  var QUESTIONS = [
    {
      q: 'Una empresa promete 10 % mensual sin riesgo. ¿Qué paso tiene más sentido?',
      options: [
        'Entrar rápido antes de que se acaben los cupos.',
        'Verificar si está autorizada y pedir por escrito de dónde sale la ganancia.',
        'Invertir una cantidad pequeña para probar.'
      ],
      answer: 1,
      why: 'Verificar primero reduce el riesgo de entregar dinero a un emisor no autorizado. Además, ninguna inversión está libre de riesgo.'
    },
    {
      q: '¿Qué significa liquidez?',
      options: [
        'Cuánto ganas por tu dinero.',
        'Qué tan rápido puedes recuperar tu dinero sin perder valor.',
        'Cuánto cobra la empresa por administrarlo.'
      ],
      answer: 1,
      why: 'La liquidez habla de la facilidad para retirar. La rentabilidad es otra cosa: cuánto gana el dinero.'
    },
    {
      q: 'Te dicen que ganarás más si invitas a tus amigos. ¿Qué señal es?',
      options: [
        'Un descuento por fidelidad.',
        'Una señal de esquema piramidal.',
        'Un beneficio de diversificación.'
      ],
      answer: 1,
      why: 'Si tu ganancia depende de que entren más personas, el dinero viene de los nuevos aportantes y no de un negocio real.'
    },
    {
      q: 'Una empresa tiene RUC. ¿Qué significa eso?',
      options: [
        'Que está autorizada a captar dinero del público.',
        'Que está registrada como contribuyente, pero no necesariamente autorizada.',
        'Que la SBS la supervisa.'
      ],
      answer: 1,
      why: 'El RUC lo tiene cualquier negocio formal. La autorización para captar dinero se verifica en la SMV o la SBS.'
    },
    {
      q: '¿Qué hace la diversificación?',
      options: [
        'Reparte tu dinero en distintas opciones para no depender de una sola.',
        'Asegura que siempre ganes.',
        'Elimina por completo el riesgo.'
      ],
      answer: 0,
      why: 'Diversificar reduce el impacto de un fracaso, pero no elimina el riesgo ni asegura ganancias.'
    },
    {
      q: '¿Qué entidad supervisa a bancos, financieras y cajas?',
      options: ['La SBS.', 'La SUNAT.', 'Indecopi.'],
      answer: 0,
      why: 'La SBS supervisa bancos, financieras, cajas, aseguradoras y AFP. La SMV supervisa el mercado de valores.'
    }
  ];

  var root = document.getElementById('quiz-root');
  var form = document.getElementById('quiz-form');
  var out = document.getElementById('quiz-result');
  var resetBtn = document.getElementById('quiz-reset');
  var submitBtn = document.getElementById('quiz-submit');
  if (!root || !form) return;

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text) n.textContent = text;
    return n;
  }

  /* Orden aleatorio de las opciones; el valor de cada opción sigue siendo su índice original */
  function shuffle(arr) {
    for (var i = arr.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = arr[i]; arr[i] = arr[j]; arr[j] = t;
    }
    return arr;
  }

  function render() {
    root.textContent = '';
    QUESTIONS.forEach(function (item, qi) {
      var fs = el('fieldset', 'card field');
      fs.style.marginBottom = 'var(--space-md)';
      fs.setAttribute('data-q', qi);
      var legend = el('legend', '', (qi + 1) + '. ' + item.q);
      legend.style.cssText = 'font-weight:600; padding:0; margin-bottom: var(--space-sm);';
      fs.appendChild(legend);
      var group = el('div', '');
      group.style.cssText = 'display:grid; gap: var(--space-sm);';
      shuffle(item.options.map(function (_, i) { return i; })).forEach(function (oi) {
        var opt = item.options[oi];
        var label = el('label', 'choice');
        label.style.display = 'flex';
        var input = document.createElement('input');
        input.type = 'radio'; input.name = 'q' + qi; input.value = oi;
        var span = el('span', '', opt);
        span.style.cssText = 'width:100%; min-height: var(--target-min); padding-block: var(--space-sm);';
        label.appendChild(input); label.appendChild(span);
        group.appendChild(label);
      });
      fs.appendChild(group);
      var fb = el('p', 'hint');
      fb.id = 'fb' + qi;
      fb.style.marginTop = 'var(--space-sm)';
      fs.appendChild(fb);
      root.appendChild(fs);
    });
    out.textContent = '';
    resetBtn.hidden = true;
    submitBtn.hidden = false;
    var last = store.get(QUIZ_KEY, null);
    if (last && typeof last.score === 'number') {
      out.appendChild(el('p', 'caption', 'Tu último resultado en este navegador: ' + last.score + ' de ' + last.total + '.'));
    }
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var answers = QUESTIONS.map(function (_, qi) {
      var c = form.querySelector('input[name="q' + qi + '"]:checked');
      return c ? Number(c.value) : -1;
    });
    if (answers.indexOf(-1) > -1) {
      out.textContent = '';
      var first = answers.indexOf(-1);
      var note = el('div', 'note');
      var ic = el('span', 'icon', 'info'); ic.setAttribute('aria-hidden', 'true');
      note.appendChild(ic);
      note.appendChild(el('p', '', 'Responde las 6 preguntas para ver tu resultado. Te falta la pregunta ' + (first + 1) + '.'));
      out.appendChild(note);
      var target = form.querySelector('input[name="q' + first + '"]');
      if (target) target.focus();
      return;
    }
    var score = 0;
    QUESTIONS.forEach(function (item, qi) {
      var ok = answers[qi] === item.answer;
      if (ok) score++;
      var fb = document.getElementById('fb' + qi);
      fb.textContent = '';
      var ic = el('span', 'icon icon-sm', ok ? 'check_circle' : 'info');
      ic.setAttribute('aria-hidden', 'true');
      ic.style.cssText = 'vertical-align:-4px; color: ' + (ok ? 'var(--color-risk-low)' : 'var(--color-primary)') + ';';
      fb.appendChild(ic);
      var lead = el('strong', '', ok ? ' Correcto. ' : ' La respuesta es: “' + item.options[item.answer] + '” ');
      fb.appendChild(lead);
      fb.appendChild(document.createTextNode(item.why));
      fb.style.color = 'var(--color-ink)';
      Array.prototype.forEach.call(form.querySelectorAll('input[name="q' + qi + '"]'), function (i) { i.disabled = true; });
    });
    store.set(QUIZ_KEY, { score: score, total: QUESTIONS.length, date: new Date().toISOString() });
    out.textContent = '';
    var msg = score === QUESTIONS.length
      ? 'Respondiste bien las ' + QUESTIONS.length + ' preguntas.'
      : 'Acertaste ' + score + ' de ' + QUESTIONS.length + '. Repasa las lecciones y vuelve a intentarlo cuando quieras.';
    var box = el('div', 'note');
    var ic2 = el('span', 'icon', 'task_alt'); ic2.setAttribute('aria-hidden', 'true');
    box.appendChild(ic2);
    var p = el('p', '');
    p.appendChild(el('strong', '', 'Tu resultado: ' + score + ' de ' + QUESTIONS.length + '. '));
    p.appendChild(document.createTextNode(msg));
    box.appendChild(p);
    out.appendChild(box);
    submitBtn.hidden = true;
    resetBtn.hidden = false;
    resetBtn.focus();
  });

  resetBtn.addEventListener('click', function () {
    render();
    var first = form.querySelector('input');
    if (first) first.focus();
  });

  render();
})();

/* ---------- Pestañas y feed de casos con fuente pública (US39) ---------- */
(function () {
  'use strict';

  var CASES = [
    { title: 'Forex y CFD: ninguna empresa está autorizada en el Perú', source: 'SMV, comunicado sobre Forex y CFD', date: 'Fecha: ver el documento',
      text: 'La SMV indica que ninguna empresa en el Perú está autorizada para ofrecer públicamente productos y servicios del mercado Forex, y pide no entregar dinero a ese tipo de empresas.',
      url: 'https://www.smv.gob.pe/uploads/SobreForexyCFD.pdf', signal: 'regulacion' },
    { title: 'Criptomonedas y financiamiento con tokens', source: 'SMV, 2021', date: '2021',
      text: 'La SMV advierte que no existe en el Perú una regulación específica que ampare la oferta o promoción de criptomonedas o tokens, y recomienda informarse antes de participar.',
      url: 'https://www.gob.pe/institucion/smv/noticias/1121398-advertencia-sobre-la-adquisicion-de-monedas-virtuales-o-criptomonedas-y-la-participacion-en-esquemas-de-financiamiento-por-el-uso-de-tokens', signal: 'regulacion' },
    { title: 'Captar dinero sin autorización es un delito', source: 'SBS, comunicado de prensa', date: 'Fecha: ver el comunicado',
      text: 'La SBS advierte sobre entidades que reciben dinero del público sin autorización y que prometen pagar altos intereses como ganancia.',
      url: 'https://www.sbs.gob.pe/noticia/detallenoticia/idnoticia/3860', signal: 'rentabilidad' },
    { title: 'Esquemas de informalidad financiera', source: 'SBS, comunicado', date: 'Fecha: ver el comunicado',
      text: 'La SBS explica cómo reconocer esquemas informales que aparentan ser entidades financieras para captar ahorros.',
      url: 'https://www.sbs.gob.pe/noticia/detallenoticia/idnoticia/2654', signal: 'regulacion' },
    { title: 'Las pirámides financieras y la certeza de perder nuestros ahorros', source: 'SBS, Boletín quincenal N.º 11', date: 'Julio de 2017',
      text: 'La SBS describe cómo funcionan las pirámides: piden incluir a más personas a cambio de mayores ganancias y terminan en pérdida para la mayoría.',
      url: 'https://www.sbs.gob.pe/Portals/0/jer/BOL-QUINCENAL/20170714_BolQuincenal-N11.pdf', signal: 'referidos' }
  ];

  var tabL = document.getElementById('tab-lecciones');
  var tabC = document.getElementById('tab-casos');
  var panelL = document.getElementById('panel-lecciones');
  var panelC = document.getElementById('panel-casos');
  var listC = document.getElementById('casos-list');
  if (!tabL || !tabC || !panelC) return;

  CASES.forEach(function (c) {
    var art = document.createElement('article');
    art.className = 'card';
    var h = document.createElement('h3');
    h.textContent = c.title;
    var meta = document.createElement('p');
    meta.className = 'case-meta';
    meta.textContent = c.source + ' · ' + c.date;
    var p = document.createElement('p');
    p.textContent = c.text;
    var row = document.createElement('div');
    row.className = 'btn-row';
    row.style.marginTop = 'var(--space-md)';
    var src = document.createElement('a');
    src.className = 'btn btn-secondary';
    src.href = c.url;
    src.target = '_blank';
    src.rel = 'noopener noreferrer';
    src.textContent = 'Leer la fuente oficial';
    var sig = document.createElement('a');
    sig.className = 'btn btn-tertiary';
    sig.href = 'senales.html#' + c.signal;
    sig.textContent = 'Ver señales de este caso';
    row.appendChild(src);
    row.appendChild(sig);
    art.appendChild(h);
    art.appendChild(meta);
    art.appendChild(p);
    art.appendChild(row);
    listC.appendChild(art);
  });

  function select(which, focus) {
    var cases = which === 'casos';
    tabL.setAttribute('aria-selected', String(!cases));
    tabC.setAttribute('aria-selected', String(cases));
    tabL.tabIndex = cases ? -1 : 0;
    tabC.tabIndex = cases ? 0 : -1;
    panelL.hidden = cases;
    panelC.hidden = !cases;
    if (focus) (cases ? tabC : tabL).focus();
  }
  tabL.addEventListener('click', function () { select('lecciones'); });
  tabC.addEventListener('click', function () { select('casos'); });
  [tabL, tabC].forEach(function (t) {
    t.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') { select(t === tabL ? 'casos' : 'lecciones', true); e.preventDefault(); }
    });
  });
  if (location.hash === '#casos') select('casos');

  /* Abre la lección indicada en el enlace (por ejemplo, desde el Centro de ayuda) */
  var target = location.hash && document.querySelector('details[data-lesson]' + location.hash);
  if (target) { target.open = true; target.scrollIntoView(); }
})();
