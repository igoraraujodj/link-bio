#!/usr/bin/env node
'use strict';

/* =====================================================================
   BUILD — gerador estático, zero dependências.

     node build.js

   Lê src/data + src/templates e escreve os HTML na raiz, prontos para o
   GitHub Pages servir sem nenhuma etapa extra. CSS e JS são
   concatenados em um arquivo cada, com hash de conteúdo na URL para
   cache busting.

   Saem dois arquivos de página: index.html, que é o site, e 404.html,
   que existe só para o Pages não cair na tela de erro dele.

   Para publicar uma alteração de conteúdo: edite src/data/*.js, rode
   `node build.js`, confira e faça commit dos arquivos gerados.
   ===================================================================== */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const site = require('./src/data/site');
const projects = require('./src/data/projects').projects;
const profile = require('./src/data/profile');
const layout = require('./src/templates/layout');
const covers = require('./src/covers');

const ROOT = __dirname;
const read = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');
const hash = (s) => crypto.createHash('sha1').update(s).digest('hex').slice(0, 8);

function write(rel, content) {
  const dest = path.join(ROOT, rel);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.writeFileSync(dest, content);
  return rel;
}

/* ---------------------------------------------------------------------
   1. Bundles — ordem explícita, sem magia de glob.
   --------------------------------------------------------------------- */
const STYLES = ['tokens.css', 'base.css', 'site.css'];

/* Dois scripts. O tema, porque alternar claro e escuro não tem como ser
   CSS, e a entrada por scroll, porque é o que dá vida à rolagem. Todo o
   resto do comportamento que o site tinha (menu de tela cheia, filtro
   de categoria, abas, carrossel, visualizador, cursor autoral, relógio,
   parallax) existia para servir páginas e componentes que não existem
   mais. */
const SCRIPTS = ['theme.js', 'reveal.js'];

function bundle(dir, files, banner) {
  return (
    banner +
    files
      .map(function (f) {
        return '\n/* ---- ' + f + ' ---- */\n' + read(path.join('src', dir, f)).trim() + '\n';
      })
      .join('')
  );
}

/* ---------------------------------------------------------------------
   1b. Minificação.

   O código-fonte é comentado com generosidade de propósito: um site sem
   framework se sustenta pela explicação do porquê de cada decisão. Mas
   um quarto do CSS e um terço do JS que chegavam ao navegador eram
   comentário, e o leitor do site não tem nada a ganhar baixando isso.

   Não entra dependência: o projeto não tem package.json nem etapa de
   instalação, e o CI só roda `node build.js`. Então são dois
   minificadores conservadores escritos aqui, que preferem sempre errar
   para o lado de mexer menos.
   --------------------------------------------------------------------- */

/* Troca cada string por um marcador antes de mexer em espaço, e devolve
   depois. Sem isto, um ponto e vírgula ou uma chave dentro de aspas
   seria tratado como sintaxe.

   O delimitador é NUL, que não pode aparecer em CSS. Um marcador feito
   de espaço e dígito, como ` 1 `, seria reencontrado dentro de uma
   declaração legítima como `flex: 1 1 auto`, e a restauração trocaria o
   valor errado. Escrito como escape e não como byte literal: NUL cru no
   arquivo faz o git tratar build.js como binário e o grep parar de
   funcionar nele. */
const SENTINELA = '\u0000';
const RE_SENTINELA = /\u0000(\d+)\u0000/g;
function protectStrings(src) {
  const held = [];
  let out = '';
  let i = 0;
  while (i < src.length) {
    const c = src[i];
    if (c === '"' || c === "'") {
      let s = c;
      i++;
      while (i < src.length) {
        if (src[i] === '\\') { s += src[i] + (src[i + 1] || ''); i += 2; continue; }
        s += src[i];
        const fim = src[i] === c;
        i++;
        if (fim) break;
      }
      out += SENTINELA + held.push(s) + SENTINELA;
      continue;
    }
    out += c;
    i++;
  }
  return {
    text: out,
    restore: function (s) {
      return s.replace(RE_SENTINELA, function (_, n) { return held[n - 1]; });
    },
  };
}

