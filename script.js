(function () {
  'use strict';
  var WA = 'https://wa.me/5491149702287?text=' + encodeURIComponent('Hola BRIQ TEAM, quiero recibir información sobre los entrenamientos.');
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Enlaces de WhatsApp unificados
  document.querySelectorAll('a.wa').forEach(function (a) { a.href = WA; });

  // Año del footer
  var y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();

  // Navegación: fondo al hacer scroll + menú móvil
  var nav = document.getElementById('nav');
  var burger = document.getElementById('burger');
  var menu = document.getElementById('menu');
  function closeMenu() {
    menu.classList.remove('open');
    burger.setAttribute('aria-expanded', 'false');
    burger.setAttribute('aria-label', 'Abrir menú');
  }
  burger.addEventListener('click', function () {
    var open = menu.classList.toggle('open');
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
  });
  menu.addEventListener('click', function (e) { if (e.target.tagName === 'A') closeMenu(); });

  // Revelado al hacer scroll
  var items = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    items.forEach(function (el) { io.observe(el); });
  } else {
    items.forEach(function (el) { el.classList.add('in'); });
  }

  // Parallax suave
  var par = Array.prototype.slice.call(document.querySelectorAll('[data-parallax]'));
  var ticking = false;
  function onScroll() {
    nav.classList.toggle('solid', window.scrollY > 40);
    if (reduce) return;
    var vh = window.innerHeight;
    par.forEach(function (el) {
      var r = el.getBoundingClientRect();
      if (r.bottom < -100 || r.top > vh + 100) return;
      var k = parseFloat(el.getAttribute('data-parallax'));
      var off = (r.top + r.height / 2 - vh / 2) * k;
      if (el.classList.contains('hero-bg')) off = window.scrollY * k;
      el.style.transform = 'translate3d(0,' + off.toFixed(1) + 'px,0)';
    });
    ticking = false;
  }
  window.addEventListener('scroll', function () {
    if (!ticking) { ticking = true; requestAnimationFrame(onScroll); }
  }, { passive: true });
  window.addEventListener('resize', onScroll);
  onScroll();

  // Lightbox con navegación y zoom
  var lb = document.getElementById('lb');
  var lbImg = document.getElementById('lbImg');
  var lbC = document.getElementById('lbC');
  var thumbs = Array.prototype.slice.call(document.querySelectorAll('#gallery .g img'));
  var cur = 0, lastFocus = null;

  function show(i) {
    cur = (i + thumbs.length) % thumbs.length;
    lbImg.classList.remove('zoom');
    lbImg.src = thumbs[cur].getAttribute('src');
    lbImg.alt = thumbs[cur].alt;
    lbC.textContent = (cur + 1) + ' / ' + thumbs.length + ' · ' + thumbs[cur].alt;
  }
  function open(i) {
    lastFocus = document.activeElement;
    show(i);
    lb.hidden = false;
    document.body.style.overflow = 'hidden';
    document.getElementById('lbX').focus();
  }
  function close() {
    lb.hidden = true;
    document.body.style.overflow = '';
    if (lastFocus) lastFocus.focus();
  }
  thumbs.forEach(function (img, i) {
    img.closest('.g').addEventListener('click', function () { open(i); });
  });
  document.getElementById('lbX').addEventListener('click', close);
  document.getElementById('lbP').addEventListener('click', function () { show(cur - 1); });
  document.getElementById('lbN').addEventListener('click', function () { show(cur + 1); });
  lbImg.addEventListener('click', function () { lbImg.classList.toggle('zoom'); });
  lb.addEventListener('click', function (e) { if (e.target === lb) close(); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { if (!lb.hidden) close(); else closeMenu(); }
    if (lb.hidden) return;
    if (e.key === 'ArrowLeft') show(cur - 1);
    if (e.key === 'ArrowRight') show(cur + 1);
  });

  // Swipe en móviles
  var sx = null;
  lb.addEventListener('touchstart', function (e) { sx = e.touches[0].clientX; }, { passive: true });
  lb.addEventListener('touchend', function (e) {
    if (sx === null) return;
    var dx = e.changedTouches[0].clientX - sx;
    if (Math.abs(dx) > 50) show(dx < 0 ? cur + 1 : cur - 1);
    sx = null;
  });
})();
