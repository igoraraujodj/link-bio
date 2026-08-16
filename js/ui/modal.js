// Um motor de formulário para todas as telas.
//
// Cada view descreve os campos e recebe os valores de volta. Isso evita
// sete formulários quase iguais e mantém validação, foco e teclado num
// lugar só.

import { el, clear, $ } from './dom.js';
import { parseMoney, formatMoney } from '../utils/money.js';

let openSheet = null;

export function openForm({
  title,
  subtitle = null,
  fields,
  values = {},
  submitLabel = 'Salvar',
  onSubmit,
  onDelete = null,
}) {
  closeForm();

  const inputs = new Map();
  const errorNodes = new Map();

  const form = el('form', {
    class: 'sheet__form',
    novalidate: true,
    onSubmit: async (event) => {
      event.preventDefault();
      const collected = {};
      let firstInvalid = null;

      for (const field of fields) {
        const value = readField(field, inputs.get(field.name));
        const error = validate(field, value);
        errorNodes.get(field.name).textContent = error || '';
        inputs.get(field.name)?.classList?.toggle('is-invalid', Boolean(error));
        if (error && !firstInvalid) firstInvalid = inputs.get(field.name);
        collected[field.name] = value;
      }

      if (firstInvalid) {
        firstInvalid.focus?.();
        return;
      }

      try {
        await onSubmit(collected);
        closeForm();
      } catch (err) {
        console.error(err);
        const box = $('.sheet__error', form);
        if (box) box.textContent = err.message || 'Algo deu errado.';
      }
    },
  });

  for (const field of fields) {
    const id = `f-${field.name}`;
    const control = buildControl(field, id, values[field.name]);
    inputs.set(field.name, control);

    const error = el('p', { class: 'field__error', id: `${id}-error` });
    errorNodes.set(field.name, error);

    form.append(
      el('div', { class: `field field--${field.type || 'text'}${field.span === 'half' ? ' field--half' : ''}` },
        field.type !== 'check' && el('label', { class: 'field__label', for: id },
          field.label,
          field.required && el('span', { class: 'field__req', 'aria-hidden': 'true' }, '*'),
        ),
        control,
        field.hint && el('p', { class: 'field__hint' }, field.hint),
        error,
      )
    );
  }

  form.append(
    el('p', { class: 'sheet__error', role: 'alert' }),
    el('div', { class: 'sheet__actions' },
      onDelete && el('button', {
        type: 'button',
        class: 'btn btn--danger-ghost',
        onClick: async () => { await onDelete(); closeForm(); },
      }, 'Excluir'),
      el('span', { class: 'sheet__spacer' }),
      el('button', { type: 'button', class: 'btn btn--ghost', onClick: closeForm }, 'Cancelar'),
      el('button', { type: 'submit', class: 'btn btn--primary' }, submitLabel),
    ),
  );

  const panel = el('div', {
    class: 'sheet__panel',
    role: 'dialog',
    'aria-modal': 'true',
    'aria-label': title,
  },
    el('header', { class: 'sheet__head' },
      el('div', {},
        el('h2', { class: 'sheet__title' }, title),
        subtitle && el('p', { class: 'sheet__sub' }, subtitle),
      ),
      el('button', {
        type: 'button', class: 'sheet__close', 'aria-label': 'Fechar', onClick: closeForm,
      }, '✕'),
    ),
    form,
  );

  const backdrop = el('div', {
    class: 'sheet',
    onClick: (event) => { if (event.target === backdrop) closeForm(); },
  }, panel);

  document.body.append(backdrop);
  document.body.classList.add('is-locked');
  requestAnimationFrame(() => backdrop.classList.add('is-open'));

  const previousFocus = document.activeElement;
  const onKey = (event) => {
    if (event.key === 'Escape') { event.preventDefault(); closeForm(); }
    if (event.key === 'Tab') trapFocus(event, panel);
  };
  document.addEventListener('keydown', onKey);

  openSheet = { backdrop, onKey, previousFocus };

  // Foca o primeiro campo, mas não no mobile: o teclado subindo junto com a
  // folha deixa a animação tremida e esconde metade do formulário.
  if (window.matchMedia('(min-width: 768px)').matches) {
    setTimeout(() => inputs.get(fields[0]?.name)?.focus?.(), 60);
  }
}

