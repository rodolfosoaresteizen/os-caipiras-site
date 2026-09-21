(function () {
  'use strict';

  var D = window.OC_DATA;
  var root = document.documentElement;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  var store = {
    get: function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set: function (k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  };

  /* ================= Idioma ================= */
  var lang = store.get('oc-lang') === 'en' ? 'en' : 'pt';
  function t(key) { return (I18N[lang] && I18N[lang][key]) || I18N.pt[key] || key; }

  function applyI18n() {
    root.setAttribute('lang', lang === 'en' ? 'en' : 'pt-BR');
    $$('[data-i18n]').forEach(function (el) { el.textContent = t(el.getAttribute('data-i18n')); });
    $$('[data-i18n-html]').forEach(function (el) { el.innerHTML = t(el.getAttribute('data-i18n-html')); });
    $$('[data-i18n-attr]').forEach(function (el) {
      el.getAttribute('data-i18n-attr').split(';').forEach(function (pair) {
        var p = pair.split(':'); if (p.length === 2) el.setAttribute(p[0].trim(), t(p[1].trim()));
      });
    });
    document.title = lang === 'en'
      ? 'Os Caipiras | Countryside calm and flavor, right around the corner!'
      : 'Os Caipiras | A tranquilidade e o sabor do interior pertinho de você!';
    updateOpenStatus();
    renderMenu();
    renderGallery();
    renderPreview();
    renderCart();
    fillTimeSelects();
    // Mensagens de erro já exibidas são re-traduzidas
    $$('.field.invalid').forEach(function (f) { var i = $('input,select,textarea', f); if (i) validateField(i); });
  }

  $('#lang-toggle').addEventListener('click', function () {
    lang = lang === 'pt' ? 'en' : 'pt';
    store.set('oc-lang', lang);
    applyI18n();
  });

  /* ================= Tema ================= */
  $('#theme-toggle').addEventListener('click', function () {
    var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    store.set('oc-theme', next);
  });
  if (window.matchMedia) {
    var mq = window.matchMedia('(prefers-color-scheme: dark)');
    var onMq = function (e) { if (!store.get('oc-theme')) root.setAttribute('data-theme', e.matches ? 'dark' : 'light'); };
    mq.addEventListener ? mq.addEventListener('change', onMq) : mq.addListener(onMq);
  }

  /* ================= Cabeçalho / menu ================= */
  var header = $('.site-header');
  var nav = $('#main-nav');
  var menuBtn = $('#menu-toggle');

  function onScroll() { header.classList.toggle('is-solid', window.scrollY > 40); }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  function setMenu(open) {
    nav.classList.toggle('is-open', open);
    header.classList.toggle('menu-open', open);
    menuBtn.setAttribute('aria-expanded', String(open));
    menuBtn.setAttribute('aria-label', open ? t('a11y.close') : t('a11y.menu'));
  }
  menuBtn.addEventListener('click', function () { setMenu(!nav.classList.contains('is-open')); });
  $$('a', nav).forEach(function (a) { a.addEventListener('click', function () { setMenu(false); }); });
  document.addEventListener('click', function (e) {
    if (nav.classList.contains('is-open') && !nav.contains(e.target) && !menuBtn.contains(e.target)) setMenu(false);
  });

  // Destaca a seção atual no menu
  var navLinks = $$('.main-nav ul a');
  if ('IntersectionObserver' in window) {
    var secObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          navLinks.forEach(function (a) { a.classList.toggle('is-current', a.getAttribute('href') === '#' + en.target.id); });
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    ['inicio', 'cardapio', 'sobre', 'galeria', 'contato'].forEach(function (id) { var s = document.getElementById(id); if (s) secObs.observe(s); });
  }

  /* ================= Aberto / fechado (horário de Brasília) ================= */
  function spNow() {
    try {
      var parts = new Intl.DateTimeFormat('en-GB', { timeZone: 'America/Sao_Paulo', hour: '2-digit', minute: '2-digit', year: 'numeric', month: '2-digit', day: '2-digit', hour12: false }).formatToParts(new Date());
      var o = {}; parts.forEach(function (p) { o[p.type] = p.value; });
      return { date: o.year + '-' + o.month + '-' + o.day, mins: (+o.hour % 24) * 60 + (+o.minute) };
    } catch (e) {
      var d = new Date();
      return { date: d.toISOString().slice(0, 10), mins: d.getHours() * 60 + d.getMinutes() };
    }
  }
  function updateOpenStatus() {
    var n = spNow(), open = n.mins >= 600 && n.mins < 1080;
    $('#open-status').textContent = t(open ? 'hero.open' : 'hero.closed');
    $('#open-status-dot').classList.toggle('closed', !open);
  }
  setInterval(updateOpenStatus, 60000);

  /* ================= Carrossel do hero ================= */
  (function heroCarousel() {
    var slides = $$('.hero-slide'), dots = $('#hero-dots'), idx = 0, timer = null;
    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    slides.forEach(function (s, i) {
      var b = document.createElement('button');
      b.type = 'button'; b.setAttribute('role', 'tab');
      b.setAttribute('aria-label', (i + 1) + ' / ' + slides.length);
      b.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
      b.addEventListener('click', function () { go(i); restart(); });
      dots.appendChild(b);
    });
    function go(i) {
      idx = (i + slides.length) % slides.length;
      slides.forEach(function (s, k) { s.classList.toggle('is-active', k === idx); });
      $$('button', dots).forEach(function (b, k) { b.setAttribute('aria-selected', k === idx ? 'true' : 'false'); });
      var img = $('img', slides[idx]); if (img) img.loading = 'eager';
    }
    function restart() { clearInterval(timer); if (!reduce) timer = setInterval(function () { go(idx + 1); }, 6000); }
    $('#hero-prev').addEventListener('click', function () { go(idx - 1); restart(); });
    $('#hero-next').addEventListener('click', function () { go(idx + 1); restart(); });
    var hero = $('.hero'), sx = null;
    hero.addEventListener('touchstart', function (e) { sx = e.touches[0].clientX; }, { passive: true });
    hero.addEventListener('touchend', function (e) {
      if (sx === null) return; var dx = e.changedTouches[0].clientX - sx; sx = null;
      if (Math.abs(dx) > 50) { go(idx + (dx < 0 ? 1 : -1)); restart(); }
    });
    document.addEventListener('visibilitychange', function () { document.hidden ? clearInterval(timer) : restart(); });
    restart();
  })();

  /* ================= Utilidades ================= */
  function money(v) {
    return v.toLocaleString(lang === 'en' ? 'en-US' : 'pt-BR', { style: 'currency', currency: 'BRL' });
  }
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  var toastEl = $('#toast'), toastT;
  function toast(msg) {
    toastEl.textContent = msg; toastEl.classList.add('show');
    clearTimeout(toastT); toastT = setTimeout(function () { toastEl.classList.remove('show'); }, 2400);
  }
  var catIcon = { pratos: 'i-meat', monte: 'i-meat', executivo: 'i-meat', petiscos: 'i-bowl', acomp: 'i-bowl', bebidas: 'i-mug', sobremesas: 'i-cake' };
  function svg(id, cls) { return '<svg class="' + (cls || 'ico') + '"><use href="#' + id + '"/></svg>'; }

  /* ================= Cardápio ================= */
  /* Itens do carrinho são guardados como "id#tamanho" (tamanho = índice em item.sizes, 0 se preço único) */
  var menuFilter = 'pratos';
  var selSize = {};
  var cart = {};
  try { cart = JSON.parse(store.get('oc-cart-v2') || '{}') || {}; } catch (e) { cart = {}; }
  function itemById(id) { for (var i = 0; i < D.menu.length; i++) if (D.menu[i].id === id) return D.menu[i]; return null; }
  function parseKey(k) { var p = k.split('#'), it = itemById(p[0]), si = +p[1] || 0; return it && (!it.sizes || it.sizes[si]) ? { it: it, si: si } : null; }
  function unitPrice(it, si) { return it.sizes ? it.sizes[si][2] : it.price; }
  function sizeLabel(it, si, lg) { return it.sizes ? it.sizes[si][lg === 'en' ? 1 : 0] : ''; }
  function lineName(it, si, lg) { var s = sizeLabel(it, si, lg); return (it[lg] || it.pt).n + (s ? ' (' + s + ')' : ''); }
  Object.keys(cart).forEach(function (k) { if (!parseKey(k) || !(cart[k] > 0)) delete cart[k]; });

  function renderMenu() {
    var grid = $('#menu-grid'), html = '';
    $('#cat-note').textContent = t('menu.note.' + menuFilter);
    D.menu.forEach(function (it, i) {
      if (it.cat !== menuFilter) return;
      var L = it[lang] || it.pt, si = selSize[it.id] || 0, key = it.id + '#' + si, q = cart[key] || 0;
      var tag = it.featured ? '<span class="dish-tag">' + t('menu.house') + '</span>' : '';
      var sizes = '';
      if (it.sizes && it.sizes.length > 1) {
        sizes = '<div class="sizes" role="radiogroup" aria-label="' + t('menu.size') + '">' + it.sizes.map(function (s, k) {
          return '<button type="button" role="radio" aria-checked="' + (k === si) + '" data-size="' + it.id + '|' + k + '">' +
            '<span>' + esc(s[lang === 'en' ? 1 : 0]) + '</span><strong>' + money(s[2]) + '</strong></button>';
        }).join('') + '</div>';
      } else if (it.sizes) {
        sizes = '<p class="size-single">' + esc(sizeLabel(it, 0, lang)) + '</p>';
      }
      html += '<article class="dish" style="animation-delay:' + Math.min(i % 12 * 30, 300) + 'ms">' +
        (it.img
          ? '<div class="dish-media"><img src="' + it.img + '" alt="' + esc(L.n) + '" loading="lazy" width="800" height="500">' + tag + '</div>'
          : '<div class="dish-media is-icon"><span aria-hidden="true">' + svg(catIcon[it.cat], '') + '</span>' + tag + '</div>') +
        '<div class="dish-body">' +
          '<div class="dish-top"><h3>' + esc(L.n) + '</h3><span class="dish-price">' + money(unitPrice(it, si)) + '</span></div>' +
          (L.d ? '<p>' + esc(L.d) + '</p>' : '<p></p>') +
          sizes +
          '<div class="dish-actions">' +
            (q > 0
              ? '<div class="qty" role="group" aria-label="' + esc(lineName(it, si, lang)) + '">' +
                  '<button type="button" data-dec="' + key + '" aria-label="' + t('cart.dec') + '">' + svg('i-minus') + '</button>' +
                  '<output aria-live="polite">' + q + '</output>' +
                  '<button type="button" data-inc="' + key + '" aria-label="' + t('cart.inc') + '">' + svg('i-plus') + '</button>' +
                '</div>'
              : '') +
            '<button type="button" class="btn btn-secondary" data-add="' + key + '">' + svg('i-plus') + '<span>' + t('menu.add') + '</span></button>' +
          '</div>' +
        '</div></article>';
    });
    grid.innerHTML = html;
  }

  function setupFilters(wrapSel, onChange) {
    var wrap = $(wrapSel);
    wrap.addEventListener('click', function (e) {
      var b = e.target.closest('.chip'); if (!b) return;
      $$('.chip', wrap).forEach(function (c) { var on = c === b; c.classList.toggle('is-active', on); c.setAttribute('aria-selected', on ? 'true' : 'false'); });
      onChange(b.getAttribute('data-filter'));
    });
  }
  setupFilters('#menu-filters', function (f) { menuFilter = f; renderMenu(); });

  $('#menu-grid').addEventListener('click', function (e) {
    var b = e.target.closest('button'); if (!b) return;
    var sz = b.getAttribute('data-size');
    if (sz) { sz = sz.split('|'); selSize[sz[0]] = +sz[1]; renderMenu(); var nb = $('[data-size="' + sz.join('|') + '"]'); nb && nb.focus(); return; }
    var id = b.getAttribute('data-add') || b.getAttribute('data-inc');
    if (id) {
      cart[id] = (cart[id] || 0) + 1;
      if (b.hasAttribute('data-add')) { var pk = parseKey(id); toast(lineName(pk.it, pk.si, lang) + ' ' + t('menu.added')); }
      saveCart(true);
    } else if ((id = b.getAttribute('data-dec'))) {
      cart[id] = (cart[id] || 0) - 1; if (cart[id] <= 0) delete cart[id];
      saveCart();
    }
  });

  /* ================= Carrinho ================= */
  var fab = $('#cart-fab'), panel = $('#cart-panel'), overlay = $('#overlay');
  function cartCount() { return Object.keys(cart).reduce(function (s, k) { return s + cart[k]; }, 0); }
  function cartTotal() { return Object.keys(cart).reduce(function (s, k) { var p = parseKey(k); return s + (p ? unitPrice(p.it, p.si) * cart[k] : 0); }, 0); }

  function saveCart(bump) {
    store.set('oc-cart-v2', JSON.stringify(cart));
    renderCart(); renderMenu();
    if (bump) { fab.classList.remove('bump'); void fab.offsetWidth; fab.classList.add('bump'); }
  }

  function renderCart() {
    var n = cartCount(), keys = Object.keys(cart), list = $('#cart-items');
    $('#cart-count').textContent = n;
    $('#cart-fab-total').textContent = n ? money(cartTotal()) : '';
    fab.classList.toggle('is-visible', n > 0 || panel.classList.contains('is-open'));
    fab.setAttribute('aria-label', t('cart.open') + ' (' + n + ')');
    $('#cart-total').textContent = money(cartTotal());
    $('#checkout-btn').disabled = n === 0;
    if (!keys.length) {
      list.innerHTML = '<div class="cart-empty">' + svg('i-cart', '') + '<p><strong>' + t('cart.empty') + '</strong><br>' + t('cart.emptyHint') + '</p></div>';
      return;
    }
    list.innerHTML = keys.map(function (id) {
      var p = parseKey(id), it = p.it, name = (it[lang] || it.pt).n, sl = sizeLabel(it, p.si, lang), u = unitPrice(it, p.si);
      return '<div class="cart-line">' +
        '<div><h4>' + esc(name) + '</h4><span class="unit">' + (sl ? esc(sl) + ' · ' : '') + money(u) + '</span></div>' +
        '<span class="line-total">' + money(u * cart[id]) + '</span>' +
        '<div class="qty" role="group" aria-label="' + esc(lineName(it, p.si, lang)) + '">' +
          '<button type="button" data-dec="' + id + '" aria-label="' + t('cart.dec') + '">' + svg('i-minus') + '</button>' +
          '<output>' + cart[id] + '</output>' +
          '<button type="button" data-inc="' + id + '" aria-label="' + t('cart.inc') + '">' + svg('i-plus') + '</button>' +
        '</div>' +
        '<button type="button" class="link-btn remove" data-remove="' + id + '">' + t('cart.remove') + '</button>' +
      '</div>';
    }).join('');
  }

  $('#cart-items').addEventListener('click', function (e) {
    var b = e.target.closest('button'); if (!b) return;
    var id;
    if ((id = b.getAttribute('data-inc'))) cart[id]++;
    else if ((id = b.getAttribute('data-dec'))) { cart[id]--; if (cart[id] <= 0) delete cart[id]; }
    else if ((id = b.getAttribute('data-remove'))) delete cart[id];
    else return;
    saveCart();
  });
  $('#cart-clear').addEventListener('click', function () { cart = {}; saveCart(); toast(t('cart.cleared')); });

  var lastFocus = null;
  function lockScroll(on) { document.body.classList.toggle('no-scroll', on); }
  function openCart() {
    lastFocus = document.activeElement;
    panel.classList.add('is-open'); panel.setAttribute('aria-hidden', 'false');
    fab.setAttribute('aria-expanded', 'true');
    overlay.hidden = false; lockScroll(true);
    setTimeout(function () { var c = $('[data-close="cart"]', panel); c && c.focus(); }, 50);
  }
  function closeCart() {
    panel.classList.remove('is-open'); panel.setAttribute('aria-hidden', 'true');
    fab.setAttribute('aria-expanded', 'false');
    overlay.hidden = true; lockScroll(false);
    renderCart();
    if (lastFocus) lastFocus.focus();
  }
  fab.addEventListener('click', openCart);
  overlay.addEventListener('click', closeCart);

  /* ================= Checkout ================= */
  var coModal = $('#checkout-modal'), coForm = $('#checkout-form'), coDone = $('#co-done');
  function openCheckout() {
    if (!cartCount()) return;
    panel.classList.remove('is-open'); panel.setAttribute('aria-hidden', 'true'); overlay.hidden = true;
    coForm.hidden = false; coDone.hidden = true;
    renderSummary();
    coModal.hidden = false; lockScroll(true);
    setTimeout(function () { $('#o-name').focus(); }, 60);
  }
  function closeCheckout() { coModal.hidden = true; lockScroll(false); renderCart(); fab.focus(); }
  $('#checkout-btn').addEventListener('click', openCheckout);
  coModal.addEventListener('click', function (e) { if (e.target === coModal) closeCheckout(); });
  document.addEventListener('click', function (e) {
    var c = e.target.closest('[data-close]'); if (!c) return;
    if (c.getAttribute('data-close') === 'cart') closeCart();
    if (c.getAttribute('data-close') === 'checkout') closeCheckout();
  });

  function renderSummary() {
    var html = '<strong>' + t('co.items') + '</strong>';
    Object.keys(cart).forEach(function (id) {
      var p = parseKey(id);
      html += '<div class="row"><span>' + cart[id] + '× ' + esc(lineName(p.it, p.si, lang)) + '</span><span>' + money(unitPrice(p.it, p.si) * cart[id]) + '</span></div>';
    });
    if (coForm.mode.value === 'entrega') html += '<div class="row muted"><span>' + t('co.deliveryNote') + '</span><span></span></div>';
    html += '<div class="row total"><span>' + t('cart.total') + '</span><span>' + money(cartTotal()) + '</span></div>';
    $('#co-summary').innerHTML = html;
  }
  $$('input[name="mode"]', coForm).forEach(function (r) {
    r.addEventListener('change', function () {
      var del = coForm.mode.value === 'entrega';
      $('#address-field').hidden = !del;
      $('#o-address').required = del;
      renderSummary();
    });
  });

  /* ================= Datas e horários ================= */
  function todayISO() { return spNow().date; }
  function slots() { var a = []; for (var m = 600; m <= 1050; m += 30) a.push(('0' + Math.floor(m / 60)).slice(-2) + ':' + ('0' + m % 60).slice(-2)); return a; }
  function fillTimeSelects() {
    ['#b-time', '#o-time'].forEach(function (sel) {
      var s = $(sel), cur = s.value;
      s.innerHTML = '<option value="">' + t('f.select') + '</option>' + slots().map(function (v) {
        return '<option value="' + v + '">' + (lang === 'en' ? to12h(v) : v.replace(':00', 'h').replace(':30', 'h30')) + '</option>';
      }).join('');
      s.value = cur;
    });
  }
  function to12h(v) { var h = +v.slice(0, 2), m = v.slice(3); return ((h % 12) || 12) + (m === '00' ? '' : ':' + m) + (h < 12 ? 'am' : 'pm'); }
  ['#b-date', '#o-date'].forEach(function (s) { $(s).min = todayISO(); });
  $('#o-date').value = todayISO();

  /* ================= Validação ================= */
  function digits(v) { return (v || '').replace(/\D/g, ''); }
  function validateField(el) {
    var v = (el.value || '').trim(), msg = '', name = el.name;
    if (el.required && !v) msg = t('v.required');
    else if (v) {
      if (name === 'name' && (v.length < 3 || !/\S+\s+\S+/.test(v))) msg = t('v.name');
      else if (name === 'phone' && (digits(v).length < 10 || digits(v).length > 13)) msg = t('v.phone');
      else if (el.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) msg = t('v.email');
      else if (el.type === 'date' && v < todayISO()) msg = t('v.datePast');
      else if (name === 'time') {
        var form = el.form, d = form.date && form.date.value;
        var mins = +v.slice(0, 2) * 60 + (+v.slice(3));
        if (mins < 600 || mins > 1050) msg = t('v.time');
        else if (d === todayISO() && mins <= spNow().mins) msg = t('v.timePast');
      }
      else if (name === 'people' && (!(+v >= 1 && +v <= 60))) msg = t('v.people');
      else if (name === 'address' && v.length < 8) msg = t('v.address');
      else if (el.minLength > 0 && v.length < el.minLength) msg = t('v.min');
    }
    var f = el.closest('.field');
    if (f) {
      f.classList.toggle('invalid', !!msg);
      f.classList.toggle('valid', !msg && !!v);
      var err = $('.error', f); if (err) err.textContent = msg;
    }
    el.setAttribute('aria-invalid', msg ? 'true' : 'false');
    return !msg;
  }
  function validateForm(form) {
    var ok = true, first = null;
    $$('input:not(.hp):not([type=radio]), select, textarea', form).forEach(function (el) {
      if (el.closest('[hidden]')) return;
      if (!validateField(el)) { ok = false; first = first || el; }
    });
    if (first) { first.focus(); toast(t('v.fix')); }
    return ok;
  }
  // Máscara simples de telefone
  $$('input[type=tel]').forEach(function (el) {
    el.addEventListener('input', function () {
      var d = digits(el.value).slice(0, 11), out = d;
      if (d.length > 2) out = '(' + d.slice(0, 2) + ') ' + d.slice(2);
      if (d.length > 6) out = '(' + d.slice(0, 2) + ') ' + d.slice(2, d.length - 4) + '-' + d.slice(-4);
      el.value = out;
    });
  });
  // Validação em tempo real
  $$('form').forEach(function (form) {
    form.addEventListener('blur', function (e) { if (e.target.matches('input:not(.hp),select,textarea')) validateField(e.target); }, true);
    form.addEventListener('input', function (e) { var f = e.target.closest('.field'); if (f && f.classList.contains('invalid')) validateField(e.target); });
    form.addEventListener('change', function (e) { if (e.target.name === 'date' && form.time && form.time.value) validateField(form.time); });
  });

  // Anti-spam: honeypot + intervalo mínimo entre envios
  var lastSend = 0;
  function spamGuard(form) {
    if (form.website && form.website.value) { toast(t('v.spam')); return false; }
    if (Date.now() - lastSend < 4000) return false;
    lastSend = Date.now(); return true;
  }

  function fmtDate(iso) {
    if (!iso) return '';
    var p = iso.split('-'); return lang === 'en' ? p[1] + '/' + p[2] + '/' + p[0] : p[2] + '/' + p[1] + '/' + p[0];
  }
  function sendWhatsApp(text) {
    var url = 'https://api.whatsapp.com/send?phone=' + D.whatsapp + '&text=' + encodeURIComponent(text);
    var w = window.open(url, '_blank', 'noopener');
    if (!w) window.location.href = url;
  }
  function withLoading(btn, fn) {
    btn.classList.add('is-loading'); btn.disabled = true;
    setTimeout(function () { fn(); btn.classList.remove('is-loading'); btn.disabled = false; }, 600);
  }
  function showSuccess(form, msg) {
    var s = $('.form-success', form);
    s.innerHTML = svg('i-check') + '<span>' + esc(msg) + '</span>'; s.hidden = false;
    setTimeout(function () { s.hidden = true; }, 9000);
  }
  function line(label, v) { return v ? '*' + label + ':* ' + v + '\n' : ''; }
  // As mensagens para o restaurante saem sempre em português, mesmo se o cliente navegar em inglês
  function inPT(fn) {
    var was = lang; lang = 'pt';
    try { return fn() + (was === 'en' ? '\n_(Cliente usou o site em inglês)_' : ''); } finally { lang = was; }
  }
  var payKeys = { pix: 'co.pay.pix', dinheiro: 'co.pay.cash', cartao: 'co.pay.card' };

  /* Pedido */
  coForm.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!validateForm(coForm) || !spamGuard(coForm)) return;
    var f = coForm, num = 'OC-' + Date.now().toString(36).slice(-5).toUpperCase();
    var msg = inPT(function () {
      var items = Object.keys(cart).map(function (id) {
        var p = parseKey(id);
        return '• ' + cart[id] + 'x ' + lineName(p.it, p.si, 'pt') + ' — ' + money(unitPrice(p.it, p.si) * cart[id]);
      }).join('\n');
      return '🍖 *' + t('wa.order') + ' ' + num + '* — Os Caipiras\n\n' +
        line(t('wa.name'), f.name.value.trim()) + line(t('wa.phone'), f.phone.value.trim()) +
        line(t('wa.mode'), t(f.mode.value === 'entrega' ? 'co.delivery' : 'co.pickup')) +
        (f.mode.value === 'entrega' ? line(t('wa.address'), f.address.value.trim()) : '') +
        line(t('wa.date'), fmtDate(f.date.value)) + line(t('wa.time'), f.time.value) + line(t('wa.pay'), t(payKeys[f.pay.value])) +
        '\n*' + t('wa.items') + ':*\n' + items + '\n\n*' + t('wa.total') + ': ' + money(cartTotal()) + '*' +
        (f.mode.value === 'entrega' ? ' (+ ' + t('co.deliveryNote').toLowerCase() + ')' : '') + '\n' +
        (f.notes.value.trim() ? '\n' + line(t('wa.notes'), f.notes.value.trim()) : '');
    });
    withLoading($('button[type=submit]', coForm), function () {
      sendWhatsApp(msg);
      $('#co-number').textContent = num;
      coForm.hidden = true; coDone.hidden = false;
      cart = {}; saveCart();
      coForm.reset(); $('#o-date').value = todayISO(); $('#address-field').hidden = true;
      $$('.field', coForm).forEach(function (x) { x.classList.remove('valid', 'invalid'); });
    });
  });

  /* Reserva */
  $('#booking-form').addEventListener('submit', function (e) {
    e.preventDefault();
    var f = e.currentTarget;
    if (!validateForm(f) || !spamGuard(f)) return;
    var msg = inPT(function () {
      return '📅 *' + t('wa.booking') + '* — Os Caipiras\n\n' +
        line(t('wa.name'), f.name.value.trim()) + line(t('wa.phone'), f.phone.value.trim()) + line(t('wa.email'), f.email.value.trim()) +
        line(t('wa.date'), fmtDate(f.date.value)) + line(t('wa.time'), f.time.value) + line(t('wa.people'), f.people.value) +
        line(t('wa.notes'), f.notes.value.trim());
    });
    withLoading($('button[type=submit]', f), function () {
      sendWhatsApp(msg); showSuccess(f, t('book.success'));
      f.reset(); $$('.field', f).forEach(function (x) { x.classList.remove('valid', 'invalid'); });
    });
  });

  /* Contato */
  $('#contact-form').addEventListener('submit', function (e) {
    e.preventDefault();
    var f = e.currentTarget;
    if (!validateForm(f) || !spamGuard(f)) return;
    var msg = inPT(function () {
      return '✉️ *' + t('wa.contact') + '* — Os Caipiras\n\n' +
        line(t('wa.name'), f.name.value.trim()) + line(t('wa.email'), f.email.value.trim()) + line(t('wa.phone'), f.phone.value.trim()) +
        line(t('wa.subject'), f.subject.value.trim()) + '\n' + f.message.value.trim();
    });
    withLoading($('button[type=submit]', f), function () {
      sendWhatsApp(msg); showSuccess(f, t('cf.success'));
      f.reset(); $$('.field', f).forEach(function (x) { x.classList.remove('valid', 'invalid'); });
    });
  });

  /* ================= Galeria + lightbox ================= */
  var galFilter = 'all', lbList = [], lbIdx = 0;
  function tileHTML(g, i, sizes) {
    var cap = g[lang] || g.pt;
    return '<button type="button" class="tile" data-idx="' + i + '" data-caption="' + esc(cap) + '" style="animation-delay:' + Math.min(i * 25, 400) + 'ms">' +
      '<img src="images/thumbs/' + g.f + '" alt="' + esc(cap) + '" loading="lazy" decoding="async" width="' + g.w + '" height="' + g.h + '"' +
      ' srcset="images/thumbs/' + g.f + ' 640w, images/' + g.f + ' 1600w" sizes="' + sizes + '">' +
    '</button>';
  }
  function renderGallery() {
    $('#gal-grid').innerHTML = D.gallery.map(function (g, i) {
      return (galFilter === 'all' || g.cat === galFilter) ? tileHTML(g, i, '(min-width:1024px) 25vw, (min-width:768px) 33vw, 50vw') : '';
    }).join('');
  }
  function renderPreview() {
    $('#gp-grid').innerHTML = D.preview.map(function (i, k) {
      return tileHTML(D.gallery[i], i, k === 0 ? '(min-width:768px) 50vw, 100vw' : '(min-width:768px) 25vw, 50vw');
    }).join('');
  }
  setupFilters('#gal-filters', function (f) { galFilter = f; renderGallery(); });

  var lb = $('#lightbox'), lbImg = $('#lb-img'), lbCap = $('#lb-cap');
  function openLb(idx, list) {
    lastFocus = document.activeElement;
    lbList = list; lbIdx = Math.max(0, list.indexOf(idx));
    showLb(); lb.hidden = false; lockScroll(true);
    $('.lb-close', lb).focus();
  }
  function showLb() {
    var g = D.gallery[lbList[lbIdx]], cap = g[lang] || g.pt;
    lbImg.src = 'images/' + g.f; lbImg.alt = cap;
    lbCap.textContent = cap + '  ·  ' + (lbIdx + 1) + ' / ' + lbList.length;
    [lbList[lbIdx + 1], lbList[lbIdx - 1]].forEach(function (n) { if (n != null) { var im = new Image(); im.src = 'images/' + D.gallery[n].f; } });
  }
  function stepLb(d) { lbIdx = (lbIdx + d + lbList.length) % lbList.length; showLb(); }
  function closeLb() { lb.hidden = true; lockScroll(false); if (lastFocus) lastFocus.focus(); }

  function visibleList(container) { return $$('.tile', container).map(function (x) { return +x.getAttribute('data-idx'); }); }
  $('#gal-grid').addEventListener('click', function (e) { var b = e.target.closest('.tile'); if (b) openLb(+b.getAttribute('data-idx'), visibleList($('#gal-grid'))); });
  $('#gp-grid').addEventListener('click', function (e) { var b = e.target.closest('.tile'); if (b) openLb(+b.getAttribute('data-idx'), D.gallery.map(function (_, i) { return i; })); });
  $('.lb-close', lb).addEventListener('click', closeLb);
  $('.lb-prev', lb).addEventListener('click', function () { stepLb(-1); });
  $('.lb-next', lb).addEventListener('click', function () { stepLb(1); });
  lb.addEventListener('click', function (e) { if (e.target === lb || e.target.classList.contains('lb-figure')) closeLb(); });
  var lsx = null;
  lb.addEventListener('touchstart', function (e) { lsx = e.touches[0].clientX; }, { passive: true });
  lb.addEventListener('touchend', function (e) {
    if (lsx === null) return; var dx = e.changedTouches[0].clientX - lsx; lsx = null;
    if (Math.abs(dx) > 50) stepLb(dx < 0 ? 1 : -1);
  });

  /* ================= Teclado (ESC / setas / foco preso) ================= */
  function trapFocus(container, e) {
    var f = $$('a[href],button:not([disabled]),input:not(.hp):not([type=hidden]),select,textarea,[tabindex]:not([tabindex="-1"])', container)
      .filter(function (el) { return el.offsetParent !== null; });
    if (!f.length) return;
    var first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }
  document.addEventListener('keydown', function (e) {
    if (!lb.hidden) {
      if (e.key === 'Escape') closeLb();
      else if (e.key === 'ArrowRight') stepLb(1);
      else if (e.key === 'ArrowLeft') stepLb(-1);
      else if (e.key === 'Tab') trapFocus(lb, e);
      return;
    }
    if (!coModal.hidden) { if (e.key === 'Escape') closeCheckout(); else if (e.key === 'Tab') trapFocus(coModal, e); return; }
    if (panel.classList.contains('is-open')) { if (e.key === 'Escape') closeCart(); else if (e.key === 'Tab') trapFocus(panel, e); return; }
    if (e.key === 'Escape' && nav.classList.contains('is-open')) { setMenu(false); menuBtn.focus(); }
  });

  /* ================= Scroll reveal ================= */
  if ('IntersectionObserver' in window) {
    var rObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('is-visible'); rObs.unobserve(en.target); } });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    $$('.reveal').forEach(function (el, i) { el.style.transitionDelay = (i % 4) * 80 + 'ms'; rObs.observe(el); });
  } else {
    $$('.reveal').forEach(function (el) { el.classList.add('is-visible'); });
  }

  $('#year').textContent = new Date().getFullYear();
  applyI18n();
})();
