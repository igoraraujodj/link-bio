# MB Motos — mini site / link na bio

Página única de conversão para a MB Motos, oficina de motos em Cariacica, ES.
HTML, CSS e JavaScript puros, sem framework e sem build. Abrir o `index.html`
no navegador já mostra o resultado final.

- **Estratégia e seções:** [`ESTRUTURA.md`](ESTRUTURA.md)
- **No ar:** https://mbmotos.vercel.app

Repositório próprio do cliente, separado do portfólio do Igor.

## Arquivos

```
index.html            estrutura e conteúdo da página
assets/css/style.css  design system em tokens + layout
assets/js/config.js   ← dados do negócio (é aqui que se mexe)
assets/js/main.js     comportamento, horários e dados estruturados
assets/img/           favicon e imagens
```

## Vercel

O `vercel.json` apenas confirma que não há build e define o cache. O site é
a própria raiz do repositório.

## Endereço do site

Hoje: `https://igoraraujodj.github.io/link-bio/mb-motos/` (GitHub Pages).

Para um endereço sem o nome pessoal, sem custo, há dois caminhos:

1. **Netlify** (mais rápido): conecte este repositório, sem build command.
   Em Change site name, defina `mbmotos` e o endereço vira
   `https://mbmotos.netlify.app`. Cloudflare Pages funciona igual e entrega
   `mbmotos.pages.dev`.
2. **Conta própria do cliente no GitHub**: criando a conta `mbmotos` e um
   repositório `mbmotos.github.io`, o site passa a viver em
   `https://mbmotos.github.io`. Mais trabalhoso, porém é o cliente dono do
   próprio endereço.

Domínio `.com.br` não existe de graça: o registro.br cobra por ano e é o
único caminho legítimo. Apontar o domínio para Netlify ou Pages continua
sendo gratuito.

## Como republicar

O site é servido pelo GitHub Pages a partir da branch `main`. Todo push na
`main` que toque esta pasta republica sozinho, em um ou dois minutos. Não há
build: os arquivos são servidos como estão.

## Ofertas

As três ofertas definidas com o cliente ficam em `config.js`, no array
`ofertas`. Para trocar a promoção da semana, edite o objeto ou mude
`ativa: false` para tirar do ar. A oferta com `destaque: true` ocupa a
largura toda da seção e é a âncora dos anúncios.

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

## Pixel da Meta e GA4

Em `config.js`, no bloco `medicao`, cole o ID do Pixel e o do GA4. As tags
entram sozinhas. Com os campos vazios, a página não faz requisição nenhuma
para Meta ou Google.

Eventos disparados:

| Ação na página | Evento padrão da Meta | Evento nosso |
|---|---|---|
| Qualquer clique que leve ao WhatsApp | `Contact` | `contato_whatsapp` |
| Envio do formulário do topo | `Lead` | `contato_whatsapp` |
| Clique em rota (Maps ou Waze) | — | `clique_rota` |
| Clique em ligar | — | `contato_telefone` |

O evento padrão é o que o algoritmo da Meta usa para otimizar a campanha.
O evento nosso leva junto a origem do clique (`oferta revisao`,
`estoque: Pneus`, `balão flutuante`), que é o que mostra qual bloco da
página trouxe o cliente.

## Design

Registro editorial: fundo preto, tipografia enorme em caixa alta com
entrelinha comprimida, cantos generosos (28px nos cards, 48px nos blocos
grandes) e superfícies chapadas. **Zero sombra** em qualquer lugar: a
profundidade vem do contraste entre preto, grafite e branco.

O bloco 1 do CSS (`:root`) concentra cor, tipografia, escala, espaçamento e
raio. Trocar os tokens ali reestiliza a página inteira sem mexer no HTML.

- Superfícies: `--preto` (fundo), `--carvao` (cards), `--grafite` (hover e
  pílulas), `--branco` (blocos invertidos, como o formulário e a oferta
  âncora).
- Acento: `--menta` `#D1FFCA`, só em elemento pequeno (ícone, tag, link,
  fita da oferta). Verde `--zap` fica reservado para ação de WhatsApp.
- Tipografia: pilha da Apple, sem fonte externa. Nenhuma requisição a mais.

## Ícones

Sprite SVG embutido no topo do `index.html`, traço monoline de 1.5 herdando
a cor do texto. Fica embutido, e não em arquivo separado, porque o Safari
não resolve `<use href="arquivo.svg#id">`. Para usar:

```html
<svg class="ic" aria-hidden="true"><use href="#ic-pneu"/></svg>
```

Quando os SVGs do cliente chegarem, troque o conteúdo de cada `<symbol>`
mantendo o mesmo `id`.

## Formulário

O formulário do topo não envia nada para servidor nenhum: ele monta a
mensagem e abre o WhatsApp já preenchido, que é onde o atendimento
acontece de verdade. A mensagem sai assim:

> Olá! Meu nome é Fulano. Tenho uma CG 160 Titan 2021 e gostaria de:
> Revisão completa (a partir de R$ 199).
>
> Observação: corrente fazendo barulho
>
> (enviado pelo site)

## Responsividade

Mobile primeiro. Tipografia fluida com `clamp()`, grades com `auto-fit` (sem
media query por componente), e três pontos de ajuste: 900px vira o menu de
desktop, esconde a barra fixa de ações e passa oferta e localização para duas
colunas. Testado de 320px a 1440px.