/* Comentário e string têm que ser reconhecidos na MESMA varredura.

   Tentei antes fazer em duas etapas e as duas ordens estão erradas:

   - tirando comentário primeiro, uma abertura de comentário dentro de
     aspas comeria regra de verdade até o próximo fechamento;
   - protegendo string primeiro, o apóstrofo de um comentário em
     português (este CSS tem "marca d'água") vira abertura de string e
     engole todo o arquivo até a próxima aspa. Foi o que aconteceu: em
     vez de minificar, metade do CSS saía intacta.

   Uma varredura só, decidindo caractere a caractere, não tem esse
   problema porque dentro de comentário aspas não significam nada e
   dentro de string barra-asterisco não significa nada. */
function stripCssComments(src) {
  let out = '';
  let i = 0;
  while (i < src.length) {
    const c = src[i];
    if (c === '/' && src[i + 1] === '*') {
      i += 2;
      while (i < src.length && !(src[i] === '*' && src[i + 1] === '/')) i++;
      i += 2;
      /* o comentário vira um espaço, e não nada: colar os dois lados
         poderia fundir dois tokens que estavam separados só por ele */
      out += ' ';
      continue;
    }
    if (c === '"' || c === "'") {
      out += c;
      i++;
      while (i < src.length) {
        if (src[i] === '\\') { out += src[i] + (src[i + 1] || ''); i += 2; continue; }
        out += src[i];
        const fim = src[i] === c;
        i++;
        if (fim) break;
      }
      continue;
    }
    out += c;
    i++;
  }
  return out;
}

function minifyCss(src) {
  const guard = protectStrings(stripCssComments(src));

  let s = guard.text
    .replace(/\s+/g, ' ')
    /* Só o espaço colado em chave, ponto e vírgula, dois pontos e
       vírgula é removido.

       O espaço ao redor de + e de - fica de fora de propósito: dentro
       de calc() ele é obrigatório, e `calc(100% - 18px)` sem espaço é
       declaração inválida que o navegador descarta. Pelo mesmo motivo o
       combinador + em seletor também não é tocado: distinguir um do
       outro exigiria entender a gramática, e o ganho não paga o
       risco. */
    .replace(/\s*([{};,:])\s*/g, '$1')
    .replace(/;}/g, '}')
    .trim();

  return guard.restore(s);
}

/* Um `/` em JavaScript pode abrir uma expressão regular ou ser divisão.
   O que decide é o token anterior: depois de identificador, número ou
   fechamento de parêntese ou colchete, é divisão; caso contrário,
   regex. */
function regexPodeComecar(anterior) {
  return !/[A-Za-z0-9_$)\]]/.test(anterior);
}

function minifyJs(src) {
  let out = '';
  let i = 0;
  let anterior = '';

  while (i < src.length) {
    const c = src[i];
    const d = src[i + 1];

    if (c === '/' && d === '/') {
      while (i < src.length && src[i] !== '\n') i++;
      continue;
    }
    if (c === '/' && d === '*') {
      i += 2;
      while (i < src.length && !(src[i] === '*' && src[i + 1] === '/')) i++;
      i += 2;
      continue;
    }
    if (c === '"' || c === "'" || c === '`') {
      out += c;
      i++;
      while (i < src.length) {
        if (src[i] === '\\') { out += src[i] + (src[i + 1] || ''); i += 2; continue; }
        out += src[i];
        const fim = src[i] === c;
        i++;
        if (fim) break;
      }
      anterior = c;
      continue;
    }
    if (c === '/' && regexPodeComecar(anterior)) {
      out += c;
      i++;
      let emClasse = false;
      while (i < src.length) {
        if (src[i] === '\\') { out += src[i] + (src[i + 1] || ''); i += 2; continue; }
        if (src[i] === '[') emClasse = true;
        else if (src[i] === ']') emClasse = false;
        out += src[i];
        const fim = src[i] === '/' && !emClasse;
        i++;
        if (fim) break;
      }
      while (i < src.length && /[gimsuy]/.test(src[i])) { out += src[i]; i++; }
      anterior = '/';
      continue;
    }

    out += c;
    if (!/\s/.test(c)) anterior = c;
    i++;
  }

  /* Tira indentação e linhas vazias, mas mantém as quebras de linha.
     Juntar tudo numa linha só mudaria o programa: sem o `\n`, a
     inserção automática de ponto e vírgula deixa de acontecer onde o
     código conta com ela. */
  return out
    .split('\n')
    .map(function (l) { return l.trim(); })
    .filter(function (l) { return l.length; })
    .join('\n');
}

