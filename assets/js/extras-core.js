/* InvestCheck — lógica pura de las funciones ampliadas (US24 a US48).
   Sin DOM, para poder probarse con Node (tests/extras.test.js).
   Todo trabaja con datos que ya están en el navegador del usuario: no hay servidor ni datos de otras personas. */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory(require('./risk.js'), require('./verificar.js'));
  else root.InvestCheckCore = factory(root.InvestCheckRisk, root.InvestCheckRuc);
})(typeof self !== 'undefined' ? self : this, function (Risk, Verify) {
  'use strict';

  var SIGNAL_NAMES = {
    rentabilidad: 'Rentabilidad prometida', regulacion: 'Registro SMV/SBS', presion: 'Presión de tiempo',
    referidos: 'Captación por referidos', garantia: 'Ganancia garantizada', contrato: 'Contrato por escrito'
  };

  /* Señales que una evaluación guardada marcó como alerta o por verificar */
  function flaggedIds(entry) {
    var a = entry.answers || {};
    var res = Risk.evaluate({
      rate: entry.rate, period: a.period || entry.period, registered: a.registered,
      pressure: a.pressure, referrals: a.referrals, guaranteed: a.guaranteed, contract: a.contract
    });
    return res.signals.filter(function (s) { return s.status !== 'ok'; }).map(function (s) { return s.id; });
  }

  /* US24 / US27: cuántas señales marcadas comparten dos evaluaciones */
  function similarity(a, b) {
    var fa = flaggedIds(a);
    var fb = flaggedIds(b);
    var shared = fa.filter(function (id) { return fb.indexOf(id) > -1; });
    return { shared: shared, count: shared.length, total: 6 };
  }

  /* Devuelve la evaluación guardada más parecida (mínimo 3 señales marcadas en común) o null */
  function mostSimilar(entry, history, minShared) {
    var min = minShared || 3;
    var best = null;
    history.forEach(function (other) {
      if (other.id === entry.id) return;
      var s = similarity(entry, other);
      if (s.count >= min && (!best || s.count > best.similarity.count)) best = { entry: other, similarity: s };
    });
    return best;
  }

  /* US27: filas para la tabla de comparación (una por señal) */
  function compareRows(a, b) {
    function statuses(entry) {
      var ans = entry.answers || {};
      var res = Risk.evaluate({
        rate: entry.rate, period: ans.period || entry.period, registered: ans.registered,
        pressure: ans.pressure, referrals: ans.referrals, guaranteed: ans.guaranteed, contract: ans.contract
      });
      return res.signals;
    }
    var sa = statuses(a);
    var sb = statuses(b);
    return sa.map(function (s, i) { return { id: s.id, title: SIGNAL_NAMES[s.id], a: s.status, b: sb[i].status }; });
  }

  /* US29: CSV seguro. Las celdas que empiezan con = + - @ se prefijan para que Excel no las ejecute. */
  function csvCell(value) {
    var s = value === null || value === undefined ? '' : String(value);
    if (/^[=+\-@\t\r]/.test(s)) s = "'" + s;
    return '"' + s.replace(/"/g, '""') + '"';
  }

  function toCsv(history) {
    var head = ['Fecha', 'Nombre', 'Monto (S/)', 'Rentabilidad prometida (%)', 'Periodo', 'Nivel de riesgo', 'Señales marcadas', 'Señales revisadas', 'RUC'];
    var rows = history.map(function (e) {
      var level = (Risk.LEVELS[e.level] || {}).label || e.level;
      return [e.date, e.name || '', e.amount, e.rate, e.period, level, e.count, e.total, (e.answers && e.answers.ruc) || ''];
    });
    return [head].concat(rows).map(function (r) { return r.map(csvCell).join(','); }).join('\r\n');
  }

  /* US25: recordatorios que vencen hoy o mañana (aviso un día antes de la fecha límite) */
  function dayStart(d) { return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime(); }

  function dueReminders(reminders, now) {
    var today = dayStart(now);
    return reminders.filter(function (r) {
      var parts = String(r.date || '').split('-');
      if (parts.length !== 3) return false;
      var due = new Date(+parts[0], +parts[1] - 1, +parts[2]).getTime();
      if (isNaN(due)) return false;
      var daysLeft = Math.round((due - today) / 86400000);
      return daysLeft <= 1 && daysLeft >= -7;
    });
  }

  /* US46: saca un RUC válido del texto de un código QR (puede ser un enlace o texto suelto) */
  function extractRuc(text) {
    var matches = String(text || '').match(/\d{11}/g) || [];
    for (var i = 0; i < matches.length; i++) {
      if (Verify.validateRuc(matches[i]).ok) return matches[i];
    }
    return null;
  }

  /* US34: búsqueda sin distinguir mayúsculas ni tildes */
  function normalize(s) {
    return String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
  }

  function searchFaq(query, items) {
    var words = normalize(query).split(/\s+/).filter(Boolean);
    if (!words.length) return items.slice();
    return items.filter(function (it) {
      var hay = normalize(it.q + ' ' + it.a + ' ' + (it.tags || ''));
      return words.every(function (w) { return hay.indexOf(w) > -1; });
    });
  }

  /* US44 / US45: promedio simple de las calificaciones guardadas */
  function averageRating(ratings) {
    if (!ratings.length) return 0;
    return Math.round(ratings.reduce(function (t, r) { return t + r.score; }, 0) / ratings.length * 10) / 10;
  }

  return {
    flaggedIds: flaggedIds, similarity: similarity, mostSimilar: mostSimilar, compareRows: compareRows,
    toCsv: toCsv, SIGNAL_NAMES: SIGNAL_NAMES, csvCell: csvCell, dueReminders: dueReminders, extractRuc: extractRuc,
    searchFaq: searchFaq, normalize: normalize, averageRating: averageRating
  };
});
