'use strict';

/* =====================================================================
   PROJETOS / CASE STUDIES
   ---------------------------------------------------------------------
   Fonte única de verdade. Adicionar um case = adicionar um objeto aqui
   e rodar `node build.js`. Nada é escrito direto no HTML.

   REGRA DE HONESTIDADE
   Campos com conteúdo real vêm preenchidos. Campos que dependem de
   informação que só o Igor tem (métricas, prazos, escopo contratado,
   detalhes de processo) vêm como `null` e a página renderiza um bloco
   "A PREENCHER" visível, explicando o que entra ali. Nada é inventado.

   ESTRUTURA
   slug        identificador na URL: work/<slug>.html
   title       nome do projeto
   client      cliente / marca
   year        ano (null enquanto não confirmado)
   category    categoria principal (usada no filtro)
   categories  todas as categorias às quais o projeto pertence
   summary     uma linha, aparece no card e na meta description
   role        o que o Igor fez (obrigatório: o recrutador precisa saber)
   tools       ferramentas usadas
   tags        palavras-chave do case
   cover       imagem de capa
   featured    aparece no "Selected Work" da home
   spotlight   vira o "case destaque" full-bleed da home (só um)
   study       narrativa do case (ver abaixo)
   gallery     imagens do case, em ordem
   ===================================================================== */

/* Texto reutilizado no bloco "a preencher", por tipo de seção. */
const HINT = {
  context: 'Cenário do cliente quando o projeto começou: mercado, momento da marca, o que já existia.',
  challenge: 'O problema concreto que o projeto precisava resolver.',
  objective: 'O que precisava ser alcançado, em termos de negócio e de comunicação.',
  strategy: 'Como o problema foi abordado: o raciocínio antes do desenho.',
  concept: 'A ideia central que sustenta toda a execução.',
  execution: 'Onde a solução foi aplicada: peças, canais, pontos de contato.',
  results: 'Resultado obtido. Se não houver número, descreva o resultado qualitativo.',
};

