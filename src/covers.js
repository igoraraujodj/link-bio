'use strict';

/* =====================================================================
   CAPAS GRÁFICAS

   Enquanto as fotos das peças não sobem, cada case tem uma capa
   desenhada a partir do próprio conteúdo: sono vira curva, telecom vira
   sinal, sistema visual vira módulo, IA vira campo de pontos.

   Duas regras que guiaram o desenho:

   1. Isto é direção de arte do site, não é a peça entregue ao cliente.
      Por isso nenhuma capa imita a marca do cliente nem se apresenta
      como aplicação real: são composições da linguagem daqui, no
      espírito de uma capa editorial.

   2. A mesma imagem é cortada em 4:5 nos cards e em 16:9 no hero do
      case e no destaque. Um corte 4:5 tira 20% da largura, um 16:9 tira
      44% da altura. Então o desenho vive inteiro dentro de
      x 120..1080 e y 264..936 e é centrado, para atravessar os dois
      cortes sem perder a ideia.

      A capa não tem texto nenhum dentro, e isso é decisão, não descuido.
      A grade da home recorta em 4:3, os cards em 4:5, o hero em 16:9;
      cada proporção come uma borda diferente, e um rótulo no canto
      acabava cortado ao meio em alguma delas (chegou a sair "PAPS" no
      lugar de "CPAPS"). Além disso ele seria repetido: número, cliente,
      categoria e título já estão escritos ao lado da imagem, em texto
      de verdade, que um leitor de tela lê e um buscador indexa. Sem
      texto, a composição é centrada e atravessa qualquer corte.

   Cada capa é um SVG de poucos kB, nítido em qualquer tela, com fundo
   próprio (ela não muda com o tema, então precisa se resolver sozinha
   tanto sobre papel quanto sobre tinta).
   ===================================================================== */

/* Marcador que autoriza a build a regerar o arquivo. Uma capa sem esta
   linha foi colocada por uma pessoa e nunca é sobrescrita. */
const MARK = '<!-- gerado por build.js: apague este comentario para congelar o arquivo -->';

const INK = '#0B0B0C';

/* Paleta das capas. Cada projeto ganha fundo, traço e acento próprios.
   O acento é o ponto focal de cada composição, e o teste de corte
   confere que ele sobrevive tanto ao 4:5 quanto ao 16:9. */
const SKINS = {
  'cpaps-mes-do-sono':    { bg: '#141A3A', fg: '#C9D2FF', hi: '#D9F63E' },
  'avante-telecom':       { bg: '#0E3A34', fg: '#9FE3D2', hi: '#D9F63E' },
  'dom-campanholi':       { bg: '#E8DCC8', fg: '#4A3A22', hi: '#6B3A12' },
  'rn-telecom':           { bg: '#1B1B1F', fg: '#BFC3CC', hi: '#D9F63E' },
  'top-burger':           { bg: '#B3341C', fg: '#FFE0C2', hi: '#FFC44D' },
  'cpaps-ecommerce':      { bg: '#C7D8F2', fg: '#233A5C', hi: '#0B3B8C' },
  /* Roxo bem escuro, não preto: com #0B0B0C o card perdia a silhueta
     contra o fundo do tema escuro, que é exatamente essa cor. */
  'ai-direcao-de-imagem': { bg: '#171327', fg: '#9C8BD4', hi: '#D9F63E' },
};

const FALLBACK = { bg: '#E8DCC8', fg: '#4A4A42', hi: INK };

/* Gerador determinístico: a mesma semente devolve sempre a mesma
   sequência. Sem isso cada build produziria um ruído diferente e o
   arquivo mudaria sozinho, quebrando a verificação de build limpa. */
