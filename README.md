# Igor Araujo — Portfólio

Portfólio profissional de Igor Araujo, designer multidisciplinar.
Site estático de uma página, sem framework e sem dependências, publicado
no GitHub Pages.

**No ar:** https://igoraraujodj.github.io/link-bio/

---

## Como funciona

O site é **gerado**. Os arquivos `.html` na raiz são saída de build — não
edite nenhum deles à mão, porque o próximo build sobrescreve tudo.

```
src/data/        ← conteúdo (é aqui que você mexe)
src/templates/   ← estrutura da página
src/styles/      ← design system
src/scripts/     ← comportamento
build.js         ← gerador

↓  node build.js  ↓

index.html  404.html  style.css  script.js  sitemap.xml  robots.txt
```

Para publicar qualquer alteração:

```bash
node build.js       # regenera tudo
git add -A
git commit -m "..."
git push
```

Não precisa instalar nada. Só Node.

---

## Uma página só

O site inteiro é `index.html`, em rolagem única, com cinco blocos:

| Bloco | O que entra |
| --- | --- |
| Hero | nome, o que você faz, disponibilidade, dois caminhos de saída |
| Trabalho | os sete projetos, em card, com a capa |
| Sobre | retrato, bio, manifesto, especialidades, onde atuou, marcas |
| Clientes | os quatro depoimentos |
| Contato | campo de briefing e os cinco canais |

`404.html` existe só para o GitHub Pages não cair na tela de erro dele.

A navegação do topo é âncora para seção, então acrescentar um destino
é acrescentar uma âncora em `src/data/site.js` e a seção correspondente
em `src/templates/pages/home.js`.

---

## Onde mexer em cada coisa

| O que você quer mudar | Arquivo |
| --- | --- |
| Nome, contatos, links, disponibilidade, navegação, SEO | `src/data/site.js` |
| Projetos | `src/data/projects.js` |
| Manifesto, bio, especialidades, experiência, depoimentos, marcas | `src/data/profile.js` |
| Cores, tipografia, espaçamento | `src/styles/tokens.css` |
| Layout e componentes | `src/styles/site.css` |

### Fechar a agenda

Em `src/data/site.js`, `availability.open: false`. O ponto verde e o
texto mudam no header e no rodapé de uma vez.

---

## Adicionar um projeto

1. Suba a imagem em `assets/images/work/<slug>.jpg`.
2. Adicione um objeto em `src/data/projects.js`:

```js
{
  slug: 'nome-do-projeto',
  title: 'Nome do projeto',
  client: 'Cliente',
  year: '2025',
  category: 'Branding',             // aparece no card
  categories: ['Branding', 'Digital'],
  summary: 'Uma linha. Aparece no card.',
  role: ['Direção de arte', 'Design'],   // vira as tags do card
  tools: ['Figma', 'Illustrator'],
  tags: ['Rebrand', 'Sistema visual'],
  cover: 'assets/images/work/nome-do-projeto.jpg',
  study: { context: null, challenge: null, objective: null,
           strategy: null, concept: null, execution: null, results: null },
  gallery: [],
}
```

3. `node build.js`.

O card, o índice numerado, o sitemap e os dados estruturados saem
sozinhos.

Os campos `study`, `gallery`, `tools`, `tags`, `featured` e `spotlight`
continuam nos dados mas não aparecem mais na página: eles eram o
conteúdo das páginas de case, que foram removidas. Ficam ali porque são
o material pronto caso um dia a página de case volte.

### Capas: como subir a foto de um projeto

**É só jogar o arquivo na pasta.** Não precisa editar nenhum dado.

```
assets/images/work/avante-telecom.jpg
```

O nome do arquivo é o `slug` do projeto. Valem `.jpg`, `.jpeg`, `.png`,
`.webp` e `.avif`. Rode `node build.js` e o site passa a usar a foto.

O build mostra em que pé está:

```
3 capa(s) com imagem real
4 projeto(s) ainda com capa gerada: solte a foto em assets/images/work/<slug>.jpg
```

**Proporção.** O card corta em 4:3. Mande quadrada ou próxima disso,
com o assunto centrado.

