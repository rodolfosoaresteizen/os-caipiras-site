# Os Caipiras: como colocar o site no ar e como funcionam os pedidos

---

## Parte 1: como os pedidos funcionam para o dono do restaurante

O site **não tem servidor, banco de dados nem pagamento online**. Tudo passa pelo **WhatsApp do restaurante** (+55 11 4245-6367), que o restaurante já usa no dia a dia.

### O caminho de um pedido

```
Cliente no site                     Celular do cliente                  WhatsApp do restaurante
─────────────────                   ──────────────────                  ───────────────────────
1. Escolhe pratos e tamanhos  ──►   3. O WhatsApp abre com a     ──►   4. Chega a mensagem pronta
2. Preenche nome, telefone,            mensagem já escrita;               com nº do pedido, itens,
   retirada/entrega, horário           o cliente toca "Enviar"            total e dados do cliente
   e pagamento
                                                                        5. A equipe responde e confirma
```

### Exemplo do que chega no WhatsApp do restaurante

```
🍖 NOVO PEDIDO OC-K3F9Q — Os Caipiras

Nome: Maria Silva
Telefone: (11) 98765-4321
Tipo: Entrega
Endereço: Rua das Flores, 100, Centro, Taboão da Serra
Data: 27/09/2026
Horário: 13:00
Pagamento: Pix / transferência

Itens:
• 1x Costela Bovina (M · 3 pessoas) — R$ 167,99
• 2x Chopp Brahma (1 litro) — R$ 75,98

Total: R$ 243,97 (+ taxa de entrega a combinar)

Observações: bem passada
```

As **reservas** chegam do mesmo jeito ("📅 PEDIDO DE RESERVA": data, horário e número de pessoas), e o **formulário de contato** também ("✉️ MENSAGEM PELO SITE").
Se o cliente usou o site em inglês, a mensagem chega **em português** mesmo assim, com o aviso *(Cliente usou o site em inglês)*.

### O que a equipe faz ao receber um pedido

1. **Confirmar** a disponibilidade e o horário respondendo na própria conversa.
2. **Informar a taxa de entrega**, se for entrega (o site mostra "taxa a combinar").
3. **Cobrar**: enviar a chave Pix, ou combinar dinheiro/cartão na entrega ou retirada.
4. **Preparar e entregar**, avisando o cliente pelo mesmo chat.

### Pontos importantes

| Situação | O que acontece |
|---|---|
| Cliente monta o pedido mas **não toca em "Enviar"** no WhatsApp | O restaurante **não recebe nada**. O pedido só existe quando a mensagem é enviada. |
| Pagamento | O site **não cobra**. O pagamento é combinado na conversa (Pix, dinheiro, cartão). |
| Preços errados ou prato em falta | A equipe corrige na conversa antes de confirmar. Mantenha `site/js/data.js` atualizado. |
| Pedido fora do horário (10h às 18h) | O site só aceita horários entre 10h e 18h. Mesmo assim, configure uma mensagem de ausência no WhatsApp Business. |
| Histórico de pedidos | Fica nas conversas do WhatsApp. O número (ex.: OC-K3F9Q) ajuda a localizar cada pedido. |

### Recomendações para o WhatsApp do restaurante

- Use o app **WhatsApp Business** (gratuito) no número **(11) 4245-6367**. Número fixo também funciona: na verificação, escolha "Me ligue" para receber o código por ligação.
- **Etiquetas:** crie "Novo pedido", "Aguardando Pix", "Pago", "Saiu p/ entrega", "Reserva".
- **Respostas rápidas:** por exemplo, `/pix` com a chave Pix, `/taxa` com a tabela de entrega e `/confirmado` com "Pedido confirmado! Fica pronto às ...".
- **Mensagem de ausência:** fora do horário, avisar "Abrimos todos os dias das 10h às 18h".
- Para vários funcionários atenderem ao mesmo tempo, use o **WhatsApp Web** ou **dispositivos conectados** (até 4 aparelhos no mesmo número).

> ⚠️ **Antes de publicar, confirme** que o número (11) 4245-6367 tem WhatsApp. Se o restaurante usar outro número (um celular, por exemplo), troque em `site/js/data.js`, na linha `whatsapp: '551142456367'` (formato: 55 + DDD + número, só dígitos).

