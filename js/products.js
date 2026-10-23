/* ==========================================================================
   TUA HOME — dados do catálogo
   Edite este arquivo para alterar preços, produtos, cores e contatos.
   - preco: número em reais (ex.: 119.9). Use null para "sob consulta".
   - texto (opcional): substitui o preço exibido (ex.: "Consulte disponibilidade").
   - imagem na opção (opcional): foto própria da peça (ex.: Lavabo); senão usa a foto da cor.
   - imagem: caminho dentro de assets/img, sem extensão (o site usa .webp e -sm.webp).
   ========================================================================== */

const CATALOGO = {
  config: {
    mostrarPrecos: true,
    // Enquanto true, exibe o aviso de que os valores devem ser confirmados no WhatsApp.
    precosProvisorios: false,
  },

  contato: {
    whatsapp: "5547988334271",
    whatsappExibicao: "(47) 98833-4271",
    instagram: "tuahomeoficial",
    endereco: "Av. 7 de Setembro, 776, sala 902 — Itajaí, SC",
    mapa: "https://www.google.com/maps/search/?api=1&query=Av.+7+de+Setembro,+776,+Itaja%C3%AD,+SC",
  },

  linhas: [
    {
      id: "unika",
      nome: "Unika",
      tagline: "Toque ultra macio",
      gramatura: "500 g/m²",
      material: "100% algodão",
      atributos: ["Toque ultra macio", "Super absorção", "Toalha encorpada e felpuda"],
      cores: ["Branca", "Lunar"],
      imagem: "produtos-karsten/banho-unika-branco",
    },
    {
      id: "theo",
      nome: "Unika Theo",
      tagline: "A maciez Unika em um novo desenho",
      gramatura: "500 g/m²",
      material: "100% algodão",
      atributos: ["Toque ultra macio", "Super absorção", "Opção de toalha lavabo"],
      cores: ["Branca"],
      imagem: "produtos-karsten/banho-theo-branco",
    },
    {
      id: "nuvia",
      nome: "Nuvia",
      tagline: "Leveza que seca rápido",
      gramatura: "380 g/m²",
      material: "100% algodão",
      atributos: ["+ Leveza", "+ Praticidade", "+ Secagem rápida"],
      cores: ["Branca", "Platina"],
      imagem: "produtos-karsten/banho-nuvia-platina",
    },
  ],

  // Cores das toalhas (usadas nos seletores)
  cores: {
    Branca: "#F7F5F2",
    Lunar: "#BBAB97",
    Platina: "#BEB9B4",
  },

  produtos: [
    /* ---------- Toalhas avulsas ---------- */
    {
      id: "toalhas-unika",
      linha: "unika",
      tipo: "avulsa",
      nome: "Toalhas Unika",
      descricao: "Escolha a peça e a cor",
      variantes: [
        {
          cor: "Branca",
          imagem: "produtos-karsten/banho-unika-branco",
          opcoes: [
            { nome: "Banhão", preco: 129.9 },
            { nome: "Banho", preco: 109.9 },
            { nome: "Rosto", preco: 59.9 },
          ],
        },
        {
          cor: "Lunar",
          imagem: "produtos-karsten/banho-unika-lunar",
          opcoes: [
            { nome: "Banho", preco: 109.9 },
            { nome: "Rosto", preco: 59.9 },
          ],
        },
      ],
    },
    {
      id: "toalhas-theo",
      linha: "theo",
      tipo: "avulsa",
      nome: "Toalhas Unika Theo",
      descricao: "Escolha a peça",
      variantes: [
        {
          cor: "Branca",
          imagem: "produtos-karsten/banho-theo-branco",
          opcoes: [
            { nome: "Banho", preco: 119.9 },
            { nome: "Rosto", preco: 69.9 },
            { nome: "Lavabo", preco: 49.9, imagem: "produtos-karsten/visita-theo-branco" },
          ],
        },
      ],
    },
    {
      id: "toalhas-nuvia",
      linha: "nuvia",
      tipo: "avulsa",
      nome: "Toalhas Nuvia",
      descricao: "Escolha a peça e a cor",
      variantes: [
        {
          cor: "Branca",
          imagem: "produtos-karsten/banho-nuvia-branco",
          opcoes: [
            { nome: "Banho", preco: 79.9 },
            { nome: "Rosto", preco: 49.9 },
          ],
        },
        {
          cor: "Platina",
          imagem: "produtos-karsten/banho-nuvia-platina",
          opcoes: [
            { nome: "Banho", preco: 79.9 },
            { nome: "Rosto", preco: 49.9 },
          ],
        },
      ],
    },

    /* ---------- Kits ---------- */
    {
      id: "kit-unika-solteiro",
      linha: "unika",
      tipo: "kit",
      nome: "Kit Unika Solteiro",
      descricao: "1 banho + 1 rosto",
      variantes: [
        { cor: "Branca", imagem: "produtos-karsten/unika-kit-solteiro", opcoes: [{ nome: "Kit", preco: 159.9 }] },
        { cor: "Lunar", imagem: "produtos-karsten/banho-unika-lunar", opcoes: [{ nome: "Kit", preco: 159.9 }] },
      ],
    },
    {
      id: "kit-unika-casal",
      linha: "unika",
      tipo: "kit",
      nome: "Kit Unika Casal",
      descricao: "2 banhos + 1 rosto",
      variantes: [
        { cor: "Branca", imagem: "produtos-karsten/unika-kit-casal", opcoes: [{ nome: "Kit", preco: 239.9 }] },
        { cor: "Lunar", imagem: "produtos-karsten/banho-unika-lunar", opcoes: [{ nome: "Kit", preco: 239.9 }] },
      ],
    },
    {
      id: "kit-theo-solteiro",
      linha: "theo",
      tipo: "kit",
      nome: "Kit Theo Solteiro",
      descricao: "1 banho + 1 rosto",
      variantes: [
        { cor: "Branca", imagem: "produtos-karsten/theo-kit-solteiro", opcoes: [{ nome: "Kit", preco: 179.9 }] },
      ],
    },
    {
      id: "kit-theo-casal",
      linha: "theo",
      tipo: "kit",
      nome: "Kit Theo Casal",
      descricao: "2 banhos + 1 rosto",
      variantes: [
        { cor: "Branca", imagem: "produtos-karsten/theo-kit-casal", opcoes: [{ nome: "Kit", preco: 269.9 }] },
      ],
    },
    {
      id: "kit-nuvia-solteiro",
      linha: "nuvia",
      tipo: "kit",
      nome: "Kit Nuvia Solteiro",
      descricao: "1 banho + 1 rosto",
      variantes: [
        { cor: "Branca", imagem: "produtos-karsten/nuvia-kit-solteiro", opcoes: [{ nome: "Kit", preco: 119.9 }] },
        { cor: "Platina", imagem: "produtos-karsten/banho-nuvia-platina", opcoes: [{ nome: "Kit", preco: 119.9 }] },
      ],
    },
    {
      id: "kit-nuvia-casal",
      linha: "nuvia",
      tipo: "kit",
      nome: "Kit Nuvia Casal",
      descricao: "2 banhos + 1 rosto",
      variantes: [
        { cor: "Branca", imagem: "produtos-karsten/nuvia-kit-casal", opcoes: [{ nome: "Kit", preco: 179.9 }] },
        { cor: "Platina", imagem: "produtos-karsten/banho-nuvia-platina", opcoes: [{ nome: "Kit", preco: 179.9 }] },
      ],
    },
    {
      id: "kit-nuvia-completo",
      linha: "nuvia",
      tipo: "kit",
      nome: "Kit Nuvia Completo",
      descricao: "2 banhos + 1 rosto + 1 piso",
      variantes: [
        { cor: "Branca", imagem: "produtos-karsten/banho-jogo-5-pecas-nuvia-branco", opcoes: [{ nome: "Kit", preco: 239.9 }] },
        { cor: "Platina", imagem: "produtos-karsten/banho-jogo-5-pecas-nuvia-platina", opcoes: [{ nome: "Kit", preco: 239.9 }] },
      ],
    },
  ],

  bordados: [
    { nome: "Branco", cor: "#FFFFFF", imagem: "cores-bordados/t-branco-pend" },
    { nome: "Prata", cor: "#A7A9AC", imagem: "cores-bordados/t-prata-pend" },
    { nome: "Dourado", cor: "#C9A86A", imagem: "cores-bordados/t-dourado-pend" },
    { nome: "Bege escuro", cor: "#A68A6D", imagem: "cores-bordados/t-bronze-pend" },
    { nome: "Marrom", cor: "#4A3426", imagem: "cores-bordados/t-marrom-pend" },
    { nome: "Preto", cor: "#1F1B18", imagem: "cores-bordados/t-preto-pend" },
  ],

  // Fotos de peças personalizadas (galeria "Feito para você")
  galeria: [
    { imagem: "fotos/g-e-preto", alt: "Toalhas brancas com as iniciais G e E bordadas em preto" },
    { imagem: "fotos/t-prata", alt: "Toalha branca com a letra T bordada em prata, ao lado de um vaso com eucalipto" },
    { imagem: "fotos/m-r-bege", alt: "Toalhas brancas em escada de madeira com as iniciais M e R bordadas em bege escuro" },
    { imagem: "fotos/theo-rosto-m-r", alt: "Toalha de rosto branca com o monograma M|R bordado" },
    { imagem: "fotos/a-preto-nuvia", alt: "Toalha Nuvia branca com a letra A bordada em preto" },
    { imagem: "fotos/c-branco", alt: "Toalhas em tom Lunar com a letra C bordada em branco, num cesto de palha" },
    { imagem: "fotos/lavabo", alt: "Toalha lavabo branca com a flor da TUA bordada" },
  ],

  embalagens: [
    {
      nome: "Caixa Presente Flores",
      descricao: "Caixa com flores secas, para um presente inesquecível",
      imagens: ["embalagens/caixa-presente-flores-secas_02", "embalagens/caixa-presente-flores-secas_01"],
      opcoes: [
        { nome: "Média", preco: 19.9 },
        { nome: "Grande", preco: 29.9 },
      ],
    },
    {
      nome: "Caixa Presente Laço",
      descricao: "Caixa com laço bordô, clássica e elegante",
      imagens: ["embalagens/caixa-presente-laco-bordo_01", "embalagens/caixa-presente-tua-laco-bordo_02"],
      opcoes: [
        { nome: "Média", preco: 19.9 },
        { nome: "Grande", preco: 29.9 },
      ],
    },
    {
      nome: "Sacola Presente Especial",
      descricao: "Sacola translúcida com laço de cetim e tag TUA",
      imagens: ["embalagens/embalagem-luxuosa-tua-home"],
      opcoes: [{ nome: "Média ou grande", preco: null, texto: "Consulte disponibilidade" }],
    },
    {
      nome: "Sacola Presente Básica",
      descricao: "Sacola TUA com papel de seda e laço",
      imagens: ["embalagens/sacola-branca-tua-home-laco-preto"],
      opcoes: [{ nome: "Cortesia", preco: 0 }],
    },
  ],
};
