/* InvestCheck — puntuación de riesgo
   Evalúa las respuestas del usuario contra 6 señales de alerta y devuelve un nivel de riesgo.
   Es una guía educativa: mide señales de fraude o falta de transparencia, no la rentabilidad esperada.
   Sin dependencias del DOM, para poder probarse con Node (tests/risk.test.js). */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.InvestCheckRisk = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  /* Rentabilidad mensual (equivalente) desde la cual se considera irreal.
     2 % mensual equivale a cerca de 27 % al año, muy por encima de depósitos y bonos formales. */
  var UNREALISTIC_MONTHLY_PCT = 2;

  var LEVELS = {
    low: { id: 'low', label: 'Riesgo bajo', icon: 'check_circle' },
    medium: { id: 'medium', label: 'Riesgo medio', icon: 'error' },
    high: { id: 'high', label: 'Riesgo alto', icon: 'cancel' }
  };

  var SIGNAL_IDS = ['rentabilidad', 'regulacion', 'presion', 'referidos', 'garantia', 'contrato'];

  function monthlyEquivalent(rate, period) {
    if (period === 'anual') return (Math.pow(1 + rate / 100, 1 / 12) - 1) * 100;
    return rate;
  }

  function annualEquivalent(rate, period) {
    if (period === 'anual') return rate;
    return (Math.pow(1 + rate / 100, 12) - 1) * 100;
  }

  /* Formato peruano (punto decimal): "10 %", "213.8 %". Se usa espacio duro antes del %. */
  function formatPercent(value) {
    if (Math.abs(value) >= 1000) return Math.round(value).toLocaleString('en-US') + '\u00a0%';
    var rounded = Math.round(value * 10) / 10;
    return (Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(1)) + '\u00a0%';
  }

  function formatMoney(value) {
    return 'S/ ' + Number(value).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  function signalRentabilidad(a) {
    var rate = Number(a.rate);
    var period = a.period === 'anual' ? 'anual' : 'mensual';
    if (!isFinite(rate) || rate <= 0) {
      return { status: 'doubt', title: 'Rentabilidad irreal', detail: 'No indicaste una rentabilidad prometida.' };
    }
    var monthly = monthlyEquivalent(rate, period);
    var promised = formatPercent(rate) + ' ' + period;
    if (monthly >= UNREALISTIC_MONTHLY_PCT) {
      var detail = promised + ' es muy superior al sistema formal.';
      if (period === 'mensual') detail += ' Equivale a cerca de ' + formatPercent(annualEquivalent(rate, period)) + ' al año.';
      return { status: 'alert', title: 'Rentabilidad irreal', detail: detail };
    }
    return {
      status: 'ok', title: 'Rentabilidad dentro de lo habitual',
      detail: promised + '. Sigue siendo una promesa: ninguna rentabilidad está asegurada.'
    };
  }

  function signalRegulacion(a) {
    if (a.registered === 'si') {
      return { status: 'ok', title: 'Figura en registros oficiales', detail: 'Dices que figura en la SMV o la SBS. Compruébalo tú en el registro oficial.' };
    }
    if (a.registered === 'no') {
      return { status: 'alert', title: 'No regulada', detail: 'No figura en SMV ni SBS. Solo las entidades autorizadas pueden captar dinero del público.' };
    }
    return { status: 'doubt', title: 'Regulación sin verificar', detail: 'Aún no verificaste si figura en la SMV o la SBS.' };
  }

  function yesNoSignal(value, alertTitle, alertDetail, okTitle, okDetail) {
    if (value === 'si') return { status: 'alert', title: alertTitle, detail: alertDetail };
    if (value === 'no') return { status: 'ok', title: okTitle, detail: okDetail };
    return { status: 'doubt', title: alertTitle, detail: 'No respondiste esta pregunta.' };
  }

  function signalContrato(a) {
    if (a.contract === 'si') return { status: 'ok', title: 'Contrato por escrito', detail: 'Existe documento. Verifica su contenido.' };
    if (a.contract === 'no') return { status: 'alert', title: 'Sin contrato por escrito', detail: 'Sin documento no hay condiciones claras ni dónde reclamar.' };
    return { status: 'doubt', title: 'Sin contrato por escrito', detail: 'No respondiste esta pregunta.' };
  }

  var NEXT_STEPS = {
    regulacion_alert: 'Consulta el registro de la SMV y de la SBS. Si no figura, solo una entidad autorizada puede captar tu dinero.',
    regulacion_doubt: 'Consulta el registro de la SMV y de la SBS antes de decidir.',
    regulacion_ok: 'Comprueba tú mismo el registro oficial. No te bases solo en lo que te dijeron.',
    rentabilidad: 'Pide por escrito de dónde sale la ganancia y compárala con depósitos a plazo o fondos regulados.',
    presion: 'Tómate unos días. Una oferta legítima puede esperar a que verifiques.',
    referidos: 'Pregunta qué producto real se vende. Si ganas más por traer personas, es señal de esquema piramidal.',
    garantia: 'Recuerda que toda inversión puede perder valor. Pide las condiciones por escrito.',
    contrato: 'Pide el contrato y léelo completo antes de transferir dinero.',
    general: 'Si tienes dudas, habla con alguien de confianza que no gane con tu decisión o con un asesor autorizado.'
  };

  /* Nivel: 0 señales = bajo; 1–2 = medio; 3 o más = alto.
     Rentabilidad irreal + emisor no regulado se considera riesgo alto aunque haya pocas señales. */
  function levelFor(count, signals) {
    var byId = {};
    signals.forEach(function (s) { byId[s.id] = s; });
    var hardCombo = byId.rentabilidad.status === 'alert' && byId.regulacion.status === 'alert';
    if (count >= 3 || hardCombo) return LEVELS.high;
    if (count >= 1) return LEVELS.medium;
    return LEVELS.low;
  }

  function summaryFor(level, count) {
    var n = count === 1 ? '1 señal de alerta' : count + ' señales de alerta';
    if (level.id === 'high') return 'Esta oferta muestra ' + n + '. Te recomendamos verificarla antes de decidir.';
    if (level.id === 'medium') return 'Hay ' + (count === 1 ? 'una duda' : 'dudas') + ' que verificar antes de decidir. Encontramos ' + n + '.';
    return 'No detectamos señales graves en lo que nos contaste. Aun así, verifica siempre que el emisor esté autorizado.';
  }

  /* answers: { rate, period: 'mensual'|'anual', registered: 'si'|'no'|'nose',
                pressure, referrals, guaranteed, contract: 'si'|'no' } */
  function evaluate(answers) {
    var a = answers || {};
    var raw = [
      signalRentabilidad(a),
      signalRegulacion(a),
      yesNoSignal(a.pressure, 'Presión de tiempo', 'Te piden decidir rápido. Es una táctica para que no verifiques.',
        'Sin presión de tiempo', 'Puedes tomarte el tiempo para verificar.'),
      yesNoSignal(a.referrals, 'Captación por referidos', 'Ganas más si traes a otras personas. Es típico de esquemas piramidales.',
        'Sin captación por referidos', 'Tu ganancia no depende de traer a otras personas.'),
      yesNoSignal(a.guaranteed, 'Ganancia garantizada', 'Te aseguran que no hay riesgo. Toda inversión puede perder valor.',
        'Sin garantía de ganancia', 'No te prometen ausencia de riesgo.'),
      signalContrato(a)
    ];
    var signals = raw.map(function (s, i) {
      s.id = SIGNAL_IDS[i];
      return s;
    });
    var count = signals.filter(function (s) { return s.status !== 'ok'; }).length;
    var level = levelFor(count, signals);

    var steps = [];
    var reg = signals[1];
    steps.push(NEXT_STEPS['regulacion_' + reg.status]);
    ['rentabilidad', 'presion', 'referidos', 'garantia', 'contrato'].forEach(function (id) {
      var s = signals[SIGNAL_IDS.indexOf(id)];
      if (s.status !== 'ok') steps.push(NEXT_STEPS[id]);
    });
    steps.push(NEXT_STEPS.general);

    return {
      level: level,
      count: count,
      total: signals.length,
      signals: signals,
      summary: summaryFor(level, count),
      nextSteps: steps
    };
  }

  return {
    evaluate: evaluate,
    monthlyEquivalent: monthlyEquivalent,
    annualEquivalent: annualEquivalent,
    formatPercent: formatPercent,
    formatMoney: formatMoney,
    LEVELS: LEVELS,
    SIGNAL_IDS: SIGNAL_IDS,
    UNREALISTIC_MONTHLY_PCT: UNREALISTIC_MONTHLY_PCT
  };
});
