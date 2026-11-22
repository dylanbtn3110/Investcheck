/* InvestCheck — idiomas (US42 inglés, US43 quechua).
   El texto base está en español. Se traduce por coincidencia exacta de cada texto; lo que no esté en el
   diccionario se queda en español. Así nunca se muestra un texto roto ni inventado.
   QUECHUA: es una versión beta con pocos términos. Debe revisarla un hablante de quechua antes de publicarla. */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.InvestCheckI18n = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  var LANGS = [
    { code: 'es', label: 'Español (Perú)' },
    { code: 'en', label: 'English' },
    { code: 'qu', label: 'Quechua (beta)' }
  ];

  var EN = {
    /* Navegación y pie */
    'Saltar al contenido': 'Skip to content',
    'Evaluar oferta': 'Check an offer',
    'Aprende': 'Learn',
    'Señales de alerta': 'Warning signs',
    'Verificar emisor': 'Verify the issuer',
    'Nosotros': 'About us',
    'Ayuda': 'Help',
    'Ajustes': 'Settings',
    'Iniciar evaluación': 'Start check',
    'Iniciar': 'Start',
    'Plataforma': 'Platform',
    'Proyecto': 'Project',
    'Centro de ayuda': 'Help center',
    'Código en GitHub': 'Code on GitHub',
    'Revisa antes de invertir. Una plataforma educativa para entender el riesgo de una oferta antes de comprometer tu dinero.': 'Check before you invest. An educational platform to understand the risk of an offer before you commit your money.',
    'InvestCheck es educativa. No es un bróker, no recomienda invertir ni dejar de invertir y no reemplaza a un asesor regulado. Tus respuestas se guardan solo en tu navegador.': 'InvestCheck is educational. It is not a broker, it does not recommend investing or not investing, and it does not replace a regulated advisor. Your answers are saved only in your browser.',
    /* Inicio */
    'Educación sobre riesgo de inversión': 'Investment risk education',
    'Antes de invertir tus ahorros, revisa la oferta.': 'Before you invest your savings, check the offer.',
    'Responde unas preguntas y descubre si una oportunidad muestra señales de alerta. Gratis, en 5 minutos y sin conocimientos financieros.': 'Answer a few questions and find out whether an opportunity shows warning signs. Free, in 5 minutes, no financial knowledge needed.',
    '¿Cómo funciona?': 'How does it work?',
    'Señales que revisamos': 'Signs we check',
    'Rentabilidad prometida': 'Promised return',
    'Registro en SMV / SBS': 'SMV / SBS registration',
    'Presión para decidir rápido': 'Pressure to decide fast',
    'Captación por referidos': 'Referral recruiting',
    'Tres pasos para revisar una oferta': 'Three steps to check an offer',
    'Revisa antes de decidir': 'Check before you decide',
    'Lo que suelen preguntarnos': 'Frequently asked questions',
    /* Evaluar */
    'Evalúa una oferta de inversión': 'Check an investment offer',
    'Responde 4 pasos cortos. Revisamos 6 señales de alerta y te decimos qué verificar. No guardamos tus datos fuera de tu navegador.': 'Answer 4 short steps. We review 6 warning signs and tell you what to verify. We do not store your data outside your browser.',
    'La oferta': 'The offer',
    'Quién la ofrece': 'Who is offering it',
    'Cómo te la presentan': 'How it is presented to you',
    'Documentos y revisión': 'Documents and review',
    'Continuar': 'Continue',
    'Atrás': 'Back',
    'Cambiar': 'Change',
    'Historial': 'History',
    'Borrar historial': 'Clear history',
    'Ver resultado': 'View result',
    'Eliminar': 'Delete',
    'Cancelar': 'Cancel',
    'Resultado de tu evaluación': 'Your check result',
    'Riesgo bajo': 'Low risk',
    'Riesgo medio': 'Medium risk',
    'Riesgo alto': 'High risk',
    'Ver qué verificar': 'See what to verify',
    'Iniciar otra evaluación': 'Start another check',
    'Guardar como PDF': 'Save as PDF',
    'Qué verificar antes de decidir': 'What to verify before you decide',
    'Cómo verificar al emisor': 'How to verify the issuer',
    'Entender las señales': 'Understand the signs',
    'Este resultado es educativo. No es una recomendación de inversión ni una opinión legal o financiera.': 'This result is educational. It is not investment advice nor a legal or financial opinion.',
    'Aún no tienes evaluaciones.': 'You have no checks yet.',
    'Iniciar la primera': 'Start the first one',
    'Comparar evaluaciones': 'Compare checks',
    'Exportar historial': 'Export history',
    'Recordarme': 'Remind me',
    '¿Te fue útil este resultado?': 'Was this result useful?',
    'Enviar': 'Send',
    'Gracias por tu opinión.': 'Thanks for your feedback.',
    /* Aprende */
    'Entiende los términos antes de decidir': 'Understand the terms before you decide',
    'Tu avance': 'Your progress',
    'Lecciones': 'Lessons',
    'Casos recientes': 'Recent cases',
    'Marcar como completada': 'Mark as completed',
    'Pendiente': 'Pending',
    'Completada': 'Completed',
    /* Verificar */
    'Comprueba quién te ofrece la inversión': 'Check who is offering you the investment',
    'Paso a paso': 'Step by step',
    'Revisar RUC': 'Check RUC',
    'RUC de la empresa': 'Company RUC',
    'Escanear QR': 'Scan QR',
    'Nombre comercial': 'Business name',
    'Sanciones públicas': 'Public sanctions',
    /* Ajustes */
    'Idioma': 'Language',
    'Alto contraste': 'High contrast',
    'Reducir movimiento': 'Reduce motion',
    'Ver tutorial': 'View tutorial',
    'Cerrar': 'Close',
    'Mejora la lectura con colores más intensos (contraste mínimo 7:1).': 'Improves readability with stronger colors (minimum 7:1 contrast).',
    'Las transiciones aparecen de inmediato.': 'Transitions appear immediately.',
    'Accesibilidad': 'Accessibility',
    /* Ayuda */
    'Escríbenos': 'Write to us',
    'Enviar mensaje': 'Send message',
    'Siguiente': 'Next',
    'Saltar': 'Skip',
    'Comenzar': 'Get started'
  };

  /* Quechua beta: solo términos de uso común. Pendiente de revisión por un hablante. */
  var QU = {
    'Aprende': 'Yachay',
    'Ayuda': 'Yanapay',
    'Idioma': 'Simi'
  };

  var DICT = { en: EN, qu: QU };

  function translate(text, lang) {
    var d = DICT[lang];
    if (!d) return text;
    var trimmed = String(text).trim();
    if (!trimmed || !Object.prototype.hasOwnProperty.call(d, trimmed)) return text;
    return String(text).replace(trimmed, d[trimmed]);
  }

  /* ---------- DOM (solo en el navegador) ---------- */

  var originals = typeof WeakMap !== 'undefined' ? new WeakMap() : null;
  var attrOriginals = typeof WeakMap !== 'undefined' ? new WeakMap() : null;
  var current = 'es';
  var observer = null;
  var ATTRS = ['aria-label', 'placeholder', 'title'];

  function applyNode(node, lang) {
    if (node.nodeType === 3) {
      var p = node.parentNode;
      if (p && /^(SCRIPT|STYLE|TEXTAREA)$/.test(p.nodeName)) return;
      if (p && p.closest && p.closest('[data-no-i18n]')) return;
      if (lang === 'es') {
        if (originals.has(node)) { node.nodeValue = originals.get(node); originals.delete(node); }
        return;
      }
      var src = originals.has(node) ? originals.get(node) : node.nodeValue;
      var out = translate(src, lang);
      if (out !== src) {
        if (!originals.has(node)) originals.set(node, src);
        if (node.nodeValue !== out) node.nodeValue = out;
      } else if (originals.has(node)) {
        node.nodeValue = originals.get(node); originals.delete(node);
      }
    } else if (node.nodeType === 1) {
      if (node.closest && node.closest('[data-no-i18n]')) return;
      ATTRS.forEach(function (a) {
        if (!node.hasAttribute(a)) return;
        var store = attrOriginals.get(node) || {};
        var src = Object.prototype.hasOwnProperty.call(store, a) ? store[a] : node.getAttribute(a);
        var out = lang === 'es' ? src : translate(src, lang);
        if (out !== src) { store[a] = src; attrOriginals.set(node, store); }
        else if (Object.prototype.hasOwnProperty.call(store, a)) { delete store[a]; }
        if (node.getAttribute(a) !== out) node.setAttribute(a, out);
      });
      for (var c = node.firstChild; c; c = c.nextSibling) applyNode(c, lang);
    }
  }

  function apply(rootNode, lang) {
    if (typeof document === 'undefined') return;
    applyNode(rootNode || document.body, lang || current);
  }

  function setLang(lang) {
    if (!DICT[lang] && lang !== 'es') lang = 'es';
    current = lang;
    document.documentElement.lang = lang === 'qu' ? 'qu' : lang;
    if (observer) observer.disconnect();
    apply(document.body, lang);
    if (lang !== 'es') watch();
  }

  /* Traduce también lo que el sitio dibuja después (resultado, historial, diálogos) */
  function watch() {
    if (typeof MutationObserver === 'undefined') return;
    observer = new MutationObserver(function (muts) {
      muts.forEach(function (m) {
        Array.prototype.forEach.call(m.addedNodes, function (n) { applyNode(n, current); });
      });
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }

  return { LANGS: LANGS, translate: translate, setLang: setLang, apply: apply, get lang() { return current; } };
});
