'use strict';

/* =====================================================================
   IDIOMA

   O site é escrito em português e traduzido para inglês. A chave da
   tradução é a própria frase em português, e não um identificador
   inventado como `nav.work`.

   O motivo é prático: o template continua legível. Quem lê
   `T('Ver case')` entende o que sai na tela; quem lê `T('case.cta')`
   precisa abrir outro arquivo. E o custo dessa escolha, que é quebrar
   quando alguém edita a frase em português sem atualizar a tradução, é
   exatamente o comportamento que se quer: a build para e diz qual frase
   ficou órfã, em vez de publicar uma página meio traduzida.

   Frases com parte variável usam {0}, {1}: `T('Capa do case {0}', titulo)`.
   ===================================================================== */

const PAGINAS = require('./i18n-paginas');

/* --------------------------------------------------------------------
   Cabeçalho, rodapé, menu e componentes compartilhados.
   -------------------------------------------------------------------- */
const COMUNS = {
  /* navegação e estrutura */
  'Pular para o conteúdo': 'Skip to content',
  'Navegação principal': 'Main navigation',
  'Navegação': 'Navigation',
  'Abrir menu': 'Open menu',
  'Alternar tema claro e escuro': 'Toggle light and dark theme',
  '{0}, início': '{0}, home',
  'Home': 'Home',
  'Site': 'Site',
  'Contato': 'Contact',
  'Colofão': 'Colophon',
  'Páginas': 'Pages',
  'Redes e contato': 'Social and contact',
  'Voltar ao topo': 'Back to top',
  'Ver em inglês': 'View in English',
  'Ver em português': 'Ver em português',

  /* disponibilidade */
  'Disponível': 'Available',
  'Agenda fechada': 'Books closed',

  /* ações recorrentes */
  'Start a project': 'Start a project',
  'Download CV': 'Download CV',
  'Ver projetos': 'See work',
  'Sobre mim': 'About me',
  'Ver case': 'See case study',
  'Ver todos os projetos': 'See all projects',
  'Ler o manifesto completo': 'Read the full manifesto',
  'Ver experiência': 'See experience',
  'Entrar no AI Lab': 'Enter the AI Lab',
  'Conversar': 'Talk',
  'Chamar': 'Call',
  'Próximo': 'Next',
  'Anterior': 'Previous',
  'Vamos conversar': "Let's talk",

  /* rodapé */
  'HTML, CSS e JavaScript escritos à mão': 'HTML, CSS and JavaScript written by hand',
  'Sem framework, sem dependência': 'No framework, no dependencies',
  'Hora local': 'Local time',
  'E-mail': 'Email',

  /* bloco de conteúdo pendente */
  'A preencher': 'To be filled in',
  'a preencher': 'to be filled in',

  /* campo de briefing */
  'O que você quer construir?': 'What do you want to build?',
  'Conte em uma linha o que você quer construir': 'Tell me in one line what you want to build',
  'Conte em uma linha o que você precisa': 'Tell me in one line what you need',
  'Abre o WhatsApp com a sua mensagem já escrita.': 'Opens WhatsApp with your message already written.',
  'Abrir conversa no WhatsApp': 'Open a WhatsApp conversation',

  /* carrossel e visualizador */
  'Depoimentos de clientes': 'Client testimonials',

  /* cards e imagens */
  'Capa do case {0}, para {1}': 'Cover of the {0} case study, for {1}',
  'Ferramentas usadas': 'Tools used',
  'Áreas de atuação': 'Areas of work',

  /* CTA final */
  "Let's build something": "Let's build something",
  'Duas portas.<br>Escolha a <em>sua</em>.': 'Two doors.<br>Pick <em>yours</em>.',
  'Prefere e-mail?': 'Prefer email?',
  'Ver todas as formas de contato': 'See every way to reach me',

  /* mensagens de WhatsApp pré-preenchidas */
  'Olá, Igor! Vim pelo seu portfólio.': 'Hi Igor! I came from your portfolio.',
  'Olá, Igor! Vim pelo seu portfólio e queria conversar.': 'Hi Igor! I came from your portfolio and would like to talk.',
  'Olá, Igor! Vi o case {0}: {1} no seu site e queria saber mais.': 'Hi Igor! I saw the {0}: {1} case study on your site and would like to know more.',
};

const EN = Object.assign({}, COMUNS, PAGINAS);

function aplicar(texto, args) {
  if (!args.length) return texto;
  return texto.replace(/\{(\d+)\}/g, function (marca, i) {
    const v = args[Number(i)];
    return v === undefined ? marca : String(v);
  });
}

/* Devolve a função de tradução do idioma pedido.

   Em português ela é identidade: o texto do template JÁ é o conteúdo
   final, então não há dicionário a consultar nem como ficar defasado.

   Em inglês, frase sem tradução derruba a build. É deliberado: uma
   página meio traduzida no ar é pior do que uma build vermelha aqui. */
function translator(locale) {
  if (locale === 'pt') {
    return function (texto) {
      return aplicar(texto, Array.prototype.slice.call(arguments, 1));
    };
  }

  return function (texto) {
    if (!Object.prototype.hasOwnProperty.call(EN, texto)) {
      throw new Error(
        'Falta tradução em inglês para:\n  ' + JSON.stringify(texto) +
        '\nAcrescente em src/i18n.js (compartilhada) ou src/i18n-paginas.js (de uma página só).'
      );
    }
    return aplicar(EN[texto], Array.prototype.slice.call(arguments, 1));
  };
}

/* Quantas frases o dicionário cobre. Serve de sinal na saída da build. */
const total = Object.keys(EN).length;

module.exports = { translator: translator, total: total, EN: EN };
