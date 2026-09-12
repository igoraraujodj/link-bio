# MB Motos — mini site / link na bio

Projeto isolado dentro do repositório. Nada aqui é gerado pelo `build.js` do
portfólio, e o `build.js` não toca nesta pasta. Os dois convivem sem conflito.

- **URL prevista:** `https://igoraraujodj.github.io/link-bio/mb-motos/`
  (depois trocamos por domínio próprio, ex.: `mbmotos.com.br`)
- **Cliente:** MB Motos — oficina de motos
- **Local:** Rodovia José Sette, Santana — Cariacica / ES
- **Objetivo:** página única de conversão para tráfego pago, com WhatsApp como
  destino final, e SEO local para quem busca "oficina de moto em Cariacica".

---

## 1. Posicionamento

O problema de mercado: oficina de moto é vista como serviço de risco. O dono da
moto não sabe se a peça é boa, se o preço é justo, se vai ficar pronto no prazo.
Quem resolve essa insegurança primeiro ganha o cliente, mesmo cobrando mais.

Então o site inteiro trabalha três provas, repetidas em blocos diferentes:

1. **Transparência** — orçamento antes do serviço, sem surpresa.
2. **Peça de verdade** — estoque próprio, marca conhecida, garantia.
3. **Prazo** — a moto é o transporte da pessoa, não pode sumir por uma semana.

Isso é o que tira a MB Motos do lugar de "oficina comum" e sustenta um preço de
oficina de referência em Cariacica.

Tagline de trabalho (a confirmar com o cliente):
**"Sua moto de volta pra rua. Com peça certa, prazo certo e garantia."**

---

## 2. Estrutura das seções

Ordem pensada para tráfego pago: a pessoa cai de anúncio, não conhece a marca, e
decide nos primeiros 5 segundos se rola ou não.

### 00. Barra fixa de ação (mobile)
Fica colada no rodapé da tela o tempo todo: **WhatsApp · Ligar · Como chegar**.
É o que mais converte em landing de serviço local. Não é seção, é estrutura.

### 01. Topo / Hero
- Logo + selo "Aberto agora / Fecha às 18h" (muda sozinho pelo horário).
- Título que diz o que é, para quem e onde:
  *"Oficina de motos em Cariacica — revisão, manutenção e peças com garantia."*
- Subtítulo com a objeção principal derrubada: orçamento na hora, sem compromisso.
- Dois botões: **Pedir orçamento no WhatsApp** (principal) e **Ver serviços**.
- Foto real da oficina ao fundo. Foto real vende mais que banco de imagem.

### 02. Faixa de confiança
Quatro selos curtos, logo abaixo do hero: orçamento sem compromisso · peças com
garantia · serviço no mesmo dia (quando possível) · Pix, cartão e parcelamento.

### 03. Serviços — o núcleo do site
Cards, um por serviço, cada um com um botão que abre o WhatsApp **já com a
mensagem escrita** ("Olá, quero orçamento de troca de kit relação"):

| Serviço | Por que tem card próprio |
|---|---|
| Revisão completa | maior volume, é o serviço de entrada |
| Manutenção e mecânica geral | pega busca genérica |
| Troca de kit relação | alta busca, alta recorrência |
| Pneus — venda e montagem | serviço de urgência, converte na hora |
| Carenagem e estética | maior ticket, melhor material visual |
| Peças e acessórios | prova do estoque próprio |

Cada card é também um conjunto de anúncio separado depois, com público e
criativo próprios. E é aqui que mora a maior parte das palavras-chave do SEO.

### 04. Oferta da semana (o gancho do anúncio)
Bloco fixo de promoção recorrente — o "toda quarta" que você mencionou. Formato
sugerido: **dia fixo da semana com um benefício fixo** (ex.: revisão com desconto,
ou troca de óleo com mão de obra grátis). Recorrência cria hábito e dá urgência
toda semana sem queimar a margem o mês inteiro.
→ *Falta confirmar: qual dia e qual é a oferta.*

### 05. Estoque / vitrine
Prova visual de que a peça está lá, pronta. De 6 a 8 itens com foto: pneus,
kit relação, óleo, carenagem, acessórios. Sem tabela de preço fixa — "consulte",
para não travar o preço na página e ainda puxar a conversa pro WhatsApp.

### 06. Como funciona
Cinco passos numerados: chama no WhatsApp → diagnóstico → orçamento aprovado →
serviço com peça de qualidade → entrega com garantia. É o bloco que mais muda a
percepção de "oficina comum" para "oficina séria". Barato de fazer, alto impacto.

### 07. Antes e depois
Galeria de trabalhos reais, principalmente carenagem e recuperação. É o bloco que
gera os melhores criativos de anúncio — o material sai daqui direto pro Meta Ads.

### 08. Depoimentos e avaliações
Prova social com nome e foto da moto. Se o cliente ainda não tem avaliação no
Google, isso vira tarefa da primeira semana: pedir avaliação a cada entrega.

### 09. Perguntas frequentes
Derruba objeção e ainda rende resultado rico no Google (FAQ marcado em JSON-LD):
preço, garantia, prazo, precisa agendar, atende qual cilindrada/marca, formas de
pagamento, busca e entrega a moto.

### 10. Localização e horário
Mapa, endereço completo com ponto de referência da Rodovia José Sette, botões
Waze e Google Maps, horários por dia da semana. Bairros atendidos citados em
texto (Cariacica, Campo Grande, Vila Velha, Viana, Vitória, Serra) — isso é o
que faz a página aparecer nas buscas de cada região.

### 11. Rodapé
Contatos, Instagram, horário, endereço, CNPJ se houver, links rápidos.

---

## 3. Camada de SEO e medição

- **Título e descrição** focados em "oficina de motos em Cariacica ES".
- **JSON-LD:** `AutoRepair` + `OpeningHoursSpecification` + `geo` + `Service` +
  `FAQPage`. É o que faz a ficha aparecer bonita no Google.
- **Google Meu Negócio** com nome, endereço e telefone idênticos ao site.
  Sem isso, o SEO local não sobe. É o item de maior retorno e custo zero.
- **Imagem de compartilhamento (OG)** para o link ficar apresentável no WhatsApp
  e no Instagram — é assim que a maioria vai ver o link.
- **Medição:** Pixel da Meta + GA4, com clique no WhatsApp marcado como conversão
  e um parâmetro por serviço, pra saber qual card traz dinheiro.
- **Velocidade:** HTML e CSS puros, sem framework, imagens em WebP. Página leve
  derruba menos gente vinda de anúncio e baixa o custo por clique.

---

## 4. O que falta confirmar com o cliente

1. Número do WhatsApp e telefone.
2. Endereço exato (número / ponto de referência na Rodovia José Sette).
3. Horário de funcionamento, incluindo sábado.
4. **Dia e conteúdo da promoção semanal** (quarta ou quinta).
5. Logo e cores da marca — se não houver, a gente cria.
6. Instagram e Google Meu Negócio (já existem?).
7. Formas de pagamento e parcelamento.
8. Tempo de mercado e número aproximado de motos atendidas (vira prova no hero).
9. Garantia oferecida (dias / km).
10. Fotos da oficina, da equipe e de serviços prontos.
11. Marcas e cilindradas atendidas, e se busca/entrega a moto.
