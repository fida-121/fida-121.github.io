/* Small, dependency-free helpers: footer year, mobile menu, copy buttons,
   scroll reveal and active nav link. The site works without this file. */
(function () {
  'use strict';
  var doc = document;
  window.__siteReady = true; // tells the page this script loaded (see the fallback in <head>)

  var yr = doc.getElementById('yr');
  if (yr) yr.textContent = new Date().getFullYear();

  // Mobile menu
  var toggle = doc.querySelector('.nav-toggle');
  var links = doc.getElementById('nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', function () {
      var open = links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    links.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') {
        links.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // Copy buttons
  function fallbackCopy(text, done) {
    var a = doc.createElement('textarea');
    a.value = text;
    a.setAttribute('readonly', '');
    a.style.position = 'fixed';
    a.style.opacity = '0';
    doc.body.appendChild(a);
    a.select();
    try { doc.execCommand('copy'); done(); } catch (err) {}
    doc.body.removeChild(a);
  }
  var buttons = doc.querySelectorAll('[data-copy]');
  Array.prototype.forEach.call(buttons, function (b) {
    b.addEventListener('click', function () {
      var text = b.getAttribute('data-copy');
      var original = b.textContent;
      var done = function () {
        b.textContent = 'Copied';
        setTimeout(function () { b.textContent = original; }, 1500);
      };
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text).then(done, function () { fallbackCopy(text, done); });
      } else {
        fallbackCopy(text, done);
      }
    });
  });

  // Scroll reveal
  var reveals = doc.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
    Array.prototype.forEach.call(reveals, function (el) { io.observe(el); });
  } else {
    Array.prototype.forEach.call(reveals, function (el) { el.classList.add('in'); });
  }

  // Active nav link (homepage only)
  var navLinks = doc.querySelectorAll('.nav-links a[href^="#"]');
  if ('IntersectionObserver' in window && navLinks.length) {
    var map = {};
    Array.prototype.forEach.call(navLinks, function (a) { map[a.getAttribute('href').slice(1)] = a; });
    var so = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting && map[en.target.id]) {
          Array.prototype.forEach.call(navLinks, function (a) { a.removeAttribute('aria-current'); });
          map[en.target.id].setAttribute('aria-current', 'true');
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    Object.keys(map).forEach(function (id) {
      var s = doc.getElementById(id);
      if (s) so.observe(s);
    });
  }
})();
