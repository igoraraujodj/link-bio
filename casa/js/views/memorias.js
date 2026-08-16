// Linha do tempo do casal.
//
// A foto é redimensionada e vira base64 antes de entrar no store: sem
// servidor de arquivo, uma foto de 4 MB do celular estouraria a cota do
// localStorage no segundo upload.

import { el, frag, section, button, empty, toast } from '../ui/dom.js';
import { openForm, closeForm } from '../ui/modal.js';
import { today, formatDateFull, daysBetween } from '../utils/date.js';

const MAX_EDGE = 1000;   // px no maior lado
const QUALITY = 0.72;    // JPEG

export function render(ctx) {
  const memories = [...ctx.state.memories]
    .sort((a, b) => (b.date || '').localeCompare(a.date || ''));

  return frag(
    section('Memórias', {
      sub: 'As datas que valem a pena não esquecer.',
      action: button('Nova memória', { variant: 'primary', onClick: () => openMemoryForm(ctx) }),
    }),

    memories.length === 0
      ? empty(
          'Nada guardado ainda. A primeira pode ser o dia em que vocês começaram.',
          button('Guardar a primeira', { variant: 'primary', onClick: () => openMemoryForm(ctx) }),
        )
      : el('ol', { class: 'timeline' }, memories.map((memory) => card(ctx, memory))),
  );
}

function card(ctx, memory) {
  const days = memory.date ? Math.abs(daysBetween(memory.date, today())) : null;

  return el('li', { class: 'memory' },
    memory.photo
      ? el('img', {
          class: 'memory__photo', src: memory.photo, alt: memory.title, loading: 'lazy',
        })
      : null,
    el('div', { class: 'memory__body' },
      el('p', { class: 'memory__date' },
        formatDateFull(memory.date),
        days !== null && days > 0 ? el('span', { class: 'memory__ago' }, `há ${days} dias`) : null,
      ),
      el('h3', { class: 'memory__title' }, memory.title),
      memory.note && el('p', { class: 'memory__note' }, memory.note),
      el('button', {
        type: 'button', class: 'link-btn',
        onClick: () => openMemoryForm(ctx, memory),
      }, 'Editar'),
    ),
  );
}

export function openMemoryForm(ctx, memory = {}) {
  const isEdit = Boolean(memory.id);
  let photo = memory.photo || null;

  openForm({
    title: isEdit ? 'Editar memória' : 'Nova memória',
    submitLabel: isEdit ? 'Salvar' : 'Guardar',
    values: {
      title: memory.title || '',
      date: memory.date || today(),
      note: memory.note || '',
    },
    fields: [
      { name: 'title', label: 'O que foi', required: true,
        placeholder: 'Ex.: primeiro apartamento, viagem pra praia' },
      { name: 'date', label: 'Quando', type: 'date', required: true },
      { name: 'note', label: 'Como foi', type: 'textarea', rows: 4 },
    ],
    onSubmit: async (values) => {
      const record = { ...values, photo };
      if (isEdit) await ctx.store.update('memories', memory.id, record);
      else await ctx.store.insert('memories', record);
    },
    onDelete: isEdit ? async () => { await ctx.store.remove('memories', memory.id); } : null,
  });

  // O seletor de foto entra depois que a folha existe: é o único campo que
  // não é um input comum, então não passa pelo motor de formulário.
  const form = document.querySelector('.sheet__form');
  if (!form) return;

  const preview = el('img', {
    class: `photo-picker__preview${photo ? '' : ' is-empty'}`,
    src: photo || '',
    alt: '',
  });

  const input = el('input', {
    type: 'file', accept: 'image/*', class: 'photo-picker__input', id: 'f-photo',
    onChange: async (event) => {
      const file = event.target.files?.[0];
      if (!file) return;
      try {
        photo = await downscale(file);
        preview.src = photo;
        preview.classList.remove('is-empty');
      } catch (err) {
        console.error(err);
        toast('Não consegui ler essa imagem.', 'error');
      }
    },
  });

  form.insertBefore(
    el('div', { class: 'field field--photo' },
      el('label', { class: 'field__label', for: 'f-photo' }, 'Foto'),
      el('div', { class: 'photo-picker' },
        preview,
        el('div', { class: 'photo-picker__actions' },
          input,
          photo && el('button', {
            type: 'button', class: 'link-btn',
            onClick: () => {
              photo = null;
              preview.src = '';
              preview.classList.add('is-empty');
            },
          }, 'Remover foto'),
        ),
      ),
      el('p', { class: 'field__hint' },
        'A imagem é reduzida antes de salvar. Sem servidor, tudo fica no navegador.'),
    ),
    form.querySelector('.sheet__error'),
  );
}

function downscale(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Falha ao ler o arquivo.'));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error('Arquivo não é uma imagem válida.'));
      img.onload = () => {
        const scale = Math.min(1, MAX_EDGE / Math.max(img.width, img.height));
        const canvas = el('canvas', {
          width: Math.round(img.width * scale),
          height: Math.round(img.height * scale),
        });
        canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', QUALITY));
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}

export const quickAdd = (ctx) => openMemoryForm(ctx);
