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
var header = document.getElementById('header');
var toggle = document.getElementById('menuToggle');
var menu = document.getElementById('mobileMenu');
if (header) {
var onScroll = function () {
header.classList.toggle('is-stuck', window.scrollY > 8);
};
onScroll();
window.addEventListener('scroll', onScroll, { passive: true });
}
if (!toggle || !menu) return;
var lastFocus = null;
function open() {
lastFocus = document.activeElement;
menu.hidden = false;
toggle.setAttribute('aria-expanded', 'true');
toggle.setAttribute('aria-label', 'Fechar menu');
document.body.classList.add('is-locked');
var first = menu.querySelector('a, button');
if (first) first.focus();
}
function close() {
menu.hidden = true;
toggle.setAttribute('aria-expanded', 'false');
toggle.setAttribute('aria-label', 'Abrir menu');
document.body.classList.remove('is-locked');
if (lastFocus) lastFocus.focus();
}
toggle.addEventListener('click', function () {
if (menu.hidden) open(); else close();
});
menu.addEventListener('click', function (e) {
if (e.target.closest('a')) close();
});
document.addEventListener('keydown', function (e) {
if (menu.hidden) return;
if (e.key === 'Escape') { close(); return; }
if (e.key === 'Tab') {
var items = menu.querySelectorAll('a[href], button:not([disabled])');
if (!items.length) return;
var first = items[0];
var last = items[items.length - 1];
if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
}
});
window.matchMedia('(min-width: 861px)').addEventListener('change', function (e) {
if (e.matches && !menu.hidden) close();
});
})();
(function () {
if (!('IntersectionObserver' in window)) return;
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
var SELECTORS = [
'.sec-head',
'.caps > .cap',
'.stack__row',
'.pipe',
'.about-strip__portrait',
'.about-strip__text',
'.xp__row',
'.clients',
'.quote',
'.prob',
'.bring',
'.value',
'.proc__step',
'.skillgroup',
'.tl__item',
'.pcard',
'.wcard',
'.door',
'.doors__head',
'.chap',
'.xcard',
'.case-facts',
'.recruit__facts',
'.spotlight__media',
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
(function () {
var el = document.getElementById('cursor');
if (!el) return;
if (!window.matchMedia('(pointer: fine)').matches) return;
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
var label = el.querySelector('.cursor__label');
var tx = -100, ty = -100, cx = -100, cy = -100;
var running = false;
document.body.classList.add('has-cursor');
document.addEventListener(
'pointermove',
function (e) {
tx = e.clientX;
ty = e.clientY;
if (!running) { running = true; requestAnimationFrame(frame); }
},
{ passive: true }
);
function frame() {
cx += (tx - cx) * 0.22;
cy += (ty - cy) * 0.22;
el.style.setProperty('--cx', cx.toFixed(2) + 'px');
el.style.setProperty('--cy', cy.toFixed(2) + 'px');
if (Math.abs(tx - cx) > 0.1 || Math.abs(ty - cy) > 0.1) requestAnimationFrame(frame);
else running = false;
}
document.addEventListener('pointerover', function (e) {
var target = e.target.closest ? e.target.closest('[data-cursor]') : null;
if (!target) return;
label.textContent = target.getAttribute('data-cursor');
el.classList.add('is-active');
});
document.addEventListener('pointerout', function (e) {
var target = e.target.closest ? e.target.closest('[data-cursor]') : null;
if (target && !target.contains(e.relatedTarget)) el.classList.remove('is-active');
});
document.addEventListener('pointerleave', function () { el.classList.remove('is-active'); });
})();
(function () {
var grid = document.querySelector('[data-project-grid]');
if (!grid) return;
var buttons = document.querySelectorAll('[data-filter]');
var cards = grid.querySelectorAll('.pcard');
var count = document.querySelector('[data-filter-count]');
var empty = document.querySelector('[data-filter-empty]');
function apply(value) {
var shown = 0;
cards.forEach(function (card) {
var cats = (card.getAttribute('data-categories') || '').split('|');
var match = value === '*' || cats.indexOf(value) > -1;
card.hidden = !match;
if (match) shown++;
});
if (count) count.textContent = shown + (shown === 1 ? ' projeto' : ' projetos');
if (empty) empty.hidden = shown > 0;
}
buttons.forEach(function (btn) {
btn.addEventListener('click', function () {
buttons.forEach(function (b) {
var active = b === btn;
b.classList.toggle('is-active', active);
b.setAttribute('aria-pressed', String(active));
});
apply(btn.getAttribute('data-filter'));
});
});
})();
(function () {
var stepper = document.querySelector('[data-stepper]');
if (!stepper) return;
var tabs = Array.prototype.slice.call(stepper.querySelectorAll('[role="tab"]'));
var panels = Array.prototype.slice.call(stepper.querySelectorAll('[role="tabpanel"]'));
if (!tabs.length) return;
function select(i, focus) {
tabs.forEach(function (tab, n) {
var active = n === i;
tab.classList.toggle('is-active', active);
tab.setAttribute('aria-selected', String(active));
tab.tabIndex = active ? 0 : -1;
});
panels.forEach(function (panel, n) {
panel.classList.toggle('is-active', n === i);
});
if (focus) tabs[i].focus();
}
tabs.forEach(function (tab, i) {
tab.addEventListener('click', function () { select(i); });
tab.addEventListener('keydown', function (e) {
var next = null;
if (e.key === 'ArrowDown' || e.key === 'ArrowRight') next = (i + 1) % tabs.length;
else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') next = (i - 1 + tabs.length) % tabs.length;
else if (e.key === 'Home') next = 0;
else if (e.key === 'End') next = tabs.length - 1;
if (next === null) return;
e.preventDefault();
select(next, true);
});
});
select(0);
})();
(function () {
var form = document.getElementById('contactForm');
if (!form) return;
var wa = form.getAttribute('data-wa');
var mail = form.getAttribute('data-email');
var status = form.querySelector('[data-form-status]');
var rows = form.querySelectorAll('[data-when]');
function mode() {
var checked = form.querySelector('input[name="mode"]:checked');
return checked ? checked.value : 'client';
}
function syncRows() {
var current = mode();
rows.forEach(function (row) {
var show = row.getAttribute('data-when') === current;
row.hidden = !show;
row.querySelectorAll('input, select, textarea').forEach(function (field) {
field.disabled = !show;
});
});
}
form.querySelectorAll('input[name="mode"]').forEach(function (radio) {
radio.addEventListener('change', syncRows);
});
syncRows();
function validate() {
var ok = true;
form.querySelectorAll('[required]').forEach(function (field) {
var wrap = field.closest('.field');
var error = wrap ? wrap.querySelector('[data-error]') : null;
var empty = !field.value.trim();
if (wrap) wrap.classList.toggle('is-invalid', empty);
if (error) error.textContent = empty ? 'Preencha este campo' : '';
field.setAttribute('aria-invalid', String(empty));
if (empty && ok) { field.focus(); ok = false; }
});
return ok;
}
form.querySelectorAll('[required]').forEach(function (field) {
field.addEventListener('input', function () {
if (!field.value.trim()) return;
var wrap = field.closest('.field');
if (wrap) wrap.classList.remove('is-invalid');
var error = wrap ? wrap.querySelector('[data-error]') : null;
if (error) error.textContent = '';
field.setAttribute('aria-invalid', 'false');
});
});
function value(name) {
var field = form.elements[name];
return field && !field.disabled ? String(field.value).trim() : '';
}
function compose() {
var isClient = mode() === 'client';
var lines = [];
lines.push(isClient ? 'Olá, Igor! Tenho um projeto.' : 'Olá, Igor! Tenho uma oportunidade.');
lines.push('');
lines.push('Nome: ' + value('name'));
if (value('company')) lines.push('Empresa: ' + value('company'));
if (isClient) {
if (value('scope')) lines.push('Projeto: ' + value('scope'));
if (value('deadline')) lines.push('Prazo: ' + value('deadline'));
} else {
if (value('position')) lines.push('Vaga: ' + value('position'));
if (value('model')) lines.push('Modelo: ' + value('model'));
}
lines.push('');
lines.push(value('message'));
return {
subject: isClient ? 'Projeto — ' + value('name') : 'Oportunidade — ' + value('name'),
body: lines.join('\n'),
};
}
function send(channel) {
if (!validate()) {
if (status) status.textContent = 'Faltou preencher os campos obrigatórios.';
return;
}
var msg = compose();
var url =
channel === 'email'
? 'mailto:' + mail + '?subject=' + encodeURIComponent(msg.subject) + '&body=' + encodeURIComponent(msg.body)
: 'https://wa.me/' + wa + '?text=' + encodeURIComponent(msg.body);
if (status) status.textContent = channel === 'email' ? 'Abrindo seu cliente de e-mail…' : 'Abrindo o WhatsApp…';
if (channel === 'email') window.location.href = url;
else window.open(url, '_blank', 'noopener');
}
form.addEventListener('submit', function (e) {
e.preventDefault();
send('whatsapp');
});
var emailBtn = form.querySelector('[data-send="email"]');
if (emailBtn) emailBtn.addEventListener('click', function () { send('email'); });
})();
(function () {
var links = document.querySelectorAll('[data-cv]');
if (!links.length || !window.fetch) return;
var pdf = links[0].getAttribute('data-cv');
if (!pdf) return;
fetch(pdf, { method: 'HEAD' })
.then(function (res) {
if (!res.ok) return;
links.forEach(function (link) {
link.href = link.getAttribute('data-cv');
link.setAttribute('download', '');
});
})
.catch(function () {
});
})();
(function () {
var nodes = document.querySelectorAll('[data-clock]');
if (!nodes.length) return;
var fmt;
try {
fmt = new Intl.DateTimeFormat('pt-BR', {
timeZone: 'America/Sao_Paulo',
hour: '2-digit',
minute: '2-digit',
});
} catch (e) {
return;
}
function tick() {
var time = fmt.format(new Date());
nodes.forEach(function (node) {
node.textContent = node.getAttribute('data-clock') === 'time' ? 'Hora local · ' + time : 'Vitória, ES · ' + time;
});
}
tick();
setInterval(tick, 30000);
})();
(function () {
var wa = document.querySelector('.wa');
if (!wa) return;
var lastY = window.pageYOffset || 0;
var hidden = false;
var atEnd = false;
var ticking = false;
var THRESHOLD = 6;
function setHidden(next) {
if (next === hidden) return;
hidden = next;
wa.classList.toggle('is-away', hidden);
if (hidden) wa.setAttribute('tabindex', '-1');
else wa.removeAttribute('tabindex');
}
var COVER_LIMIT = 0.3;
function coveringSomething() {
if (!document.elementsFromPoint) return false;
var r = wa.getBoundingClientRect();
var stack = document.elementsFromPoint(r.left + r.width / 2, r.top + r.height / 2);
for (var i = 0; i < stack.length; i++) {
var el = stack[i];
if (el === wa || wa.contains(el)) continue;
var hit = el.closest && el.closest('a, button, input, select, textarea, summary, [role="tab"]');
if (!hit) break;
var t = hit.getBoundingClientRect();
var area = t.width * t.height;
if (!area) break;
var ox = Math.max(0, Math.min(r.right, t.right) - Math.max(r.left, t.left));
var oy = Math.max(0, Math.min(r.bottom, t.bottom) - Math.max(r.top, t.top));
return (ox * oy) / area > COVER_LIMIT;
}
return false;
}
function onScroll() {
if (ticking) return;
ticking = true;
requestAnimationFrame(function () {
ticking = false;
var y = window.pageYOffset || 0;
var delta = y - lastY;
var moved = Math.abs(delta) >= THRESHOLD;
if (moved) lastY = y;
if (atEnd) return;
if (moved && y > 240 && delta > 0) { setHidden(true); return; }
setHidden(coveringSomething());
});
}
window.addEventListener('scroll', onScroll, { passive: true });
var end = document.querySelector('.doors') || document.querySelector('.footer');
if (end && 'IntersectionObserver' in window) {
new IntersectionObserver(
function (entries) {
atEnd = entries[0].isIntersecting;
setHidden(atEnd || coveringSomething());
},
{ rootMargin: '0px 0px -25% 0px' }
).observe(end);
}
function settle() { setHidden(atEnd || coveringSomething()); }
if (document.readyState === 'complete') settle();
else window.addEventListener('load', settle);
window.addEventListener('resize', settle, { passive: true });
})();
(function () {
var carousels = document.querySelectorAll('[data-carousel]');
if (!carousels.length) return;
var reduce = false;
try {
reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
} catch (e) {}
function setup(root) {
var view = root.querySelector('.carousel__viewport');
var track = root.querySelector('.carousel__track');
var ctrl = root.querySelector('.carousel__ctrl');
var bar = root.querySelector('.carousel__bar i');
var prev = root.querySelector('[data-carousel-prev]');
var next = root.querySelector('[data-carousel-next]');
if (!view || !track || !ctrl) return;
function step() {
var slides = track.children;
if (slides.length < 2) return view.clientWidth;
return slides[1].getBoundingClientRect().left - slides[0].getBoundingClientRect().left;
}
function go(dir) {
view.scrollBy({ left: step() * dir, behavior: reduce ? 'auto' : 'smooth' });
}
var ticking = false;
function sync() {
if (ticking) return;
ticking = true;
requestAnimationFrame(function () {
ticking = false;
var max = view.scrollWidth - view.clientWidth;
if (max <= 1) {
ctrl.hidden = true;
return;
}
ctrl.hidden = false;
var x = view.scrollLeft;
if (prev) prev.disabled = x <= 1;
if (next) next.disabled = x >= max - 1;
if (bar) {
var seen = view.clientWidth / view.scrollWidth;
bar.style.setProperty('--seen', (seen * 100).toFixed(2) + '%');
var slack = (1 - seen) * 100;
bar.style.setProperty('--at', ((x / max) * slack).toFixed(2) + '%');
}
});
}
if (prev) prev.addEventListener('click', function () { go(-1); });
if (next) next.addEventListener('click', function () { go(1); });
view.addEventListener('keydown', function (e) {
if (e.key === 'ArrowRight') { e.preventDefault(); go(1); }
else if (e.key === 'ArrowLeft') { e.preventDefault(); go(-1); }
});
view.addEventListener('scroll', sync, { passive: true });
window.addEventListener('resize', sync, { passive: true });
sync();
if (document.fonts && document.fonts.ready) document.fonts.ready.then(sync);
window.addEventListener('load', sync);
}
Array.prototype.forEach.call(carousels, setup);
})();
(function () {
var TARGETS = [
'.case-hero__media img',
'.case-gallery img',
];
var ICON = {
close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg>',
prev: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m15 6-6 6 6 6"/></svg>',
next: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m9 6 6 6-6 6"/></svg>',
expand: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 3H5.5A2.5 2.5 0 0 0 3 5.5V9m12-6h3.5A2.5 2.5 0 0 1 21 5.5V9M9 21H5.5A2.5 2.5 0 0 1 3 18.5V15m12 6h3.5a2.5 2.5 0 0 0 2.5-2.5V15"/></svg>',
};
var groups = [];
var found = document.querySelectorAll(TARGETS.join(','));
Array.prototype.forEach.call(found, function (img) {
if (img.closest('a, button')) return;
if (!img.getAttribute('alt')) return;
var root = img.closest('main') || document.body;
var set = null;
for (var i = 0; i < groups.length; i++) {
if (groups[i].root === root) set = groups[i];
}
if (!set) {
set = { root: root, items: [] };
groups.push(set);
}
set.items.push(img);
arm(img, set, set.items.length - 1);
});
if (!groups.length) return;
var reduce = false;
try {
reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
} catch (e) {}
var box = null;
var view, legend, count, nav, closeBtn;
var group = null;
var at = 0;
var lastFocus = null;
var hideTimer = null;
var warmed = {};
function arm(img, set, i) {
var btn = document.createElement('button');
btn.type = 'button';
btn.className = 'vzoom';
btn.setAttribute('data-cursor', 'Ampliar');
img.parentNode.insertBefore(btn, img);
btn.innerHTML = '<span class="sr-only">Ampliar:</span>';
btn.appendChild(img);
btn.insertAdjacentHTML(
'beforeend',
'<span class="go go--light vzoom__go" aria-hidden="true">' + ICON.expand + '</span>'
);
btn.addEventListener('click', function () { open(set, i); });
}
function build() {
if (box) return;
box = document.createElement('div');
box.className = 'viewer';
box.hidden = true;
box.innerHTML =
'<div class="viewer__dialog" role="dialog" aria-modal="true" aria-label="Visualizador de imagens">' +
'<div class="viewer__bar">' +
'<button class="cbtn viewer__close" type="button"><span class="sr-only">Fechar visualizador</span>' + ICON.close + '</button>' +
'</div>' +
'<div class="viewer__stage"><img class="viewer__img" alt=""></div>' +
'<div class="viewer__foot">' +
'<p class="viewer__cap" aria-live="polite">' +
'<span class="viewer__legend"></span>' +
'<span class="viewer__count"></span>' +
'</p>' +
'<div class="viewer__nav">' +
'<button class="cbtn viewer__prev" type="button"><span class="sr-only">Imagem anterior</span>' + ICON.prev + '</button>' +
'<button class="cbtn viewer__next" type="button"><span class="sr-only">Próxima imagem</span>' + ICON.next + '</button>' +
'</div>' +
'</div>' +
'</div>';
document.body.appendChild(box);
view = box.querySelector('.viewer__img');
legend = box.querySelector('.viewer__legend');
count = box.querySelector('.viewer__count');
nav = box.querySelector('.viewer__nav');
closeBtn = box.querySelector('.viewer__close');
closeBtn.addEventListener('click', close);
box.querySelector('.viewer__prev').addEventListener('click', function () { show(at - 1); });
box.querySelector('.viewer__next').addEventListener('click', function () { show(at + 1); });
box.addEventListener('click', function (e) {
var dragged = moved;
moved = false;
if (dragged) return;
if (e.target.closest('button, .viewer__foot') || e.target === view) return;
close();
});
view.addEventListener('dragstart', function (e) { e.preventDefault(); });
swipe(box.querySelector('.viewer__stage'));
}
function show(i) {
var items = group.items;
at = (i + items.length) % items.length;
var src = items[at];
var alt = src.getAttribute('alt') || '';
view.setAttribute('alt', alt);
size(src.naturalWidth || src.getAttribute('width'), src.naturalHeight || src.getAttribute('height'));
view.setAttribute('src', src.currentSrc || src.getAttribute('src'));
legend.textContent = alt;
count.textContent = items.length > 1 ? at + 1 + ' de ' + items.length : '';
nav.hidden = items.length < 2;
warm(at + 1);
warm(at - 1);
}
function size(w, h) {
if (w && h) {
view.setAttribute('width', w);
view.setAttribute('height', h);
} else {
view.removeAttribute('width');
view.removeAttribute('height');
}
}
function warm(i) {
var items = group.items;
var img = items[(i + items.length) % items.length];
var src = img.currentSrc || img.getAttribute('src');
if (!src || warmed[src]) return;
warmed[src] = new Image();
warmed[src].src = src;
}
function open(g, i) {
build();
group = g;
lastFocus = document.activeElement;
show(i);
clearTimeout(hideTimer);
box.hidden = false;
void box.offsetWidth;
box.classList.add('is-open');
shield(true);
document.body.classList.add('is-locked');
closeBtn.focus();
}
function close() {
if (!box || box.hidden) return;
box.classList.remove('is-open');
shield(false);
document.body.classList.remove('is-locked');
clearTimeout(hideTimer);
hideTimer = setTimeout(function () { box.hidden = true; }, reduce ? 0 : 240);
var back = group && group.items[at] ? group.items[at].closest('.vzoom') : null;
if (back) back.focus();
else if (lastFocus && lastFocus.focus) lastFocus.focus();
lastFocus = null;
}
var canInert = 'inert' in HTMLElement.prototype;
function shield(on) {
var kids = document.body.children;
for (var i = 0; i < kids.length; i++) {
var el = kids[i];
if (el === box) continue;
if (canInert) el.inert = on;
else if (on) el.setAttribute('aria-hidden', 'true');
else el.removeAttribute('aria-hidden');
}
}
document.addEventListener('keydown', function (e) {
if (!box || box.hidden) return;
if (e.key === 'Escape') { e.preventDefault(); close(); return; }
if (group.items.length > 1) {
if (e.key === 'ArrowLeft') { e.preventDefault(); show(at - 1); return; }
if (e.key === 'ArrowRight') { e.preventDefault(); show(at + 1); return; }
if (e.key === 'Home') { e.preventDefault(); show(0); return; }
if (e.key === 'End') { e.preventDefault(); show(group.items.length - 1); return; }
}
if (e.key === 'Tab') trap(e);
});
function trap(e) {
var items = [];
Array.prototype.forEach.call(box.querySelectorAll('button:not([disabled])'), function (b) {
if (b.offsetParent !== null) items.push(b);
});
if (!items.length) return;
var first = items[0];
var last = items[items.length - 1];
if (items.indexOf(document.activeElement) === -1) {
e.preventDefault();
(e.shiftKey ? last : first).focus();
} else if (e.shiftKey && document.activeElement === first) {
e.preventDefault();
last.focus();
} else if (!e.shiftKey && document.activeElement === last) {
e.preventDefault();
first.focus();
}
}
var pointer = null;
var sx = 0, sy = 0, moved = false;
function swipe(stage) {
stage.addEventListener('pointerdown', function (e) {
if (pointer !== null) { pointer = null; return; }
pointer = e.pointerId;
sx = e.clientX;
sy = e.clientY;
moved = false;
});
stage.addEventListener('pointermove', function (e) {
if (e.pointerId !== pointer) return;
if (Math.abs(e.clientX - sx) > 10 || Math.abs(e.clientY - sy) > 10) moved = true;
});
stage.addEventListener('pointerup', function (e) {
if (e.pointerId !== pointer) return;
pointer = null;
var dx = e.clientX - sx;
var dy = e.clientY - sy;
if (group.items.length > 1 && Math.abs(dx) > 56 && Math.abs(dx) > Math.abs(dy)) {
show(at + (dx < 0 ? 1 : -1));
}
});
stage.addEventListener('pointercancel', function () { pointer = null; });
}
})();
(function () {
if (!window.matchMedia || !window.requestAnimationFrame) return;
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
var root = document.documentElement;
var body = document.body;
if (!body) return;
var MAX_PAR = 9;
var MAX_MAG = 6;
var CUE_FADE = 260;
var MIN_SCROLL = 320;
var fine = window.matchMedia('(pointer: fine)');
var wide = window.matchMedia('(min-width: 861px)');
var canTranslate = !!(window.CSS && window.CSS.supports && window.CSS.supports('translate', '0 10px'));
var vh = window.innerHeight || 0;
var maxScroll = 0;
function clamp(n, min, max) {
return n < min ? min : n > max ? max : n;
}
function scrollY() {
return window.pageYOffset || root.scrollTop || 0;
}
document.addEventListener(
'transitionend',
function (e) {
var el = e.target;
if (!el || !el.classList || !el.style) return;
if (!el.classList.contains('reveal') || !el.classList.contains('is-in')) return;
if (el.style.transitionDelay) el.style.transitionDelay = '';
},
true
);
var header = document.getElementById('header');
var bar = document.createElement('div');
var fill = document.createElement('span');
var lastProgress = -1;
var lastHeaderH = -1;
bar.className = 'mo-progress';
bar.setAttribute('aria-hidden', 'true');
fill.className = 'mo-progress__fill';
bar.appendChild(fill);
body.appendChild(bar);
function measureHeader() {
if (!header) return;
var h = Math.round(header.getBoundingClientRect().height * 10) / 10;
if (h === lastHeaderH) return;
lastHeaderH = h;
root.style.setProperty('--mo-header-h', h + 'px');
}
function renderProgress(y) {
var p = maxScroll > 0 ? clamp(y / maxScroll, 0, 1) : 0;
p = Math.round(p * 1000) / 1000;
if (p === lastProgress) return;
lastProgress = p;
fill.style.transform = 'scaleX(' + p + ')';
}
var items = [];
var parallaxOn = false;
(function collect() {
var nodes = document.querySelectorAll('.pcard__media img, .spotlight__media img, .case-hero__media img');
var i;
for (i = 0; i < nodes.length; i++) {
if (!nodes[i].parentElement) continue;
items.push({
img: nodes[i],
frame: nodes[i].parentElement,
top: 0,
h: 0,
inview: false,
applied: false,
last: null
});
}
})();
function applyItem(item) {
var want = parallaxOn && item.inview;
if (want === item.applied) return;
item.applied = want;
if (want) {
item.img.classList.add('is-par');
} else {
item.img.classList.remove('is-par');
item.img.style.removeProperty('--mo-par');
item.last = null;
}
}
if (items.length && 'IntersectionObserver' in window) {
var io = new IntersectionObserver(
function (entries) {
var i, item;
for (i = 0; i < entries.length; i++) {
item = entries[i].target._moItem;
if (!item) continue;
item.inview = entries[i].isIntersecting;
applyItem(item);
}
onScroll();
},
{ rootMargin: '25% 0px 25% 0px' }
);
for (var n = 0; n < items.length; n++) {
items[n].frame._moItem = items[n];
io.observe(items[n].frame);
}
} else {
for (var m = 0; m < items.length; m++) items[m].inview = true;
}
function measureItems() {
var y = scrollY();
var i, r;
for (i = 0; i < items.length; i++) {
r = items[i].frame.getBoundingClientRect();
items[i].top = r.top + y;
items[i].h = r.height;
}
}
function syncParallax() {
var on = canTranslate && fine.matches && wide.matches && items.length > 0;
if (on === parallaxOn) return;
parallaxOn = on;
root.classList.toggle('has-parallax', on);
for (var i = 0; i < items.length; i++) applyItem(items[i]);
}
function renderParallax(y) {
if (!parallaxOn || !vh) return;
var mid = y + vh / 2;
var i, item, rel, par;
for (i = 0; i < items.length; i++) {
item = items[i];
if (!item.applied) continue;
rel = clamp((item.top + item.h / 2 - mid) / vh, -1, 1);
par = Math.round(-rel * MAX_PAR * 10) / 10;
if (par === item.last) continue;
item.last = par;
item.img.style.setProperty('--mo-par', par + 'px');
}
}
var cue = document.querySelector('.hero__cue');
var lastCue = -1;
function renderCue(y) {
if (!cue) return;
var o = Math.round(clamp(1 - y / CUE_FADE, 0, 1) * 100) / 100;
if (o === lastCue) return;
lastCue = o;
cue.style.opacity = o;
}
function bindMagnet(el) {
var rect = null;
var px = 0;
var py = 0;
var queued = false;
function apply() {
queued = false;
if (!rect || !rect.width || !rect.height) return;
var dx = clamp((px - (rect.left + rect.width / 2)) / (rect.width / 2), -1, 1);
var dy = clamp((py - (rect.top + rect.height / 2)) / (rect.height / 2), -1, 1);
el.style.setProperty('--mo-mx', (dx * MAX_MAG).toFixed(1) + 'px');
el.style.setProperty('--mo-my', (dy * MAX_MAG * 0.5).toFixed(1) + 'px');
}
function release() {
rect = null;
el.style.removeProperty('--mo-mx');
el.style.removeProperty('--mo-my');
}
el.addEventListener(
'pointerenter',
function (e) {
if (e.pointerType && e.pointerType !== 'mouse') return;
if (!fine.matches || !wide.matches) return;
rect = el.getBoundingClientRect();
el.classList.add('mo-magnet');
},
{ passive: true }
);
el.addEventListener(
'pointermove',
function (e) {
if (!rect) return;
px = e.clientX;
py = e.clientY;
if (queued) return;
queued = true;
requestAnimationFrame(apply);
},
{ passive: true }
);
el.addEventListener('pointerleave', release, { passive: true });
el.addEventListener('click', release, { passive: true });
}
(function magnets() {
if (!('PointerEvent' in window)) return;
var nodes = document.querySelectorAll('.btn--primary, .btn--ghost');
for (var i = 0; i < nodes.length; i++) bindMagnet(nodes[i]);
})();
(function counters() {
if (!('IntersectionObserver' in window)) return;
var nodes = document.querySelectorAll('.num__v');
var list = [];
var i, raw, match, item;
for (i = 0; i < nodes.length; i++) {
raw = (nodes[i].textContent || '').trim();
match = /^([0-9]{1,4})([^0-9]{0,3})$/.exec(raw);
if (!match) continue;
if (parseInt(match[1], 10) < 2) continue;
list.push({ el: nodes[i], raw: raw, target: parseInt(match[1], 10), suffix: match[2] });
}
if (!list.length) return;
function run(it) {
var start = 0;
var dur = 900;
function step(now) {
if (!start) start = now;
var t = clamp((now - start) / dur, 0, 1);
var eased = 1 - Math.pow(1 - t, 3);
if (t < 1) {
it.el.textContent = Math.round(eased * it.target) + it.suffix;
requestAnimationFrame(step);
} else {
it.el.textContent = it.raw;
}
}
requestAnimationFrame(step);
}
function onScreen(entry) {
var r = entry.boundingClientRect;
return r.bottom > 0 && r.top < (window.innerHeight || 0);
}
var ioRun = new IntersectionObserver(
function (entries) {
var k;
for (k = 0; k < entries.length; k++) {
if (!entries[k].isIntersecting) continue;
ioRun.unobserve(entries[k].target);
run(entries[k].target._moNum);
}
},
{ threshold: 0.45 }
);
var ioPrime = new IntersectionObserver(
function (entries) {
var k, entry, target;
for (k = 0; k < entries.length; k++) {
entry = entries[k];
target = entry.target._moNum;
if (!target || !entry.isIntersecting) continue;
ioPrime.unobserve(entry.target);
if (onScreen(entry)) continue;
entry.target.textContent = '0' + target.suffix;
ioRun.observe(entry.target);
}
},
{ rootMargin: '0px 0px 45% 0px' }
);
for (i = 0; i < list.length; i++) {
item = list[i];
item.el._moNum = item;
ioPrime.observe(item.el);
}
})();
var ticking = false;
function render() {
var y = scrollY();
renderProgress(y);
renderParallax(y);
renderCue(y);
}
function onScroll() {
if (ticking) return;
ticking = true;
requestAnimationFrame(function () {
ticking = false;
render();
});
}
function measure() {
vh = window.innerHeight || 0;
maxScroll = Math.max(0, (root.scrollHeight || 0) - vh);
bar.style.display = maxScroll > MIN_SCROLL ? '' : 'none';
measureHeader();
syncParallax();
if (parallaxOn) measureItems();
lastProgress = -1;
}
var remeasuring = false;
function remeasure() {
if (remeasuring) return;
remeasuring = true;
requestAnimationFrame(function () {
remeasuring = false;
measure();
render();
});
}
window.addEventListener('scroll', onScroll, { passive: true });
window.addEventListener('resize', remeasure, { passive: true });
window.addEventListener('orientationchange', remeasure, { passive: true });
window.addEventListener('load', remeasure);
if (header) {
if ('ResizeObserver' in window) {
new ResizeObserver(measureHeader).observe(header);
} else {
header.addEventListener('transitionend', measureHeader);
}
}
if ('ResizeObserver' in window) {
new ResizeObserver(remeasure).observe(body);
}
if (fine.addEventListener) {
fine.addEventListener('change', remeasure);
wide.addEventListener('change', remeasure);
}
measure();
render();
})();