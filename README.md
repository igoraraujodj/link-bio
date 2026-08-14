# Igor Araujo — Portfólio

Portfólio profissional de Igor Araujo, designer multidisciplinar.
Site estático, sem framework e sem dependências, publicado no GitHub Pages.

**No ar:** https://igoraraujodj.github.io/link-bio/

---

## Como funciona

O site é **gerado**. Os arquivos `.html` na raiz são saída de build — não edite
nenhum deles à mão, porque o próximo build sobrescreve tudo.

```
src/data/        ← conteúdo (é aqui que você mexe)
src/templates/   ← estrutura das páginas
src/styles/      ← design system
src/scripts/     ← comportamento
build.js         ← gerador

↓  node build.js  ↓

index.html  projects.html  about.html  experience.html  ai-lab.html
contact.html  404.html  work/*.html  style.css  script.js  sitemap.xml
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

## Onde mexer em cada coisa

| O que você quer mudar | Arquivo |
| --- | --- |
| Nome, contatos, links, disponibilidade, SEO | `src/data/site.js` |
| Projetos e cases | `src/data/projects.js` |
| Manifesto, bio, especialidades, processo, ferramentas, experiência, FAQ | `src/data/profile.js` |
| AI Lab: pipeline e experimentos | `src/data/ailab.js` |
| Cores, tipografia, espaçamento, grid | `src/styles/tokens.css` |

### Fechar a agenda

Em `src/data/site.js`, `availability.open: false`. O ponto verde e o texto
mudam no header, no hero e no rodapé de uma vez.

---

## Adicionar um projeto

1. Suba as imagens em `assets/images/work/`.
2. Adicione um objeto em `src/data/projects.js`:

```js
{
  slug: 'nome-do-projeto',          // vira work/nome-do-projeto.html
  title: 'Nome do projeto',
  client: 'Cliente',
  year: '2025',
  category: 'Branding',             // categoria principal (filtro)
  categories: ['Branding', 'Digital'],
  summary: 'Uma linha. Aparece no card e na meta description.',
  role: ['Direção de arte', 'Design'],   // obrigatório
  tools: ['Figma', 'Illustrator'],
  tags: ['Rebrand', 'Sistema visual'],
  cover: 'assets/images/work/nome-do-projeto.jpg',
  featured: true,                   // aparece no "Selected Work" da home
  spotlight: false,                 // case destaque full-bleed (só um)
  study: {
    context: 'Texto…', challenge: null, objective: null,
    strategy: null, concept: null, execution: null, results: null,
  },
  gallery: [
    { src: 'assets/images/work/nome-01.jpg', alt: 'Descrição', caption: 'Legenda' },
  ],
}
```

3. `node build.js`.

A página do case, a entrada no índice da home, o card na listagem, os filtros,
o sitemap e os metadados são gerados sozinhos.

### Capas provisórias

Se o arquivo em `cover` não existir, o build gera uma placa editorial
provisória no lugar — o site nunca mostra imagem quebrada. No dia em que a arte
real subir com o mesmo nome, o build **não** sobrescreve: ele só gera o que
está faltando.

---

## Conteúdo pendente

Cases têm campos `null` de propósito. **Nada foi preenchido com texto
fictício** — nenhuma métrica, cliente, prazo ou resultado inventado.

Onde falta conteúdo, a página mostra um bloco **A PREENCHER** dizendo o que
entra ali. É honesto com quem lê e serve como checklist para você.

O build avisa quantos cases ainda têm seções abertas:

```
⚠ 7 case(s) com seções a preencher — ver src/data/projects.js
```

Trocar `null` pelo texto real faz o bloco sumir sozinho. Quando todos os
campos de um case estiverem preenchidos, o aviso "Case em preenchimento"
some da página.

**Outros pontos marcados como pendentes:**

- `experience[].period` — períodos de cada passagem profissional
- `experience[].results` — resultados de cada passagem
- `experienceNote` — histórico anterior aos registros atuais
- `projects[].year` — ano de cada projeto
- `assets/images/ai-lab/*.jpg` — imagens dos experimentos do AI Lab

---

## Currículo em PDF

Coloque o arquivo em `assets/cv/igor-araujo-cv.pdf`.

Enquanto ele não existir, os botões "Download CV" checam o arquivo no clique e
levam para a versão web da experiência em vez de dar 404. Assim que o PDF
subir, os mesmos botões passam a baixá-lo, sem precisar mudar nada no código.

---

## Design system

Tudo sai de `src/styles/tokens.css`.

**Cor** — base neutra com um único acento. Preto tinta `#0B0B0C`, papel
`#F3F2EE`, acento vermilion. O tema claro e o escuro têm paletas próprias:
não é inversão de cores, os fios e o acento são recalibrados em cada um.
Todas as combinações de texto passam em contraste AA.

**Tipografia** — três famílias com papéis distintos:
Space Grotesk (display), Inter (leitura), JetBrains Mono (metadados, rótulos,
índices). Uma única requisição de fonte, pesos mínimos.

**Grid** — 12 colunas no desktop, 8 no tablet, 4 no mobile. Margens e
medianizes fluidas. O grid rege a composição sem aparecer.

**Movimento** — entrada por scroll, revelação do hero letra a letra, preview do
projeto seguindo o cursor e cursor com etiqueta. Tudo respeita
`prefers-reduced-motion`, e o cursor autoral só existe em ponteiro fino.

---

## Decisões técnicas

**Por que não React/Next.** O site é servido pelo GitHub Pages direto da raiz,
sem build na nuvem. HTML gerado e commitado dá SEO real por página, primeira
pintura sem hidratação e deploy sem CI. O que se ganharia com um framework —
componentização e dados centralizados — já está resolvido pelos templates e
pelo `src/data/`.

**Progressive enhancement.** Sem JavaScript o site continua inteiro: os textos
não dependem de reveal, o pipeline do AI Lab mostra todas as etapas empilhadas,
os filtros somem e a grade aparece completa, e o formulário de contato tem os
canais diretos logo ao lado.

**Formulário sem servidor.** O formulário monta a mensagem e entrega ao
WhatsApp ou ao cliente de e-mail. Nenhum dado trafega ou é armazenado.

**Acessibilidade.** HTML semântico, navegação por teclado com foco visível,
menu mobile com foco preso e Esc, abas do AI Lab no padrão ARIA, skip link,
alvos de toque adequados e contraste AA nos dois temas.

---

## Estrutura

```
build.js                  gerador (Node, zero dependências)
src/
  data/
    site.js               identidade, contatos, navegação, SEO
    projects.js           projetos e cases
    profile.js            manifesto, especialidades, processo, experiência, FAQ
    ailab.js              pipeline e experimentos de IA
  templates/
    layout.js             shell: head, header, footer, JSON-LD
    components.js         componentes reutilizáveis
    pages/                uma função por página
  styles/                 tokens → base → layout → components → sections → pages
  scripts/                theme, nav, reveal, cursor, projects, stepper, form, cv, clock
assets/
  images/                 retrato, capas de projeto, AI Lab
  icons/                  favicon
  cv/                     currículo em PDF (a subir)
```

`style.css` e `script.js` na raiz são bundles gerados, com hash de conteúdo na
URL para cache busting.