export function closeForm() {
  if (!openSheet) return;
  const { backdrop, onKey, previousFocus } = openSheet;
  openSheet = null;
  document.removeEventListener('keydown', onKey);
  document.body.classList.remove('is-locked');
  backdrop.classList.remove('is-open');
  setTimeout(() => backdrop.remove(), 180);
  previousFocus?.focus?.();
}

function trapFocus(event, panel) {
  const focusables = panel.querySelectorAll(
    'button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  if (!focusables.length) return;
  const first = focusables[0];
  const last = focusables[focusables.length - 1];
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault(); last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault(); first.focus();
  }
}

// ── Controles ────────────────────────────────────────────────────────────

function buildControl(field, id, value) {
  const type = field.type || 'text';

  if (type === 'textarea') {
    return el('textarea', {
      id, class: 'input input--area', rows: field.rows || 3,
      placeholder: field.placeholder || '', value: value ?? '',
    });
  }

  if (type === 'select') {
    return el('select', { id, class: 'input' },
      field.placeholder && el('option', { value: '' }, field.placeholder),
      field.options.map((opt) => {
        const option = normalizeOption(opt);
        return el('option', {
          value: option.id,
          selected: String(value ?? '') === String(option.id),
        }, option.label);
      }),
    );
  }

  if (type === 'segmented') {
    const group = el('div', { id, class: 'segmented', role: 'radiogroup' });
    let current = value ?? normalizeOption(field.options[0]).id;
    group.dataset.value = current;

    field.options.forEach((opt) => {
      const option = normalizeOption(opt);
      const btn = el('button', {
        type: 'button',
        class: `segmented__item${option.id === current ? ' is-active' : ''}`,
        role: 'radio',
        'aria-checked': String(option.id === current),
        onClick: () => {
          current = option.id;
          group.dataset.value = current;
          [...group.children].forEach((child) => {
            const active = child.dataset.id === current;
            child.classList.toggle('is-active', active);
            child.setAttribute('aria-checked', String(active));
          });
          field.onChange?.(current);
        },
      }, option.label);
      btn.dataset.id = option.id;
      group.append(btn);
    });
    return group;
  }

  if (type === 'check') {
    const wrap = el('label', { class: 'check' },
      el('input', { id, type: 'checkbox', checked: Boolean(value) }),
      el('span', {}, field.label),
    );
    return wrap;
  }

  if (type === 'money') {
    const input = el('input', {
      id, class: 'input input--money', type: 'text', inputmode: 'decimal',
      placeholder: field.placeholder || 'R$ 0,00',
      value: value ? formatMoney(value) : '',
    });
    // Reformata ao sair do campo: quem digita "89,9" vê "R$ 89,90".
    input.addEventListener('blur', () => {
      if (input.value.trim()) input.value = formatMoney(parseMoney(input.value));
    });
    return input;
  }

  return el('input', {
    id,
    class: 'input',
    type: type === 'number' ? 'number' : type,   // date, time, number, text
    placeholder: field.placeholder || '',
    value: value ?? '',
    step: field.step,
    min: field.min,
    max: field.max,
  });
}

function normalizeOption(opt) {
  return typeof opt === 'string' ? { id: opt, label: opt } : opt;
}

function readField(field, node) {
  const type = field.type || 'text';
  if (type === 'segmented') return node.dataset.value;
  if (type === 'check') return node.querySelector('input').checked;
  if (type === 'money') return parseMoney(node.value);
  if (type === 'number') return node.value === '' ? null : Number(node.value);
  const value = node.value?.trim?.() ?? node.value;
  return value === '' ? null : value;
}

function validate(field, value) {
  if (field.required) {
    const isEmpty = value === null || value === undefined || value === ''
      || (field.type === 'money' && value === 0);
    if (isEmpty) return field.type === 'money' ? 'Informe um valor.' : 'Campo obrigatório.';
  }
  if (field.validate) return field.validate(value) || '';
  return '';
}
