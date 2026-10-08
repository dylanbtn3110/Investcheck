const test = require('node:test');
const assert = require('node:assert/strict');
const R = require('../assets/js/risk.js');

const clean = { rate: 0.5, period: 'mensual', registered: 'si', pressure: 'no', referrals: 'no', guaranteed: 'no', contract: 'si' };
const scam = { rate: 10, period: 'mensual', registered: 'no', pressure: 'si', referrals: 'si', guaranteed: 'si', contract: 'si' };

test('oferta sin señales: riesgo bajo', () => {
  const r = R.evaluate(clean);
  assert.equal(r.level.id, 'low');
  assert.equal(r.count, 0);
  assert.equal(r.total, 6);
});

test('ejemplo de la guía: 10 % mensual, no regulada, presión y referidos con contrato = riesgo alto', () => {
  const r = R.evaluate({ ...scam, guaranteed: 'no' });
  assert.equal(r.count, 4);
  assert.equal(r.level.id, 'high');
  assert.equal(r.signals.find(s => s.id === 'contrato').status, 'ok');
});

test('1 o 2 señales: riesgo medio', () => {
  assert.equal(R.evaluate({ ...clean, pressure: 'si' }).level.id, 'medium');
  assert.equal(R.evaluate({ ...clean, pressure: 'si', contract: 'no' }).level.id, 'medium');
});

test('3 o más señales: riesgo alto', () => {
  assert.equal(R.evaluate({ ...clean, pressure: 'si', contract: 'no', referrals: 'si' }).level.id, 'high');
});

test('rentabilidad irreal + no regulada es riesgo alto aunque solo sean 2 señales', () => {
  const r = R.evaluate({ ...clean, rate: 5, registered: 'no' });
  assert.equal(r.count, 2);
  assert.equal(r.level.id, 'high');
});

test('"No sé" si figura en SMV/SBS cuenta como señal por verificar', () => {
  const r = R.evaluate({ ...clean, registered: 'nose' });
  assert.equal(r.signals[1].status, 'doubt');
  assert.equal(r.count, 1);
  assert.equal(r.level.id, 'medium');
});

test('umbral de rentabilidad: 2 % mensual es irreal, 1.9 % no', () => {
  assert.equal(R.evaluate({ ...clean, rate: 2 }).signals[0].status, 'alert');
  assert.equal(R.evaluate({ ...clean, rate: 1.9 }).signals[0].status, 'ok');
});

test('rentabilidad anual se convierte a mensual equivalente', () => {
  assert.ok(Math.abs(R.monthlyEquivalent(12, 'anual') - 0.95) < 0.01);
  assert.equal(R.evaluate({ ...clean, rate: 12, period: 'anual' }).signals[0].status, 'ok');
  assert.equal(R.evaluate({ ...clean, rate: 40, period: 'anual' }).signals[0].status, 'alert');
});

test('10 % mensual equivale a cerca de 213.8 % anual', () => {
  assert.ok(Math.abs(R.annualEquivalent(10, 'mensual') - 213.84) < 0.01);
  const detail = R.evaluate(scam).signals[0].detail;
  assert.match(detail, /213\.8/);
});

test('rentabilidad faltante o inválida no rompe y cuenta como duda', () => {
  assert.equal(R.evaluate({ ...clean, rate: NaN }).signals[0].status, 'doubt');
  assert.equal(R.evaluate({ ...clean, rate: -3 }).signals[0].status, 'doubt');
  assert.doesNotThrow(() => R.evaluate());
  assert.doesNotThrow(() => R.evaluate({}));
});

test('el resumen nunca recomienda invertir ni no invertir', () => {
  for (const a of [clean, scam, { ...clean, pressure: 'si' }]) {
    const text = R.evaluate(a).summary + R.evaluate(a).nextSteps.join(' ');
    assert.doesNotMatch(text, /\b(invierte|no inviertas|debes invertir|no debes invertir)\b/i);
    assert.doesNotMatch(text, /[!¡]/);
  }
});

test('formatos peruanos', () => {
  assert.equal(R.formatMoney(15000), 'S/ 15,000.00');
  assert.equal(R.formatPercent(10), '10 %');
  assert.equal(R.formatPercent(213.84), '213.8 %');
  assert.equal(R.formatPercent(1234.5), '1,235 %');
});

test('siempre devuelve pasos siguientes y la verificación de regulación va primero', () => {
  const r = R.evaluate(scam);
  assert.ok(r.nextSteps.length >= 3);
  assert.match(r.nextSteps[0], /SMV/);
});