const cssFonte = bundle('styles', STYLES, '/* Igor Araujo — gerado por build.js. Edite src/styles/, não este arquivo. */\n');
const jsFonte = bundle(
  'scripts',
  SCRIPTS,
  "'use strict';\n/* Igor Araujo — gerado por build.js. Edite src/scripts/, não este arquivo. */\n"
);

const AVISO = '/* Igor Araujo. Gerado por build.js a partir de src/. Nao edite este arquivo. */\n';
const css = AVISO + minifyCss(cssFonte);
const js = AVISO + minifyJs(jsFonte);

/* O hash sai do arquivo final, que é o que o navegador baixa. */
const assets = { css: hash(css), js: hash(js) };
const economia = {
  css: [cssFonte.length, css.length],
  js: [jsFonte.length, js.length],
};

/* ---------------------------------------------------------------------
   2. Capas de projeto.

   Ordem de preferência, por projeto:

     1. Uma foto real em assets/images/work/<slug>.<jpg|png|webp|avif>.
        Basta o Igor jogar o arquivo na pasta: a build acha sozinha e
        passa a usar, sem editar nenhum dado.
     2. Um SVG que alguém colocou ali à mão (sem o marcador da build).
     3. A capa gráfica desenhada em src/covers.js, regerada a cada build.

   O marcador existe justamente para separar o caso 2 do caso 3: a build
   só sobrescreve arquivo que ela mesma escreveu.
   --------------------------------------------------------------------- */
const RASTER = ['.jpg', '.jpeg', '.png', '.webp', '.avif'];
const WORK_DIR = 'assets/images/work';

let coversMade = 0;
let coversReal = 0;

projects.forEach(function (project) {
  const real = RASTER.map(function (ext) { return WORK_DIR + '/' + project.slug + ext; })
    .find(function (rel) { return fs.existsSync(path.join(ROOT, rel)); });

  if (real) {
    project.cover = real;
    coversReal++;
    return;
  }

  const rel = WORK_DIR + '/' + project.slug + '.svg';
  const dest = path.join(ROOT, rel);
  project.cover = rel;

  if (fs.existsSync(dest) && fs.readFileSync(dest, 'utf8').indexOf(covers.MARK) === -1) return;

  const svg = covers.cover(project);
  /* Só escreve se mudou: assim a build não suja o git a cada rodada. */
  if (!fs.existsSync(dest) || fs.readFileSync(dest, 'utf8') !== svg) {
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.writeFileSync(dest, svg);
    coversMade++;
  }
});

/* ---------------------------------------------------------------------
   3. Dados estruturados.
   --------------------------------------------------------------------- */
const personLd = {
  '@type': 'Person',
  '@id': site.baseUrl + '#igor',
  name: site.name,
  jobTitle: site.role,
  description: site.seo.description,
  url: site.baseUrl,
  image: site.baseUrl + site.seo.image,
  email: 'mailto:' + site.contacts.email,
  address: { '@type': 'PostalAddress', addressLocality: 'Vitória', addressRegion: 'ES', addressCountry: 'BR' },
  knowsAbout: ['Branding', 'Identidade visual', 'Direção de arte', 'UI/UX', 'Growth design', 'Marketing digital', 'Inteligência artificial generativa'],
  sameAs: [site.contacts.linkedin, site.contacts.behance, site.contacts.instagram],
};

/* ---------------------------------------------------------------------
   4. Páginas.
   --------------------------------------------------------------------- */
