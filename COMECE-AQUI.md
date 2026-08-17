# Comece aqui

Guia único, sem termo técnico. Se você só tem 2 minutos, leia a seção
**"O que falta você fazer"** e ignore o resto.

**No ar:** https://casa-igor-karen-mktigor2022-gmailcoms-projects.vercel.app

---

## O que é isto

Um sistema pra vocês dois, que abre no celular e no computador:

**Início** · o que importa hoje
**Agenda** · calendário dos dois, com cor por pessoa
**Tarefas** · quadro que arrasta: Backlog → Próxima → Em andamento → Concluída
**Finanças** · lê os números do seu bot do Telegram
**Metas** · o que vocês querem alcançar
**Compras** · lista de mercado e casa
**Hábitos** · marcar o dia, com sequência
**Memórias** · linha do tempo com foto

O botão **Igor · Karen · Os dois** lá em cima separa o que é de cada um.

---

## O que falta você fazer

São três coisas. A primeira é a única que muda algo de verdade.

### 1. Ligar o bot na aba Finanças  ⏱ 5 min

Hoje a aba Finanças abre no modo manual. Pra ela mostrar os números que o
seu bot já lança na planilha:

**a)** Abra o Apps Script (projeto *Financas Casa*), arquivo **`Código.gs`**.
Procure por `createTemplateFromFile('Painel')` — só existe um. Cole o
bloco de 6 linhas do arquivo `integracao/Api.gs.txt` **logo acima** dessa
linha. Depois: *Implantar → Gerenciar implantações → lápis → Nova versão*.

**b)** No grupo do Telegram, mande `/painel`. Copie o link que o bot responder.

**c)** No app: **Ajustes → Bot do Telegram (finanças) → Colar o link**.

Pronto. Se o link estiver errado, o app te diz o que está errado.
E dá pra desligar quando quiser — volta ao modo manual.

### 2. Instalar o app da Vercel no GitHub  ⏱ 1 min

Isso faz o site se atualizar sozinho toda vez que o código mudar.

Abra **https://github.com/apps/vercel**, escolha *Only select repositories*
e marque **`financas-casa`**. Só isso.

Enquanto não fizer, o site continua no ar — mas cada atualização depende de
mim republicar na mão.

**Por que é assim:** a Vercel não consegue ler o `financas-casa` porque ele é
privado e o app dela não está instalado. Então o site publicado baixa o código
de uma cópia espelho na branch `casa-de-dois` do `link-bio`, que é público.

Existem hoje **três projetos na Vercel**, porque a sessão só me deixa criar
projeto novo, nunca republicar num existente. O bom é o último:

| Projeto | Situação |
| --- | --- |
| `casa-igor-karen` | ✅ **este é o atual** |
| `casa-de-dois-app` | código antigo, pode apagar |
| `casa-de-dois` | código antigo, pode apagar |

Depois de instalar o app da Vercel, crie um projeto ligado direto ao
`financas-casa`, apague esses três, e **só então** apague a branch
`casa-de-dois` do `link-bio`. Nessa ordem — enquanto os projetos acima
existirem, apagar a branch derruba o site.

### 3. Opcional: o acerto do mês  ⏱ 15 min

Sua planilha guarda *quem pagou*, mas não *de quem é a despesa*. Sem isso
não dá pra dizer "a Karen te deve R$ 200 esse mês".

O passo a passo está no fim do `integracao/Api.gs.txt`. **Pode deixar pra
depois** — o app já entende essa coluna se ela existir e ignora se não
existir.

---

## O que já está pronto

- As 8 telas, funcionando no celular e no computador
- Tema claro e escuro
- Instalável na tela inicial do celular (funciona sem internet)
- A aba Finanças já sabe ler a planilha do bot — só falta o passo 1
- Backup: **Ajustes → Exportar** gera um arquivo com tudo

---

## O que ainda NÃO existe

**Sincronização entre vocês dois.** Fora as finanças, tudo o que você digitar
fica guardado só no seu aparelho. O que o Igor escrever na agenda **não
aparece** no celular da Karen.

Isso é etapa, não esquecimento — e o próximo passo pra resolver está escrito
em `js/store/adapter-supabase.example.js`.

Por enquanto, **Ajustes → Exportar** é o jeito de passar os dados de um
aparelho pro outro.

**Login.** Quem tiver o endereço abre o app. Como os dados moram no navegador
de vocês, ninguém vê nada de vocês — mas o endereço em si é aberto.

---

## Coisas que eu não consegui fazer daqui

Sem acesso ao seu computador, três coisas ficaram com você:

1. **Instalar o app da Vercel** (passo 2 acima) — é permissão da sua conta.
2. **Confirmar que o site está no ar.** Este ambiente bloqueia abrir
   endereços da Vercel, e o acesso de leitura da API foi negado. Abra o link
   e me diga se está de pé.
3. **Colar o trecho no Apps Script** (passo 1) — só você tem acesso ao editor.

---

## Um aviso pra daqui a alguns meses

A aba `fixos` da planilha (aluguel, MRV, cartões) foi preenchida à mão. É ela
que sustenta o "quanto sobra". Com o tempo os valores mudam e ninguém lembra
de voltar lá — aí o número começa a mentir baixinho, sem dar erro na tela.

Vale automatizar: o resumo de domingo que o bot já manda pode comparar cada
conta fixa com a média real dos últimos meses e avisar quando divergir.
