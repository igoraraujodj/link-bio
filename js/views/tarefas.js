// Kanban. Quatro colunas: Backlog → Próxima → Em andamento → Concluída.
//
// No desktop se arrasta o card. No mobile, arrastar entre colunas que
// rolam na horizontal é frustrante — lá o card tem as setas ‹ › que movem
// de coluna. As duas formas fazem a mesma coisa.

import { el, frag, section, button, avatar, tag, empty } from '../ui/dom.js';
import { openForm } from '../ui/modal.js';
import { tasksByStatus } from '../domain/queries.js';
import { TASK_STATUS, PRIORITIES } from '../store/schema.js';
import { today, relativeLabel, formatDate } from '../utils/date.js';

let dragging = null;

export function render(ctx) {
  const { state, scope } = ctx;

  const board = el('div', { class: 'board' },
    TASK_STATUS.map((status) => {
      const tasks = tasksByStatus(state, status.id, scope);

      const column = el('section', {
        class: 'column',
        dataset: { status: status.id },
        onDragover: (event) => {
          if (!dragging) return;
          event.preventDefault();
          column.classList.add('is-target');
        },
        onDragleave: () => column.classList.remove('is-target'),
        onDrop: async (event) => {
          event.preventDefault();
          column.classList.remove('is-target');
          if (!dragging || dragging.status === status.id) return;
          await moveTask(ctx, dragging, status.id);
        },
      },
        el('header', { class: 'column__head' },
          el('div', {},
            el('h3', { class: 'column__title' }, status.label),
            el('p', { class: 'column__hint' }, status.hint),
          ),
          el('span', { class: 'column__count' }, tasks.length),
        ),
        el('div', { class: 'column__body' },
          tasks.length
            ? tasks.map((task) => card(ctx, task, status))
            : el('p', { class: 'column__empty' }, 'Vazia'),
        ),
        el('button', {
          type: 'button', class: 'column__add',
          onClick: () => openTaskForm(ctx, { status: status.id }),
        }, '+ Adicionar'),
      );

      return column;
    }),
  );

  const done = state.tasks.filter((t) => t.status === 'concluida').length;

  return frag(
    section('Tarefas', {
      sub: scope === 'nos'
        ? 'Tudo que os dois têm pra fazer. Filtre por pessoa no topo.'
        : `Campo ${scope === 'igor' ? 'Igor' : 'Karen'} — tarefas dessa pessoa e as compartilhadas.`,
      action: frag(
        done > 0 && button(`Limpar concluídas (${done})`, {
          onClick: async () => {
            const olds = state.tasks.filter((t) => t.status === 'concluida');
            for (const task of olds) await ctx.store.remove('tasks', task.id);
          },
        }),
        button('Nova tarefa', { variant: 'primary', onClick: () => openTaskForm(ctx) }),
      ),
    }),
    board,
  );
}