function rng(seed) {
  let s = seed >>> 0;
  return function () {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

/* ------------------------------------------------------------------ */
/* 01 · CPAPS, Mês do Sono — a curva de um ciclo de sono               */
/* Ondas que descem e se alargam, do desperto ao sono profundo.        */
function sono(s) {
  const waves = [];
  for (let i = 0; i < 8; i++) {
    const base = 336 + i * 68;
    /* a onda vai ficando mais funda e mais lenta da esquerda para a
       direita: a noite descendo para o sono profundo */
    const amp = 30 + i * 9;
    const freq = 2.6 - i * 0.28;
    const pts = [];
    for (let x = 120; x <= 1080; x += 10) {
      const k = (x - 120) / 960;
      const y = base + Math.sin(k * Math.PI * freq + i * 0.55) * amp * (0.3 + k * 0.7);
      pts.push(x + ',' + y.toFixed(1));
    }
    waves.push(`<polyline points="${pts.join(' ')}" fill="none" stroke="${s.fg}" stroke-width="${(6.4 - i * 0.42).toFixed(2)}" stroke-linecap="round" stroke-linejoin="round" opacity="${(0.95 - i * 0.085).toFixed(2)}"/>`);
  }
  /* Lua: o único elemento cheio, e o que dá o assunto à capa. Por isso
     ela mora dentro da faixa que sobrevive ao corte 16:9 (y 264..936);
     mais para cima ela sumia no hero do case e sobrava só a onda. */
  return `
  <circle cx="880" cy="382" r="88" fill="${s.hi}" opacity=".95"/>
  <circle cx="838" cy="356" r="82" fill="${s.bg}"/>
  ${waves.join('\n  ')}`;
}

/* ------------------------------------------------------------------ */
/* 02 · Avante Telecom — sinal saindo de um ponto                      */
function sinal(s) {
  const arcs = [];
  for (let i = 0; i < 11; i++) {
    const r = 110 + i * 66;
    const op = (0.85 - i * 0.062).toFixed(2);
    /* arcos abertos para a direita, como emissão direcional */
    arcs.push(`<path d="M 240 ${600 - r} A ${r} ${r} 0 0 1 240 ${600 + r}" fill="none" stroke="${s.fg}" stroke-width="${(7.5 - i * 0.42).toFixed(2)}" stroke-linecap="round" opacity="${op}"/>`);
  }
  return `
  ${arcs.join('\n  ')}
  <circle cx="240" cy="600" r="34" fill="${s.hi}"/>
  <circle cx="240" cy="600" r="68" fill="none" stroke="${s.hi}" stroke-width="3" opacity=".55"/>`;
}

/* ------------------------------------------------------------------ */
/* 03 · Dom Campanholi — letra em serifa, marca como forma             */
function marca(s) {
  /* Construção de marca: a letra desenhada sobre o próprio andaime que
     a constrói. As guias ficam visíveis de propósito, é isso que separa
     uma marca de um logotipo desenhado no olho. */
  const guias = [320, 440, 600, 760, 880]
    .map(function (x) { return `<line x1="${x}" y1="300" x2="${x}" y2="900" stroke="${s.fg}" stroke-width="1" opacity=".18"/>`; })
    .concat([380, 480, 600, 720, 820].map(function (y) {
      return `<line x1="220" y1="${y}" x2="980" y2="${y}" stroke="${s.fg}" stroke-width="1" opacity=".18"/>`;
    }))
    .join('\n  ');

  return `
  <rect x="220" y="300" width="760" height="600" rx="20" fill="none" stroke="${s.fg}" stroke-width="2.5" opacity=".5"/>
  ${guias}
  <circle cx="600" cy="600" r="252" fill="none" stroke="${s.fg}" stroke-width="2" opacity=".4"/>
  <text x="600" y="756" text-anchor="middle" font-family="Georgia,'Times New Roman',serif" font-style="italic" font-size="470" fill="${s.hi}">D</text>
  <line x1="220" y1="820" x2="980" y2="820" stroke="${s.hi}" stroke-width="3" opacity=".7"/>`;
}

/* ------------------------------------------------------------------ */
/* 04 · RN Telecom — o sistema como módulos de peso variável           */
function modulos(s) {
  const r = rng(4);
  const cells = [];
  const cols = 6;
  const rows = 4;
  const w = 128;
  const h = 128;
  const x0 = 600 - (cols * w + (cols - 1) * 16) / 2;
  const y0 = 600 - (rows * h + (rows - 1) * 16) / 2;
  for (let ry = 0; ry < rows; ry++) {
    for (let cx = 0; cx < cols; cx++) {
      const x = x0 + cx * (w + 16);
      const y = y0 + ry * (h + 16);
      const v = r();
      if (v > 0.78) {
        cells.push(`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="34" fill="${s.hi}"/>`);
      } else if (v > 0.5) {
        cells.push(`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="34" fill="${s.fg}" opacity=".38"/>`);
      } else {
        cells.push(`<rect x="${x + 1}" y="${y + 1}" width="${w - 2}" height="${h - 2}" rx="33" fill="none" stroke="${s.fg}" stroke-width="2" opacity=".4"/>`);
      }
    }
  }
  return '\n  ' + cells.join('\n  ');
}

/* ------------------------------------------------------------------ */
/* 05 · Top Burger — camadas empilhadas                                */
function camadas(s) {
  const bars = [
    { y: 352, w: 620, h: 92, r: 46, fill: s.fg, op: '.95' },
    { y: 466, w: 700, h: 56, r: 28, fill: s.hi, op: '1' },
    { y: 544, w: 660, h: 74, r: 24, fill: s.fg, op: '.55' },
    { y: 640, w: 720, h: 58, r: 26, fill: s.hi, op: '.8' },
    { y: 720, w: 664, h: 70, r: 22, fill: s.fg, op: '.7' },
    { y: 812, w: 620, h: 96, r: 48, fill: s.fg, op: '.95' },
  ];
  return '\n  ' + bars
    .map(function (b) {
      return `<rect x="${600 - b.w / 2}" y="${b.y}" width="${b.w}" height="${b.h}" rx="${b.r}" fill="${b.fill}" opacity="${b.op}"/>`;
    })
    .join('\n  ');
}

/* ------------------------------------------------------------------ */
/* 06 · CPAPS e-commerce — a jornada até a conversão                   */
function jornada(s) {
  const steps = [
    { x: 200, w: 190, h: 250 },
    { x: 430, w: 190, h: 200 },
    { x: 660, w: 190, h: 156 },
    { x: 890, w: 120, h: 120 },
  ];
  const blocks = steps
    .map(function (b, i) {
      const y = 600 - b.h / 2;
      const last = i === steps.length - 1;
      return `<rect x="${b.x}" y="${y}" width="${b.w}" height="${b.h}" rx="28" fill="${last ? s.hi : s.fg}" opacity="${last ? '1' : (0.34 + i * 0.14).toFixed(2)}"/>`;
    })
    .join('\n  ');
  const links = [0, 1, 2]
    .map(function (i) {
      const a = steps[i].x + steps[i].w;
      const b = steps[i + 1].x;
      return `<line x1="${a + 12}" y1="600" x2="${b - 12}" y2="600" stroke="${s.fg}" stroke-width="2" stroke-dasharray="6 10" opacity=".5"/>`;
    })
    .join('\n  ');
  return `\n  ${blocks}\n  ${links}
  <circle cx="950" cy="600" r="26" fill="${s.bg}"/>
  <path d="M936 600l10 11 20-24" fill="none" stroke="${s.hi}" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>`;
}

/* ------------------------------------------------------------------ */
/* 07 · IA — campo generativo que se organiza da esquerda à direita    */
function campo(s) {
  const r = rng(7);
  const out = [];
  const COLS = 13;
  const ROWS = 9;
  const step = 74;
  const x0 = 600 - ((COLS - 1) * step) / 2;
  const y0 = 600 - ((ROWS - 1) * step) / 2;

  /* A leitura é da esquerda para a direita: a IA gera solto e a direção
     de arte vai puxando para a grade. `ordem` é o quanto aquela coluna
     já está organizada, e governa desvio, forma e cor ao mesmo tempo. */
  for (let c = 0; c < COLS; c++) {
    const ordem = Math.pow(c / (COLS - 1), 1.5);
    for (let l = 0; l < ROWS; l++) {
      const gx = x0 + c * step;
      const gy = y0 + l * step;
      const solta = 1 - ordem;
      const x = gx + (r() - 0.5) * step * 1.5 * solta;
      const y = gy + (r() - 0.5) * step * 1.5 * solta;
      const op = (0.2 + ordem * 0.7).toFixed(2);

      if (ordem > 0.72) {
        /* já organizado: vira módulo, e os últimos ganham o acento */
        const d = 34 + ordem * 16;
        const fill = c >= COLS - 2 ? s.hi : s.fg;
        out.push(`<rect x="${(x - d / 2).toFixed(1)}" y="${(y - d / 2).toFixed(1)}" width="${d.toFixed(1)}" height="${d.toFixed(1)}" rx="${(d * 0.3).toFixed(1)}" fill="${fill}" opacity="${op}"/>`);
      } else {
        const rad = (4 + ordem * 12).toFixed(1);
        out.push(`<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${rad}" fill="${s.fg}" opacity="${op}"/>`);
      }
    }
  }
  return '\n  ' + out.join('\n  ');
}

const ART = {
  'cpaps-mes-do-sono': sono,
  'avante-telecom': sinal,
  'dom-campanholi': marca,
  'rn-telecom': modulos,
  'top-burger': camadas,
  'cpaps-ecommerce': jornada,
  'ai-direcao-de-imagem': campo,
};

/* Se um projeto novo entrar em projects.js sem arte própria aqui, ele
   cai no campo generativo em vez de quebrar a build. */
function art(project, skin) {
  return (ART[project.slug] || campo)(skin);
}

function cover(project) {
  const skin = SKINS[project.slug] || FALLBACK;

  /* Quem descreve a imagem é o alt do <img> na página, que muda de
     acordo com o contexto de uso. O aria-label aqui é só a rede de
     segurança para quando o SVG é aberto sozinho. */
  return `${MARK}
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 1200" width="1200" height="1200" role="img" aria-label="Capa gráfica do case ${project.client}, ${project.title}">
  <rect width="1200" height="1200" fill="${skin.bg}"/>
  <g>${art(project, skin)}
  </g>

</svg>
`;
}

module.exports = { cover: cover, MARK: MARK };
