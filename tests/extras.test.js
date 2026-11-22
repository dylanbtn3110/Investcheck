const test = require('node:test');
const assert = require('node:assert/strict');
const Core = require('../assets/js/extras-core.js');
const Risk = require('../assets/js/risk.js');

function entry(id, answers, rate) {
  const a = Object.assign({ period: 'mensual', registered: 'no', pressure: 'si', referrals: 'si', guaranteed: 'no', contract: 'no' }, answers || {});
  const res = Risk.evaluate({ rate: rate, period: a.period, registered: a.registered, pressure: a.pressure, referrals: a.referrals, guaranteed: a.guaranteed, contract: a.contract });
  return { id: id, date: '2026-11-01T10:00:00.000Z', level: res.level.id, count: res.count, total: res.total, name: 'Oferta ' + id, amount: 1000, rate: rate, period: a.period, answers: a };
}

test('US24: encuentra la evaluación guardada más parecida (3 o más señales en común)', () => {
  const hist = [entry(1, {}, 10), entry(2, { registered: 'si', pressure: 'no', referrals: 'no', contract: 'si' }, 0.5)];
  const nueva = entry(3, {}, 12);
  const m = Core.mostSimilar(nueva, hist);
  assert.equal(m.entry.id, 1);
  assert.ok(m.similarity.count >= 3);
});

test('US24: sin parecidos no devuelve nada y no se compara consigo misma', () => {
  const limpia = entry(5, { registered: 'si', pressure: 'no', referrals: 'no', contract: 'si' }, 0.5);
  assert.equal(Core.mostSimilar(limpia, [limpia]), null);
  assert.equal(Core.mostSimilar(entry(6, {}, 10), [limpia]), null);
});

test('US27: la tabla comparativa tiene una fila por cada una de las 6 señales', () => {
  const rows = Core.compareRows(entry(1, {}, 10), entry(2, { registered: 'si' }, 0.5));
  assert.equal(rows.length, 6);
  assert.equal(rows[0].title, 'Rentabilidad prometida');
  assert.equal(rows[1].a, 'alert');
});

test('US29: el CSV escapa comillas y neutraliza fórmulas', () => {
  const e = entry(1, { ruc: '20131312955' }, 10);
  e.name = '=HYPERLINK("http://x")';
  const csv = Core.toCsv([e]);
  const lines = csv.split('\r\n');
  assert.equal(lines.length, 2);
  assert.match(lines[1], /"'=HYPERLINK\(""http:\/\/x""\)"/);
  assert.match(lines[0], /^"Fecha","Nombre"/);
});

test('US25: avisa un día antes de la fecha límite y no antes', () => {
  const now = new Date(2026, 10, 22, 9, 0);
  const due = Core.dueReminders([{ id: 1, date: '2026-11-23' }, { id: 2, date: '2026-11-22' }, { id: 3, date: '2026-11-30' }, { id: 4, date: '2026-10-01' }], now);
  assert.deepEqual(due.map(r => r.id), [1, 2]);
});

test('US46: extrae un RUC válido desde el texto de un QR', () => {
  assert.equal(Core.extractRuc('https://ejemplo.pe/verificar?ruc=20131312955&x=1'), '20131312955');
  assert.equal(Core.extractRuc('20131312956'), null);
  assert.equal(Core.extractRuc('sin números'), null);
});

test('US34: la búsqueda ignora tildes y mayúsculas', () => {
  const faq = [{ q: '¿Qué es la rentabilidad?', a: 'Lo que ganas.', tags: 'ganancia' }, { q: '¿Qué hace la SMV?', a: 'Supervisa el mercado de valores.' }];
  assert.equal(Core.searchFaq('RENTABILIDAD', faq).length, 1);
  assert.equal(Core.searchFaq('mercádo valores', faq).length, 1);
  assert.equal(Core.searchFaq('', faq).length, 2);
  assert.equal(Core.searchFaq('xyz', faq).length, 0);
});

test('US44: promedio de calificaciones', () => {
  assert.equal(Core.averageRating([]), 0);
  assert.equal(Core.averageRating([{ score: 5 }, { score: 4 }]), 4.5);
});