const projects = [
  {
    slug: 'cpaps-mes-do-sono',
    title: 'Mês do Sono',
    client: 'CPAPS',
    year: null,
    category: 'Campanha',
    categories: ['Campanha', 'Branding', 'Digital', 'Marketing'],
    summary:
      'Campanha sazonal de conscientização sobre sono, do conceito à veiculação em canais digitais.',
    role: ['Direção de arte', 'Conceito de campanha', 'Design', 'Digital', 'Produção'],
    tools: ['Figma', 'Photoshop', 'Illustrator', 'After Effects', 'IA generativa'],
    tags: ['Campanha sazonal', 'Saúde', 'Conteúdo', 'Performance'],
    cover: 'assets/images/work/cpaps-mes-do-sono.svg',
    featured: true,
    spotlight: true,
    study: {
      context: null,
      challenge: null,
      objective: null,
      strategy: null,
      concept: null,
      execution: null,
      results: null,
    },
    gallery: [],
  },

  {
    slug: 'avante-telecom',
    title: 'Rebranding Avante Telecom',
    client: 'Avante Telecom',
    year: null,
    category: 'Branding',
    categories: ['Branding', 'Identidade visual', 'Direção de arte'],
    summary:
      'Reconstrução da identidade visual de uma operadora regional, de marca a aplicação.',
    role: ['Branding', 'Identidade visual', 'Direção de arte', 'Aplicações'],
    tools: ['Illustrator', 'Figma', 'Photoshop'],
    tags: ['Rebrand', 'Telecom', 'Sistema visual', 'Aplicação'],
    cover: 'assets/images/work/avante-telecom.svg',
    featured: true,
    study: {
      context: null,
      challenge: null,
      objective: null,
      strategy: null,
      concept: null,
      execution: null,
      // Resultado qualitativo real, na palavra do cliente (mesmo depoimento exibido no site).
      results: {
        type: 'qualitative',
        quote:
          'Igor renovou toda a identidade visual da Avante Telecom. Ficou muito mais moderna e profissional, os clientes notaram na hora.',
        author: 'Hudson',
        company: 'Avante Telecom',
      },
    },
    gallery: [],
  },

  {
    slug: 'dom-campanholi',
    title: 'Identidade Dom Campanholi',
    client: 'Dom Campanholi',
    year: null,
    category: 'Branding',
    categories: ['Branding', 'Identidade visual', 'Direção de arte'],
    summary:
      'Construção de marca e sistema visual para reposicionar o negócio na percepção do público.',
    role: ['Branding', 'Identidade visual', 'Direção de arte'],
    tools: ['Illustrator', 'Photoshop', 'Figma'],
    tags: ['Marca', 'Sistema visual', 'Reposicionamento'],
    cover: 'assets/images/work/dom-campanholi.svg',
    featured: true,
    study: {
      context: null,
      challenge: null,
      objective: null,
      strategy: null,
      concept: null,
      execution: null,
      results: {
        type: 'qualitative',
        quote:
          'O trabalho de branding que o Igor fez pra Dom Campanholi deu outra cara pro negócio. Recebemos vários elogios depois da mudança.',
        author: 'Domingos',
        company: 'Dom Campanholi',
      },
    },
    gallery: [],
  },

  {
    slug: 'rn-telecom',
    title: 'Sistema visual RN Telecom',
    client: 'RN Telecom',
    year: null,
    category: 'Sistema visual',
    categories: ['Sistema visual', 'Branding', 'Direção de arte'],
    summary:
      'Repaginação de marca com foco em solidez e consistência entre todos os pontos de contato.',
    role: ['Branding', 'Sistema visual', 'Direção de arte'],
    tools: ['Illustrator', 'Figma'],
    tags: ['Rebrand', 'Telecom', 'Consistência', 'Guidelines'],
    cover: 'assets/images/work/rn-telecom.svg',
    featured: true,
    study: {
      context: null,
      challenge: null,
      objective: null,
      strategy: null,
      concept: null,
      execution: null,
      results: {
        type: 'qualitative',
        quote:
          'Contratamos o Igor pra repaginar a marca da RN Telecom e o resultado superou as expectativas. Ficou muito mais sólida e confiável.',
        author: 'RN Telecom',
        company: 'Telecomunicações',
      },
    },
    gallery: [],
  },

  {
    slug: 'top-burger',
    title: 'Top Burger',
    client: 'Top Burger',
    year: null,
    category: 'Direção de arte',
    categories: ['Direção de arte', 'Branding', 'Social'],
    summary:
      'Identidade e direção de arte para social, com foco em reconhecimento e apetite visual.',
    role: ['Identidade visual', 'Direção de arte', 'Social media'],
    tools: ['Illustrator', 'Photoshop', 'Figma'],
    tags: ['Food', 'Social', 'Identidade', 'Direção de arte'],
    cover: 'assets/images/work/top-burger.svg',
    featured: true,
    study: {
      context: null,
      challenge: null,
      objective: null,
      strategy: null,
      concept: null,
      execution: null,
      results: {
        type: 'qualitative',
        quote:
          'A nova identidade visual trouxe muito mais reconhecimento pra Top Burger. As redes sociais também ficaram muito mais atrativas.',
        author: 'Top Burger',
        company: 'Hamburgueria',
      },
    },
    gallery: [],
  },

  {
    slug: 'cpaps-ecommerce',
    title: 'Experiência de e-commerce',
    client: 'CPAPS',
    year: null,
    category: 'Digital',
    categories: ['Digital', 'UI/UX', 'Marketing'],
    summary:
      'Interface e jornada de compra pensadas para reduzir atrito e sustentar a marca no digital.',
    role: ['UI design', 'UX', 'Direção visual', 'Landing pages', 'CRO'],
    tools: ['Figma', 'HTML', 'CSS', 'No-code'],
    tags: ['E-commerce', 'UI', 'Jornada', 'Conversão'],
    cover: 'assets/images/work/cpaps-ecommerce.svg',
    featured: true,
    study: {
      context: null,
      challenge: null,
      objective: null,
      strategy: null,
      concept: null,
      execution: null,
      results: null,
    },
    gallery: [],
  },

  {
    slug: 'ai-direcao-de-imagem',
    title: 'Direção de imagem com IA',
    client: 'Projeto autoral',
    year: null,
    category: 'IA',
    categories: ['IA', 'Direção de arte', 'Digital'],
    summary:
      'Uso de IA generativa como etapa de direção de arte: da referência ao frame final aprovado.',
    role: ['Direção de arte', 'Prompt engineering', 'Curadoria', 'Pós-produção'],
    tools: ['Midjourney', 'Photoshop', 'Runway', 'ChatGPT'],
    tags: ['IA generativa', 'Concept', 'Direção de imagem', 'Workflow'],
    cover: 'assets/images/work/ai-direcao-de-imagem.svg',
    featured: true,
    study: {
      context:
        'IA generativa deixou de ser novidade e virou etapa de produção. O que separa um resultado usável de um banco de imagens genérico não é o modelo, é a direção.',
      challenge: null,
      objective: null,
      strategy:
        'Tratar o modelo como um fotógrafo contratado: briefing claro, referência de luz e enquadramento, várias rodadas, e curadoria dura. O prompt é o briefing, não o trabalho.',
      concept: null,
      execution: null,
      results: null,
    },
    gallery: [],
  },
];

/* --------------------------------------------------------------------
   Derivados: calculados, nunca escritos à mão.
   -------------------------------------------------------------------- */

/* Índice editorial: 01, 02, 03… na ordem em que aparecem acima. */
projects.forEach(function (project, i) {
  project.index = String(i + 1).padStart(2, '0');

  /* Um case está "completo" quando toda a narrativa foi preenchida. */
  project.pending = Object.keys(project.study).filter(function (key) {
    return project.study[key] === null;
  });
  project.complete = project.pending.length === 0;
});

/* Categorias únicas, na ordem de primeira aparição, para os filtros. */
const categories = [];
projects.forEach(function (project) {
  project.categories.forEach(function (category) {
    if (categories.indexOf(category) === -1) categories.push(category);
  });
});

module.exports = { projects: projects, categories: categories, HINT: HINT };
