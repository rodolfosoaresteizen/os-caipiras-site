/* =========================================================
   DADOS EDITÁVEIS – cardápio e galeria
   ---------------------------------------------------------
   CARDÁPIO: transcrito do cardápio impresso do Os Caipiras.
   Confira os preços com o restaurante antes de publicar.
   - cat: pratos | monte | executivo | petiscos | acomp | bebidas | sobremesas
   - price: preço único   OU   sizes: [ [rótulo PT, rótulo EN, preço], ... ]
   - fotos: só as do próprio restaurante (lista FOTOS abaixo)
   ========================================================= */
(function () {
  var P3 = function (p, m, g) { return [['P · 2 pessoas', 'S · serves 2', p], ['M · 3 pessoas', 'M · serves 3', m], ['G · 4 pessoas', 'L · serves 4', g]]; };
  var PG = function (p, g) { return [['Pequena', 'Small', p], ['Grande', 'Large', g]]; };
  var CH = function (a, b, c) { return [['300 ml', '300 ml', a], ['1 litro', '1 liter', b], ['Torre 2,5 L', '2.5 L tower', c]]; };
  var PRATO = ' Acompanha arroz, feijão, salada e farofa.';
  var PRATO_EN = ' Served with rice, beans, salad and farofa.';
  var EXEC = ' Acompanha arroz, feijão, farofa e salada.';
  var MONTE_EN = ' Served with farofa and vinaigrette (meat only).';

  /* Somente fotos do próprio restaurante; os demais itens mostram o ícone da categoria */
  var FOTOS = {
    'costela-bovina': 'images/menu/costela-bovina.jpg',
    'monte-costela': 'images/menu/costela-aperitivo.jpg',
    'exec-costela': 'images/menu/costela-exec.jpg',
    'mandioca': 'images/menu/mandioca.jpg',
    'chopp-brahma': 'images/menu/chopp-brahma.jpg'
  };

  function m(id, cat, pt, en, price, extra) {
    var o = { id: id, cat: cat, img: FOTOS[id] || null, pt: pt, en: en };
    if (Array.isArray(price)) o.sizes = price; else o.price = price;
    if (extra) { if (extra.featured) o.featured = true; if (extra.tag) o.tag = extra.tag; }
    return o;
  }
  function t(n, d) { return { n: n, d: d || '' }; }

  window.OC_DATA = {
    whatsapp: '551142456367',

    menu: [
      /* ---------- Pratos principais (P/M/G) ---------- */
      m('costela-bovina', 'pratos', t('Costela Bovina', 'A especialidade da casa: costela aperitivo assada na brasa por horas, com cebola curtida ao vinho e molho barbecue.' + PRATO),
        t('Beef Ribs', 'The house specialty: slow-grilled beef ribs with wine-pickled onions and barbecue sauce.' + PRATO_EN), P3(117.99, 167.99, 204.99), { featured: true }),
      m('costela-suina', 'pratos', t('Costela Suína', 'Costela suína grelhada com barbecue, com vinagrete.' + PRATO),
        t('Pork Ribs', 'Grilled pork ribs with barbecue sauce and vinaigrette.' + PRATO_EN), [['M · 3 pessoas', 'M · serves 3', 147.99]]),
      m('cupim', 'pratos', t('Cupim ao Alho', 'Cupim macio assado ao alho, com vinagrete.' + PRATO),
        t('Garlic Beef Hump (Cupim)', 'Tender garlic-roasted cupim with vinaigrette.' + PRATO_EN), P3(117.99, 167.99, 204.99)),
      m('feijoada', 'pratos', t('Feijoada', 'Toda quarta e sábado. Bisteca suína, arroz, feijoada, couve refogada, farofa, banana frita, laranja e torresmo.'),
        t('Feijoada', 'Wednesdays and Saturdays. Pork chop, rice, black bean stew, sautéed collard greens, farofa, fried banana, orange and pork crackling.'), P3(89.99, 125.99, 145.99), { tag: 'feijoada' }),
      m('tulipa-frango', 'pratos', t('Tulipa de Frango', 'Tulipa de frango grelhada com molho de alho.' + PRATO),
        t('Chicken Lollipops', 'Grilled chicken wing lollipops with garlic sauce.' + PRATO_EN), P3(89.99, 125.99, 144.99)),
      m('contra-file', 'pratos', t('Contra Filé ao Alho', 'Contra filé grelhado ao alho, com vinagrete.' + PRATO),
        t('Garlic Sirloin Steak', 'Grilled sirloin with garlic and vinaigrette.' + PRATO_EN), P3(134.99, 177.99, 209.99)),

      /* ---------- Monte o seu (só a carne, com farofa e vinagrete) ---------- */
      m('monte-costela', 'monte', t('Costela Bovina Aperitivo', 'Com farofa, cebola ao vinho e molho barbecue.'),
        t('Beef Ribs (appetizer cut)', 'With farofa, wine onions and barbecue sauce.'), P3(67.99, 99.99, 129.99), { img: 'costela-aperitivo' }),
      m('picanha', 'monte', t('Picanha ao Alho', 'Com farofa e vinagrete.'), t('Garlic Picanha', 'With farofa and vinaigrette.'), P3(149.99, 194.99, 239.99)),
      m('monte-cupim', 'monte', t('Cupim ao Alho', 'Com farofa e vinagrete.'), t('Garlic Cupim', MONTE_EN.trim()), P3(67.99, 99.99, 129.99), { img: 'cupim' }),
      m('linguica', 'monte', t('Linguiça Cuiabana', 'Linguiça de carne bovina recheada com queijo, acebolada, com farofa e vinagrete.'),
        t('Cuiabana Sausage', 'Beef sausage stuffed with cheese, with onions, farofa and vinaigrette.'), P3(69.99, 99.99, 129.99)),
      m('file-frango', 'monte', t('Filé de Frango', 'Acebolado, com farofa e vinagrete.'), t('Chicken Fillet', 'With onions, farofa and vinaigrette.'), P3(34.99, 49.99, 59.99)),
      m('monte-contra-file', 'monte', t('Contra Filé ao Alho', 'Com farofa e vinagrete.'), t('Garlic Sirloin', MONTE_EN.trim()), P3(84.99, 109.99, 135.99), { img: 'contra-file' }),
      m('monte-tulipa', 'monte', t('Tulipa de Frango na Brasa', 'Com farofa e molho de alho.'), t('Grilled Chicken Lollipops', 'With farofa and garlic sauce.'), P3(39.99, 57.99, 69.99), { img: 'tulipa-frango' }),
      m('tambaqui', 'monte', t('Tambaqui na Brasa', 'Peixe amazônico assado na brasa, com farofa e batata ao murro.'),
        t('Grilled Tambaqui', 'Amazonian fish grilled over coals, with farofa and smashed potatoes.'), 97.99),
      m('monte-costela-suina', 'monte', t('Costela Suína com Barbecue', 'Com farofa e vinagrete.'), t('Pork Ribs with Barbecue', MONTE_EN.trim()), 79.99, { img: 'costela-suina' }),

      /* ---------- Executivo (segunda a sexta, exceto feriados) ---------- */
      m('exec-costela', 'executivo', t('Costela na Brasa', EXEC.trim()), t('Grilled Beef Ribs', PRATO_EN.trim()), 34.99, { img: 'costela-exec' }),
      m('exec-picanha', 'executivo', t('Picanha ao Alho', EXEC.trim()), t('Garlic Picanha', PRATO_EN.trim()), 57.99, { img: 'picanha' }),
      m('exec-cupim', 'executivo', t('Cupim ao Alho', EXEC.trim()), t('Garlic Cupim', PRATO_EN.trim()), 34.99, { img: 'cupim' }),
      m('exec-frango', 'executivo', t('Filé de Frango', EXEC.trim()), t('Chicken Fillet', PRATO_EN.trim()), 24.99, { img: 'file-frango' }),
      m('exec-contra-file', 'executivo', t('Contra Filé', EXEC.trim()), t('Sirloin Steak', PRATO_EN.trim()), 32.99, { img: 'contra-file' }),
      m('exec-linguica', 'executivo', t('Linguiça Cuiabana Artesanal', EXEC.trim()), t('Artisanal Cuiabana Sausage', PRATO_EN.trim()), 35.99, { img: 'linguica' }),
      m('virado', 'executivo', t('Virado à Paulista (segunda)', 'Arroz, tutu de feijão, bisteca, ovo frito, torresmo, banana empanada, linguiça e couve refogada.'),
        t('Virado à Paulista (Monday)', 'Rice, bean tutu, pork chop, fried egg, crackling, breaded banana, sausage and collard greens.'), 29.99, { tag: 'seg' }),
      m('sobrecoxa', 'executivo', t('Sobrecoxa de Frango na Brasa (terça)', EXEC.trim()), t('Grilled Chicken Thigh (Tuesday)', PRATO_EN.trim()), 25.99, { tag: 'ter' }),
      m('exec-feijoada', 'executivo', t('Feijoada Nobre (quarta)', 'Arroz, feijoada nobre (bacon, linguiça e carne seca), bisteca, couve, torresmo, banana empanada e farofa.'),
        t('Premium Feijoada (Wednesday)', 'Rice, feijoada with bacon, sausage and dried beef, pork chop, greens, crackling, breaded banana and farofa.'), 35.99, { img: 'feijoada', tag: 'qua' }),
      m('vaca-atolada', 'executivo', t('Vaca Atolada (quinta)', 'Costela cozida com mandioca. Acompanha arroz, feijão e salada.'),
        t('Vaca Atolada (Thursday)', 'Beef rib and cassava stew. Served with rice, beans and salad.'), 29.99, { tag: 'qui' }),
      m('peixe-empanado', 'executivo', t('Peixe Empanado – merluza (sexta)', 'Acompanha arroz à grega, feijão, farofa e salada.'),
        t('Breaded Hake (Friday)', 'Served with Greek-style rice, beans, farofa and salad.'), 29.99, { tag: 'sex' }),
      m('exec-fritas', 'executivo', t('Adicional de Fritas (100 g)', 'Porção extra de batata frita para o seu prato executivo.'),
        t('Extra Fries (100 g)', 'An extra side of fries for your lunch plate.'), 6.99, { img: 'fritas' }),

      /* ---------- Entradas e petiscos ---------- */
      m('bolinho-costela', 'petiscos', t('Bolinho de Costela', 'Bolinhos crocantes recheados com a nossa costela desfiada.'), t('Beef Rib Croquettes', 'Crispy croquettes filled with our shredded beef ribs.'), 39.99, { featured: true }),
      m('dadinho', 'petiscos', t('Dadinho de Tapioca', 'Com geleia de pimenta.'), t('Tapioca Cheese Cubes', 'With pepper jelly.'), 27.99),
      m('pao-alho', 'petiscos', t('Pão de Alho', 'Recheado com queijo (4 unidades).'), t('Garlic Bread', 'Stuffed with cheese (4 pieces).'), 12.99),
      m('pastel', 'petiscos', t('Mini Pastel', '10 unidades – carne ou queijo (até 2 sabores).'), t('Mini Pastéis', '10 pieces – beef or cheese (up to 2 flavors).'), 29.99),
      m('queijo-coalho', 'petiscos', t('Queijo Coalho no Espeto', '1 unidade, assado na brasa.'), t('Grilled Coalho Cheese Skewer', '1 skewer, grilled over coals.'), 9.99),
      m('frango-passarinho', 'petiscos', t('Frango a Passarinho', 'Com alho frito.'), t('Crispy Garlic Chicken Bites', 'With fried garlic.'), 39.99),
      m('torresmo', 'petiscos', t('Torresmo', 'Sequinho e crocante, do jeito do interior.'), t('Pork Crackling', 'Dry and crunchy, countryside style.'), 24.99),
      m('fritas', 'petiscos', t('Fritas', 'Porção de batata frita.'), t('French Fries', 'A portion of fries.'), 27.99),
      m('polenta', 'petiscos', t('Polenta', 'Polenta frita crocante.'), t('Fried Polenta', 'Crispy fried polenta.'), 32.99),
      m('mandioca', 'petiscos', t('Mandioca Cremosa', 'Mandioca frita, crocante por fora e cremosa por dentro.'), t('Creamy Fried Cassava', 'Fried cassava, crispy outside and creamy inside.'), 34.99),
      m('add-cheddar', 'petiscos', t('Adicional Cheddar e Bacon', 'Para fritas, polenta ou mandioca.'), t('Add Cheddar & Bacon', 'For fries, polenta or cassava.'), 9.99, { img: 'fritas-cheddar' }),
      m('add-queijo', 'petiscos', t('Adicional Queijo Meia Cura Ralado', 'Para fritas, polenta ou mandioca.'), t('Add Grated Aged Cheese', 'For fries, polenta or cassava.'), 7.99, { img: 'queijo-meia-cura' }),
      m('queijo-nozinho', 'petiscos', t('Queijo Nozinho ou Palitinho 200 g', 'Porção fria.'), t('Knotted or String Cheese 200 g', 'Cold platter.'), 39.99),
      m('queijo-meia-cura', 'petiscos', t('Queijo Meia Cura 200 g', 'Porção fria.'), t('Semi-aged Minas Cheese 200 g', 'Cold platter.'), 37.99),
      m('salame', 'petiscos', t('Salame do Sul 200 g', 'Porção fria.'), t('Southern Salami 200 g', 'Cold platter.'), 39.99),

      /* ---------- Acompanhamentos ---------- */
      m('feijao', 'acomp', t('Feijão', ''), t('Beans', ''), PG(14.99, 19.99)),
      m('arroz', 'acomp', t('Arroz', ''), t('Rice', ''), PG(9.99, 12.99)),
      m('salada', 'acomp', t('Salada Completa', 'Alface, azeitona, batata, cebola, cenoura, milho, ovo, palmito, repolho, rúcula e tomate.'),
        t('Full Salad', 'Lettuce, olives, potato, onion, carrot, corn, egg, hearts of palm, cabbage, arugula and tomato.'), PG(24.99, 34.99)),

      /* ---------- Bebidas ---------- */
      m('chopp-brahma', 'bebidas', t('Chopp Brahma', 'Bem gelado, tirado na hora (copo de 350 ml).'), t('Brahma Draft Beer', 'Ice-cold, freshly poured (350 ml glass).'),
        [['350 ml', '350 ml', 13.99], ['1 litro', '1 liter', 37.99], ['Torre 2,5 L', '2.5 L tower', 89.99]], { featured: true }),
      m('chopp-artesanal', 'bebidas', t('Chopp Artesanal', ''), t('Craft Draft Beer', ''), CH(9.99, 29.99, 69.99)),
      m('chopp-vinho', 'bebidas', t('Chopp de Vinho', ''), t('Wine Draft', ''), CH(12.99, 39.99, 98.99)),
      m('refrigerante', 'bebidas', t('Refrigerante (lata 350 ml)', ''), t('Soda (350 ml can)', ''), 8.99),
      m('coca-ks', 'bebidas', t('Coca-Cola KS 290 ml', 'Garrafinha de vidro.'), t('Coca-Cola 290 ml', 'Glass bottle.'), 7.50),
      m('agua', 'bebidas', t('Água Mineral', 'Com ou sem gás.'), t('Mineral Water', 'Still or sparkling.'), 4.99),
      m('tonica', 'bebidas', t('Água Tônica (lata) ou H2OH', ''), t('Tonic Water (can) or H2OH', ''), 9.99),
      m('suco-lata', 'bebidas', t('Suco Del Valle (lata)', ''), t('Del Valle Juice (can)', ''), 8.99),
      m('suco-laranja', 'bebidas', t('Suco de Laranja Natural', 'Com leite: + R$ 3,00.'), t('Fresh Orange Juice', 'With milk: + R$ 3.00.'), 14.99),
      m('limonada', 'bebidas', t('Limonada Natural', ''), t('Fresh Lemonade', ''), 11.99),
      m('suco-polpa', 'bebidas', t('Suco de Polpa', 'Abacaxi, abacaxi com hortelã, manga, maracujá ou morango.'), t('Fruit Pulp Juice', 'Pineapple, pineapple-mint, mango, passion fruit or strawberry.'), 12.99),
      m('suco-uva', 'bebidas', t('Suco de Uva Natural', 'Tinto ou branco.'), t('Fresh Grape Juice', 'Red or white.'), [['Taça 250 ml', 'Glass 250 ml', 8.99], ['Jarra 500 ml', 'Jug 500 ml', 14.99]]),
      m('heineken', 'bebidas', t('Heineken', ''), t('Heineken', ''), [['Long neck 330 ml', 'Long neck 330 ml', 13.99], ['600 ml', '600 ml', 23.99]]),
      m('heineken-zero', 'bebidas', t('Heineken sem Álcool 330 ml', 'Long neck.'), t('Heineken 0.0 330 ml', 'Long neck.'), 13.99),
      m('corona', 'bebidas', t('Corona', ''), t('Corona', ''), [['Long neck 330 ml', 'Long neck 330 ml', 14.99], ['600 ml', '600 ml', 24.99]]),
      m('eisenbahn', 'bebidas', t('Eisenbahn Pilsen', ''), t('Eisenbahn Pilsner', ''), [['Long neck 355 ml', 'Long neck 355 ml', 9.99], ['600 ml', '600 ml', 17.99]]),
      m('spaten', 'bebidas', t('Spaten', ''), t('Spaten', ''), [['Long neck 350 ml', 'Long neck 350 ml', 11.99], ['600 ml', '600 ml', 19.99]]),
      m('malzbier', 'bebidas', t('Malzbier Long Neck', ''), t('Malzbier Long Neck', ''), 11.99),
      m('original', 'bebidas', t('Original 600 ml', ''), t('Original 600 ml', ''), 19.99),
      m('serra-malte', 'bebidas', t('Serra Malte 600 ml', ''), t('Serra Malte 600 ml', ''), 19.99),
      m('caipirinha-jorge', 'bebidas', t('Caipirinha Jorge Amado', 'Maracujá, limão e cachaça Gabriela (cravo e canela).'), t('Jorge Amado Caipirinha', 'Passion fruit, lime and Gabriela cachaça (clove and cinnamon).'), 29.99, { featured: true }),
      m('caipirinha', 'bebidas', t('Caipirinha', 'Cachaça de alambique. Sabores: caju, frutas vermelhas, kiwi, limão, maracujá ou morango.'), t('Caipirinha', 'Artisanal cachaça. Flavors: cashew fruit, berries, kiwi, lime, passion fruit or strawberry.'), 24.99),
      m('caipiroska', 'bebidas', t('Caipiroska', 'Vodka Smirnoff. Mesmos sabores da caipirinha.'), t('Caipiroska', 'Smirnoff vodka. Same flavors as the caipirinha.'), 29.99),
      m('saquerinha', 'bebidas', t('Saquerinha', 'Saquê. Mesmos sabores da caipirinha.'), t('Sakerinha', 'Sake. Same flavors as the caipirinha.'), 27.99),
      m('caipirinha-zero', 'bebidas', t('Caipirinha sem Álcool', 'Com água com gás. Mesmos sabores da caipirinha.'), t('Alcohol-free Caipirinha', 'With sparkling water. Same flavors.'), 24.99),
      m('gin-tonica', 'bebidas', t('Gin Tônica', 'Gin importado.'), t('Gin & Tonic', 'Imported gin.'), 29.99),
      m('gin-tropical', 'bebidas', t('Gin Tropical', 'Gin importado com Red Bull Tropical.'), t('Tropical Gin', 'Imported gin with Red Bull Tropical.'), 34.99),
      m('negroni', 'bebidas', t('Negroni', ''), t('Negroni', ''), 24.99),
      m('red-label', 'bebidas', t('Whisky Red Label (dose)', ''), t('Red Label Whisky (shot)', ''), 19.99),
      m('jack', 'bebidas', t("Jack Daniel's (dose)", ''), t("Jack Daniel's (shot)", ''), 29.99),
      m('cachaca', 'bebidas', t('Cachaça Seleta ou Boazinha (dose)', ''), t('Seleta or Boazinha Cachaça (shot)', ''), 14.99),
      m('cachaca-mel', 'bebidas', t('Cachaça com Mel e Gengibre (dose)', 'Também com maracujá.'), t('Cachaça with Honey & Ginger (shot)', 'Also with passion fruit.'), 11.99),
      m('smirnoff-ice', 'bebidas', t('Smirnoff Ice', ''), t('Smirnoff Ice', ''), 14.99),
      m('vodka', 'bebidas', t('Vodka Smirnoff (dose com gelo)', ''), t('Smirnoff Vodka (shot on ice)', ''), 9.99),
      m('tequila', 'bebidas', t('Tequila José Cuervo (dose)', ''), t('José Cuervo Tequila (shot)', ''), 19.99),

      /* ---------- Sobremesas ---------- */
      m('petit-gateau', 'sobremesas', t('Petit Gâteau', 'Bolinho de chocolate com recheio cremoso e sorvete.'), t('Petit Gâteau', 'Molten chocolate cake with ice cream.'), 28.99),
      m('torta-holandesa', 'sobremesas', t('Torta Holandesa', ''), t('Dutch Pie', 'Creamy pie with chocolate topping.'), 24.99),
      m('pudim', 'sobremesas', t('Pudim', 'Pudim de leite com calda de caramelo.'), t('Brazilian Flan', 'Milk flan with caramel sauce.'), 19.99),
      m('brownie', 'sobremesas', t('Brownie com Sorvete', ''), t('Brownie with Ice Cream', ''), 19.99),
      m('torta-mineira', 'sobremesas', t('Torta Mineira', ''), t('Minas-style Pie', 'Creamy cheese pie with dulce de leche.'), 19.99),
      m('torta-limao', 'sobremesas', t('Torta de Limão ou Floresta Negra', ''), t('Lemon or Black Forest Pie', ''), 24.99)
    ],

    /* GALERIA – cat: ambiente | pratos | lazer | natureza | eventos */
    gallery: [
      { f: 'img_0031.jpg', cat: 'ambiente', w: 1296, h: 864, pt: 'Nossa fachada, com a grande árvore', en: 'Our entrance, with the big tree' },
      { f: 'costela-de-ripa.jpg', cat: 'pratos', w: 1600, h: 1067, pt: 'Costela de ripa, a especialidade da casa', en: 'Beef ribs, the house specialty' },
      { f: '20200308_121526.jpg', cat: 'lazer', w: 1600, h: 1200, pt: 'Playground para a criançada', en: "Kids' playground" },
      { f: 'img_2801.jpg', cat: 'natureza', w: 1600, h: 1067, pt: 'Pavão branco exibindo a cauda', en: 'White peacock showing off' },
      { f: '20200307_130519.jpg', cat: 'ambiente', w: 1600, h: 900, pt: 'Salão coberto', en: 'Covered dining hall' },
      { f: 'img_1394.jpg', cat: 'pratos', w: 1600, h: 1067, pt: 'Costela de ripa saindo da brasa', en: 'Beef ribs fresh off the grill' },
      { f: 'img_2718.jpg', cat: 'eventos', w: 1600, h: 1066, pt: 'Música ao vivo', en: 'Live music' },
      { f: 'img_2707.jpg', cat: 'ambiente', w: 1600, h: 1066, pt: 'Área externa com lago', en: 'Outdoor area by the pond' },
      { f: 'img_1041.jpg', cat: 'natureza', w: 1600, h: 1067, pt: 'Arara-canindé', en: 'Blue-and-yellow macaw' },
      { f: 'img_0094.jpg', cat: 'lazer', w: 1600, h: 1196, pt: 'Brinquedão com escorregador', en: 'Play structure with slide' },
      { f: 'img_1792.jpg', cat: 'pratos', w: 1600, h: 1067, pt: 'Torre de chopp gelado', en: 'Ice-cold beer tower' },
      { f: 'img_0111.jpg', cat: 'ambiente', w: 1600, h: 1067, pt: 'Salão amplo para grupos', en: 'Spacious hall for groups' },
      { f: 'img_0615.jpg', cat: 'natureza', w: 1600, h: 1219, pt: 'Avestruz', en: 'Ostrich' },
      { f: 'img_1830.jpg', cat: 'pratos', w: 1600, h: 1067, pt: 'Porção de mandioca', en: 'Fried cassava' },
      { f: 'img_0001.jpg', cat: 'ambiente', w: 1296, h: 864, pt: "Roda d'água e lago", en: 'Water wheel and pond' },
      { f: 'img_2699.jpg', cat: 'natureza', w: 1600, h: 1066, pt: 'Araras coloridas', en: 'Colorful macaws' },
      { f: 'img_0041.jpg', cat: 'lazer', w: 1600, h: 1067, pt: 'Piscina de bolinhas', en: 'Ball pit' },
      { f: 'img_1387.jpg', cat: 'pratos', w: 1600, h: 1067, pt: 'Costela de ripa na tábua', en: 'Beef ribs on the board' },
      { f: 'img_0608.jpg', cat: 'natureza', w: 1600, h: 1067, pt: 'Pavões no rancho', en: 'Peacocks at the ranch' },
      { f: 'img_1068.jpg', cat: 'ambiente', w: 1600, h: 1067, pt: 'Salão interno', en: 'Indoor dining room' },
      { f: 'img_0037.jpg', cat: 'eventos', w: 1600, h: 1067, pt: 'Palco pronto para o show', en: 'Stage set for the show' },
      { f: 'img_2743.jpg', cat: 'natureza', w: 1600, h: 1066, pt: 'Arara-vermelha', en: 'Red-and-green macaw' },
      { f: 'img_0019.jpg', cat: 'ambiente', w: 1555, h: 1037, pt: 'Área ao ar livre', en: 'Open-air area' },
      { f: 'img_0605.jpg', cat: 'natureza', w: 1600, h: 1199, pt: 'Galinha com pintinhos', en: 'Hen with chicks' },
      { f: 'img_2741.jpg', cat: 'natureza', w: 1066, h: 1600, pt: 'Avestruz no viveiro', en: 'Ostrich in its enclosure' },
      { f: 'img_0078.jpg', cat: 'natureza', w: 1296, h: 864, pt: 'Arara de perto', en: 'Macaw up close' },
      { f: 'img_0054.jpg', cat: 'natureza', w: 1296, h: 864, pt: 'Lago com carpas', en: 'Koi pond' },
      { f: 'img_2810.jpg', cat: 'natureza', w: 1600, h: 1067, pt: 'Patinho', en: 'Duckling' },
      { f: 'img_0594.jpg', cat: 'natureza', w: 1600, h: 1067, pt: 'Coelho do rancho', en: 'Ranch bunny' },
      { f: 'img_2731.jpg', cat: 'natureza', w: 1600, h: 1066, pt: 'Galinha-sedosa', en: 'Silkie chicken' },
      { f: 'img_0611.jpg', cat: 'natureza', w: 1600, h: 1067, pt: 'Galinha no poleiro', en: 'Hen on a perch' },
      { f: 'img_0609.jpg', cat: 'natureza', w: 1600, h: 1179, pt: 'Patos no terreiro', en: 'Ducks in the yard' },
      { f: 'img_2701.jpg', cat: 'natureza', w: 1600, h: 1066, pt: 'Arara-vermelha', en: 'Red macaw' }
    ],

    /* Fotos da prévia na página inicial (índices da lista acima) */
    preview: [5, 2, 3, 11, 6, 8]
  };

})();
