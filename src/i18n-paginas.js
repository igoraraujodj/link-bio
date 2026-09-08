'use strict';

/* =====================================================================
   TRADUÇÕES DE PÁGINA

   Frases que aparecem em uma página só. As compartilhadas (cabeçalho,
   rodapé, botões, componentes) ficam em src/i18n.js.

   A chave é a frase em português exatamente como está no template,
   incluindo a marcação interna quando houver. Um título como
   `Projetos <em>selecionados</em>` entra inteiro, com o <em>, porque
   traduzir "Projetos" e "selecionados" em pedaços separados não produz
   inglês, produz duas palavras soltas.

   Frase com parte variável usa {0}, {1}.
   ===================================================================== */

module.exports = {
  /* ---- HOME ---------------------------------------------------------- */
  'Igor Araujo, designer multidisciplinar': 'Igor Araujo, multidisciplinary designer',
  'Role para explorar': 'Scroll to explore',
  '{0} anos': '{0} years',
  '{0} entregas': '{0} deliverables',

  /* fita de áreas */
  'Branding': 'Branding',
  'Identidade visual': 'Visual identity',
  'Direção de arte': 'Art direction',
  'Campanhas': 'Campaigns',
  'Marketing': 'Marketing',
  'UI/UX': 'UI/UX',
  'E-commerce': 'E-commerce',
  'IA generativa': 'Generative AI',
  'Creative technology': 'Creative technology',

  /* trabalho selecionado */
  'Selected work': 'Selected work',
  'Projetos <em>selecionados</em>': 'Selected <em>work</em>',
  'Cada projeto representa uma competência diferente: marca, campanha, sistema visual, digital e IA. Todos abrem um case com contexto, decisão e resultado.':
    'Each project stands for a different skill: brand, campaign, visual system, digital and AI. Every one opens a case study with context, decision and outcome.',

  /* especialidades */
  'Especialidades': 'What I do',
  'Cinco frentes,<br>um <em>jeito</em> de trabalhar': 'Five fronts,<br>one <em>way</em> of working',
  'Design, estratégia, marketing, tecnologia e IA não são serviços separados aqui. São etapas da mesma decisão.':
    'Design, strategy, marketing, technology and AI are not separate services here. They are steps of the same decision.',

  /* case destaque */
  'Case destaque': 'Featured case study',
  'Ver case completo': 'See the full case study',

  /* design x technology */
  'Design × Technology': 'Design × Technology',
  'Ferramenta é meio.<br>O que importa é o que <em>sai</em> dela.':
    'A tool is a means.<br>What matters is what <em>comes out</em> of it.',
  'Trabalho na interseção entre criatividade, design e tecnologia. Abaixo, o que consigo construir com cada uma. Não é uma parede de logos.':
    'I work where creativity, design and technology meet. Below, what I can build with each one. This is not a wall of logos.',

  /* AI lab, chamada da home */
  'AI Lab': 'AI Lab',
  'A IA gera.<br>A direção <em>decide</em>.': 'AI generates.<br>Direction <em>decides</em>.',

  /* faixa sobre, widgets do retrato */
  'Agora': 'Now',
  'Aceitando projetos': 'Taking on projects',

  /* experiência resumida na home */
  'Experience': 'Experience',
  'Onde isso foi <em>aplicado</em>': 'Where this was <em>applied</em>',
  'Mais de {0} anos entre marca, comunicação e produto digital.':
    'More than {0} years across brand, communication and digital product.',
  'período a preencher': 'period to be filled in',
  'Atual': 'Current',

  /* clientes e depoimentos */
  'Clients': 'Clients',
  'Marcas que <em>passaram</em> por aqui': 'Brands that <em>came</em> through here',

  /* problemas que resolvo */
  'For clients': 'For clients',
  'Problemas que eu <em>resolvo</em>': 'Problems I <em>solve</em>',
  /* ---- TODOS OS PROJETOS ---------------------------------------------- */
  'Work': 'Work',
  'Todos': 'All',
  'Projetos': 'Projects',
  'Todos os <em>projetos</em>': 'All <em>projects</em>',
  '{0} projetos entre branding, campanha, sistema visual, digital, direção de arte e IA. Cada um abre um case com contexto, decisão, execução e resultado.':
    '{0} projects across branding, campaign, visual system, digital, art direction and AI. Each one opens a case study with context, decision, execution and outcome.',
  'Filtrar projetos por categoria': 'Filter projects by category',
  '{0} projetos': '{0} projects',
  'Nenhum projeto nessa categoria ainda.': 'No projects in this category yet.',

  /* ---- 404 ------------------------------------------------------------ */
  'Erro 404': 'Error 404',
  'Essa página<br><em>não existe</em>.': 'This page<br><em>does not exist</em>.',
  'O link pode ter mudado de lugar. Abaixo, os caminhos que valem a pena.':
    'The link may have moved. Below, the paths worth taking.',
  'Voltar ao início': 'Back to home',
  'Comece <em>por aqui</em>': 'Start <em>here</em>',
  /* ---- SOBRE ---------------------------------------------------------- */
  'About': 'About',
  'Manifesto': 'Manifesto',
  'Perfil': 'Profile',
  'O <em>profissional</em>': 'The <em>professional</em>',
  'Atuação': 'Role',
  'Experiência': 'Experience',
  'Base': 'Based in',
  'Modelo': 'Setup',
  'Remoto · Híbrido': 'Remote · Hybrid',
  'Ver experiência': 'See experience',
  'O que eu <em>faço</em>': 'What I <em>do</em>',
  'Sem barra de progresso, sem porcentagem. Categorias e o que sai de cada uma.':
    'No progress bars, no percentages. Categories, and what comes out of each one.',
  'Processo criativo': 'Creative process',
  'Sete etapas,<br>do briefing à <em>otimização</em>': 'Seven steps,<br>from brief to <em>optimization</em>',
  'Ferramentas': 'Tools',
  'Com o que eu <em>construo</em>': 'What I <em>build</em> with',
  'Valores': 'Values',
  'Como eu <em>trabalho</em>': 'How I <em>work</em>',

  /* ---- TRAJETÓRIA ------------------------------------------------------ */
  'Trajetória': 'Track record',
  'Responsabilidades': 'Responsibilities',
  'Resultados': 'Results',
  'Resultados dessa passagem: entregas relevantes, ganhos de processo, números quando houver.':
    'Results from this role: relevant deliverables, process gains, numbers where there are any.',
  'For recruiters': 'For recruiters',
  'O perfil em 60 segundos': 'The profile in 60 seconds',
  'Timeline': 'Timeline',
  'Onde eu <em>estive</em>': 'Where I have <em>been</em>',
  'What I bring to a team': 'What I bring to a team',
  'O que eu trago<br>para um time': 'What I bring<br>to a team',
  'Skills': 'Skills',
  'Competências': 'Skills',
  'Organizadas por categoria. Sem porcentagem, porque nível se demonstra em case, não em barra.':
    'Organized by category. No percentages, because skill shows in a case study, not in a bar.',

  /* ---- AI LAB ---------------------------------------------------------- */
  'Imagem a subir': 'Image to upload',
  'Pipeline': 'Pipeline',
  'Do conceito ao resultado': 'From concept to result',
  'Seis etapas entre uma ideia e uma imagem que pode ir para o ar. A ferramenta cobre uma delas.':
    'Six steps between an idea and an image ready to publish. The tool covers one of them.',
  'Etapas do processo com IA': 'Steps of the AI process',
  'Experimentos': 'Experiments',
  'Explorações': 'Explorations',
  'Estrutura pronta para receber as imagens de cada frente de experimentação.':
    'Structure ready to receive the images from each line of experimentation.',
  'Case': 'Case study',
  'IA aplicada a <em>projeto real</em>': 'AI applied to a <em>real project</em>',

  /* ---- CONTATO --------------------------------------------------------- */
  'Contact': 'Contact',
  'Se você tem um projeto ou uma oportunidade, o caminho mais curto está aqui embaixo.':
    'If you have a project or an opportunity, the shortest path is right below.',
  'Resposta mais rápida': 'Fastest reply',
  'Rede profissional': 'Professional network',
  'Projetos e cases': 'Projects and case studies',
  'Processo e bastidor': 'Process and behind the scenes',
  'Formulário de contato': 'Contact form',
  'Canais diretos': 'Direct channels',
  'Contato direto': 'Direct contact',
  'Você é cliente ou recrutador?': 'Are you a client or a recruiter?',
  'Tenho um projeto': 'I have a project',
  'Sou cliente': 'I am a client',
  'Tenho uma oportunidade': 'I have an opportunity',
  'Sou recrutador': 'I am a recruiter',
  'Nome': 'Name',
  'Como devo te chamar': 'What should I call you',
  'Empresa': 'Company',
  'Opcional': 'Optional',
  'Tipo de projeto': 'Project type',
  'Branding / identidade visual': 'Branding / visual identity',
  'Campanha': 'Campaign',
  'Site / landing page': 'Website / landing page',
  'Social media / direção de arte': 'Social media / art direction',
  'IA aplicada ao processo criativo': 'AI applied to the creative process',
  'Ainda não sei, quero conversar': 'Not sure yet, I want to talk',
  'Prazo': 'Timeline',
  'Sem pressa': 'No rush',
  'Nas próximas semanas': 'In the next few weeks',
  'Urgente': 'Urgent',
  'Vaga / cargo': 'Role / position',
  'Ex.: Designer Sênior': 'e.g. Senior Designer',
  'Remoto': 'Remote',
  'Híbrido': 'Hybrid',
  'Presencial': 'On site',
  'Mensagem': 'Message',
  'Conte o contexto em duas ou três linhas.': 'Give me the context in two or three lines.',
  'O formulário monta a mensagem e abre no seu WhatsApp ou cliente de e-mail. Nenhum dado é enviado ou armazenado por este site.':
    'The form composes the message and opens it in your WhatsApp or email client. No data is sent to or stored by this site.',
  'Ver experiência e CV': 'See experience and CV',
  'FAQ': 'FAQ',
  'Perguntas <em>frequentes</em>': 'Frequently asked <em>questions</em>',
  'O que eu trago para um <em>time</em>': 'What I bring to a <em>team</em>',

  /* ---- CASE ------------------------------------------------------------ */
  'Você está em': 'You are in',
  'Categoria': 'Category',
  'Ano': 'Year',
  'Cliente': 'Client',
  'Índice': 'Index',
  'Imagem principal do case {0} para {1}': 'Main image of the {0} case study for {1}',
  '<strong>Case em preenchimento.</strong> A estrutura da narrativa está pronta; {0} seção aguarda o conteúdo real do projeto. Nada aqui foi preenchido com texto fictício.':
    '<strong>Case study in progress.</strong> The narrative structure is ready; {0} section is waiting for the real project content. Nothing here was filled in with made up text.',
  '<strong>Case em preenchimento.</strong> A estrutura da narrativa está pronta; {0} seções aguardam o conteúdo real do projeto. Nada aqui foi preenchido com texto fictício.':
    '<strong>Case study in progress.</strong> The narrative structure is ready; {0} sections are waiting for the real project content. Nothing here was filled in with made up text.',
  'Enquanto isso, os projetos publicados estão no': 'In the meantime, the published projects are on',
  'ou': 'or',
  'peça os detalhes deste projeto': 'ask for the details of this project',
  'Contexto': 'Context',
  'Desafio': 'Challenge',
  'Objetivo': 'Objective',
  'Estratégia': 'Strategy',
  'Conceito': 'Concept',
  'Ficha técnica': 'Project details',
  'Minha participação': 'My role',
  'Tags': 'Tags',
  'Processo': 'Process',
  'Como o projeto foi <em>conduzido</em>': 'How the project was <em>run</em>',
  'O método aplicado do briefing à entrega. Abaixo entram as anotações específicas deste projeto: pesquisa, referências, moodboard e testes.':
    'The method applied from brief to delivery. Below go the notes specific to this project: research, references, moodboard and tests.',
  'Pesquisa, referências, moodboard, sketches e testes deste projeto: imagens e notas do processo.':
    'Research, references, moodboard, sketches and tests for this project: process images and notes.',
  'Aplicações reais do projeto: peças, telas, mockups e fotos de uso. Suba as imagens em assets/images/work/ e liste em gallery[].':
    'Real applications of the project: pieces, screens, mockups and photos in use. Upload the images to assets/images/work/ and list them in gallery[].',
  'Execução': 'Execution',
  'Onde a solução foi <em>aplicada</em>': 'Where the solution was <em>applied</em>',
  'Resultado': 'Outcome',
  'O que <em>mudou</em>': 'What <em>changed</em>',
  'Resultado qualitativo, na palavra do cliente. Métricas do projeto podem ser somadas aqui quando disponíveis.':
    'Qualitative outcome, in the client\'s words. Project metrics can be added here when available.',
  'Related': 'Related',
  'Projetos <em>relacionados</em>': '<em>Related</em> projects',
  'Próximo case': 'Next case study',
  'Ver experiência completa e CV': 'See full experience and CV',
  '{0} anos entre marca, comunicação e produto digital. Abaixo: onde atuei, o que fiz e o que dá para esperar de mim dentro de um time.':
    '{0} years across brand, communication and digital product. Below: where I worked, what I did and what you can expect from me inside a team.',
  '{0}, experimento de {1}': '{0}, {1} experiment',
};