function card(ctx, task, status) {
  const index = TASK_STATUS.findIndex((s) => s.id === status.id);
  const late = task.dueDate && task.dueDate < today() && task.status !== 'concluida';

  const node = el('article', {
    class: `card card--${task.priority || 'media'}${late ? ' is-late' : ''}`,
    draggable: 'true',
    tabindex: '0',
    onDragstart: (event) => {
      dragging = task;
      node.classList.add('is-dragging');
      event.dataTransfer.effectAllowed = 'move';
      event.dataTransfer.setData('text/plain', task.id);
    },
    onDragend: () => { dragging = null; node.classList.remove('is-dragging'); },
    onClick: (event) => {
      if (event.target.closest('.card__move')) return;
      openTaskForm(ctx, task);
    },
    onKeydown: (event) => {
      if (event.key === 'Enter') openTaskForm(ctx, task);
      // Teclado move de coluna sem mouse nenhum.
      if (event.key === 'ArrowRight' && index < TASK_STATUS.length - 1) {
        event.preventDefault(); moveTask(ctx, task, TASK_STATUS[index + 1].id);
      }
      if (event.key === 'ArrowLeft' && index > 0) {
        event.preventDefault(); moveTask(ctx, task, TASK_STATUS[index - 1].id);
      }
    },
  },
    el('header', { class: 'card__head' },
      el('h4', { class: 'card__title' }, task.title),
      avatar(task.scope),
    ),
    task.description && el('p', { class: 'card__desc' }, task.description),
    el('div', { class: 'card__meta' },
      task.priority === 'alta' && tag('Alta', 'alta'),
      task.startDate && tag(`Início ${formatDate(task.startDate)}`),
      task.dueDate && tag(
        task.status === 'concluida' ? `Prazo ${formatDate(task.dueDate)}` : relativeLabel(task.dueDate),
        late ? 'late' : null,
      ),
    ),
    el('div', { class: 'card__move' },
      el('button', {
        type: 'button', class: 'icon-btn icon-btn--sm',
        'aria-label': 'Mover para a coluna anterior', disabled: index === 0,
        onClick: () => moveTask(ctx, task, TASK_STATUS[index - 1].id),
      }, '‹'),
      el('button', {
        type: 'button', class: 'icon-btn icon-btn--sm',
        'aria-label': 'Mover para a próxima coluna',
        disabled: index === TASK_STATUS.length - 1,
        onClick: () => moveTask(ctx, task, TASK_STATUS[index + 1].id),
      }, '›'),
    ),
  );

  return node;
}

async function moveTask(ctx, task, statusId) {
  const patch = { status: statusId };
  // Entrar em "andamento" sem data de início marcada preenche sozinho:
  // ninguém volta no formulário só pra isso.
  if (statusId === 'andamento' && !task.startDate) patch.startDate = today();
  if (statusId === 'concluida') patch.completedAt = today();
  await ctx.store.update('tasks', task.id, patch);
}

export function openTaskForm(ctx, task = {}) {
  const isEdit = Boolean(task.id);

  openForm({
    title: isEdit ? 'Editar tarefa' : 'Nova tarefa',
    submitLabel: isEdit ? 'Salvar' : 'Criar',
    values: {
      scope: task.scope || (ctx.scope === 'nos' ? 'nos' : ctx.scope),
      title: task.title || '',
      description: task.description || '',
      status: task.status || 'backlog',
      priority: task.priority || 'media',
      startDate: task.startDate || '',
      dueDate: task.dueDate || '',
    },
    fields: [
      { name: 'scope', label: 'De quem é', type: 'segmented',
        options: [
          { id: 'igor', label: 'Igor' },
          { id: 'karen', label: 'Karen' },
          { id: 'nos', label: 'Os dois' },
        ] },
      { name: 'title', label: 'O que precisa ser feito', required: true,
        placeholder: 'Ex.: renovar o seguro do carro' },
      { name: 'description', label: 'Descrição', type: 'textarea',
        placeholder: 'Detalhes, links, o que precisa antes…' },
      { name: 'status', label: 'Coluna', type: 'select', options: TASK_STATUS, span: 'half' },
      { name: 'priority', label: 'Prioridade', type: 'select', options: PRIORITIES, span: 'half' },
      { name: 'startDate', label: 'Data de início', type: 'date', span: 'half' },
      { name: 'dueDate', label: 'Data de término', type: 'date', span: 'half',
        validate: (value) => {
          const start = document.querySelector('#f-startDate')?.value;
          if (value && start && value < start) return 'O término não pode ser antes do início.';
          return '';
        } },
    ],
    onSubmit: async (values) => {
      if (isEdit) await ctx.store.update('tasks', task.id, values);
      else await ctx.store.insert('tasks', values);
    },
    onDelete: isEdit ? async () => { await ctx.store.remove('tasks', task.id); } : null,
  });
}

export const quickAdd = (ctx) => openTaskForm(ctx);