const pages = [
  {
    id: 'home',
    path: 'index.html',
    title: site.seo.title,
    description: site.seo.description,
    jsonLd: {
      '@context': 'https://schema.org',
      '@graph': [
        personLd,
        {
          '@type': 'WebSite',
          url: site.baseUrl,
          name: 'Portfólio de ' + site.name,
          inLanguage: site.lang,
          publisher: { '@id': site.baseUrl + '#igor' },
        },
        {
          '@type': 'ItemList',
          name: 'Projetos',
          itemListElement: projects.map(function (p, i) {
            return { '@type': 'ListItem', position: i + 1, name: p.client + ': ' + p.title };
          }),
        },
      ],
    },
    render: require('./src/templates/pages/home'),
  },
  {
    id: 'not-found',
    path: '404.html',
    noindex: true,
    /* As âncoras do header não levam a nada fora da home. */
    anchors: false,
    title: 'Página não encontrada | ' + site.name,
    description: 'A página que você procurava não existe. Volte ao portfólio de ' + site.name + '.',
    jsonLd: { '@context': 'https://schema.org', '@type': 'WebPage', name: '404' },
    render: require('./src/templates/pages/notfound'),
  },
];

/* ---------------------------------------------------------------------
   5. Escrita
   --------------------------------------------------------------------- */
const written = [];

written.push(write('style.css', css));
written.push(write('script.js', js));

pages.forEach(function (page) {
  page.body = page.render({ site: site, projects: projects, profile: profile });
  written.push(write(page.path, layout.render(page, assets)));
});

/* Sitemap — só páginas indexáveis, o que hoje é uma.

   Sem `lastmod`, de propósito. A build precisa ser determinística para
   o CI conferir que os arquivos gerados batem com src/, e qualquer data
   automática quebra isso:

     - "hoje" muda a cada build;
     - a data do último commit é circular, porque o commit que grava o
       sitemap vira o último commit, então o build seguinte gera outra
       data. Foi exatamente assim que o CI quebrou uma vez.

   `lastmod` é opcional no protocolo e tratado como dica fraca pelos
   buscadores, então sai barato. */
const sitemap =
  '<?xml version="1.0" encoding="UTF-8"?>\n' +
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
  pages
    .filter(function (p) { return !p.noindex; })
    .map(function (p) {
      const loc = site.baseUrl + (p.path === 'index.html' ? '' : p.path);
      return `  <url>\n    <loc>${loc}</loc>\n    <priority>1.0</priority>\n  </url>`;
    })
    .join('\n') +
  '\n</urlset>\n';
written.push(write('sitemap.xml', sitemap));

written.push(
  write('robots.txt', 'User-agent: *\nAllow: /\n\nSitemap: ' + site.baseUrl + 'sitemap.xml\n')
);

/* ---------------------------------------------------------------------
   6. Relatório
   --------------------------------------------------------------------- */
const kb = (n) => (n / 1024).toFixed(1) + ' kB';

console.log('\n  Igor Araujo — build\n  ' + '─'.repeat(52));
written.forEach(function (f) {
  console.log('  ✓ ' + f.padEnd(38) + kb(fs.statSync(path.join(ROOT, f)).size).padStart(10));
});
console.log('  ' + '─'.repeat(52));
console.log('  ' + pages.length + ' páginas · ' + projects.length + ' projetos · css ' + assets.css + ' · js ' + assets.js);

const emKb = function (n) { return (n / 1024).toFixed(0) + ' kB'; };
const corte = function (par) { return Math.round(100 - (100 * par[1]) / par[0]) + '%'; };
console.log(
  '  minificado: css ' + emKb(economia.css[0]) + ' para ' + emKb(economia.css[1]) + ' (menos ' + corte(economia.css) + ')' +
  ' · js ' + emKb(economia.js[0]) + ' para ' + emKb(economia.js[1]) + ' (menos ' + corte(economia.js) + ')'
);
if (coversMade) console.log('  ' + coversMade + ' capa(s) grafica(s) escrita(s) em ' + WORK_DIR + '/');
if (coversReal) console.log('  ' + coversReal + ' capa(s) com imagem real');
if (coversReal < projects.length) {
  console.log('  ' + (projects.length - coversReal) + ' projeto(s) ainda com capa gerada: solte a foto em ' + WORK_DIR + '/<slug>.jpg');
}
console.log('');
