# MB Motos — mini site / link na bio

Página única de conversão para a MB Motos, oficina de motos em Cariacica, ES.
HTML, CSS e JavaScript puros, sem framework e sem build. Abrir o `index.html`
no navegador já mostra o resultado final.

- **Estratégia e seções:** [`ESTRUTURA.md`](ESTRUTURA.md)
- **URL de teste:** `https://igoraraujodj.github.io/link-bio/mb-motos/`

Esta pasta é independente do portfólio que vive na raiz do repositório. O
`build.js` da raiz não gera nem apaga nada daqui.

## Arquivos

```
index.html            estrutura e conteúdo da página
assets/css/style.css  design system em tokens + layout
assets/js/config.js   ← dados do negócio (é aqui que se mexe)
assets/js/main.js     comportamento, horários e dados estruturados
assets/img/           favicon e imagens
```

## Antes de publicar

Tudo que precisa de dado real está em `assets/js/config.js`, marcado com
`PROVISÓRIO`:

1. **WhatsApp** no formato `55DDDNÚMERO`. É o destino de todos os CTAs.
2. **Telefone** para o botão de ligação.
3. **Endereço** completo, com número na Rodovia José Sette e CEP.
4. **Coordenadas** (`lat` / `lng`), pegas no Google Maps com clique direito
   sobre o ponto exato. É o que sustenta o SEO local.
5. **Horários**, dia a dia. `abre: null` fecha o dia.
6. **Promoção semanal**: `diaSemana` (0 = domingo), selo, título e itens.
7. **Instagram** e link curto do Google Maps, se houver.

As imagens ainda são áreas pontilhadas com o rótulo do que entra ali. Para
trocar, substitua o `<div class="ph" data-ph="...">` por um `<img>`.

## Como o CTA funciona

Qualquer elemento com `data-zap` vira link de WhatsApp automaticamente, e o
`data-servico` entra na mensagem já escrita:

```html
<a data-zap data-servico="troca de kit relação">Pedir orçamento</a>
```

O clique também dispara um evento (`contato_whatsapp`) para o GA4 e para o
Pixel da Meta, quando as tags estiverem instaladas. Sem as tags, nada quebra.

## Design

O CSS está em duas camadas. O bloco 1 (`:root`) concentra cor, tipografia,
escala, espaçamento, raio e sombra. Trocar os tokens ali reestiliza a página
inteira sem mexer no HTML. Do bloco 5 em diante é só layout de cada seção.

A paleta atual é provisória: preto tinta, papel neutro e um acento laranja.

## Responsividade

Mobile primeiro. Tipografia fluida com `clamp()`, grades com `auto-fit` (sem
media query por componente), e três pontos de ajuste: 900px vira o menu de
desktop, esconde a barra fixa de ações e passa oferta e localização para duas
colunas. Testado de 320px a 1440px.
