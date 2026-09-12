/* MB Motos — dados do negócio.
   É o único arquivo que precisa ser editado quando o cliente passar as
   informações. Tudo que aparece na página (links de WhatsApp, telefone,
   endereço, horários, promoção) sai daqui.

   ⚠ Os valores marcados com PROVISÓRIO são de exemplo e precisam ser
   trocados antes de publicar. */

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
    referencia: 'Em frente ao ponto de referência a confirmar',
    /* PROVISÓRIO — coordenadas reais melhoram muito o SEO local */
    lat: -20.2846,
    lng: -40.4163
  },

  /* 0 = domingo … 6 = sábado. Use null para dia fechado. */
  horarios: [
    { dia: 'Domingo',       abre: null,    fecha: null },
    { dia: 'Segunda-feira', abre: '08:00', fecha: '18:00' },
    { dia: 'Terça-feira',   abre: '08:00', fecha: '18:00' },
    { dia: 'Quarta-feira',  abre: '08:00', fecha: '18:00' },
    { dia: 'Quinta-feira',  abre: '08:00', fecha: '18:00' },
    { dia: 'Sexta-feira',   abre: '08:00', fecha: '18:00' },
    { dia: 'Sábado',        abre: '08:00', fecha: '13:00' }
  ],

  /* Promoção recorrente. diaSemana: 0 = domingo … 6 = sábado. */
  promocao: {
    ativa: true,
    diaSemana: 3,                    /* PROVISÓRIO — quarta ou quinta */
    selo: 'Toda quarta',
    titulo: 'Quarta da Revisão',
    descricao: 'Revisão completa com condição especial, só às quartas. Vagas limitadas pela agenda do dia.',
    itens: [
      'Checagem de 20 itens de segurança',
      'Mão de obra com desconto na revisão',
      'Orçamento de qualquer peça extra antes de executar'
    ]
  },

  instagram: '',                     /* PROVISÓRIO — ex.: 'mbmotos' */
  googleMaps: '',                    /* PROVISÓRIO — link curto do Maps */
  cnpj: ''                           /* opcional, aparece no rodapé se preenchido */
};
