// Helpers de DOM. Nada de innerHTML com dado do usuário — tudo vira
// textContent, então nome de tarefa com "<" não quebra nem injeta nada.

export function el(tag, props = {}, ...children) {
  const node = document.createElement(tag);

  for (const [key, value] of Object.entries(props || {})) {
    if (value === null || value === undefined || value === false) continue;

    if (key === 'class') node.className = value;
    else if (key === 'dataset') Object.assign(node.dataset, value);
    else if (key === 'style') Object.assign(node.style, value);
    else if (key === 'html') node.innerHTML = value;          // só conteúdo nosso
    else if (key.startsWith('on') && typeof value === 'function') {
      node.addEventListener(key.slice(2).toLowerCase(), value);
    } else if (key in node && key !== 'list') {
      node[key] = value;
    } else {
      node.setAttribute(key, value === true ? '' : value);
    }
  }

  append(node, children);
  return node;
}

function append(parent, children) {
  for (const child of children.flat(Infinity)) {
    if (child === null || child === undefined || child === false) continue;
    parent.append(child instanceof Node ? child : document.createTextNode(String(child)));
  }
}

export function frag(...children) {
  const f = document.createDocumentFragment();
  append(f, children);
  return f;
}

export function clear(node) {
  while (node.firstChild) node.removeChild(node.firstChild);
  return node;
}

export const $ = (sel, root = document) => root.querySelector(sel);
export const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

// ── Blocos recorrentes ───────────────────────────────────────────────────

export function section(title, { action = null, sub = null } = {}) {
  return el('header', { class: 'section-head' },
    el('div', {},
      el('h2', { class: 'section-title' }, title),
      sub && el('p', { class: 'section-sub' }, sub),
    ),
    action,
  );
}

export function button(label, { variant = 'ghost', onClick, icon, ...rest } = {}) {
  return el('button', {
    class: `btn btn--${variant}`,
    type: 'button',
    onClick,
    ...rest,
  }, icon && el('span', { class: 'btn__icon', html: icon }), el('span', {}, label));
}

export function chip(label, { active = false, onClick, tone = null } = {}) {
  return el('button', {
    class: `chip${active ? ' is-active' : ''}${tone ? ` chip--${tone}` : ''}`,
    type: 'button',
    'aria-pressed': String(active),
    onClick,
  }, label);
}

export function tag(label, tone = null) {
  return el('span', { class: `tag${tone ? ` tag--${tone}` : ''}` }, label);
}

export function empty(message, action = null) {
  return el('div', { class: 'empty' },
    el('p', { class: 'empty__text' }, message),
    action,
  );
}

export function avatar(scope, { size = 'sm' } = {}) {
  const map = { igor: 'I', karen: 'K', nos: 'IK' };
  return el('span', {
    class: `avatar avatar--${size} avatar--${scope}`,
    title: scope === 'nos' ? 'Os dois' : scope,
  }, map[scope] || '?');
}

// ── Avisos ───────────────────────────────────────────────────────────────

let toastTimer = null;

export function toast(message, tone = 'default') {
  let node = $('#toast');
  if (!node) {
    node = el('div', { id: 'toast', class: 'toast', role: 'status', 'aria-live': 'polite' });
    document.body.append(node);
  }
  node.textContent = message;
  node.className = `toast toast--${tone} is-visible`;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => node.classList.remove('is-visible'), 3200);
}

export function confirmDialog(message) {
  // Nativo de propósito: é bloqueante, e apagar dado do casal deve ser.
  return window.confirm(message);
}