---

## Parte 2: como colocar o site no ar

O site é só uma pasta de arquivos (`site/`). Qualquer hospedagem de site estático serve.
O domínio **oscaipiras.com.br** hoje está na **Locaweb**, com DNS na Locaweb (ns1/ns2/ns3.locaweb.com.br), o site antigo no "Criador de Sites" e **e-mail @oscaipiras.com.br também na Locaweb**.

### Opção A (recomendada): Netlify, grátis, com atualização arrastando a pasta

**1. Publicar (5 minutos)**
1. Acesse **https://app.netlify.com/drop**.
2. Arraste a pasta **`site`** inteira para a página.
3. Em segundos aparece um endereço como `https://nome-aleatorio.netlify.app`. Abra no celular e teste tudo.
4. Crie uma conta grátis (botão "Claim"/"Sign up") para o site não expirar.
5. Em **Site configuration → Change site name**, troque para `oscaipiras` (fica `oscaipiras.netlify.app`).

**2. Ligar o domínio oscaipiras.com.br**
1. No Netlify, vá em **Domain management → Add a domain** e digite `oscaipiras.com.br`. Escolha **"Set up Netlify DNS" → NÃO**. Use a opção de **DNS externo**.
2. Entre no **painel da Locaweb → Domínios → oscaipiras.com.br → Gerenciar DNS** (Zona de DNS) e altere **somente** estes registros:

   | Tipo | Nome | Valor |
   |---|---|---|
   | A | `@` (oscaipiras.com.br) | `75.2.60.5` |
   | CNAME | `www` | `oscaipiras.netlify.app` |

   Apague o registro A antigo do `@` (`186.202.135.240`) e o do `www`, se houver.
3. **⚠️ Não mexa nos registros MX** (`mx.a.locaweb.com.br` etc.) nem nos nameservers. Eles mantêm o e-mail funcionando.
4. Aguarde de 15 minutos a algumas horas. No Netlify, clique em **Verify DNS** e depois em **Provision certificate** para ativar o **HTTPS** (cadeado), que é gratuito.
5. Só depois que tudo estiver funcionando, cancele o plano do Criador de Sites na Locaweb, se não for mais usar.

**3. Atualizar o site depois (preços, fotos, textos)**
- Edite os arquivos na pasta `site/` (por exemplo, `js/data.js` para os preços).
- No Netlify: **Deploys → arraste a pasta `site` de novo**. Em segundos o site novo está no ar.

### Opção B: hospedagem da própria Locaweb

Vale se vocês preferem manter tudo na Locaweb (é pago, a partir do plano de Hospedagem de Sites).
1. Contrate ou ative um plano de **Hospedagem** (o "Criador de Sites" não aceita subir arquivos próprios).
2. No painel, abra o **Gerenciador de Arquivos** (ou use FTP com o FileZilla) e envie **o conteúdo** da pasta `site/` para a pasta **`public_html`**: o `index.html` precisa ficar direto dentro dela.
3. Aponte o domínio para essa hospedagem pelo próprio painel da Locaweb e ative o **SSL gratuito**.

### Outras opções gratuitas equivalentes
**Cloudflare Pages**, **Vercel** ou **GitHub Pages**. O processo é o mesmo: subir a pasta `site` e apontar o domínio.

---

## Parte 3: checklist antes de divulgar

- [ ] Conferir **preços e pratos** em `site/js/data.js` com o cardápio atual. Os preços foram transcritos do cardápio impresso publicado no Restaurant Guru e podem estar desatualizados.
- [ ] Confirmar o **número do WhatsApp**.
- [ ] Fazer **um pedido de teste** pelo celular e ver a mensagem chegar.
- [ ] Fazer **uma reserva de teste**.
- [ ] Testar o site no **modo escuro** e em **inglês** (botões no topo).
- [ ] Trocar o link na **bio do Instagram** e no **Google Meu Negócio** (Perfil da Empresa) para o novo site.
- [ ] Opcional: fotografar os pratos do restaurante e adicioná-los ao cardápio (salvar em `site/images/menu/` e incluir na lista `FOTOS` de `site/js/data.js`). Hoje só costela, mandioca e chopp têm foto; os outros itens mostram um ícone.
