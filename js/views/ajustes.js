// Ajustes, backup e o aviso honesto sobre o estágio do sistema.

import { el, frag, section, button, toast, confirmDialog } from '../ui/dom.js';
import { openForm } from '../ui/modal.js';
import { formatMoney } from '../utils/money.js';
import { sampleState } from '../seed.js';
import { parseEndpoint, clearCache } from '../domain/casa-api.js';
import { resetRemote } from './financas.js';

export function render(ctx) {
  const { state, store } = ctx;
  const counts = {
    compromissos: state.events.length,
    tarefas: state.tasks.length,
    lançamentos: state.transactions.length,
    metas: state.goals.length,
    compras: state.shopping.length,
    hábitos: state.habits.length,
    memórias: state.memories.length,
  };

  return frag(
    section('Ajustes', { sub: 'Preferências, backup e estado do sistema.' }),

    el('div', { class: 'panel panel--warn' },
      el('div', { class: 'panel__head' }, el('h3', {}, 'Este sistema ainda é um protótipo')),
      el('p', { class: 'panel__note' },
        'Os dados ficam guardados só neste navegador, neste aparelho. O que o ' +
        'Igor digitar aqui não aparece no celular da Karen, e limpar os dados ' +
        'do navegador apaga tudo. Faça o backup abaixo de vez em quando.'),
      el('p', { class: 'panel__note' },
        'Pra virar sincronização de verdade entre os dois, o próximo passo é ' +
        'ligar o Supabase — o caminho está escrito em ' +
        'js/store/adapter-supabase.example.js.'),
    ),

    el('div', { class: 'panel' },
      el('div', { class: 'panel__head' }, el('h3', {}, 'Preferências')),
      el('div', { class: 'setting' },
        el('div', {},
          el('p', { class: 'setting__title' }, 'Tema'),
          el('p', { class: 'setting__note' }, 'Claro, escuro ou seguindo o sistema.'),
        ),
        el('div', { class: 'segmented' },
          [
            { id: 'auto', label: 'Automático' },
            { id: 'light', label: 'Claro' },
            { id: 'dark', label: 'Escuro' },
          ].map((option) => el('button', {
            type: 'button',
            class: `segmented__item${state.settings.theme === option.id ? ' is-active' : ''}`,
            onClick: async () => {
              await store.setSetting('theme', option.id);
              ctx.applyTheme();
            },
          }, option.label)),
        ),
      ),
      el('div', { class: 'setting' },
        el('div', {},
          el('p', { class: 'setting__title' }, 'Meta de reserva mensal'),
          el('p', { class: 'setting__note' },
            state.settings.monthlyTarget
              ? `Hoje: ${formatMoney(state.settings.monthlyTarget)} por mês.`
              : 'Não definida. Aparece como barra de progresso em Finanças.'),
        ),
        button('Definir', {
          onClick: () => openForm({
            title: 'Meta de reserva mensal',
            values: { monthlyTarget: state.settings.monthlyTarget },
            fields: [{
              name: 'monthlyTarget', label: 'Quanto guardar por mês', type: 'money',
              hint: 'Deixe zerado para desligar.',
            }],
            onSubmit: async (values) => {
              await store.setSetting('monthlyTarget', values.monthlyTarget || null);
            },
          }),
        }),
      ),
    ),

    el('div', { class: 'panel' },
      el('div', { class: 'panel__head' }, el('h3', {}, 'Bot do Telegram (finanças)')),
      el('p', { class: 'panel__note' },
        state.settings.financeUrl
          ? 'A tela de Finanças está lendo a planilha do bot. Quem lança é o bot; ' +
            'aqui é só leitura.'
          : 'Ligue para a tela de Finanças mostrar os números que o bot já lança na ' +
            'planilha, em vez de você digitar duas vezes.'),
      el('ol', { class: 'steps' },
        el('li', {}, 'No Apps Script, cole no Código.gs o trecho de integracao/Api.gs.txt e publique uma nova versão.'),
        el('li', {}, 'No Telegram, mande /painel no grupo e copie o link que o bot responder.'),
        el('li', {}, 'Cole o link aqui embaixo. O ?json=1 eu acrescento sozinho.'),
      ),
      el('div', { class: 'panel__actions' },
        button(state.settings.financeUrl ? 'Trocar o link' : 'Colar o link', {
          variant: 'primary',
          onClick: () => openForm({
            title: 'Link do painel de finanças',
            subtitle: 'O mesmo link que o comando /painel entrega no grupo.',
            values: { financeUrl: state.settings.financeUrl || '' },
            fields: [{
              name: 'financeUrl', label: 'Link', required: true,
              placeholder: 'https://script.google.com/macros/s/.../exec?k=...',
              validate: (value) => {
                try { parseEndpoint(value); return ''; }
                catch (err) { return err.message; }
              },
            }],
            onSubmit: async (values) => {
              await store.setSetting('financeUrl', parseEndpoint(values.financeUrl));
              clearCache();
              resetRemote();
              toast('Link salvo. Abrindo finanças…');
              ctx.go('financas');
            },
          }),
        }),
        state.settings.financeUrl
          ? button('Desligar', {
              onClick: async () => {
                if (!confirmDialog('Desligar a integração e voltar ao modo local?')) return;
                await store.setSetting('financeUrl', null);
                clearCache();
                resetRemote();
                toast('Integração desligada.');
              },
            })
          : null,
      ),
    ),

    el('div', { class: 'panel' },
      el('div', { class: 'panel__head' }, el('h3', {}, 'O que tem guardado')),
      el('ul', { class: 'counts' },
        Object.entries(counts).map(([label, value]) =>
          el('li', {}, el('b', {}, value), el('span', {}, label))),
      ),
    ),

    el('div', { class: 'panel' },
      el('div', { class: 'panel__head' }, el('h3', {}, 'Backup')),
      el('p', { class: 'panel__note' },
        'Exporte um arquivo .json e guarde onde vocês dois alcancem. É também ' +
        'o jeito de passar os dados de um aparelho pro outro por enquanto.'),
      el('div', { class: 'panel__actions' },
        button('Exportar', { variant: 'primary', onClick: () => exportBackup(store) }),
        button('Importar', { onClick: () => importBackup(ctx) }),
      ),
    ),

    el('div', { class: 'panel panel--danger' },
      el('div', { class: 'panel__head' }, el('h3', {}, 'Zona de risco')),
      el('div', { class: 'panel__actions' },
        button('Carregar dados de exemplo', {
          onClick: async () => {
            if (!confirmDialog(
              'Isso substitui TUDO que está aqui por dados fictícios. Continuar?'
            )) return;
            await store.replace(sampleState());
            toast('Dados de exemplo carregados.');
          },
        }),
        button('Apagar tudo', {
          variant: 'danger',
          onClick: async () => {
            if (!confirmDialog('Apagar todos os dados deste navegador. Tem certeza?')) return;
            if (!confirmDialog('Não dá pra desfazer. Confirma mesmo?')) return;
            await store.wipe();
            toast('Tudo apagado.');
          },
        }),
      ),
    ),
  );
}

function exportBackup(store) {
  const stamp = new Date().toISOString().slice(0, 10);
  const blob = new Blob([store.exportJSON()], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = el('a', { href: url, download: `casa-de-dois-${stamp}.json` });
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
  toast('Backup baixado.');
}

function importBackup(ctx) {
  const input = el('input', {
    type: 'file', accept: 'application/json,.json',
    onChange: async (event) => {
      const file = event.target.files?.[0];
      if (!file) return;
      if (!confirmDialog('Importar substitui todos os dados atuais. Continuar?')) return;
      try {
        await ctx.store.importJSON(await file.text());
        toast('Backup restaurado.');
      } catch (err) {
        toast(err.message || 'Arquivo inválido.', 'error');
      }
    },
  });
  input.click();
}

export const quickAdd = () => {};
