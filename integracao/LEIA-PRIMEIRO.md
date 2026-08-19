# Ligar o bot do Telegram no Nina

Está tudo pronto dos dois lados. Quando você estiver no computador, são
três passos e uns 5 minutos.

## O que muda

Hoje você tem dois lugares com finanças: o bot (que lê comprovante e lança
na planilha) e a tela de Finanças deste app (onde você digitaria na mão).

Depois disso, sobra um só. **O bot continua sendo quem lança.** A tela do app
passa a mostrar aqueles mesmos números — e some o botão de lançar na mão,
porque lançar aqui gravaria num lugar que o bot não lê.

Nada no seu bot muda. Nenhuma linha. Continua custando R$ 0.

## Os três passos

**1. Abra o Apps Script e cole o trecho.**
Está em `Api.gs.txt`, aqui nesta pasta. São 6 linhas que entram dentro do
`doGet` que já existe no seu `Código.gs` — o projeto tem um arquivo `.gs` só,
com tudo dentro. O `Api.gs.txt` diz o lugar exato: procure por
`createTemplateFromFile('Painel')` e cole logo acima. Depois:
*Implantar → Gerenciar implantações → lápis → Nova versão*.

**2. Pegue o link.**
No grupo do Telegram, mande `/painel`. O bot responde com um link. Copie.

**3. Cole no app.**
Abra o app → **Ajustes** → *Bot do Telegram (finanças)* → **Colar o link**.
Pronto. O `?json=1` o app acrescenta sozinho.

Se o link estiver errado, o app diz o que está errado em vez de mostrar tela
branca. E dá para desligar a qualquer momento — volta ao modo local.

## O que você ganha na tela

- **Renda, comprometido, saiu e sobra** — vindos das abas `fixos` e `lancamentos`
- **Teto por categoria** com ⚠️ em 80% e 🚨 quando estoura, igual ao alerta do grupo
- **Quem pagou quanto** no mês
- **Contas fixas** do mês, abertas em uma lista
- **↗ em cada lançamento** que volta pra mensagem original no Telegram, onde
  está a foto do comprovante
- **Funciona sem internet** — a última leitura fica guardada, e o app avisa
  que os números são de antes em vez de mostrar zero

## A parte opcional: o acerto do mês

Sua planilha guarda **quem pagou**, mas não **de quem é a despesa**. Sem isso
não dá pra dizer "a Karen te deve R$ 200 esse mês".

O `Api.gs.txt` tem o passo a passo pra criar uma coluna `rateio` na aba
`lancamentos` e mais três botões na resposta do Telegram (½ meio a meio /
só Igor / só Karen).

**Pode deixar pra depois.** O app já lê essa coluna se ela existir e ignora
se não existir — não quebra nada esperar.

## Uma coisa pra ficar de olho

A aba `fixos` foi preenchida à mão a partir da sua planilha de 2022–2026. É
ela que sustenta o "quanto sobra". Com o tempo o aluguel sobe, a fatura muda,
e ninguém lembra de voltar lá — aí o número começa a mentir baixinho.

Vale, mais pra frente, um aviso automático no resumo de domingo comparando
cada conta fixa com a mediana real dos últimos meses de `lancamentos`.
