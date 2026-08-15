'use strict';

/* =====================================================================
   PERFIL: manifesto, especialidades, processo, ferramentas,
   experiência, públicos, depoimentos e FAQ.

   Mesma regra dos projetos: o que é verificável está escrito; o que
   depende de informação que só o Igor tem vem como `null` e a página
   mostra um bloco "A PREENCHER". Nada é inventado.
   ===================================================================== */

/* --------------------------------------------------------------------
   MANIFESTO: a voz do site. Direto, sem clichê de portfólio.
   -------------------------------------------------------------------- */
const manifesto = [
  'Design não é a última etapa de um projeto. É a forma como uma decisão de negócio fica visível.',
  'Trabalho no ponto em que marca, comunicação e tecnologia se encontram, porque é ali que as escolhas aparecem para quem está do outro lado da tela.',
  'Não separo estratégia de execução. Uma ideia que não sobrevive ao arquivo final não era uma boa ideia.',
  'Uso IA como uso qualquer outra ferramenta: para chegar mais rápido às perguntas certas, não para pular o pensamento.',
];

const bio =
  'Sou designer multidisciplinar com mais de 11 anos de trabalho em branding, identidade visual, direção de arte, marketing e produtos digitais. Atuo do conceito à execução: construo a marca, desenho o sistema que a sustenta e acompanho até a peça publicada. Nos últimos anos incorporei IA generativa ao processo (em direção de imagem, exploração de concept e produção), mantendo o critério de direção de arte no centro.';

/* --------------------------------------------------------------------
   ESPECIALIDADES. O diferencial central: cinco frentes, um jeito de
   trabalhar. Cada uma explica o que sai na prática.
   -------------------------------------------------------------------- */
const capabilities = [
  {
    id: 'design',
    label: 'Design',
    line: 'A marca e o sistema que a sustenta.',
    items: ['Branding', 'Identidade visual', 'Direção de arte', 'Design gráfico', 'Editorial', 'Sistemas visuais'],
  },
  {
    id: 'strategy',
    label: 'Strategy',
    line: 'A decisão que vem antes do desenho.',
    items: ['Brand strategy', 'Creative strategy', 'Posicionamento', 'Arquitetura de mensagem', 'Comunicação'],
  },
  {
    id: 'marketing',
    label: 'Marketing',
    line: 'A marca colocada em circulação.',
    items: ['Campanhas', 'Social', 'Conteúdo', 'Landing pages', 'E-commerce', 'Growth design'],
  },
  {
    id: 'technology',
    label: 'Technology',
    line: 'Do arquivo de design à página no ar.',
    items: ['Figma', 'Framer', 'HTML', 'CSS', 'JavaScript', 'No-code', 'Automação'],
  },
  {
    id: 'ai',
    label: 'AI',
    line: 'Ferramenta nova, critério de direção antigo.',
    items: ['IA generativa', 'Prompt engineering', 'Direção de imagem', 'Curadoria', 'Workflows assistidos'],
  },
];

/* --------------------------------------------------------------------
   PROCESSO: sete etapas, uma linha cada. Sem fluxograma corporativo.
   -------------------------------------------------------------------- */
const process = [
  { n: '01', label: 'Discover', text: 'Entender o negócio, o público e o que já existe. Perguntar antes de propor.' },
  { n: '02', label: 'Define', text: 'Transformar o briefing em um problema de design com escopo e critério de sucesso.' },
  { n: '03', label: 'Concept', text: 'Encontrar a ideia que sustenta tudo o que vem depois. Referência, território, conceito.' },
  { n: '04', label: 'Design', text: 'Construir o sistema: tipografia, cor, grid, imagem, comportamento.' },
  { n: '05', label: 'Prototype', text: 'Tirar do estático. Testar em tela, em peça, em contexto real de uso.' },
  { n: '06', label: 'Execute', text: 'Levar até o fim: arquivos, aplicações, publicação, handoff.' },
  { n: '07', label: 'Optimize', text: 'Medir, ajustar e documentar o que funcionou para a próxima rodada.' },
];

/* --------------------------------------------------------------------
   VALORES
   -------------------------------------------------------------------- */
const values = [
  { title: 'Contexto antes de estética', text: 'Nenhuma decisão visual se defende sozinha. Ela responde a um problema ou não deveria existir.' },
  { title: 'Sistema antes de peça', text: 'Uma peça bonita resolve um dia. Um sistema resolve o ano inteiro.' },
  { title: 'Decisão documentada', text: 'Quem recebe o projeto precisa entender por que ele é assim, não só como usá-lo.' },
  { title: 'Execução até o fim', text: 'Direção de arte que não chega ao arquivo final é opinião, não trabalho.' },
  { title: 'Ferramenta nova, critério antigo', text: 'IA acelera a exploração. Não substitui o julgamento sobre o que presta.' },
];

/* --------------------------------------------------------------------
   DESIGN × TECHNOLOGY: o que ele constrói com cada ferramenta.
   Não é vitrine de logo.
   -------------------------------------------------------------------- */
