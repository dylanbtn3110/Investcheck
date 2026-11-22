/* InvestCheck — flujo de evaluación por pasos, resultado e historial.
   Todo se guarda en localStorage del navegador; no se envía nada a ningún servidor. */
(function () {
  'use strict';

  var Risk = window.InvestCheckRisk;
  var store = window.InvestCheckStorage;
  var DRAFT_KEY = 'investcheck.draft';
  var HISTORY_KEY = 'investcheck.history';
  var HISTORY_MAX = 20;
  var REMINDERS_KEY = 'investcheck.reminders';
  var RATINGS_KEY = 'investcheck.ratings';
  var SETTINGS_KEY = 'investcheck.settings';
  var Core = window.InvestCheckCore;

  var STEPS = ['La oferta', 'Quién la ofrece', 'Cómo te la presentan', 'Documentos y revisión'];
  var STEP_FIELDS = {
    1: ['amount', 'rate', 'period'],
    2: ['ruc', 'registered'],
    3: ['pressure', 'referrals', 'guaranteed'],
    4: ['contract']
  };

  var form = document.getElementById('wizard');
  var resultBox = document.getElementById('result');
  var draftNote = document.getElementById('draft-note');
  var btnBack = document.getElementById('btn-back');
  var btnNext = document.getElementById('btn-next');
  var stepNow = document.getElementById('step-now');
  var stepName = document.getElementById('step-name');
  var stepBar = document.getElementById('stepper-bar');
  var historyRoot = document.getElementById('history-root');
  var historyClear = document.getElementById('history-clear');
  if (!form || !Risk) return;

  var step = 1;

  /* ---------- Utilidades ---------- */

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
      if (Array.isArray(c)) c.forEach(function (x) { if (x) node.appendChild(typeof x === 'string' ? document.createTextNode(x) : x); });
      else if (c) node.appendChild(typeof c === 'string' ? document.createTextNode(c) : c);
    }
    return node;
  }

  function icon(name, extra) {
    return el('span', { class: 'icon' + (extra ? ' ' + extra : ''), 'aria-hidden': 'true', text: name });
  }

  /* Acepta "5000", "5,000.00", "5.000,50" y "10,5" */
  function parseNumber(raw) {
    var s = String(raw || '').replace(/[S\/\s%]/gi, '');
    if (!s) return NaN;
    if (s.indexOf('.') > -1 && s.indexOf(',') > -1) {
      s = s.lastIndexOf('.') > s.lastIndexOf(',') ? s.replace(/,/g, '') : s.replace(/\./g, '').replace(',', '.');
    } else if (s.indexOf(',') > -1) {
      s = /,\d{1,2}$/.test(s) ? s.replace(',', '.') : s.replace(/,/g, '');
    }
    return /^\d*\.?\d+$|^\d+\.$/.test(s) ? parseFloat(s) : NaN;
  }

  function fieldEl(name) { return form.querySelector('[data-field="' + name + '"]'); }

  function radioValue(name) {
    var checked = form.querySelector('input[name="' + name + '"]:checked');
    return checked ? checked.value : '';
  }

  function readAnswers() {
    return {
      amount: form.elements.amount.value.trim(),
      rate: form.elements.rate.value.trim(),
      period: radioValue('period'),
      name: form.elements.name.value.trim(),
      ruc: form.elements.ruc.value.trim(),
      registered: radioValue('registered'),
      pressure: radioValue('pressure'),
      referrals: radioValue('referrals'),
      guaranteed: radioValue('guaranteed'),
      contract: radioValue('contract')
    };
  }

  function fillAnswers(a) {
    ['amount', 'rate', 'name', 'ruc'].forEach(function (n) { form.elements[n].value = a[n] || ''; });
    ['period', 'registered', 'pressure', 'referrals', 'guaranteed', 'contract'].forEach(function (n) {
      var radios = form.querySelectorAll('input[name="' + n + '"]');
      Array.prototype.forEach.call(radios, function (r) { r.checked = a[n] === r.value; });
    });
  }

  function hasAnyAnswer(a) {
    return Object.keys(a).some(function (k) { return a[k]; });
  }

  /* ---------- Validación (al salir del campo, no mientras se escribe) ---------- */

  function validateField(name) {
    var a = readAnswers();
    var msg = '';
    if (name === 'amount') {
      var amount = parseNumber(a.amount);
      if (!(amount > 0)) msg = 'Ingresa un monto mayor a cero.';
      else if (amount > 1e9) msg = 'Revisa el monto: parece demasiado alto.';
    } else if (name === 'rate') {
      var rate = parseNumber(a.rate);
      if (!(rate > 0)) msg = 'Ingresa un porcentaje mayor a cero.';
      else if (rate > 10000) msg = 'Revisa el porcentaje: parece demasiado alto.';
    } else if (name === 'ruc') {
      if (a.ruc && !/^\d{11}$/.test(a.ruc)) msg = 'El RUC debe tener 11 dígitos.';
    } else if (name === 'period') {
      if (!a.period) msg = 'Elige el periodo.';
    } else if (!a[name]) {
      msg = 'Elige una opción.';
    }
    setError(name, msg);
    return !msg;
  }

  function setError(name, msg) {
    var field = fieldEl(name);
    if (!field) return;
    field.classList.toggle('has-error', !!msg);
    var holder = field.querySelector('.msg');
    if (holder && msg) holder.textContent = msg;
    var input = field.querySelector('input.control');
    if (input) input.setAttribute('aria-invalid', msg ? 'true' : 'false');
  }

  function validateStep(n) {
    var firstBad = null;
    STEP_FIELDS[n].forEach(function (name) {
      if (!validateField(name) && !firstBad) firstBad = name;
    });
    if (firstBad) {
      var field = fieldEl(firstBad);
      var target = field.querySelector('input');
      if (target) target.focus();
    }
    return !firstBad;
  }

  /* ---------- Navegación entre pasos ---------- */

  function goTo(n, focusHeading) {
    step = n;
    Array.prototype.forEach.call(form.querySelectorAll('.step'), function (s) {
      s.hidden = Number(s.getAttribute('data-step')) !== n;
    });
    stepNow.textContent = n;
    stepName.textContent = STEPS[n - 1];
    stepBar.setAttribute('aria-valuenow', n);
    stepBar.setAttribute('aria-valuetext', 'Paso ' + n + ' de 4');
    Array.prototype.forEach.call(stepBar.children, function (bar, i) {
      bar.className = i + 1 < n ? 'is-done' : (i + 1 === n ? 'is-current' : '');
    });
    btnBack.hidden = n === 1;
    btnNext.textContent = n === 4 ? 'Ver resultado' : 'Continuar';
    if (n === 4) renderReview();
    saveDraft();
    if (focusHeading) {
      var h = document.getElementById('h-step-' + n);
      if (h) h.focus({ preventScroll: false });
    }
  }

  function renderReview() {
    var a = readAnswers();
    var review = document.getElementById('review');
    review.textContent = '';
    var yn = { si: 'Sí', no: 'No', nose: 'No sé' };
    var rows = [
      [1, 'Monto', parseNumber(a.amount) > 0 ? Risk.formatMoney(parseNumber(a.amount)) : '—'],
      [1, 'Rentabilidad prometida', parseNumber(a.rate) > 0 ? Risk.formatPercent(parseNumber(a.rate)) + ' ' + (a.period || '') : '—'],
      [2, 'Quién la ofrece', a.name || 'Sin nombre'],
      [2, 'RUC', a.ruc || 'No indicado'],
      [2, 'Figura en SMV o SBS', yn[a.registered] || '—'],
      [3, 'Presión para decidir rápido', yn[a.pressure] || '—'],
      [3, 'Ganas más si traes personas', yn[a.referrals] || '—'],
      [3, 'Te aseguran que no hay riesgo', yn[a.guaranteed] || '—']
    ];
    rows.forEach(function (r) {
      var line = el('div', { style: 'display:flex; justify-content:space-between; gap:1rem; align-items:center; flex-wrap:wrap;' });
      var dt = el('dt', { class: 'muted', text: r[1] });
      var dd = el('dd', { style: 'margin:0; display:flex; align-items:center; gap:.5rem;' },
        el('strong', { text: r[2], style: 'overflow-wrap:anywhere;' }),
        el('button', { type: 'button', class: 'btn btn-tertiary', 'aria-label': 'Cambiar: ' + r[1], text: 'Cambiar', onclick: function () { goTo(r[0], true); } })
      );
      line.appendChild(dt); line.appendChild(dd);
      review.appendChild(line);
    });
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!validateStep(step)) return;
    if (step < 4) { goTo(step + 1, true); return; }
    // Paso final: valida todo por si se editó algo desde la revisión
    for (var n = 1; n <= 3; n++) {
      if (!validateStep(n)) { goTo(n, false); return; }
    }
    finish();
  });

  btnBack.addEventListener('click', function () { if (step > 1) goTo(step - 1, true); });

  form.addEventListener('focusout', function (e) {
    var field = e.target.closest && e.target.closest('[data-field]');
    if (!field) return;
    var name = field.getAttribute('data-field');
    if (name === 'amount' || name === 'rate' || name === 'ruc') validateField(name);
  });
  form.addEventListener('change', function (e) {
    var field = e.target.closest && e.target.closest('[data-field]');
    if (field && e.target.type === 'radio') setError(field.getAttribute('data-field'), '');
    saveDraft();
  });
  form.addEventListener('input', function (e) {
    var field = e.target.closest && e.target.closest('[data-field]');
    var name = field && field.getAttribute('data-field');
    if (field && field.classList.contains('has-error') && (name === 'amount' || name === 'rate' || name === 'ruc')) validateField(name);
    saveDraft();
  });

  /* ---------- Borrador (avance automático) ---------- */

  function saveDraft() {
    var a = readAnswers();
    if (hasAnyAnswer(a)) store.set(DRAFT_KEY, { step: step, answers: a });
  }

  function restoreDraft() {
    var draft = store.get(DRAFT_KEY, null);
    if (!draft || !draft.answers || !hasAnyAnswer(draft.answers)) return false;
    fillAnswers(draft.answers);
    goTo(Math.min(Math.max(Number(draft.step) || 1, 1), 4), false);
    draftNote.hidden = false;
    return true;
  }

  function resetForm() {
    form.reset();
    Array.prototype.forEach.call(form.querySelectorAll('.has-error'), function (f) { f.classList.remove('has-error'); });
    store.remove(DRAFT_KEY);
    draftNote.hidden = true;
    goTo(1, false);
  }

  document.getElementById('draft-reset').addEventListener('click', function () {
    resetForm();
    form.elements.amount.focus();
  });

  /* ---------- Resultado ---------- */

  function finish() {
    var a = readAnswers();
    var entry = buildEntry(a);
    addHistory(entry);
    store.remove(DRAFT_KEY);
    draftNote.hidden = true;
    showResult(entry, false);
  }

  function toRiskInput(a) {
    return {
      rate: parseNumber(a.rate), period: a.period, registered: a.registered,
      pressure: a.pressure, referrals: a.referrals, guaranteed: a.guaranteed, contract: a.contract
    };
  }

  function buildEntry(a) {
    var res = Risk.evaluate(toRiskInput(a));
    return {
      id: Date.now(),
      date: new Date().toISOString(),
      level: res.level.id,
      count: res.count,
      total: res.total,
      name: a.name,
      amount: parseNumber(a.amount),
      rate: parseNumber(a.rate),
      period: a.period,
      answers: a
    };
  }

  function showResult(entry, fromHistory) {
    var res = Risk.evaluate(toRiskInput(entry.answers));
    var level = res.level;
    resultBox.textContent = '';

    var meter = el('div', { class: 'meter', 'aria-hidden': 'true' });
    for (var i = 0; i < res.total; i++) meter.appendChild(el('span', { class: i < res.count ? 'on' : '' }));

    var offerLine = (entry.name ? entry.name + ' · ' : '') + Risk.formatMoney(entry.amount) + ' · ' + Risk.formatPercent(entry.rate) + ' ' + entry.period;

    var headingId = 'result-heading';
    var card = el('div', { class: 'result-card risk-' + level.id },
      el('p', { class: 'kicker', text: 'Resultado de tu evaluación' }),
      el('div', { class: 'result-head', role: 'status' },
        el('div', { class: 'result-icon' }, icon(level.icon)),
        el('div', {},
          el('h2', { class: 'result-level', id: headingId, tabindex: '-1', text: level.label }),
          el('p', { class: 'result-count', text: res.count + ' de ' + res.total + ' señales de alerta detectadas' })
        )
      ),
      meter,
      el('p', { text: res.summary }),
      el('p', { class: 'caption', style: 'margin-top: var(--space-sm); overflow-wrap:anywhere;', text: offerLine }),
      el('div', { style: 'display:grid; gap: var(--space-sm); margin-top: var(--space-md);' },
        el('button', { type: 'button', class: 'btn btn-block', text: 'Ver qué verificar', onclick: function () {
          var t = document.getElementById('que-verificar');
          t.scrollIntoView({ behavior: 'smooth', block: 'start' });
          t.focus({ preventScroll: true });
        } }),
        el('button', { type: 'button', class: 'btn btn-secondary btn-block', text: fromHistory ? 'Volver a la evaluación' : 'Iniciar otra evaluación', onclick: function () {
          resultBox.hidden = true; form.hidden = false; resetForm();
          document.getElementById('evaluacion').scrollIntoView({ behavior: 'smooth', block: 'start' });
          form.elements.amount.focus({ preventScroll: true });
        } }),
        el('button', { type: 'button', class: 'btn btn-tertiary btn-block', onclick: function () { window.print(); } }, icon('print', 'icon-sm'), 'Guardar como PDF')
      )
    );

    var list = el('ul', { class: 'signal-list card', 'aria-label': 'Señales revisadas' });
    res.signals.forEach(function (s) {
      var cls = s.status === 'alert' ? 'is-alert' : (s.status === 'ok' ? 'is-ok' : 'is-doubt');
      var name = s.status === 'alert' ? 'close' : (s.status === 'ok' ? 'check' : 'help');
      var stateText = s.status === 'alert' ? 'Señal de alerta. ' : (s.status === 'ok' ? 'Sin señal. ' : 'Por verificar. ');
      list.appendChild(el('li', { class: cls },
        icon(name),
        el('div', {}, el('strong', {}, el('span', { class: 'sr-only', text: stateText }), s.title), el('span', { class: 'detail', text: s.detail }))
      ));
    });

    var steps = el('ul', { class: 'checklist' });
    res.nextSteps.forEach(function (t) { steps.appendChild(el('li', {}, icon('task_alt'), el('span', { text: t }))); });

    var verify = el('div', { class: 'card card-tint', style: 'margin-top: var(--gutter);' },
      el('h2', { class: 't-h3', id: 'que-verificar', tabindex: '-1', text: 'Qué verificar antes de decidir' }),
      el('div', { style: 'margin-top: var(--space-md);' }, steps),
      el('div', { class: 'btn-row', style: 'margin-top: var(--space-lg);' },
        el('a', { class: 'btn btn-secondary', href: 'verificar.html', text: 'Cómo verificar al emisor' }),
        el('a', { class: 'btn btn-tertiary', href: 'senales.html' }, 'Entender las señales', icon('arrow_forward', 'icon-sm'))
      )
    );

    var disclaimer = el('div', { class: 'note', style: 'margin-top: var(--gutter);' }, icon('info'),
      el('p', { text: 'Este resultado es educativo. No es una recomendación de inversión ni una opinión legal o financiera.' }));

    resultBox.appendChild(el('div', { class: 'result-layout' }, card, el('div', {}, list, verify, similarNote(entry), ratingCard(entry), disclaimer)));
    form.hidden = true;
    resultBox.hidden = false;
    renderHistory();
    document.getElementById('evaluacion').scrollIntoView({ behavior: 'smooth', block: 'start' });
    document.getElementById(headingId).focus({ preventScroll: true });
  }

  /* ---------- Historial ---------- */

  function getHistory() {
    var h = store.get(HISTORY_KEY, []);
    return Array.isArray(h) ? h : [];
  }

  function addHistory(entry) {
    var h = getHistory();
    h.unshift(entry);
    store.set(HISTORY_KEY, h.slice(0, HISTORY_MAX));
  }

  function removeHistory(id) {
    store.set(HISTORY_KEY, getHistory().filter(function (e) { return e.id !== id; }));
  }

  function formatDate(iso) {
    var d = new Date(iso);
    if (isNaN(d)) return '';
    return d.toLocaleDateString('es-PE', { day: 'numeric', month: 'short', year: 'numeric' });
  }

  function renderHistory() {
    var h = getHistory();
    historyRoot.textContent = '';
    historyClear.hidden = h.length === 0;

    if (!h.length) {
      var art = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      art.setAttribute('viewBox', '0 0 64 64');
      art.setAttribute('aria-hidden', 'true');
      art.innerHTML = '<rect x="6" y="6" width="52" height="52" rx="14" fill="#EFF4FF"/><circle cx="29" cy="29" r="12" fill="none" stroke="#1D4ED8" stroke-width="4"/><path d="M38 38l11 11" stroke="#1D4ED8" stroke-width="4.5" stroke-linecap="round"/>';
      historyRoot.appendChild(el('div', { class: 'empty-state' }, art,
        el('p', { text: 'Aún no tienes evaluaciones.' }),
        el('button', { type: 'button', class: 'btn', text: 'Iniciar la primera', onclick: function () {
          document.getElementById('evaluacion').scrollIntoView({ behavior: 'smooth' });
          if (!form.hidden) form.elements.amount.focus({ preventScroll: true });
        } })
      ));
      renderTools();
      return;
    }

    var ul = el('ul', { class: 'history-list' });
    h.forEach(function (entry) {
      var lv = Risk.LEVELS[entry.level] || Risk.LEVELS.medium;
      var title = entry.name || 'Oferta sin nombre';
      var li = el('li', { class: 'history-item risk-' + lv.id },
        el('span', { class: 'badge' }, icon(lv.icon), lv.label),
        el('div', { class: 'meta' },
          el('strong', { text: title }),
          el('span', { class: 'caption', text: formatDate(entry.date) + ' · ' + Risk.formatMoney(entry.amount) + ' · ' + Risk.formatPercent(entry.rate) + ' ' + entry.period + ' · ' + entry.count + ' de ' + entry.total + ' señales' })
        ),
        el('div', { class: 'btn-row', style: 'gap: var(--space-xs);' },
          el('button', { type: 'button', class: 'btn btn-secondary', 'aria-label': 'Ver resultado de ' + title, text: 'Ver resultado', onclick: function () { showResult(entry, true); } }),
          reminderButton(entry, title),
          el('button', { type: 'button', class: 'btn btn-tertiary', 'aria-label': 'Eliminar ' + title, onclick: function () {
            confirmAction({ title: '¿Eliminar esta evaluación?', text: 'Se borrará de tu historial en este navegador.', ok: 'Eliminar' }).then(function (yes) {
              if (yes) { removeHistory(entry.id); renderHistory(); }
            });
          } }, icon('delete', 'icon-sm'), 'Eliminar')
        )
      );
      ul.appendChild(li);
    });
    historyRoot.appendChild(ul);
    renderTools();
  }

  historyClear.addEventListener('click', function () {
    confirmAction({ title: '¿Borrar todo el historial?', text: 'Se eliminarán todas tus evaluaciones guardadas en este navegador.', ok: 'Borrar historial' }).then(function (yes) {
      if (yes) { store.remove(HISTORY_KEY); renderHistory(); }
    });
  });

  /* ---------- Diálogo de confirmación (la acción destructiva nunca es la opción por defecto) ---------- */

  var dialog = document.getElementById('confirm-dialog');
  function confirmAction(opts) {
    return new Promise(function (resolve) {
      if (!dialog || typeof dialog.showModal !== 'function') {
        resolve(window.confirm(opts.title + ' ' + opts.text));
        return;
      }
      document.getElementById('confirm-title').textContent = opts.title;
      document.getElementById('confirm-text').textContent = opts.text;
      document.getElementById('confirm-ok').textContent = opts.ok;
      var onClose = function () {
        dialog.removeEventListener('close', onClose);
        resolve(dialog.returnValue === 'ok');
      };
      dialog.returnValue = 'cancel';
      dialog.addEventListener('close', onClose);
      dialog.showModal();
    });
  }


  /* ---------- Funciones ampliadas: US24, US25, US27, US29, US44 ---------- */

  function alertsEnabled() {
    var s = store.get(SETTINGS_KEY, {});
    return !s || s.alerts !== false;
  }

  function entryTitle(e) { return e.name || 'Oferta sin nombre'; }

  /* US24: aviso de oferta parecida a una ya evaluada (solo con datos de este navegador) */
  function similarNote(entry) {
    if (!Core || !alertsEnabled()) return null;
    var m = Core.mostSimilar(entry, getHistory());
    if (!m) return null;
    return el('div', { class: 'note similar-note', role: 'status' }, icon('compare_arrows'),
      el('div', {},
        el('p', {}, el('strong', { text: 'Encontramos una oferta parecida a una que evaluaste. ' }),
          'Se parece a ' + entryTitle(m.entry) + ' en ' + m.similarity.count + ' de ' + m.similarity.total + ' señales marcadas.'),
        el('button', { type: 'button', class: 'btn btn-tertiary', style: 'padding-inline: 0;', text: 'Ver comparación', onclick: function () { openCompare(entry.id, m.entry.id); } })
      ));
  }

  /* US44: calificar la utilidad del resultado */
  function ratingCard(entry) {
    var ratings = store.get(RATINGS_KEY, []);
    var done = Array.isArray(ratings) && ratings.some(function (r) { return r.id === entry.id; });
    var box = el('div', { class: 'card', style: 'margin-top: var(--gutter);' });
    var title = el('h2', { class: 't-h3', id: 'rating-title-' + entry.id, text: '¿Te fue útil este resultado?' });
    if (done) {
      box.appendChild(title);
      box.appendChild(el('p', { role: 'status', text: 'Gracias por tu opinión.' }));
      return box;
    }
    var group = el('div', { class: 'rating choices', role: 'radiogroup', 'aria-labelledby': title.id });
    var selected = 0;
    var msg = el('p', { class: 'caption', role: 'status', style: 'margin-top: var(--space-sm);' });
    var send = el('button', { type: 'button', class: 'btn', style: 'margin-top: var(--space-md);', text: 'Enviar', onclick: function () {
      if (!selected) { msg.textContent = 'Elige una calificación del 1 al 5.'; return; }
      var list = store.get(RATINGS_KEY, []);
      if (!Array.isArray(list)) list = [];
      list.push({ id: entry.id, score: selected, date: new Date().toISOString() });
      store.set(RATINGS_KEY, list.slice(-200));
      box.textContent = '';
      box.appendChild(title);
      box.appendChild(el('p', { role: 'status', text: 'Gracias por tu opinión.' }));
      if (window.InvestCheckAnnounce) window.InvestCheckAnnounce('Gracias por tu opinión');
    } });
    [1, 2, 3, 4, 5].forEach(function (n) {
      var input = el('input', { type: 'radio', name: 'rating-' + entry.id, value: String(n) });
      input.addEventListener('change', function () { selected = n; msg.textContent = ''; });
      group.appendChild(el('label', { class: 'choice' }, input, el('span', { 'aria-label': n + ' de 5', text: String(n) })));
    });
    box.appendChild(title);
    box.appendChild(el('p', { class: 'caption', text: '1 = nada útil, 5 = muy útil. Se guarda solo en este navegador.' }));
    box.appendChild(group);
    box.appendChild(msg);
    box.appendChild(send);
    return box;
  }

  /* US25: recordatorio para revisar una evaluación antes de la fecha límite */
  function getReminders() {
    var r = store.get(REMINDERS_KEY, []);
    return Array.isArray(r) ? r : [];
  }

  function reminderButton(entry, title) {
    var current = getReminders().filter(function (r) { return r.id === entry.id; })[0];
    return el('button', { type: 'button', class: 'btn btn-tertiary',
      'aria-label': (current ? 'Cambiar el recordatorio de ' : 'Recordarme revisar ') + title,
      onclick: function () { openReminder(entry, title, current); } },
      icon(current ? 'notifications_active' : 'notifications', 'icon-sm'), current ? 'Recordatorio: ' + current.date : 'Recordarme');
  }

  var reminderDialog = null;
  function openReminder(entry, title, current) {
    if (!reminderDialog) {
      reminderDialog = el('dialog', { class: 'dialog', id: 'reminder-dialog', 'aria-labelledby': 'reminder-title' });
      document.body.appendChild(reminderDialog);
    }
    var d = reminderDialog;
    d.textContent = '';
    var today = new Date();
    var min = today.getFullYear() + '-' + String(today.getMonth() + 1).padStart(2, '0') + '-' + String(today.getDate()).padStart(2, '0');
    var input = el('input', { class: 'control', id: 'reminder-date', type: 'date', min: min });
    if (current) input.value = current.date;
    var err = el('p', { class: 'caption', role: 'alert', style: 'color: var(--color-risk-high);' });
    var form = el('form', { novalidate: '' },
      el('h2', { id: 'reminder-title', text: 'Recordarme antes de la fecha límite' }),
      el('p', { class: 'muted', text: title + '. Te avisaremos un día antes, la próxima vez que abras InvestCheck en este navegador.' }),
      el('div', { class: 'field', style: 'margin-top: var(--space-md);' },
        el('label', { for: 'reminder-date', text: 'Fecha límite para decidir' }), input, err),
      el('div', { class: 'actions' },
        current ? el('button', { type: 'button', class: 'btn btn-tertiary', text: 'Quitar recordatorio', onclick: function () {
          store.set(REMINDERS_KEY, getReminders().filter(function (r) { return r.id !== entry.id; }));
          d.close(); renderHistory();
        } }) : null,
        el('button', { type: 'button', class: 'btn btn-tertiary', text: 'Cancelar', onclick: function () { d.close(); } }),
        el('button', { type: 'submit', class: 'btn', text: 'Guardar recordatorio' })
      )
    );
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!input.value || input.value < min) { err.textContent = 'Elige una fecha de hoy en adelante.'; input.focus(); return; }
      var list = getReminders().filter(function (r) { return r.id !== entry.id; });
      list.push({ id: entry.id, date: input.value });
      store.set(REMINDERS_KEY, list);
      d.close(); renderHistory();
      if (window.InvestCheckAnnounce) window.InvestCheckAnnounce('Recordatorio guardado para el ' + input.value);
    });
    d.appendChild(form);
    if (typeof d.showModal === 'function') d.showModal(); else d.setAttribute('open', '');
    input.focus();
  }

  /* US27: comparar dos evaluaciones lado a lado */
  var compareRoot = document.getElementById('compare-root');
  var statusInfo = {
    alert: { cls: 'is-alert', icon: 'close', text: 'Señal de alerta' },
    ok: { cls: 'is-ok', icon: 'check', text: 'Sin señal' },
    doubt: { cls: 'is-doubt', icon: 'help', text: 'Por verificar' }
  };

  function openCompare(idA, idB) {
    var h = getHistory();
    compareRoot.textContent = '';
    compareRoot.appendChild(el('h2', { class: 't-h3', text: 'Comparar evaluaciones' }));
    if (h.length < 2) {
      compareRoot.appendChild(el('p', { class: 'muted', role: 'status', text: 'Necesitas dos evaluaciones para comparar.' }));
      return;
    }
    function select(id, label, value) {
      var s = el('select', { class: 'control', id: id });
      h.forEach(function (e) {
        var o = el('option', { value: String(e.id), text: entryTitle(e) + ' · ' + formatDate(e.date) });
        if (String(e.id) === String(value)) o.selected = true;
        s.appendChild(o);
      });
      return el('div', { class: 'field' }, el('label', { for: id, text: label }), s);
    }
    var a = select('cmp-a', 'Evaluación 1', idA || h[0].id);
    var b = select('cmp-b', 'Evaluación 2', idB || h[1].id);
    var out = el('div', { 'aria-live': 'polite' });
    compareRoot.appendChild(el('div', { class: 'compare-controls', style: 'margin-top: var(--space-md);' }, a, b));
    compareRoot.appendChild(out);
    function draw() {
      var ea = h.filter(function (e) { return String(e.id) === a.querySelector('select').value; })[0];
      var eb = h.filter(function (e) { return String(e.id) === b.querySelector('select').value; })[0];
      out.textContent = '';
      if (!ea || !eb) return;
      if (ea.id === eb.id) { out.appendChild(el('p', { class: 'muted', text: 'Elige dos evaluaciones distintas.' })); return; }
      var rows = Core.compareRows(ea, eb);
      function levelCell(e) { var lv = Risk.LEVELS[e.level] || Risk.LEVELS.medium; return el('span', { class: 'badge' }, icon(lv.icon), lv.label + ' (' + e.count + ' de ' + e.total + ')'); }
      var table = el('table', { class: 'compare-table' },
        el('caption', { text: 'Comparación por señal' }),
        el('thead', {}, el('tr', {}, el('th', { scope: 'col', text: 'Señal' }), el('th', { scope: 'col', text: entryTitle(ea) }), el('th', { scope: 'col', text: entryTitle(eb) }))),
        el('tbody', {},
          el('tr', {}, el('th', { scope: 'row', text: 'Nivel de riesgo' }), el('td', {}, levelCell(ea)), el('td', {}, levelCell(eb)))
        )
      );
      var tbody = table.querySelector('tbody');
      rows.forEach(function (r) {
        function cell(st) { var i = statusInfo[st]; return el('td', {}, el('span', { class: 'cell ' + i.cls }, icon(i.icon, 'icon-sm'), i.text)); }
        tbody.appendChild(el('tr', {}, el('th', { scope: 'row', text: r.title }), cell(r.a), cell(r.b)));
      });
      out.appendChild(table);
      out.appendChild(el('p', { class: 'caption', style: 'margin-top: var(--space-sm);', text: 'Comparación educativa con los datos que ingresaste. No es una recomendación de inversión.' }));
    }
    a.querySelector('select').addEventListener('change', draw);
    b.querySelector('select').addEventListener('change', draw);
    draw();
    compareRoot.scrollIntoView({ behavior: 'smooth', block: 'start' });
    compareRoot.focus({ preventScroll: true });
  }

  /* US29: exportar historial en CSV o PDF (impresión) */
  var exportDialog = null;
  function openExport() {
    if (!exportDialog) {
      exportDialog = el('dialog', { class: 'dialog', id: 'export-dialog', 'aria-labelledby': 'export-title' });
      document.body.appendChild(exportDialog);
    }
    var d = exportDialog;
    d.textContent = '';
    var form = el('form', { novalidate: '' },
      el('h2', { id: 'export-title', text: '¿Qué formato quieres?' }),
      el('fieldset', { class: 'field', style: 'border:0;padding:0;' },
        el('legend', { class: 'sr-only', text: 'Formato de exportación' }),
        el('div', { class: 'choices', role: 'group' },
          el('label', { class: 'choice' }, el('input', { type: 'radio', name: 'fmt', value: 'csv', checked: '' }), el('span', { text: 'CSV' })),
          el('label', { class: 'choice' }, el('input', { type: 'radio', name: 'fmt', value: 'pdf' }), el('span', { text: 'PDF' }))
        )),
      el('p', { class: 'caption', text: 'El archivo se genera en tu dispositivo. No se envía a ningún servidor.' }),
      el('div', { class: 'actions' },
        el('button', { type: 'button', class: 'btn btn-tertiary', text: 'Cancelar', onclick: function () { d.close(); } }),
        el('button', { type: 'submit', class: 'btn', text: 'Exportar' })
      ));
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var fmt = form.querySelector('input[name="fmt"]:checked').value;
      d.close();
      if (fmt === 'csv') downloadCsv(); else printHistory();
    });
    d.appendChild(form);
    if (typeof d.showModal === 'function') d.showModal(); else d.setAttribute('open', '');
  }

  function downloadCsv() {
    var csv = '﻿' + Core.toCsv(getHistory());
    var blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    var url = URL.createObjectURL(blob);
    var a = el('a', { href: url, download: 'investcheck-historial.csv' });
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
    if (window.InvestCheckAnnounce) window.InvestCheckAnnounce('Historial exportado en CSV');
  }

  function printHistory() {
    var h = getHistory();
    var box = el('section', { id: 'historial-print' },
      el('h1', { text: 'Historial de evaluaciones · InvestCheck' }),
      el('p', { text: 'Generado el ' + formatDate(new Date().toISOString()) + '. InvestCheck es educativa. No recomienda invertir.' }));
    var table = el('table', { class: 'compare-table' },
      el('thead', {}, el('tr', {}, ['Fecha', 'Oferta', 'Monto', 'Rentabilidad', 'Riesgo', 'Señales'].map(function (t) { return el('th', { scope: 'col', text: t }); }))));
    var tb = el('tbody');
    h.forEach(function (e) {
      var lv = Risk.LEVELS[e.level] || Risk.LEVELS.medium;
      tb.appendChild(el('tr', {}, [formatDate(e.date), entryTitle(e), Risk.formatMoney(e.amount), Risk.formatPercent(e.rate) + ' ' + e.period, lv.label, e.count + ' de ' + e.total].map(function (t) { return el('td', { text: t }); })));
    });
    table.appendChild(tb);
    box.appendChild(table);
    document.getElementById('contenido').appendChild(box);
    document.body.classList.add('print-history');
    var cleanup = function () { document.body.classList.remove('print-history'); box.remove(); window.removeEventListener('afterprint', cleanup); };
    window.addEventListener('afterprint', cleanup);
    window.print();
  }

  var toolsRoot = document.getElementById('history-tools');
  function renderTools() {
    if (!toolsRoot || !Core) return;
    var h = getHistory();
    toolsRoot.textContent = '';
    if (!h.length) return;
    toolsRoot.appendChild(el('button', { type: 'button', class: 'btn btn-secondary', onclick: function () { openCompare(); } }, icon('compare_arrows', 'icon-sm'), 'Comparar evaluaciones'));
    toolsRoot.appendChild(el('button', { type: 'button', class: 'btn btn-secondary', onclick: openExport }, icon('download', 'icon-sm'), 'Exportar historial'));
    if (compareRoot && h.length < 2) compareRoot.textContent = '';
  }

  /* ---------- Inicio ---------- */

  if (!restoreDraft()) goTo(1, false);
  renderHistory();
})();
