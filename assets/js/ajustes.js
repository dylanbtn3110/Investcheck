/* InvestCheck — ajustes y apoyo transversal a todas las páginas.
   US30 lector de pantalla (región de avisos), US31 alto contraste, US32 reducir movimiento,
   US33 tutorial, US25 aviso de recordatorios, US42/US43 idioma, US45 encuesta breve.
   Todo se guarda en localStorage de este navegador. */
(function () {
  'use strict';

  var store = window.InvestCheckStorage;
  var I18n = window.InvestCheckI18n;
  var Core = window.InvestCheckCore;
  var SETTINGS_KEY = 'investcheck.settings';
  var ONBOARD_KEY = 'investcheck.onboarded';
  var SURVEY_KEY = 'investcheck.survey';
  var REMINDERS_KEY = 'investcheck.reminders';
  var HISTORY_KEY = 'investcheck.history';
  var root = document.documentElement;
  if (!store) return;

  function el(tag, props) {
    var node = document.createElement(tag);
    props = props || {};
    Object.keys(props).forEach(function (k) {
      if (k === 'class') node.className = props[k];
      else if (k === 'text') node.textContent = props[k];
      else if (k === 'onclick') node.addEventListener('click', props[k]);
      else node.setAttribute(k, props[k]);
    });
    for (var i = 2; i < arguments.length; i++) {
      var c = arguments[i];
      if (c) node.appendChild(typeof c === 'string' ? document.createTextNode(c) : c);
    }
    return node;
  }
  function icon(name, extra) { return el('span', { class: 'icon' + (extra ? ' ' + extra : ''), 'aria-hidden': 'true', text: name }); }

  /* ---------- Ajustes guardados ---------- */

  var prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var settings = Object.assign({ contrast: false, motion: !!prefersReduced, lang: 'es', alerts: true }, store.get(SETTINGS_KEY, {}));

  function save() { store.set(SETTINGS_KEY, settings); }

  /* ---------- Región de avisos para lector de pantalla (US30) ---------- */

  var live = el('div', { class: 'sr-only', id: 'a11y-live', role: 'status', 'aria-live': 'polite', 'aria-atomic': 'true' });
  document.body.appendChild(live);
  function announce(text) {
    live.textContent = '';
    window.setTimeout(function () { live.textContent = text; }, 50);
  }
  window.InvestCheckAnnounce = announce;

  /* ---------- Aplicar ajustes ---------- */

  var nativeScroll = Element.prototype.scrollIntoView;
  Element.prototype.scrollIntoView = function (opts) {
    if (settings.motion && opts && typeof opts === 'object') opts = Object.assign({}, opts, { behavior: 'auto' });
    return nativeScroll.call(this, opts);
  };

  function applyContrast() { root.classList.toggle('hc', !!settings.contrast); }
  function applyMotion() { root.classList.toggle('reduce-motion', !!settings.motion); }
  function applyLang() { if (I18n) I18n.setLang(settings.lang); }

  applyContrast();
  applyMotion();

  /* ---------- Utilidades de diálogo ---------- */

  function makeDialog(id, labelledBy) {
    var d = el('dialog', { class: 'dialog', id: id, 'aria-labelledby': labelledBy });
    d.addEventListener('click', function (e) { if (e.target === d) d.close(); });
    document.body.appendChild(d);
    return d;
  }

  function openDialog(d) {
    if (typeof d.showModal === 'function') d.showModal();
    else d.setAttribute('open', '');
  }

  function switchRow(id, label, hint, checked, onChange) {
    var input = el('input', { type: 'checkbox', role: 'switch', id: id, class: 'switch-input' });
    input.checked = checked;
    input.addEventListener('change', function () { onChange(input.checked); });
    return el('div', { class: 'setting-row' },
      el('div', {}, el('label', { for: id, class: 'setting-label', text: label }), el('p', { class: 'caption', id: id + '-hint', text: hint })),
      input
    );
  }

  /* ---------- Panel de ajustes ---------- */

  function buildSettings() {
    var d = makeDialog('ajustes-dialog', 'ajustes-title');
    var body = el('div', {});
    d.appendChild(body);

    function render() {
      body.textContent = '';
      body.appendChild(el('h2', { id: 'ajustes-title', text: 'Ajustes' }));

      var langs = el('fieldset', { class: 'setting-fieldset' }, el('legend', { text: 'Idioma' }));
      var choices = el('div', { class: 'choices', role: 'group' });
      (I18n ? I18n.LANGS : [{ code: 'es', label: 'Español (Perú)' }]).forEach(function (l) {
        var input = el('input', { type: 'radio', name: 'lang', value: l.code });
        input.checked = settings.lang === l.code;
        input.addEventListener('change', function () {
          settings.lang = l.code; save(); applyLang();
          announce(l.label);
          render();
        });
        choices.appendChild(el('label', { class: 'choice' }, input, el('span', { 'data-no-i18n': '', text: l.label })));
      });
      langs.appendChild(choices);
      langs.appendChild(el('p', { class: 'caption', style: 'margin-top: var(--space-sm);', 'data-no-i18n': '',
        text: settings.lang === 'qu'
          ? 'Quechua (beta): solo hay unos pocos términos traducidos. Un hablante de quechua debe revisarlos antes de la versión final.'
          : (settings.lang === 'en' ? 'English covers the navigation, the check flow and the main pages. Anything not translated stays in Spanish.' : '') }));
      body.appendChild(langs);

      body.appendChild(switchRow('set-contrast', 'Alto contraste', 'Mejora la lectura con colores más intensos (contraste mínimo 7:1).', settings.contrast, function (v) {
        settings.contrast = v; save(); applyContrast(); announce(v ? 'Alto contraste activado' : 'Alto contraste desactivado');
      }));
      body.appendChild(switchRow('set-motion', 'Reducir movimiento', 'Las transiciones aparecen de inmediato.', settings.motion, function (v) {
        settings.motion = v; save(); applyMotion(); announce(v ? 'Movimiento reducido' : 'Movimiento normal');
      }));

      body.appendChild(switchRow('set-alerts', 'Avisos de ofertas parecidas', 'Te avisamos cuando una evaluación se parece a otra que ya guardaste.', settings.alerts !== false, function (v) {
        settings.alerts = v; save(); announce(v ? 'Avisos activados' : 'Avisos desactivados');
      }));

      body.appendChild(el('div', { class: 'btn-row', style: 'margin-top: var(--space-lg);' },
        el('button', { type: 'button', class: 'btn btn-secondary', onclick: function () { d.close(); showTutorial(true); } }, icon('play_circle', 'icon-sm'), 'Ver tutorial'),
        el('a', { class: 'btn btn-tertiary', href: 'ayuda.html' }, icon('help', 'icon-sm'), 'Centro de ayuda')
      ));
      body.appendChild(el('div', { class: 'actions' },
        el('button', { type: 'button', class: 'btn', autofocus: '', onclick: function () { d.close(); }, text: 'Cerrar' })
      ));
      if (I18n) I18n.apply(body, settings.lang);
    }
    render();
    return d;
  }

  var settingsDialog = null;
  function openSettings() {
    if (!settingsDialog) settingsDialog = buildSettings();
    openDialog(settingsDialog);
  }
  window.InvestCheckOpenSettings = openSettings;

  function mountHeaderButton() {
    var container = document.querySelector('.site-header .container');
    var toggle = container && container.querySelector('.nav-toggle');
    if (!container) return;
    var btn = el('button', { type: 'button', class: 'nav-toggle settings-btn', 'aria-haspopup': 'dialog', 'aria-label': 'Ajustes', title: 'Ajustes' }, icon('tune'));
    btn.addEventListener('click', openSettings);
    container.insertBefore(btn, toggle);
  }

  /* ---------- Tutorial del primer uso (US33) ---------- */

  var TUTORIAL = [
    { icon: 'waving_hand', title: 'Así funciona InvestCheck', text: 'Te guiamos en tu primera evaluación. Son 4 pasos cortos y no hace falta saber de finanzas.' },
    { icon: 'edit_note', title: 'Registra una oferta', text: 'Escribe el monto, la ganancia que te prometen y quién la ofrece. Si no sabes algo, elige “No sé”.' },
    { icon: 'flag', title: 'Revisa las señales', text: 'Comprobamos 6 señales de alerta, como presión para decidir rápido o ganancias garantizadas.' },
    { icon: 'verified_user', title: 'Mira tu resultado', text: 'Verás un nivel de riesgo con color, ícono y texto, y qué verificar antes de decidir. No te recomendamos invertir ni dejar de invertir.' }
  ];

  function showTutorial() {
    var d = makeDialog('tutorial-dialog', 'tutorial-title');
    var i = 0;
    var body = el('div', {});
    d.appendChild(body);
    function finish() {
      store.set(ONBOARD_KEY, true);
      d.close();
      d.remove();
    }
    d.addEventListener('cancel', function () { store.set(ONBOARD_KEY, true); });
    function render() {
      var s = TUTORIAL[i];
      body.textContent = '';
      var dots = el('div', { class: 'dots', role: 'img', 'aria-label': 'Paso ' + (i + 1) + ' de ' + TUTORIAL.length });
      TUTORIAL.forEach(function (_, k) { dots.appendChild(el('span', { class: k === i ? 'on' : '' })); });
      var next = el('button', { type: 'button', class: 'btn', onclick: function () {
        if (i < TUTORIAL.length - 1) { i++; render(); } else { finish(); }
      }, text: i < TUTORIAL.length - 1 ? 'Siguiente' : 'Comenzar' });
      body.appendChild(el('div', { class: 'tutorial-icon' }, icon(s.icon)));
      body.appendChild(el('h2', { id: 'tutorial-title', text: s.title, tabindex: '-1' }));
      body.appendChild(el('p', { class: 'muted', text: s.text }));
      body.appendChild(dots);
      body.appendChild(el('div', { class: 'actions' },
        el('button', { type: 'button', class: 'btn btn-tertiary', onclick: finish, text: 'Saltar' }),
        next
      ));
      if (I18n) I18n.apply(body, settings.lang);
      next.focus();
      announce(s.title);
    }
    render();
    openDialog(d);
  }

  /* ---------- Recordatorios vencidos o por vencer (US25) ---------- */

  function showReminderBanner() {
    if (!Core) return;
    var list = store.get(REMINDERS_KEY, []);
    if (!Array.isArray(list) || !list.length) return;
    var due = Core.dueReminders(list, new Date());
    if (!due.length) return;
    var main = document.getElementById('contenido');
    if (!main) return;
    var history = store.get(HISTORY_KEY, []);
    var names = due.map(function (r) {
      var e = history.filter(function (h) { return h.id === r.id; })[0];
      return (e && e.name) || 'Oferta sin nombre';
    });
    var banner = el('div', { class: 'container', style: 'padding-top: var(--space-md);' },
      el('div', { class: 'note', role: 'status' }, icon('notifications_active'),
        el('p', {}, el('strong', { text: 'Recordatorio: ' }),
          'revisa ' + names.join(', ') + ' antes de la fecha límite que guardaste. ',
          el('a', { href: 'evaluar.html#historial', text: 'Ver historial' }))));
    main.insertBefore(banner, main.firstChild);
    announce('Tienes ' + due.length + ' recordatorio' + (due.length > 1 ? 's' : '') + ' por revisar');
  }

  /* ---------- Encuesta breve de satisfacción, solo en inicio y tras 3 evaluaciones (US45) ---------- */

  var QUESTIONS = [
    { id: 'claro', text: '¿Qué tan claro fue el resultado?', options: ['Muy claro', 'Más o menos', 'Confuso'] },
    { id: 'facil', text: '¿Qué tan fácil fue completar la evaluación?', options: ['Fácil', 'Normal', 'Difícil'] },
    { id: 'volver', text: '¿Volverías a usar InvestCheck antes de decidir?', options: ['Sí', 'Tal vez', 'No'] }
  ];

  function maybeSurvey() {
    if (!/(^|\/)(index\.html)?$/.test(location.pathname)) return;
    var history = store.get(HISTORY_KEY, []);
    var state = store.get(SURVEY_KEY, {});
    if (!Array.isArray(history) || history.length < 3 || state.done) return;
    if (state.later && Date.now() - state.later < 3 * 86400000) return;

    var main = document.getElementById('contenido');
    if (!main) return;
    var card = el('section', { class: 'container', 'aria-labelledby': 'survey-title', style: 'padding-top: var(--space-md);' });
    var inner = el('div', { class: 'card card-tint' });
    card.appendChild(inner);

    function renderIntro() {
      inner.textContent = '';
      inner.appendChild(el('h2', { class: 't-h3', id: 'survey-title', text: '¿Cómo va tu experiencia?' }));
      inner.appendChild(el('p', { class: 'muted', text: 'Ya hiciste tres evaluaciones. Son 3 preguntas de opción y nos ayudan a mejorar.' }));
      inner.appendChild(el('div', { class: 'btn-row', style: 'margin-top: var(--space-md);' },
        el('button', { type: 'button', class: 'btn', text: 'Responder', onclick: renderForm }),
        el('button', { type: 'button', class: 'btn btn-tertiary', text: 'Más tarde', onclick: function () {
          store.set(SURVEY_KEY, { later: Date.now() }); card.remove();
        } })
      ));
      if (I18n) I18n.apply(inner, settings.lang);
    }

    function renderForm() {
      inner.textContent = '';
      var form = el('form', { novalidate: '' });
      form.appendChild(el('h2', { class: 't-h3', id: 'survey-title', text: 'Encuesta breve' }));
      QUESTIONS.forEach(function (q) {
        var fs = el('fieldset', { class: 'field', style: 'margin-top: var(--space-md);' }, el('legend', { text: q.text }));
        var ch = el('div', { class: 'choices', role: 'group' });
        q.options.forEach(function (o) {
          var input = el('input', { type: 'radio', name: q.id, value: o });
          ch.appendChild(el('label', { class: 'choice' }, input, el('span', { text: o })));
        });
        fs.appendChild(ch);
        form.appendChild(fs);
      });
      var err = el('p', { class: 'caption', role: 'alert', style: 'color: var(--color-risk-high); margin-top: var(--space-sm);' });
      form.appendChild(err);
      form.appendChild(el('div', { class: 'btn-row', style: 'margin-top: var(--space-md);' },
        el('button', { type: 'submit', class: 'btn', text: 'Enviar' }),
        el('button', { type: 'button', class: 'btn btn-tertiary', text: 'Más tarde', onclick: function () { store.set(SURVEY_KEY, { later: Date.now() }); card.remove(); } })
      ));
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        var answers = {};
        var ok = QUESTIONS.every(function (q) {
          var c = form.querySelector('input[name="' + q.id + '"]:checked');
          if (c) answers[q.id] = c.value;
          return !!c;
        });
        if (!ok) { err.textContent = 'Responde las tres preguntas para enviar.'; return; }
        store.set(SURVEY_KEY, { done: true, date: new Date().toISOString(), answers: answers });
        inner.textContent = '';
        inner.appendChild(el('p', { role: 'status' }, icon('check_circle'), ' Gracias. Tus respuestas se guardaron solo en este navegador.'));
        announce('Gracias por responder la encuesta');
        window.setTimeout(function () { card.remove(); }, 4000);
      });
      inner.appendChild(form);
      if (I18n) I18n.apply(inner, settings.lang);
    }

    renderIntro();
    main.insertBefore(card, main.firstChild);
  }

  /* ---------- Inicio ---------- */

  function init() {
    mountHeaderButton();
    applyLang();
    showReminderBanner();
    maybeSurvey();
    if (!store.get(ONBOARD_KEY, false) && /(^|\/)(index\.html)?$/.test(location.pathname)) showTutorial(false);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
