/* MB Motos — dados do negócio.
   É o único arquivo que precisa ser editado no dia a dia. Tudo que aparece na
   página (links de WhatsApp, telefone, endereço, horários, ofertas, marcas)
   sai daqui.

   ⚠ O que está marcado com PROVISÓRIO é exemplo e precisa ser trocado antes
   de publicar. O que está marcado com CONFERIR veio da conversa com o cliente
   e só precisa de confirmação do valor. */

window.MB = {
  nome: 'MB Motos',

  /* PROVISÓRIO — número real do WhatsApp.
     Formato: 55 + DDD + número, só dígitos. Ex.: 5527999998888 */
  whatsapp: '5527999998888',

  /* PROVISÓRIO — telefone para ligação */
  telefone: '+5527999998888',

  mensagemPadrao: 'Olá! Vim pelo site e quero um orçamento.',

  endereco: {
    logradouro: 'Rodovia José Sette, s/nº',  /* PROVISÓRIO — número exato */
    bairro: 'Santana',
    cidade: 'Cariacica',
    estado: 'ES',
    cep: '',                                  /* PROVISÓRIO */
    referencia: 'Ponto de referência a confirmar',
    /* PROVISÓRIO — pegue no Google Maps: clique direito sobre a oficina */
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
    { dia: 'Sábado',        abre: '08:00', fecha: '13:00' }  /* CONFERIR horário de sábado */
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
      titulo: 'Revisão completa com óleo grátis',
      precoDe: 'R$ 280',
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
      obs: 'Válida para CG 125 (2009 a 2018), CG 150, Titan e Fan até 160cc. Um litro de óleo por moto. Peças, quando necessárias, são orçadas e aprovadas por você antes do serviço.',
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
      precoNota: 'com montagem',
      diaSemana: null,
      resumo: 'Medida 110/70-16, serve na maioria das bikes elétricas. Tem em estoque e a gente monta na hora.',
      itens: [
        'Medida 110/70-16, dianteiro ou traseiro',
        'Montagem feita aqui, sem espera',
        'Também fazemos revisão de bike elétrica e temos cadeado'
      ],
      obs: '',
      cta: 'Consultar pneu da minha bike'
    }
  ],

  /* Marcas com que a oficina trabalha. Quando tiver o logo, troque
     `logo: null` pelo caminho do arquivo em assets/img/marcas/. */
  marcas: [
    { nome: 'Mobil', logo: null },
    { nome: 'Maggion', logo: null }   /* CONFERIR grafia da marca de pneus */
  ],

  /* Provas usadas no topo da página. Vieram da conversa com o cliente. */
  provas: [
    { numero: '5', texto: 'mecânicos na oficina, sua moto não espera fila' },
    { numero: '20 min', texto: 'é o que levamos para trocar um kit de transmissão' },
    { numero: 'Estoque', texto: 'próprio de peça, pneu e carenagem' }
  ],

  instagram: '',                     /* PROVISÓRIO — ex.: 'mbmotos' */
  googleMaps: '',                    /* PROVISÓRIO — link curto do Maps */
  cnpj: ''                           /* opcional, aparece no rodapé se preenchido */
};
