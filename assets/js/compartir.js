/* InvestCheck — compartir una señal de alerta (US40).
   Genera el enlace y una imagen en el dispositivo; no usa servicios externos ni guarda nada. */
(function () {
  'use strict';

  var articles = Array.prototype.slice.call(document.querySelectorAll('main article.card[id]'));
  if (!articles.length) return;

  var dialog = null;
  var state = null;

  function el(tag, props) {
    var n = document.createElement(tag);
    Object.keys(props || {}).forEach(function (k) {
      if (k === 'class') n.className = props[k];
      else if (k === 'text') n.textContent = props[k];
      else n.setAttribute(k, props[k]);
    });
    for (var i = 2; i < arguments.length; i++) if (arguments[i]) n.appendChild(typeof arguments[i] === 'string' ? document.createTextNode(arguments[i]) : arguments[i]);
    return n;
  }

  function wrapLines(ctx, text, maxWidth) {
    var words = text.split(/\s+/);
    var lines = [];
    var line = '';
    words.forEach(function (w) {
      var test = line ? line + ' ' + w : w;
      if (ctx.measureText(test).width > maxWidth && line) { lines.push(line); line = w; } else line = test;
    });
    if (line) lines.push(line);
    return lines;
  }

  function drawCard(title, text) {
    var c = document.createElement('canvas');
    c.width = 1080; c.height = 1080;
    var ctx = c.getContext('2d');
    ctx.fillStyle = '#eff4ff'; ctx.fillRect(0, 0, c.width, c.height);
    ctx.fillStyle = '#0b1b3f'; ctx.fillRect(0, 0, c.width, 14);
    ctx.fillStyle = '#1d4ed8'; ctx.font = '700 38px system-ui, sans-serif';
    ctx.fillText('Señal de alerta', 80, 150);
    ctx.fillStyle = '#0b1b3f'; ctx.font = '800 76px system-ui, sans-serif';
    var y = 270;
    wrapLines(ctx, title, 920).forEach(function (l) { ctx.fillText(l, 80, y); y += 92; });
    ctx.fillStyle = '#334155'; ctx.font = '400 44px system-ui, sans-serif';
    y += 30;
    wrapLines(ctx, text, 920).slice(0, 8).forEach(function (l) { ctx.fillText(l, 80, y); y += 62; });
    ctx.fillStyle = '#0b1b3f'; ctx.font = '800 44px system-ui, sans-serif';
    ctx.fillText('InvestCheck · revisa antes de invertir', 80, 990);
    ctx.fillStyle = '#475569'; ctx.font = '400 28px system-ui, sans-serif';
    ctx.fillText('Educativo. No recomienda invertir ni dejar de invertir.', 80, 1035);
    return c;
  }

  function buildDialog() {
    var d = el('dialog', { class: 'dialog', id: 'share-dialog', 'aria-labelledby': 'share-title' });
    d.addEventListener('click', function (e) { if (e.target === d) d.close(); });
    var body = el('div');
    d.appendChild(body);
    document.body.appendChild(d);
    d._body = body;
    return d;
  }

  function open(article) {
    var title = article.querySelector('h2').textContent.trim();
    var para = article.querySelector('dd');
    var text = para ? para.textContent.trim() : '';
    var url = location.origin + location.pathname + '#' + article.id;
    state = { title: title, text: text, url: url };
    if (!dialog) dialog = buildDialog();
    var body = dialog._body;
    body.textContent = '';
    var status = el('p', { class: 'caption', role: 'status', style: 'min-height: 1.25rem; margin-top: var(--space-sm);' });
    body.appendChild(el('h2', { id: 'share-title', text: 'Compartir' }));
    body.appendChild(el('div', { class: 'share-preview' },
      el('p', { class: 'eyebrow', text: 'Señal de alerta' }),
      el('p', { class: 't-h3', text: title }),
      el('p', { text: text }),
      el('p', { class: 'caption', style: 'margin-top: var(--space-sm);', text: 'InvestCheck · revisa antes de invertir' })));
    body.appendChild(status);
    var row = el('div', { class: 'btn-row', style: 'margin-top: var(--space-md);' });
    var copy = el('button', { type: 'button', class: 'btn', text: 'Copiar enlace' });
    copy.addEventListener('click', function () {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(url).then(function () { status.textContent = 'Enlace copiado.'; }, function () { status.textContent = 'No pudimos copiar. El enlace es: ' + url; });
      } else status.textContent = 'Tu navegador no permite copiar. El enlace es: ' + url;
    });
    var dl = el('button', { type: 'button', class: 'btn btn-secondary', text: 'Descargar imagen' });
    dl.addEventListener('click', function () {
      var canvas = drawCard(state.title, state.text);
      canvas.toBlob(function (blob) {
        if (!blob) { status.textContent = 'No pudimos crear la imagen.'; return; }
        var a = el('a', { href: URL.createObjectURL(blob), download: 'investcheck-' + article.id + '.png' });
        document.body.appendChild(a); a.click(); a.remove();
        window.setTimeout(function () { URL.revokeObjectURL(a.href); }, 1000);
        status.textContent = 'Imagen descargada.';
      }, 'image/png');
    });
    row.appendChild(copy);
    row.appendChild(dl);
    if (navigator.share) {
      var sh = el('button', { type: 'button', class: 'btn btn-secondary', text: 'Más opciones' });
      sh.addEventListener('click', function () { navigator.share({ title: state.title, text: state.text, url: state.url }).catch(function () {}); });
      row.appendChild(sh);
    }
    body.appendChild(row);
    body.appendChild(el('div', { class: 'actions' }, (function () {
      var b = el('button', { type: 'button', class: 'btn btn-tertiary', text: 'Cerrar' });
      b.addEventListener('click', function () { dialog.close(); });
      return b;
    })()));
    if (window.InvestCheckI18n) window.InvestCheckI18n.apply(body);
    if (typeof dialog.showModal === 'function') dialog.showModal(); else dialog.setAttribute('open', '');
    copy.focus();
  }

  articles.forEach(function (art) {
    var h = art.querySelector('h2');
    if (!h) return;
    var b = el('button', { type: 'button', class: 'btn btn-tertiary', style: 'margin-top: var(--space-md); padding-inline: 0;', 'aria-label': 'Compartir: ' + h.textContent.trim() });
    b.appendChild(el('span', { class: 'icon icon-sm', 'aria-hidden': 'true', text: 'share' }));
    b.appendChild(document.createTextNode(' Compartir'));
    b.addEventListener('click', function () { open(art); });
    art.appendChild(b);
  });
})();
