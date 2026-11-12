/* Igor Araujo. Gerado por build.js a partir de src/. Nao edite este arquivo. */
'use strict';
(function () {
var root = document.documentElement;
var toggle = document.getElementById('themeToggle');
function set(theme) {
root.setAttribute('data-theme', theme);
try { localStorage.setItem('theme', theme); } catch (e) {}
if (toggle) toggle.setAttribute('aria-label', theme === 'dark' ? 'Ativar tema claro' : 'Ativar tema escuro');
}
if (toggle) {
toggle.addEventListener('click', function () {
set(root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
});
}
var mq = window.matchMedia('(prefers-color-scheme: dark)');
var onChange = function (e) {
var saved = null;
try { saved = localStorage.getItem('theme'); } catch (err) {}
if (!saved) root.setAttribute('data-theme', e.matches ? 'dark' : 'light');
};
if (mq.addEventListener) mq.addEventListener('change', onChange);
else if (mq.addListener) mq.addListener(onChange);
})();
(function () {
if (!('IntersectionObserver' in window)) return;
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
var SELECTORS = [
'.sec-head',
'.pcard',
'.about__portrait',
'.about__text',
'.caps > .cap',
'.jobs__list > .job',
'.clients',
'.quote',
'.contact__brief',
'.channels > li',
];
var targets = document.querySelectorAll(SELECTORS.join(','));
if (!targets.length) return;
var observer = new IntersectionObserver(
function (entries) {
entries.forEach(function (entry) {
if (!entry.isIntersecting) return;
entry.target.classList.add('is-in');
observer.unobserve(entry.target);
});
},
{ rootMargin: '0px 0px -8% 0px', threshold: 0.08 }
);
targets.forEach(function (el, i) {
el.classList.add('reveal');
var siblings = el.parentElement ? Array.prototype.indexOf.call(el.parentElement.children, el) : 0;
el.style.transitionDelay = Math.min(siblings, 5) * 55 + 'ms';
observer.observe(el);
});
})();