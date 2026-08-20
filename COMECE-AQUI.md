# Comece aqui

Guia único, sem termo técnico. Se você só tem 2 minutos, leia a seção
**"O que falta você fazer"** e ignore o resto.

## Onde está no ar

O endereço bom é o do projeto **`casa-de-dois-git`** na Vercel — é o único
ligado ao repositório, então publica sozinho a cada push. Ache-o em
vercel.com; provavelmente é:

```
https://casa-de-dois-git-mktigor2022-gmailcoms-projects.vercel.app
```

⚠️ **Os outros três projetos da Vercel estão congelados.** `casa-igor-karen`,
`casa-de-dois-app` e `casa-de-dois` baixaram uma cópia do código no dia em
que foram criados e servem aquilo pra sempre. Se você abrir um deles vai
achar que nada mudou. Podem ser apagados.

## Estado em 19/08/2026

**Funcionando:**

- As oito telas, no celular e no computador, com tema claro e escuro
- Finanças lendo a planilha do bot do Telegram (ponte em Apps Script)
- O seletor Igor · Karen · Os dois também em Finanças: renda de cada um,
  o que cada um pagou, e onde
- A tela Início mostrando os mesmos números da planilha

**Pendente:**

1. **Ponte v2** — a versão publicada soma as duas rendas antes de enviar,
   então a renda individual não chega. O código corrigido está em
   `integracao/ApiSeparada.gs.txt`; é colar no projeto do Apps Script
   ("Ponte", não o do bot) e Implantar → Nova implantação.
2. **Coluna `rateio`** na aba `lancamentos` — destrava o acerto do mês
   ("quem deve pra quem"). Passo a passo no fim do `Api.gs.txt`.
3. **Sincronizar entre os dois** — agenda, tarefas, metas, compras e
   hábitos ainda ficam só no aparelho de quem digitou. Caminho escrito em
   `js/store/adapter-supabase.example.js`.
4. **Dois painéis mostrando a mesma coisa** — o `Painel.html` do Apps
   Script e a tela de Finanças da Nina. Vale decidir qual sobrevive.

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

### 1. ✅ Feito — a aba Finanças lê a planilha do bot

Ligado em 17/08/2026. Um projeto separado do Apps Script ("ponte") lê a
planilha `Finanças da Casa` e devolve os números pro app. O bot do Telegram
não foi tocado: continua lendo comprovante e lançando como sempre.

O código dessa ponte está em `integracao/ApiSeparada.gs.txt`. Se um dia
precisar refazer, é colar num projeto novo e publicar como App da Web.

**Duas coisas que a gente descobriu no caminho, e que valem lembrar:**

- A planilha guarda a **data como texto**, não como data. A primeira versão
  descartava os 29 lançamentos por causa disso, sem dar erro nenhum — só uma
  tela vazia. Hoje a conversão aceita os dois formatos.
- A aba `lancamentos` tem **15 colunas** (as duas últimas são `parcelas` e
  `parcela`). Por isso o rateio é procurado pelo **nome** do cabeçalho, e
  não por posição fixa.

### 2. ✅ Feito — app da Vercel instalado

O projeto **`casa-de-dois-git`** está ligado direto ao repositório
`financas-casa`. A partir de agora **cada push publica sozinho** — sem
build improvisado, sem depender de mim.

Falta só a faxina, quando você tiver 2 minutos na Vercel:

| Projeto | O que fazer |
| --- | --- |
| `casa-de-dois-git` | ✅ **guardar — é o oficial, ligado ao Git** |
| `casa-igor-karen` | apagar |
| `casa-de-dois-app` | apagar |
| `casa-de-dois` | apagar |

**A ordem importa:** apague os três primeiro, e só depois apague a branch
`casa-de-dois` do repositório `link-bio`. Aqueles três baixam o código de
lá — enquanto existirem, remover a branch derruba o site deles.

O `casa-de-dois-git` não depende dessa branch: ele lê o `financas-casa`
direto.

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
