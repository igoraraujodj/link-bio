'use strict';

/* =====================================================================
   AI LAB
   ---------------------------------------------------------------------
   O recorte é deliberado: não é "olha o que a IA fez", é "olha o que um
   designer faz usando IA como ferramenta". Por isso o pipeline vem
   antes da galeria. O método é o conteúdo.
   ===================================================================== */

const intro =
  'Um espaço de experimentação visual, direção de arte e exploração de possibilidades criativas com inteligência artificial. O modelo gera. A direção decide o que presta.';

/* --------------------------------------------------------------------
   PIPELINE: as seis etapas entre uma ideia e uma imagem aprovada.
   Conteúdo de método, escrito e verificável. Cada etapa tem uma
   amostra (`sample`) que é exibida no painel interativo.
   -------------------------------------------------------------------- */
const pipeline = [
  {
    n: '01',
    label: 'Conceito',
    title: 'A ideia existe antes do prompt',
    text: 'Antes de abrir qualquer ferramenta: o que essa imagem precisa comunicar, para quem, e em que ponto da campanha ela entra. Sem isso, o resultado é decoração.',
    sample: { kind: 'note', label: 'Briefing', value: 'Território visual, público, canal, formato e o que a imagem precisa provar.' },
  },
  {
    n: '02',
    label: 'Prompt',
    title: 'O prompt é briefing, não mágica',
    text: 'Descrevo o que descreveria a um fotógrafo: assunto, enquadramento, lente, luz, paleta, textura e referência de época. Quanto mais específico o briefing, menos rodadas até algo utilizável.',
    sample: {
      kind: 'prompt',
      label: 'Estrutura',
      value: '[assunto] · [ação] · [enquadramento e lente] · [qualidade de luz] · [paleta] · [textura e material] · [referência de direção] · [proporção]',
    },
  },
  {
    n: '03',
    label: 'Geração',
    title: 'Volume é matéria-prima, não resultado',
    text: 'Várias rodadas, variações controladas de um parâmetro por vez. O objetivo não é acertar de primeira, é mapear o território até entender onde está a imagem certa.',
    sample: { kind: 'note', label: 'Método', value: 'Uma variável por rodada: luz, depois enquadramento, depois paleta.' },
  },
  {
    n: '04',
    label: 'Curadoria',
    title: 'A parte que a ferramenta não faz',
    text: 'De dezenas de saídas, poucas sobrevivem. O critério é o mesmo de uma seleção de fotografia: leitura, hierarquia, coerência com a marca e se aguenta ser aplicada em peça real.',
    sample: { kind: 'note', label: 'Critério', value: 'Lê em 1 segundo? Sustenta a marca? Aguenta crop, texto e aplicação?' },
  },
  {
    n: '05',
    label: 'Direção de arte',
    title: 'Onde vira trabalho de designer',
    text: 'Tratamento, correção de cor, composição, tipografia, retoque de mãos e detalhes, ajuste de proporção para o formato final. É aqui que a imagem deixa de parecer gerada.',
    sample: { kind: 'note', label: 'Ferramentas', value: 'Photoshop, Illustrator, After Effects, upscaling e retoque manual.' },
  },
  {
    n: '06',
    label: 'Resultado',
    title: 'Uma peça, não um experimento',
    text: 'O entregável final é a peça aplicada: post, campanha, banner, frame de vídeo. Se a origem da imagem for a coisa mais interessante nela, o trabalho não terminou.',
    sample: { kind: 'note', label: 'Entrega', value: 'Peça aplicada no canal, dentro do sistema visual da marca.' },
  },
];

/* --------------------------------------------------------------------
   EXPERIMENTOS: estrutura pronta, imagens a subir.
   `cover: null` renderiza um slot marcado em vez de imagem quebrada.
   -------------------------------------------------------------------- */
const experiments = [
  { slug: 'personagens', title: 'Personagens', kind: 'Character design', text: 'Construção de personagem consistente entre poses, ângulos e cenas.', cover: null },
  { slug: 'campanhas', title: 'Campanhas', kind: 'Campaign', text: 'Peças de campanha geradas e dirigidas dentro de um sistema visual fechado.', cover: null },
  { slug: 'fotografia', title: 'Fotografia', kind: 'Photography', text: 'Direção fotográfica sintética: luz, lente e enquadramento definidos no briefing.', cover: null },
  { slug: 'concept-art', title: 'Concept art', kind: 'Concept', text: 'Exploração de território visual antes de decidir uma direção de campanha.', cover: null },
  { slug: 'cenarios', title: 'Cenários', kind: 'Environment', text: 'Ambientes e espaços como fundo de produto e de comunicação.', cover: null },
  { slug: 'produtos', title: 'Produtos', kind: 'Product', text: 'Produto em contexto, sem depender de estúdio nem de banco de imagem.', cover: null },
  { slug: 'video', title: 'Vídeo', kind: 'Motion', text: 'Movimento a partir de imagem estática para teaser e conteúdo curto.', cover: null },
  { slug: 'exploracoes', title: 'Explorações', kind: 'Studies', text: 'Estudos livres: textura, material, tipografia e forma sem destino comercial.', cover: null },
];

module.exports = { intro: intro, pipeline: pipeline, experiments: experiments };