const stack = [
  { name: 'Figma', kind: 'Design', text: 'Sistemas de design, bibliotecas de componentes, protótipos navegáveis e handoff para dev.' },
  { name: 'Framer', kind: 'Web', text: 'Sites e landing pages publicáveis sem depender de uma fila de desenvolvimento.' },
  { name: 'HTML & CSS', kind: 'Código', text: 'Layout, tipografia e responsividade controlados no detalhe. Este site é escrito à mão.' },
  { name: 'JavaScript', kind: 'Código', text: 'Comportamento de interface: estados, interações, componentes e integrações simples.' },
  { name: 'No-code', kind: 'Produto', text: 'Montagem rápida de fluxos, formulários e páginas para validar antes de investir em build.' },
  { name: 'Automação', kind: 'Processo', text: 'Tirar trabalho repetitivo do caminho: geração de peças, versionamento, entrega.' },
  { name: 'Midjourney', kind: 'AI', text: 'Direção de imagem, concept art e exploração visual em escala, com controle de estilo.' },
  { name: 'ChatGPT & Claude', kind: 'AI', text: 'Estruturação de conteúdo, copy, pesquisa e prototipagem de código no fluxo de trabalho.' },
  { name: 'Runway', kind: 'AI', text: 'Movimento a partir de imagem estática: teasers, transições e estudos de vídeo.' },
  { name: 'DALL·E', kind: 'AI', text: 'Geração pontual e variação de elementos gráficos dentro de uma direção já definida.' },
  { name: 'Adobe CC', kind: 'Design', text: 'Illustrator, Photoshop e After Effects para marca, tratamento de imagem e motion.' },
  { name: 'Analytics', kind: 'Dados', text: 'GA4 e Clarity para ler comportamento real e sustentar decisão de design com evidência.' },
];

/* --------------------------------------------------------------------
   EXPERIÊNCIA: timeline.
   `period` e `titleRole` ficam null quando não confirmados: a página
   mostra o campo marcado como a preencher em vez de chutar data.
   -------------------------------------------------------------------- */
const experience = [
  {
    company: 'CPAPS',
    role: 'Designer · Marketing',
    period: null,
    current: true,
    summary:
      'Atuação em design e marketing no mercado de terapia do sono, cobrindo marca, campanhas e canais digitais.',
    responsibilities: [
      'Branding e sistema visual',
      'Campanhas e conteúdo',
      'Digital e e-commerce',
      'Landing pages',
      'IA aplicada à produção criativa',
    ],
    projects: ['cpaps-mes-do-sono', 'cpaps-ecommerce'],
    results: null,
  },
  {
    company: 'Projetos para clientes',
    role: 'Designer · Direção de arte',
    period: null,
    current: false,
    summary:
      'Marca, identidade visual e direção de arte para negócios de telecom, alimentação e serviços.',
    responsibilities: [
      'Branding e rebranding',
      'Identidade visual e aplicações',
      'Direção de arte para social',
      'Material de comunicação',
    ],
    projects: ['avante-telecom', 'dom-campanholi', 'rn-telecom', 'top-burger'],
    results: null,
  },
];

/* Slot explícito para o histórico anterior, em vez de deixar buraco na timeline. */
const experienceNote =
  'Histórico anterior a preencher: empresas, cargos e períodos dos primeiros anos de atuação.';

/* --------------------------------------------------------------------
   NÚMEROS. Só entra aqui o que é verificável. Nada de métrica de vaidade
   inventada: se um número não pode ser sustentado, ele não aparece.
   Para acrescentar (projetos entregues, marcas atendidas, prêmios),
   basta somar um objeto nesta lista.
   -------------------------------------------------------------------- */
const numbers = [
  { value: '11+', label: 'Anos de atuação' },
  { value: '5', label: 'Frentes, um processo' },
  { value: '7', label: 'Cases documentados' },
  { value: '2', label: 'Portas: cliente e recrutador' },
];

/* --------------------------------------------------------------------
   PÚBLICOS: as duas portas do site.
   -------------------------------------------------------------------- */