**Enquanto não há foto**, cada projeto usa uma capa gráfica desenhada a
partir do conteúdo dele (`src/covers.js`): sono virou onda, telecom
virou sinal, sistema visual virou módulo, IA virou campo de pontos. São
composições da linguagem do site, não imitações da marca do cliente nem
simulações da peça entregue.

A ordem de preferência do build é: foto real, depois qualquer SVG que
você tenha colocado ali à mão, depois a capa gerada. O arquivo gerado
carrega um comentário marcador na primeira linha; **apague esse
comentário e o build nunca mais toca no arquivo**, caso você queira
congelar uma capa.

---

## Conteúdo pendente

**Nada foi preenchido com texto fictício** — nenhuma métrica, cliente,
prazo ou resultado inventado. O que falta continua como campo `null` nos
arquivos de dados, esperando a informação real:

- `projects[].year` — ano de cada projeto
- `projects[].study` — narrativa de cada case
- `experience[].period` — períodos de cada passagem profissional
- `experience[].results` — resultados de cada passagem
- `testimonials[].link` — URL do LinkedIn de quem assina o depoimento.
  Colando a URL, a assinatura vira link verificável sozinha.
- `assets/images/work/*.jpg` — **a maior lacuna.** Um portfólio de
  designer sem foto das peças é o único item desta lista que o visitante
  percebe.

Diferente da versão anterior, a página não imprime mais um bloco
"A PREENCHER" para cada campo vazio: numa página só, sete placards de
pendência eram o que mais chamava atenção. A honestidade agora está em
não mostrar o que não existe, e esta lista é o checklist.

---

## Design system

Tudo sai de `src/styles/tokens.css`.

**Cor** — base neutra com um único acento. Preto tinta `#0B0B0C`, papel
`#F3F2EE`, acento lime. O tema claro e o escuro têm paletas próprias:
não é inversão, os fios e o acento são recalibrados em cada um.

Uma armadilha ao mexer: `--accent` é cor de **superfície**, nunca de
texto (1.09:1 com o papel). Texto de destaque usa `--accent-text`. E
`--ink-faint` só passa AA sobre `--paper`: dentro de card, que é
`--surface`, use `--ink-dim`.

**Tipografia** — Space Grotesk (display), Inter (leitura), JetBrains
Mono (metadados e rótulos) e Instrument Serif, que entra só em itálico
dentro de `<em>` nos títulos. Uma única requisição de fonte.

**Movimento** — entrada por scroll e nada além disso. Respeita
`prefers-reduced-motion`.

---

## Decisões técnicas

**Por que não React/Next.** O site é servido pelo GitHub Pages direto da
raiz, sem build na nuvem. HTML gerado e commitado dá SEO real, primeira
pintura sem hidratação e deploy sem CI.

**Progressive enhancement.** Sem JavaScript o site continua inteiro: os
sete projetos, os depoimentos e os canais aparecem, e o campo de
briefing envia. Os dois scripts que existem (tema e entrada por scroll)
são enfeite, não estrutura.

**Formulário sem servidor.** O campo de briefing é um `form` GET para
`wa.me` com um campo chamado `text`, que é exatamente a URL que o
WhatsApp espera. O navegador monta o link: sem JS, sem fetch, sem
backend. Nenhum dado trafega ou é armazenado.

**Acessibilidade.** HTML semântico, navegação por teclado com foco
visível, skip link, alvos de toque adequados e contraste AA nos dois
temas. Auditado com axe (WCAG 2.1 A/AA) nas duas páginas e nos dois
temas, sem violação.

---

## Estrutura

```
build.js                  gerador (Node, zero dependências)
src/
  covers.js               capas gráficas geradas por projeto
  data/
    site.js               identidade, contatos, navegação, SEO
    projects.js           projetos
    profile.js            bio, manifesto, especialidades, experiência, depoimentos
  templates/
    layout.js             shell: head, header, footer, JSON-LD
    components.js         componentes reutilizáveis
    pages/home.js         a página
    pages/notfound.js     404
  styles/                 tokens → base → site
  scripts/                theme, reveal
assets/
  images/                 retrato e capas de projeto
  icons/                  favicon
```

`style.css` e `script.js` na raiz são bundles gerados, minificados, com
hash de conteúdo na URL para cache busting.
