const test = require('node:test');
const assert = require('node:assert/strict');
const { validateRuc, checkDigit } = require('../assets/js/verificar.js');

test('RUC con dígito verificador correcto es válido', () => {
  const r = validateRuc('20131312955');
  assert.equal(r.ok, true);
  assert.match(r.type, /jurídica/);
});

test('dígito verificador se calcula con módulo 11', () => {
  assert.equal(checkDigit('2013131295'), 5);
  assert.equal(checkDigit('2010007097'), 0);
});

test('persona natural: prefijo 10', () => {
  const base = '1012345678';
  const r = validateRuc(base + checkDigit(base));
  assert.equal(r.ok, true);
  assert.match(r.type, /natural/);
});

test('rechaza longitud incorrecta, letras y vacío', () => {
  for (const bad of ['2061015', '201313129555', '2013131295a', '', null, undefined]) {
    const r = validateRuc(bad);
    assert.equal(r.ok, false);
    assert.equal(r.reason, 'format');
  }
});

test('rechaza prefijo inválido y dígito incorrecto', () => {
  assert.equal(validateRuc('99131312955').reason, 'prefix');
  assert.equal(validateRuc('20131312954').reason, 'digit');
});

test('ignora espacios', () => {
  assert.equal(validateRuc(' 20131312955 ').ok, true);
});
