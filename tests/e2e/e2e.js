/* Prueba de extremo a extremo (navegador real) de las funciones US24–US48.
   No es parte de "npm test" porque necesita Playwright y un servidor local:
     npm start            (en otra terminal, puerto 8000; cambia B si usas otro)
     npx playwright install chromium && node tests/e2e/e2e.js */
const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 1100, height: 900 } });
  const p = await ctx.newPage();
  const errs = [];
  p.on('pageerror', e => errs.push('PAGEERROR ' + e.message));
  p.on('console', m => { if (m.type() === 'error' && !/fonts\.g|net::ERR|Failed to load resource/.test(m.text())) errs.push(m.text()); });
  const ok = (c, m) => console.log((c ? 'PASS ' : 'FAIL ') + m);
  const B = 'http://localhost:8000/';

  // onboarding en inicio
  await p.goto(B + 'index.html');
  await p.waitForSelector('#tutorial-dialog[open]');
  ok(true, 'US33 tutorial abre en primer uso');
  for (let i = 0; i < 3; i++) await p.click('#tutorial-dialog .btn:not(.btn-tertiary)');
  await p.click('#tutorial-dialog .btn:not(.btn-tertiary)');
  ok(await p.locator('#tutorial-dialog').count() === 0, 'US33 tutorial termina y se cierra');
  await p.reload();
  ok(await p.locator('#tutorial-dialog').count() === 0, 'US33 no reaparece');

  // ajustes
  await p.click('.settings-btn');
  await p.check('#set-contrast');
  ok(await p.evaluate(() => document.documentElement.classList.contains('hc')), 'US31 alto contraste');
  await p.check('#set-motion');
  ok(await p.evaluate(() => document.documentElement.classList.contains('reduce-motion')), 'US32 reducir movimiento');
  await p.check('input[name=lang][value=en]');
  ok((await p.textContent('.site-nav')).includes('Check an offer'), 'US42 inglés traduce navegación');
  ok((await p.textContent('h1')).includes('Before you invest'), 'US42 inglés traduce título');
  await p.check('input[name=lang][value=qu]');
  ok((await p.textContent('.site-nav')).includes('Yachay'), 'US43 quechua beta');
  await p.check('input[name=lang][value=es]');
  ok((await p.textContent('.site-nav')).includes('Evaluar oferta'), 'idioma vuelve a español');
  await p.click('#ajustes-dialog .actions .btn');
  await p.evaluate(() => { const s = JSON.parse(localStorage.getItem('investcheck.settings')); s.contrast = false; localStorage.setItem('investcheck.settings', JSON.stringify(s)); });

  // evaluaciones
  await p.goto(B + 'evaluar.html');
  async function evalOffer(name, o) {
    await p.fill('#amount', '5000'); await p.fill('#rate', o.rate);
    await p.check('input[name=period][value=mensual]'); await p.click('#btn-next');
    await p.fill('#name', name);
    await p.check('input[name=registered][value=' + o.reg + ']'); await p.click('#btn-next');
    await p.check('input[name=pressure][value=' + o.pr + ']');
    await p.check('input[name=referrals][value=' + o.ref + ']');
    await p.check('input[name=guaranteed][value=' + o.g + ']'); await p.click('#btn-next');
    await p.check('input[name=contract][value=' + o.c + ']'); await p.click('#btn-next');
    await p.click('#btn-next').catch(() => {});
    await p.waitForSelector('#result:not([hidden])');
  }
  const risky = { rate: '10', reg: 'no', pr: 'si', ref: 'si', g: 'si', c: 'no' };
  await evalOffer('Oferta A', risky);
  ok(await p.locator('.similar-note').count() === 0, 'US24 sin parecidas en la primera');
  await p.click('#result .btn-secondary'); // iniciar otra
  await evalOffer('Oferta B', risky);
  ok(await p.locator('.similar-note').count() === 1, 'US24 aviso de oferta parecida');
  ok((await p.textContent('.similar-note')).includes('Oferta A'), 'US24 nombra la oferta guardada');
  // calificación
  await p.check('input[name^=rating-][value="4"]', { force: true });
  await p.click('#result .card button:has-text("Enviar")');
  ok((await p.textContent('#result')).includes('Gracias por tu opinión'), 'US44 calificación enviada');
  ok(await p.evaluate(() => JSON.parse(localStorage.getItem('investcheck.ratings')).length === 1), 'US44 guardada local');
  // comparar
  await p.click('.similar-note button');
  await p.waitForSelector('.compare-table');
  ok(await p.locator('.compare-table tbody tr').count() === 7, 'US27 tabla con nivel + 6 señales');
  // exportar CSV
  await p.click('#history-tools button:has-text("Exportar")');
  const [dl] = await Promise.all([p.waitForEvent('download'), p.click('#export-dialog button[type=submit]')]);
  ok(dl.suggestedFilename() === 'investcheck-historial.csv', 'US29 CSV descargado');
  // recordatorio
  await p.click('#history-root button:has-text("Recordarme")').catch(async () => { await p.click('text=Recordarme'); });
  const tomorrow = new Date(Date.now() + 86400000); const d = tomorrow.getFullYear() + '-' + String(tomorrow.getMonth() + 1).padStart(2, '0') + '-' + String(tomorrow.getDate()).padStart(2, '0');
  await p.fill('#reminder-date', d);
  await p.click('#reminder-dialog button[type=submit]');
  ok(await p.evaluate(() => JSON.parse(localStorage.getItem('investcheck.reminders')).length === 1), 'US25 recordatorio guardado');
  await p.goto(B + 'index.html');
  ok(await p.locator('.note:has-text("Recordatorio")').count() === 1, 'US25 aviso un día antes');
  // encuesta tras 3 evaluaciones
  await p.goto(B + 'evaluar.html');
  await evalOffer('Oferta C', { rate: '0.5', reg: 'si', pr: 'no', ref: 'no', g: 'no', c: 'si' });
  await p.goto(B + 'index.html');
  ok(await p.locator('#survey-title').count() === 1, 'US45 encuesta aparece tras 3 evaluaciones');
  await p.click('text=Responder');
  await p.click('form button[type=submit]');
  ok((await p.textContent('#survey-title').catch(() => '')) === 'Encuesta breve', 'US45 valida respuestas incompletas');
  for (const n of ['claro', 'facil', 'volver']) await p.check(`input[name=${n}]`, { force: true }).catch(async () => { await p.locator(`input[name=${n}]`).first().check({ force: true }); });
  await p.click('form button[type=submit]');
  ok(await p.evaluate(() => JSON.parse(localStorage.getItem('investcheck.survey')).done === true), 'US45 respuesta guardada');

  // ayuda
  await p.goto(B + 'ayuda.html');
  ok((await p.textContent('#faq-list summary')).includes('rentabilidad'), 'US34 cada pregunta muestra su texto');
  await p.fill('#faq-search', 'rentabilidad anualizada');
  ok(await p.locator('#faq-list details').count() >= 1, 'US34 búsqueda encuentra');
  await p.fill('#faq-search', 'zzzz');
  ok(await p.locator('#faq-empty:not([hidden])').count() === 1, 'US34 sin resultados');
  await p.click('#support-form button[type=submit]');
  ok(await p.locator('#support-field.has-error').count() === 1, 'US35 valida mensaje vacío');

  // aprende casos
  await p.goto(B + 'aprende.html');
  await p.click('#tab-casos');
  ok(await p.locator('#casos-list article').count() === 5, 'US39 casos con fuente');
  ok(await p.locator('#casos-list a[href^="https://www."]').count() >= 5, 'US39 enlaces a fuentes oficiales');
  await p.goto(B + 'aprende.html#regulacion');
  ok(await p.evaluate(() => document.getElementById('regulacion').open), 'ayuda → abre la lección');

  // señales compartir
  await p.goto(B + 'senales.html');
  await p.click('#presion button:has-text("Compartir")');
  ok(await p.locator('#share-dialog[open]').count() === 1, 'US40 diálogo compartir');
  const [img] = await Promise.all([p.waitForEvent('download'), p.click('#share-dialog button:has-text("Descargar imagen")')]);
  ok(img.suggestedFilename() === 'investcheck-presion.png', 'US40 imagen descargada');

  // verificar
  await p.goto(B + 'verificar.html');
  await p.click('#name-form button[type=submit]');
  ok(await p.locator('#name-field.has-error').count() === 1, 'US47 valida nombre vacío');
  ok(await p.locator('a[href*="SERVICIOSANCIONESIMPUESTAS"]').count() === 1, 'US48 enlace oficial a sanciones SMV');
  await p.click('#qr-start');
  ok((await p.textContent('#qr-status')).length > 10, 'US46 mensaje de estado');

  // móvil: sin scroll horizontal
  const m = await ctx.newPage({ viewport: { width: 360, height: 740 } }).catch(() => null);
  for (const pg of ['index', 'evaluar', 'aprende', 'senales', 'verificar', 'ayuda', 'nosotros']) {
    const q = await ctx.newPage(); await q.setViewportSize({ width: 360, height: 740 });
    await q.goto(B + pg + '.html');
    const w = await q.evaluate(() => [document.documentElement.scrollWidth, window.innerWidth]);
    ok(w[0] <= w[1], 'móvil 360 sin scroll horizontal: ' + pg + ' ' + w);
    await q.close();
  }
  console.log('ERRORS', errs);
  await b.close();
})().catch(e => { console.log('CRASH', e.message); process.exit(1); });
