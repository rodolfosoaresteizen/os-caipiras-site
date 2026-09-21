# Site Os Caipiras

Site estático (HTML + CSS + JavaScript puro): não precisa de build nem de instalar nada.
Funciona em celular, tablet e desktop, com modo claro/escuro e tradução PT/EN.

## Como testar no computador

```
powershell -ExecutionPolicy Bypass -File servidor-local.ps1
```

Depois abra http://localhost:8080 no navegador (Ctrl+C para parar).

## Estrutura

| Arquivo | O que é |
|---|---|
| `index.html` | Estrutura de todas as seções (Início, Cardápio, Sobre, Galeria, Contato) |
| `css/styles.css` | Visual, cores (verde #2d5016, laranja #d84630, dourado #b8860b), modo escuro e responsividade |
| `js/data.js` | **Cardápio (preços) e lista de fotos da galeria**: é o arquivo que você mais vai editar |
| `js/i18n.js` | Todos os textos em português e inglês |
| `js/app.js` | Funcionamento: carrossel, carrinho, formulários, lightbox, idioma e tema |
| `images/` | 33 fotos do site oficial otimizadas (1600px) + `thumbs/` (640px) + `logo.png` |

## Antes de publicar

1. **Preços do cardápio:** os valores em `js/data.js` são EXEMPLOS. Troque pelos preços e pratos reais.
2. **WhatsApp:** pedidos, reservas e mensagens abrem o WhatsApp do número `551142456367`.
   Confirme que esse número tem WhatsApp (se for outro, altere `whatsapp:` em `js/data.js`).
3. **Logo:** o site oficial só tem o logo em 200×200px. Se tiver uma versão maior, substitua `images/logo.png`.

## Publicar

Envie a pasta `site/` inteira para qualquer hospedagem de arquivos estáticos
(a hospedagem atual, Netlify, Vercel, GitHub Pages, etc.). O arquivo `servidor-local.ps1` não precisa ir junto.
