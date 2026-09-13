/* MB Motos — dados do negócio.
   É o único arquivo que precisa ser editado no dia a dia. Tudo que aparece na
   página (links de WhatsApp, telefone, endereço, horários, ofertas, marcas)
   sai daqui.

   ⚠ O que está marcado com PROVISÓRIO é exemplo e precisa ser trocado antes
   de publicar. O que está marcado com CONFERIR veio da conversa com o cliente
   e só precisa de confirmação do valor. */

window.MB = {
  nome: 'MB Motos',

  /* 55 + DDD + número, só dígitos. */
  whatsapp: '5527997228358',
  telefone: '+5527997228358',

  mensagemPadrao: 'Olá! Vim pelo site e quero um orçamento.',

  endereco: {
    logradouro: 'Rod. Gov. José Henrique Sette, 5987',
    bairro: 'Santana',
    cidade: 'Cariacica',
    estado: 'ES',
    cep: '29154-210',
    referencia: '',
    /* CONFERIR: coordenadas aproximadas do CEP. Para o pino cair exato,
       cole o link do "Incorporar um mapa" do Google em mapaEmbed. */
    lat: -20.2846,
    lng: -40.4163
  },

  /* 0 = domingo … 6 = sábado. Use abre: null para dia fechado. */
  horarios: [
    { dia: 'Domingo',       abre: null,    fecha: null },
    { dia: 'Segunda-feira', abre: '08:00', fecha: '18:00' },
    { dia: 'Terça-feira',   abre: '08:00', fecha: '18:00' },
    { dia: 'Quarta-feira',  abre: '08:00', fecha: '18:00' },
    { dia: 'Quinta-feira',  abre: '08:00', fecha: '18:00' },
    { dia: 'Sexta-feira',   abre: '08:00', fecha: '18:00' },
    { dia: 'Sábado',        abre: '08:00', fecha: '12:00' }
  ],

  /* ------------------------------------------------------------------
     OFERTAS
     Definidas na reunião do dia 12. A primeira é a âncora da campanha,
     as outras duas giram a semana. Para tirar uma do ar, mude ativa
     para false. diaSemana: 0 = domingo … 6 = sábado, ou null quando a
     oferta vale todos os dias.
     ------------------------------------------------------------------ */
  ofertas: [
    {
      id: 'revisao',
      ativa: true,
      destaque: true,
      selo: 'Oferta de lançamento',
      /* Contador regressivo até o fim do dia. A condição é diária mesmo,
         então o relógio reinicia todo dia sem mentir para quem chega. */
      contador: true,
      titulo: 'Revisão completa com óleo grátis',
      precoDe: 'R$ 280',
      precoPrefixo: 'a partir de',
      preco: 'R$ 199',
      precoNota: 'mão de obra e lubrificação',
      diaSemana: null,
      resumo: 'Revisão completa da sua moto com 1 litro de óleo Mobil por nossa conta e lavagem de cortesia na entrega.',
      itens: [
        '1 litro de óleo Mobil grátis, 20W50 mineral ou 10W30 semissintético',
        'Lavagem de cortesia: a moto volta limpa',
        'Deixe de manhã e retire no fim do dia',
        'Checagem completa com orçamento antes de trocar qualquer peça'
      ],
      /* CONFERIR a lista de modelos com o cliente */
      obs: 'Válida para CG 125 (2009 a 2018), CG 150, Titan e Fan até 160cc. Um litro de óleo por moto. O valor final depende do modelo e do estado da moto: peças, quando necessárias, são orçadas e aprovadas por você antes do serviço. Revisão com agendamento pelo WhatsApp.',
      cta: 'Agendar minha revisão'
    },
    {
      id: 'capacete',
      ativa: true,
      destaque: false,
      selo: 'Toda quinta-feira',
      titulo: 'Quinta do Capacete',
      preco: '25% OFF',
      precoNota: 'no Pix ou dinheiro',
      diaSemana: 4,
      resumo: 'Um dia por semana, capacete com desconto de verdade. Estoque na loja, leve na hora.',
      itens: [
        '25% de desconto no Pix ou dinheiro',
        '15% de desconto no cartão de crédito',
        'Só às quintas, enquanto durar o estoque'
      ],
      obs: 'Desconto sobre o preço de etiqueta, válido para os capacetes disponíveis na loja.',
      cta: 'Ver capacetes disponíveis'
    },
    {
      id: 'bike-eletrica',
      ativa: true,
      destaque: false,
      selo: 'Novidade',
      titulo: 'Pneu de bike elétrica aro 16',
      /* CONFERIR com o cliente: valor final e se a montagem está inclusa */
      preco: 'R$ 300',
      precoNota: 'o pneu, mão de obra à parte',
      diaSemana: null,
      resumo: 'Medida 110/70-16, serve na maioria das bikes elétricas. Tem em estoque e a troca é feita aqui mesmo.',
      itens: [
        'Medida 110/70-16, dianteiro ou traseiro',
        'Troca feita na hora, sem espera',
        'De bike elétrica fazemos só o pneu, não a revisão'
      ],
      obs: 'O valor é do pneu. A mão de obra da troca é cobrada à parte, e você recebe o valor fechado antes do serviço.',
      cta: 'Consultar pneu da minha bike'
    }
  ],

  /* Fita animada de marcas. Quando tiver os logos, troque `logo: null`
     pelo caminho do arquivo em assets/img/marcas/. */
  marcas: [
    { nome: 'Honda', logo: null },
    { nome: 'Yamaha', logo: null },
    { nome: 'Suzuki', logo: null },
    { nome: 'Kawasaki', logo: null },
    { nome: 'BMW', logo: null },
    { nome: 'Royal Enfield', logo: null },
    { nome: 'Haojue', logo: null },
    { nome: 'Shineray', logo: null },
    { nome: 'Mobil', logo: null },
    { nome: 'Maggion', logo: null },
    { nome: 'Norisk', logo: null },
    { nome: 'Pro Tork', logo: null }
  ],

  /* ------------------------------------------------------------------
     BARRA DE CHAMADAS
     As mensagens giram uma a uma na faixa do topo. Ordem importa: a
     primeira é a que mais gente vê, porque muita gente não espera a
     segunda. Nenhuma promete prazo fechado, de propósito.
     ------------------------------------------------------------------ */
  barra: [
    'Revisão completa a partir de R$ 199, com óleo grátis',
    'Sua moto pode ficar pronta no mesmo dia',
    'Peça original com garantia e estoque próprio',
    'Quinta do Capacete: 25% de desconto no Pix'
  ],

  /* ------------------------------------------------------------------
     VITRINE DO ESTOQUE
     Cada categoria abre o WhatsApp com a pergunta já escrita, porque quem
     clica em "pneu" quer falar de pneu, não mandar um "oi" genérico.
     ------------------------------------------------------------------ */
  estoque: [
    { nome: 'Pneus',            texto: 'Medidas das motos mais rodadas da região.', cta: 'Cotar pneu',
      mensagem: 'Olá! Gostaria de cotar um pneu e saber como funciona a troca.' },
    { nome: 'Kit relação',      texto: 'Coroa, pinhão e corrente de marca.', cta: 'Saber mais',
      mensagem: 'Olá! Gostaria de saber mais sobre o kit de relação para a minha moto.' },
    { nome: 'Óleo e filtros',   texto: 'Linha completa para troca na hora.', cta: 'Ver a linha',
      mensagem: 'Olá! Queria saber a linha de óleos que vocês têm e marcar a troca.' },
    { nome: 'Carenagem',        texto: 'Peça nova e recuperada, com pintura.', cta: 'Consultar',
      mensagem: 'Olá! Queria consultar as carenagens disponíveis em loja para a minha moto.' },
    { nome: 'Freios',           texto: 'Pastilha, disco, lona e fluido.', cta: 'Consultar',
      mensagem: 'Olá! Queria saber sobre pastilha e disco de freio para a minha moto.' },
    { nome: 'Capacetes',        texto: 'Estoque na loja, com desconto às quintas.', cta: 'Ver modelos',
      mensagem: 'Olá! Queria ver os capacetes disponíveis e como funciona o desconto da quinta.' },
    { nome: 'Acessórios',       texto: 'Baú, protetor de motor e capa.', cta: 'Ver o que tem',
      mensagem: 'Olá! Queria ver os acessórios que vocês têm disponíveis.' },
    { nome: 'Pneu de bike',     texto: 'Bike elétrica, aro 16, medida 110/70-16.', cta: 'Consultar',
      mensagem: 'Olá! Queria saber sobre o pneu aro 16 para bike elétrica e o valor da troca.' }
  ],

  /* ------------------------------------------------------------------
     FEEDBACK DOS CLIENTES
     ⚠ Conteúdo de EXEMPLO, para o cliente ver o formato. Antes de rodar
     anúncio, troque por avaliação real (o ideal é pedir no Google a cada
     entrega e trazer o texto de lá). Avaliação inventada no ar é risco
     jurídico e queima confiança quando alguém percebe.
     ------------------------------------------------------------------ */
  depoimentos: [
    { nome: 'Lucas Barbosa',    moto: 'CG 160 Titan',  nota: 5, tag: 'Atendimento rápido',
      texto: 'Deixei de manhã para trocar o kit relação e peguei no fim da tarde. Valor fechado antes, sem aparecer custo extra depois.' },
    { nome: 'Everaldo Luís',    moto: 'Biz 125',       nota: 5, tag: 'Serviço de qualidade',
      texto: 'Fazia revisão em outro lugar e sempre voltava com um barulho. Aqui acharam que era a corrente folgada, ajustaram e a moto ficou macia.' },
    { nome: 'Daniele Rocha',    moto: 'Pop 110',       nota: 5, tag: 'Quem conhece confia',
      texto: 'Cheguei só para tirar dúvida de pneu e me atenderam na hora. Falei que ando com minha filha na garupa e me indicaram a medida certa.' },
    { nome: 'Jefferson Alves',  moto: 'Fan 160',       nota: 5, tag: 'Preço justo',
      texto: 'Pedi orçamento em três oficinas de Cariacica. A MB não foi a mais barata, mas foi a única que explicou item por item o que ia fazer.' },
    { nome: 'Wanderson Silva',  moto: 'Factor 150',    nota: 5, tag: 'Resolve no mesmo dia',
      texto: 'Uso a moto para trabalhar, não posso ficar sem. Levei com o freio raspando às 8h e ao meio-dia já estava rodando.' },
    { nome: 'Patrícia Gomes',   moto: 'Biz 110',       nota: 5, tag: 'Atendimento rápido',
      texto: 'Mulher em oficina costuma ouvir muita enrolação. Aqui me mostraram a peça velha e explicaram o motivo da troca.' },
    { nome: 'Rodrigo Peçanha',  moto: 'PCX 160',       nota: 5, tag: 'Tem peça em estoque',
      texto: 'Quebrei a carenagem da PCX e achei que ia esperar semanas pela peça. Eles tinham no estoque e resolveram no dia seguinte.' },
    { nome: 'Anderson Matos',   moto: 'XRE 300',       nota: 5, tag: 'Serviço de qualidade',
      texto: 'Revisão completa feita direito. Entregaram a moto lavada e com tudo anotado no papel, do óleo ao aperto da corrente.' },
    { nome: 'Simone Ferreira',  moto: 'Pop 100',       nota: 5, tag: 'Quem conhece confia',
      texto: 'Meu marido já era cliente e agora levo a minha também. O pessoal é educado e não empurra serviço que a moto não precisa.' },
    { nome: 'Thiago Nunes',     moto: 'Titan 150',     nota: 5, tag: 'Preço justo',
      texto: 'Troquei pneu e óleo no mesmo dia. Passaram o valor pelo WhatsApp antes de eu sair de casa, e foi exatamente o que paguei.' }
  ],

  /* Provas usadas no topo da página. Vieram da conversa com o cliente. */
  provas: [
    { numero: '5', texto: 'mecânicos na oficina, sua moto não espera fila' },
    { numero: '20 min', texto: 'é o que levamos para trocar um kit de transmissão' },
    { numero: 'Estoque', texto: 'próprio de peça, pneu e carenagem' }
  ],

  /* Balão flutuante no canto da tela. A foto do mecânico entra em
     `foto` (ex.: 'assets/img/mascote.png'); enquanto for null, aparece um
     avatar provisório desenhado em CSS. */
  mascote: {
    ativo: true,
    foto: 'assets/img/logo.png',     /* troque pela foto do mecânico quando ela chegar */
    nome: 'Equipe MB Motos',
    fala: 'Oi! O que eu posso te ajudar hoje?',
    mensagem: 'Oi! Gostaria de um orçamento.'
  },

  /* ------------------------------------------------------------------
     MEDIÇÃO
     Cole os IDs aqui e as tags entram sozinhas na página. Enquanto os
     campos estiverem vazios, nada é carregado: o site não faz requisição
     para Meta nem para Google, e continua rápido.

     metaPixel: ID numérico do Pixel (Gerenciador de Eventos da Meta,
       Fontes de dados, o número no topo). Ex.: '123456789012345'
     ga4: ID de medição do Google Analytics 4. Ex.: 'G-XXXXXXXXXX'
     ------------------------------------------------------------------ */
  medicao: {
    metaPixel: '',
    ga4: ''
  },

  instagram: 'mbmotoss',

  /* Link do Google Maps para o botão de rota. Deixe vazio que o site monta
     a rota a partir do endereço acima. */
  googleMaps: '',                    /* PROVISÓRIO — link curto do Maps */

  /* Mapa incorporado. Vazio = o site monta a busca pelo endereço. Quando
     tiver a ficha no Google Meu Negócio, cole aqui o src do "Incorporar um
     mapa" para o pino cair exato. */
  mapaEmbed: '',

  cnpj: ''                           /* opcional, aparece no rodapé se preenchido */
};
