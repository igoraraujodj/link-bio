# Casa de Dois

Sistema de organização do casal — Igor e Karen.
Agenda compartilhada, kanban de tarefas, finanças, metas, compras, hábitos e memórias.

Não precisa instalar nada, não tem build, não tem dependência. É HTML, CSS e
JavaScript com módulos nativos.

---

## Estado atual: protótipo

**Os dados ficam guardados só no navegador de quem abriu.** O que o Igor
digitar no notebook dele não aparece no celular da Karen. Isso é uma escolha
consciente de etapa, não um esquecimento: dava pra ver todas as telas
funcionando antes de decidir a estrutura do banco.

A camada de dados está isolada atrás de um adaptador justamente por causa
disso. Ligar a sincronização de verdade é escrever **um arquivo** e trocar
**uma linha** em `js/app.js`. O passo a passo completo — tabelas, políticas de
segurança, login — está em `js/store/adapter-supabase.example.js`.

Enquanto isso: **Ajustes → Exportar** gera um `.json` com tudo. É o backup e
também o jeito de passar os dados de um aparelho pro outro.

---

## Os campos

| Tela | O que faz |
| --- | --- |
| **Início** | O que importa hoje: agenda dos dois, tarefas vencendo, saldo do mês, metas, compras e hábitos |
| **Agenda** | Calendário do mês. Ponto colorido por pessoa, dia selecionado abre ao lado |
| **Tarefas** | Kanban: Backlog → Próxima → Em andamento → Concluída |
| **Finanças** | Entradas, saídas, contas fixas, gasto por categoria e o acerto do mês |
| **Metas** | Ideia → Em andamento → Concluída, com progresso e prazo |
| **Compras** | Mercado, casa e farmácia. Digita e dá Enter |
| **Hábitos** | Sete dias por linha, com sequência |
| **Memórias** | Linha do tempo com foto e data |
| **Ajustes** | Tema, meta de reserva, backup e apagar tudo |

### Campo Igor / Campo Karen

O seletor no topo (**Igor · Karen · Os dois**) é o que separa os campos de cada
um. Ele filtra Agenda, Tarefas e Hábitos, e define o dono padrão do que for
criado a partir dali.

Todo registro tem um escopo: `igor`, `karen` ou `nos`. Estando no campo de uma
pessoa, aparecem as coisas dela **mais** as compartilhadas — porque "jantar dos
dois" precisa estar nas duas agendas sem ser cadastrado duas vezes.

Finanças, Metas, Compras e Memórias não são filtradas: são do casal por
natureza.

### O acerto do mês

Cada despesa guarda duas informações diferentes: **quem pagou** e **de quem é a
despesa**. A Karen pode pagar o mercado que é meio a meio; o Igor pode pagar a
academia que é só dela. No fim do mês a tela de Finanças soma o que cada um
pagou, compara com o que cada um devia, e diz quem deve pra quem.

### Contas fixas

Um lançamento marcado como "todo mês" existe **uma vez** no banco. As
ocorrências dos meses seguintes são calculadas na hora. Ninguém precisa lançar
o aluguel doze vezes por ano, e mudar o valor conserta a série inteira.

---

## Rodar localmente

Módulos ES não funcionam abrindo o arquivo direto (`file://`). Precisa de um
servidor:

```bash
python3 -m http.server 8000
# abre http://localhost:8000
```

---

## Publicar

O projeto é estático puro: qualquer hospedagem serve, sem passo de build.

**Vercel** (recomendado — funciona com repositório privado no plano grátis):
importe o repositório, deixe *Framework Preset* em **Other**, build command
vazio, output directory `.`. Pronto.

**GitHub Pages** também serve, mas publicar repositório privado no Pages exige
plano pago. Num repositório público, o código fica visível — os dados não,
porque vivem no navegador de vocês.

Enquanto não existir login, quem tiver o endereço abre o app (vazio). Se isso
incomodar antes do Supabase entrar, a Vercel tem proteção por senha.

---

## Instalar no celular

O app é uma PWA. No Chrome (Android): menu → *Adicionar à tela inicial*. No
Safari (iPhone): compartilhar → *Adicionar à Tela de Início*. Vira ícone,
abre sem barra de navegador e funciona sem internet.

O service worker guarda só a casca — os dados nunca passam por ele.

---

## Estrutura

```
index.html                       casca da página
app.css                          folha única: tokens → base → casca → componentes
manifest.webmanifest             PWA
sw.js                            offline
js/
  app.js                         arranque, navegação, seletor de pessoa, tema
  router.js                      rotas por hash (#/agenda)
  seed.js                        dados de exemplo, fictícios
  store/
    index.js                     store: insert, update, remove, subscribe
    schema.js                    modelo de dados e listas fixas
    adapter-local.js             persistência em localStorage
    adapter-supabase.example.js  o mapa da virada pro banco de verdade
  domain/queries.js              consultas (totais, filtros, acerto, sequências)
  ui/dom.js                      helpers de DOM
  ui/modal.js                    motor de formulário usado por todas as telas
  utils/date.js                  datas como 'YYYY-MM-DD', sem armadilha de fuso
  utils/money.js                 dinheiro em centavos, formatação em BRL
  views/*.js                     uma tela por arquivo
```

**Dinheiro é guardado em centavos.** Ponto flutuante em finanças faz
`0.1 + 0.2` virar `0.30000000000000004`, e isso vira erro de saldo.

**Data é string, nunca `Date` cru.** `new Date('2026-03-01')` é interpretado
como UTC e volta um dia em fuso negativo. Toda conversão passa por
`utils/date.js`.

**Uma view por arquivo, um motor de formulário pra todas.** Cada tela descreve
os campos que quer; validação, foco, teclado e a folha que sobe no mobile
moram em `ui/modal.js`.

---

## O que falta

- [ ] **Sincronizar entre os dois** — Supabase, o passo que transforma isso num sistema de verdade
- [ ] **Login** — hoje quem tem o endereço abre. Só faz sentido junto com o Supabase
- [ ] Notificação de compromisso e de conta a vencer
- [ ] Anexar comprovante nos lançamentos
- [ ] Vincular meta a lançamentos, pra barra de progresso encher sozinha