const audiences = {
  recruiter: {
    id: 'recruiter',
    kicker: 'For recruiters',
    title: 'Tenho uma oportunidade',
    line: 'Perfil, experiência e ferramentas em menos de um minuto.',
    cta: "Let's talk",
    message: 'Olá, Igor! Tenho uma oportunidade e gostaria de conversar com você.',
    facts: [
      { label: 'Cargo', value: 'Designer multidisciplinar · Direção de arte' },
      { label: 'Experiência', value: '11+ anos' },
      { label: 'Localização', value: 'Vitória, ES, Brasil' },
      { label: 'Modelo', value: 'Remoto · Híbrido' },
      { label: 'Idiomas', value: 'Português' },
    ],
    brings: [
      { title: 'Pensamento estratégico', text: 'Entro no problema de negócio antes de abrir o arquivo.' },
      { title: 'Direção visual', text: 'Defino e sustento um padrão visual ao longo de um projeto inteiro.' },
      { title: 'Autonomia', text: 'Tiro um projeto do briefing à entrega sem precisar ser conduzido.' },
      { title: 'Colaboração', text: 'Trabalho com marketing, produto e dev falando a língua de cada um.' },
      { title: 'Velocidade de execução', text: 'Ciclos curtos entre ideia, peça e publicação.' },
      { title: 'Domínio tecnológico', text: 'Do Figma ao HTML publicado, sem depender de tradução.' },
      { title: 'IA aplicada', text: 'Uso IA no processo criativo com critério de direção, não como atalho.' },
    ],
  },
  client: {
    id: 'client',
    kicker: 'For clients',
    title: 'Tenho um projeto',
    line: 'Do posicionamento da marca à página no ar.',
    cta: 'Start a project',
    message: 'Olá, Igor! Tenho um projeto e gostaria de conversar.',
    problems: [
      { q: 'Precisa criar ou reposicionar uma marca?', a: 'Branding, identidade visual e o sistema que mantém tudo consistente depois da entrega.' },
      { q: 'Precisa estruturar uma campanha?', a: 'Conceito, direção de arte e desdobramento em todas as peças e canais.' },
      { q: 'Precisa melhorar sua comunicação?', a: 'Padrão visual, hierarquia de mensagem e material que fala a mesma língua em todo lugar.' },
      { q: 'Precisa de uma experiência digital?', a: 'Landing pages, e-commerce e interfaces desenhadas para converter, não só para agradar.' },
      { q: 'Precisa acelerar o processo criativo com IA?', a: 'Workflows de geração e curadoria de imagem que encurtam produção sem perder direção.' },
    ],
  },
};

/* --------------------------------------------------------------------
   DEPOIMENTOS: conteúdo real já validado pelo Igor.
   -------------------------------------------------------------------- */
const testimonials = [
  {
    quote: 'Igor renovou toda a identidade visual da Avante Telecom. Ficou muito mais moderna e profissional, os clientes notaram na hora.',
    author: 'Hudson',
    company: 'Avante Telecom',
    initials: 'H',
  },
  {
    quote: 'O trabalho de branding que o Igor fez pra Dom Campanholi deu outra cara pro negócio. Recebemos vários elogios depois da mudança.',
    author: 'Domingos',
    company: 'Dom Campanholi',
    initials: 'D',
  },
  {
    quote: 'A nova identidade visual trouxe muito mais reconhecimento pra Top Burger. As redes sociais também ficaram muito mais atrativas.',
    author: 'Top Burger',
    company: 'Hamburgueria',
    initials: 'TB',
  },
  {
    quote: 'Contratamos o Igor pra repaginar a marca da RN Telecom e o resultado superou as expectativas. Ficou muito mais sólida e confiável.',
    author: 'RN Telecom',
    company: 'Telecomunicações',
    initials: 'RN',
  },
];

/* Marcas atendidas: nomes reais, extraídos dos depoimentos e do histórico. */
const clients = ['CPAPS', 'Avante Telecom', 'Dom Campanholi', 'RN Telecom', 'Top Burger'];

/* --------------------------------------------------------------------
   FAQ
   -------------------------------------------------------------------- */
const faq = [
  {
    q: 'Quais serviços você oferece?',
    a: 'Branding, identidade visual, direção de arte, campanhas, UI/UX e growth design, com IA generativa aplicada ao processo criativo quando faz sentido para o projeto.',
  },
  {
    q: 'Como funciona o processo de trabalho?',
    a: 'Começa com um briefing para entender o negócio e o objetivo, passa por pesquisa e conceito, depois refinamento com base no seu retorno, até a entrega final dos arquivos e o acompanhamento da aplicação.',
  },
  {
    q: 'Qual o prazo médio de um projeto?',
    a: 'Depende do escopo. Depois do briefing eu passo um prazo específico, mas a média fica entre duas e seis semanas conforme a complexidade.',
  },
  {
    q: 'Você atende fora da sua região?',
    a: 'Atendo remoto, em qualquer lugar do Brasil. A comunicação acontece por WhatsApp e videochamada.',
  },
  {
    q: 'Quantas rodadas de revisão estão incluídas?',
    a: 'Cada etapa passa por rodadas de ajuste com base no seu retorno, para garantir que o resultado final reflita o que você precisa.',
  },
  {
    q: 'Como funciona o orçamento?',
    a: 'Cada projeto tem um escopo diferente, então o valor é definido depois de entender a necessidade. Me manda uma mensagem contando o que você precisa que eu retorno com uma proposta.',
  },
  {
    q: 'Como a IA entra nos projetos?',
    a: 'Como ferramenta de exploração e produção: geração de referência, concept e imagem, sempre com curadoria e direção de arte por cima. O critério do que vai para o cliente continua sendo humano.',
  },
];

module.exports = {
  manifesto: manifesto,
  numbers: numbers,
  bio: bio,
  capabilities: capabilities,
  process: process,
  values: values,
  stack: stack,
  experience: experience,
  experienceNote: experienceNote,
  audiences: audiences,
  testimonials: testimonials,
  clients: clients,
  faq: faq,
};
