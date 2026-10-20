/* ==========================================================================
   TUA HOME — interações da página
   Os dados (produtos, preços, contatos) ficam em js/products.js
   ========================================================================== */

(function () {
  "use strict";

  const { config, contato, linhas, cores, produtos, bordados, galeria, embalagens } = CATALOGO;
  const IMG = "assets/img/";

  /* ---------- Utilidades ---------- */
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  const esc = (s) =>
    String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

  const imgSm = (path) => `${IMG}${path}-sm.webp`;
  const imgLg = (path) => `${IMG}${path}.webp`;
  const srcset = (path) => `${imgSm(path)} 640w, ${imgLg(path)} 1600w`;

  const moeda = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
  const formatPreco = (valor) => (valor === 0 ? "Cortesia" : valor == null ? "Sob consulta" : moeda.format(valor));

  function linkWhatsApp(texto) {
    return `https://wa.me/${contato.whatsapp}?text=${encodeURIComponent(texto)}`;
  }

  const ICON_BAG = '<svg aria-hidden="true"><use href="#i-bag"/></svg>';

  /* ---------- Links fixos de WhatsApp e contato ---------- */
  $$("[data-wa]").forEach((a) => (a.href = linkWhatsApp(a.dataset.wa)));
  $$("[data-contato]").forEach((el) => (el.textContent = contato[el.dataset.contato]));
  $$("[data-contato-link]").forEach((a) => {
    const key = a.dataset.contatoLink;
    a.href = key === "instagram" ? `https://www.instagram.com/${contato.instagram}/` : contato[key];
  });
  $("#ano").textContent = new Date().getFullYear();

  /* ---------- Linhas ---------- */
  $("#linhas-grid").innerHTML = linhas
    .map(
      (l) => `
      <article class="linha reveal">
        <div class="linha__media">
          <img src="${imgSm(l.imagem)}" alt="Toalha da linha ${esc(l.nome)}" width="640" height="640" loading="lazy">
        </div>
        <div class="linha__body">
          <h3 class="linha__name">${esc(l.nome)}</h3>
          <p class="linha__tagline">${esc(l.tagline)}</p>
          <div class="linha__spec">
            <span class="linha__gramatura">${esc(l.gramatura)}</span>
            <span class="linha__material">${esc(l.material)}</span>
          </div>
          <ul class="linha__attrs">${l.atributos.map((a) => `<li>${esc(a)}</li>`).join("")}</ul>
          <p class="linha__cores">
            ${l.cores.map((c) => `<span class="dot" style="background:${cores[c]}" title="${esc(c)}"></span>`).join("")}
            <span>${l.cores.map(esc).join(" · ")}</span>
          </p>
          <button class="btn btn--ghost btn--block" type="button" data-ver-linha="${l.id}">Ver produtos ${esc(l.nome)}</button>
        </div>
      </article>`
    )
    .join("");

  /* ---------- Catálogo ---------- */
  const gridProdutos = $("#produtos");

  function cardProduto(p) {
    const tag = p.tipo === "kit" ? "Kit" : linhas.find((l) => l.id === p.linha)?.nome || "";
    return `
      <article class="produto reveal" data-id="${p.id}" data-linha="${p.linha}" data-tipo="${p.tipo}">
        <button class="produto__media" type="button" aria-label="Ampliar foto: ${esc(p.nome)}">
          <img alt="" width="640" height="640" loading="lazy" sizes="(max-width: 539px) 50vw, 300px">
          <span class="produto__tag">${esc(tag)}</span>
        </button>
        <div class="produto__body">
          <div>
            <h3 class="produto__name">${esc(p.nome)}</h3>
            <p class="produto__desc">${esc(p.descricao)}</p>
          </div>
          <fieldset class="seletor" data-seletor="cor">
            <legend>Cor <b></b></legend>
            <div class="seletor__opts" role="radiogroup" aria-label="Cor">
              ${p.variantes
                .map(
                  (v, i) => `
                <button class="swatch" type="button" role="radio" aria-checked="false" data-variante="${i}" aria-label="${esc(v.cor)}" title="${esc(v.cor)}">
                  <span class="dot" style="background:${cores[v.cor] || "#ccc"}"></span>
                </button>`
                )
                .join("")}
            </div>
          </fieldset>
          <fieldset class="seletor" data-seletor="opcao">
            <legend>Peça</legend>
            <div class="seletor__opts" role="radiogroup" aria-label="Peça"></div>
          </fieldset>
          <div class="produto__footer">
            <p class="preco"></p>
            <button class="btn btn--ghost btn--sm btn--block" type="button" data-add>${ICON_BAG} <span class="btn__label">Adicionar<span class="hide-xs"> à lista</span></span></button>
          </div>
        </div>
      </article>`;
  }

  // A peça pode ter foto própria (ex.: Lavabo); senão usa a foto da cor
  function imagemDe(variante, nomeOpcao) {
    return variante.opcoes.find((o) => o.nome === nomeOpcao)?.imagem || variante.imagem;
  }

  function atualizarProduto(card, p, state) {
    const variante = p.variantes[state.v];
    const opcoes = variante.opcoes;
    if (state.o >= opcoes.length) state.o = 0;
    const opcao = opcoes[state.o];

    // Imagem
    const img = $(".produto__media img", card);
    const imagem = imagemDe(variante, opcao.nome);
    const novoSrc = imgSm(imagem);
    if (!img.src.endsWith(novoSrc)) {
      img.classList.add("is-loading");
      img.onload = () => img.classList.remove("is-loading");
      img.srcset = srcset(imagem);
      img.src = novoSrc;
    }
    img.alt = opcoes.length > 1 ? `${p.nome} — ${opcao.nome} — ${variante.cor}` : `${p.nome} — ${variante.cor}`;

    // Cor
    $('[data-seletor="cor"] legend b', card).textContent = variante.cor;
    $$(".swatch", card).forEach((b, i) => b.setAttribute("aria-checked", String(i === state.v)));

    // Opções (peças)
    const fsOpcao = $('[data-seletor="opcao"]', card);
    fsOpcao.hidden = opcoes.length < 2;
    $(".seletor__opts", fsOpcao).innerHTML = opcoes
      .map(
        (o, i) =>
          `<button class="opcao" type="button" role="radio" aria-checked="${i === state.o}" data-opcao="${i}">${esc(o.nome)}</button>`
      )
      .join("");

    // Preço
    const preco = $(".preco", card);
    preco.hidden = !config.mostrarPrecos;
    preco.textContent = formatPreco(opcao.preco);
  }

  // Feedback rápido no botão depois de adicionar
  function confirmarBotao(btn) {
    const label = $(".btn__label", btn);
    if (!label) return;
    label.dataset.original ??= label.innerHTML;
    label.textContent = "Adicionado!";
    clearTimeout(btn._timer);
    btn._timer = setTimeout(() => (label.innerHTML = label.dataset.original), 1400);
  }

  gridProdutos.innerHTML = produtos.map(cardProduto).join("");

  $$(".produto", gridProdutos).forEach((card) => {
    const p = produtos.find((x) => x.id === card.dataset.id);
    const state = { v: 0, o: 0 };
    atualizarProduto(card, p, state);

    card.addEventListener("click", (e) => {
      const sw = e.target.closest("[data-variante]");
      const op = e.target.closest("[data-opcao]");
      const add = e.target.closest("[data-add]");
      if (add) {
        const v = p.variantes[state.v];
        abrirPersonalizacao({ key: chaveProduto(p, v, v.opcoes[state.o]), btn: add });
      } else if (sw) {
        // mantém a mesma peça (ex.: "Banho") ao trocar de cor, se existir
        const nomeAtual = p.variantes[state.v].opcoes[state.o].nome;
        state.v = Number(sw.dataset.variante);
        const idx = p.variantes[state.v].opcoes.findIndex((o) => o.nome === nomeAtual);
        state.o = idx >= 0 ? idx : 0;
        atualizarProduto(card, p, state);
      } else if (op) {
        state.o = Number(op.dataset.opcao);
        atualizarProduto(card, p, state);
        $(`[data-opcao="${state.o}"]`, card)?.focus();
      } else if (e.target.closest(".produto__media")) {
        const nomeOpcao = p.variantes[state.v].opcoes[state.o].nome;
        const lista = p.variantes.map((v) => ({
          path: imagemDe(v, nomeOpcao),
          alt: `${p.nome} — ${v.cor}`,
          caption: `${p.nome} · ${v.cor}`,
        }));
        abrirLightbox(lista, state.v);
      }
    });
  });

  if (config.mostrarPrecos && config.precosProvisorios) $("#catalogo-aviso").hidden = false;

  /* ---------- Filtros ---------- */
  const chips = $$("#filtros .chip");

  function aplicarFiltro(filtro) {
    chips.forEach((c) => c.setAttribute("aria-pressed", String(c.dataset.filtro === filtro)));
    $$(".produto", gridProdutos).forEach((card) => {
      const visivel = filtro === "todos" || card.dataset.linha === filtro || card.dataset.tipo === filtro;
      card.hidden = !visivel;
      if (visivel) card.classList.add("is-visible");
    });
  }

  chips.forEach((chip) => chip.addEventListener("click", () => aplicarFiltro(chip.dataset.filtro)));

  $$("[data-ver-linha]").forEach((btn) =>
    btn.addEventListener("click", () => {
      aplicarFiltro(btn.dataset.verLinha);
      $("#catalogo").scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
    })
  );

  /* ---------- Bordados ---------- */
  $("#bordados").innerHTML = bordados
    .map(
      (b) => `
      <figure class="bordado">
        <div class="bordado__img"><img src="${imgSm(b.imagem)}" alt="Letra bordada na cor ${esc(b.nome)}" width="640" height="640" loading="lazy"></div>
        <figcaption><span class="dot" style="background:${b.cor}"></span>${esc(b.nome)}</figcaption>
      </figure>`
    )
    .join("");

  /* ---------- Galeria ---------- */
  const galeriaEl = $("#galeria");
  galeriaEl.innerHTML = galeria
    .map(
      (g, i) => `
      <button class="galeria__item" type="button" data-index="${i}" aria-label="Ampliar: ${esc(g.alt)}">
        <img src="${imgSm(g.imagem)}" srcset="${srcset(g.imagem)}" sizes="(min-width: 1000px) 50vw, 70vw" alt="${esc(g.alt)}" width="640" height="853" loading="lazy">
      </button>`
    )
    .join("");

  galeriaEl.addEventListener("click", (e) => {
    const item = e.target.closest(".galeria__item");
    if (!item) return;
    abrirLightbox(galeria.map((g) => ({ path: g.imagem, alt: g.alt, caption: "Feito para você 🤎" })), Number(item.dataset.index));
  });

  /* ---------- Embalagens ---------- */
  const gridEmb = $("#embalagens-grid");
  gridEmb.innerHTML = embalagens
    .map(
      (emb, i) => `
      <article class="embalagem reveal">
        <button class="embalagem__media" type="button" data-index="${i}" aria-label="Ampliar fotos: ${esc(emb.nome)}">
          <img src="${imgSm(emb.imagens[0])}" alt="${esc(emb.nome)}" width="640" height="853" loading="lazy">
          ${emb.imagens.length > 1 ? `<span class="embalagem__count">${emb.imagens.length} fotos</span>` : ""}
        </button>
        <div class="embalagem__body">
          <h3 class="embalagem__name">${esc(emb.nome)}</h3>
          <p class="embalagem__desc">${esc(emb.descricao)}</p>
          <hr class="embalagem__divisor">
          ${
            emb.opcoes.length > 1
              ? `<fieldset class="seletor embalagem__seletor">
                  <legend>Tamanho</legend>
                  <div class="seletor__opts" role="radiogroup" aria-label="Tamanho">
                    ${emb.opcoes
                      .map((o, j) => `<button class="opcao" type="button" role="radio" aria-checked="${j === 0}" data-emb-opcao="${j}">${esc(o.nome)}</button>`)
                      .join("")}
                  </div>
                </fieldset>`
              : ""
          }
          <div class="embalagem__acoes">
            <p class="preco" data-emb-preco></p>
            <button class="btn btn--ghost btn--sm btn--block" type="button" data-add-emb="${i}">${ICON_BAG} <span class="btn__label">Adicionar<span class="hide-xs"> à lista</span></span></button>
          </div>
        </div>
      </article>`
    )
    .join("");

  // Preço exibido conforme o tamanho selecionado (texto, cortesia ou valor)
  function atualizarPrecoEmbalagem(card, emb, j) {
    const o = emb.opcoes[j];
    const preco = $("[data-emb-preco]", card);
    const cortesia = o.preco === 0 && !o.texto;
    preco.classList.toggle("preco--texto", Boolean(o.texto));
    preco.classList.toggle("preco--linha", cortesia);
    if (cortesia) preco.innerHTML = "<span>Tamanho único</span><span>Cortesia</span>";
    else preco.textContent = o.texto || formatPreco(o.preco);
    preco.hidden = !o.texto && o.preco !== 0 && !config.mostrarPrecos;
  }

  $$(".embalagem", gridEmb).forEach((card, i) => atualizarPrecoEmbalagem(card, embalagens[i], 0));

  gridEmb.addEventListener("click", (e) => {
    const card = e.target.closest(".embalagem");
    if (!card) return;
    const media = e.target.closest(".embalagem__media");
    const opcaoBtn = e.target.closest("[data-emb-opcao]");
    const add = e.target.closest("[data-add-emb]");
    if (media) {
      const emb = embalagens[Number(media.dataset.index)];
      abrirLightbox(emb.imagens.map((path) => ({ path, alt: emb.nome, caption: emb.nome })), 0);
    } else if (opcaoBtn) {
      $$("[data-emb-opcao]", card).forEach((b) => b.setAttribute("aria-checked", String(b === opcaoBtn)));
      const i = $$(".embalagem", gridEmb).indexOf(card);
      atualizarPrecoEmbalagem(card, embalagens[i], Number(opcaoBtn.dataset.embOpcao));
    } else if (add) {
      const emb = embalagens[Number(add.dataset.addEmb)];
      const sel = $('[data-emb-opcao][aria-checked="true"]', card);
      adicionarNaLista(chaveEmbalagem(emb, emb.opcoes[sel ? Number(sel.dataset.embOpcao) : 0]));
      confirmarBotao(add);
    }
  });

  /* ---------- Minha lista (pedido via WhatsApp) ---------- */
  const STORAGE_KEY = "tuahome-lista";
  const listaEl = $("#lista");
  const lista = carregarLista();

  function carregarLista() {
    try {
      const salvo = JSON.parse(localStorage.getItem(STORAGE_KEY));
      if (salvo && Array.isArray(salvo.itens)) return { itens: salvo.itens, obs: salvo.obs || "" };
    } catch (e) {
      /* armazenamento indisponível: começa vazia */
    }
    return { itens: [], obs: "" };
  }

  function salvarLista() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(lista));
    } catch (e) {
      /* sem armazenamento: a lista vale só nesta visita */
    }
  }

  function chaveProduto(p, v, o) {
    return ["p", p.id, v.cor, o.nome].join("|");
  }

  function chaveEmbalagem(emb, o) {
    return ["e", emb.nome, o.nome].join("|");
  }

  // Busca nome, detalhe, preço e foto atuais a partir da chave salva
  function resolverItem(key) {
    const [tipo, id, a, b] = key.split("|");
    if (tipo === "p") {
      const p = produtos.find((x) => x.id === id);
      const v = p?.variantes.find((x) => x.cor === a);
      const o = v?.opcoes.find((x) => x.nome === b);
      if (!o) return null;
      const temPecas = p.variantes.some((x) => x.opcoes.length > 1);
      const detalhe = [p.tipo === "kit" ? p.descricao : temPecas ? o.nome : null, v.cor].filter(Boolean).join(" · ");
      return { nome: p.nome, detalhe, preco: o.preco, imagem: imagemDe(v, o.nome) };
    }
    if (tipo === "e") {
      const emb = embalagens.find((x) => x.nome === id);
      const o = emb?.opcoes.find((x) => x.nome === a);
      if (!o) return null;
      const detalhe = o.nome === "Cortesia" ? "Tamanho único" : o.nome;
      return { nome: emb.nome, detalhe, preco: o.texto ? null : o.preco, imagem: emb.imagens[0] };
    }
    return null;
  }

  // Itens de cortesia (preço zero) entram uma única vez, sem quantidade
  const ehCortesia = (key) => resolverItem(key)?.preco === 0;

  // remove itens que não existem mais no catálogo; cortesia sempre com 1 unidade
  lista.itens = lista.itens.filter((i) => resolverItem(i.key));
  lista.itens.forEach((i) => {
    if (ehCortesia(i.key)) i.qtd = 1;
    if (i.iniciais) i.iniciais = normalizarIniciais(i.iniciais); // listas salvas antes do limite de 3 caracteres
  });

  // Mesma toalha com o mesmo bordado vira um único item (soma a quantidade)
  const mesmoItem = (a, b) =>
    a.key === b.key && (a.bordado || "") === (b.bordado || "") && (a.iniciais || "") === (b.iniciais || "");

  function adicionarNaLista(key, { qtd = 1, bordado = "", iniciais = "" } = {}) {
    const novo = { key, qtd, bordado, iniciais };
    const item = lista.itens.find((i) => mesmoItem(i, novo));
    if (item && ehCortesia(key)) {
      mostrarToast(`${resolverItem(key).nome} já está na lista`);
      return;
    }
    if (item) item.qtd += qtd;
    else lista.itens.push(novo);
    salvarLista();
    renderLista();
    mostrarToast(`${resolverItem(key).nome} adicionado à lista`);
  }

  function editarItem(index, dados) {
    const item = lista.itens[index];
    Object.assign(item, dados);
    const repetido = lista.itens.findIndex((i, j) => j !== index && mesmoItem(i, item));
    if (repetido >= 0) {
      lista.itens[repetido].qtd += item.qtd;
      lista.itens.splice(index, 1);
    }
    salvarLista();
    renderLista();
  }

  function textoBordado(item) {
    if (!item.bordado) return "Sem bordado";
    return `Bordado ${item.bordado} · ${item.iniciais ? `“${item.iniciais}”` : "iniciais a definir"}`;
  }

  function totalLista() {
    let total = 0;
    let aConsultar = false;
    lista.itens.forEach(({ key, qtd }) => {
      const { preco } = resolverItem(key);
      if (preco == null) aConsultar = true;
      else total += preco * qtd;
    });
    return { total, aConsultar };
  }

  function mensagemLista() {
    const itens = lista.itens.map((item) => {
      const it = resolverItem(item.key);
      let linha = `• ${it.preco === 0 ? "" : `${item.qtd}x `}${it.nome} — ${it.detalhe}`;
      if (it.preco === 0) linha += " (cortesia)";
      else if (it.preco == null) linha += " (consultar disponibilidade)";
      else if (config.mostrarPrecos) linha += ` — ${moeda.format(it.preco * item.qtd)}`;
      if (item.key.startsWith("p|")) {
        linha += item.bordado
          ? `\n   ↳ Bordado ${item.bordado}: ${item.iniciais ? `"${item.iniciais}"` : "iniciais a definir"}`
          : "\n   ↳ Sem bordado";
      }
      return linha;
    });
    const { total, aConsultar } = totalLista();
    const partes = ["Olá! Vi o catálogo online da TUA HOME e gostaria de fazer um pedido:", "", ...itens];
    if (config.mostrarPrecos) partes.push("", `Total estimado: ${moeda.format(total)}${aConsultar ? " + itens a consultar" : ""}`);
    if (lista.obs.trim()) partes.push("", `Observações: ${lista.obs.trim()}`);
    return partes.join("\n");
  }

  function atualizarEnvio() {
    $("#lista-enviar").href = linkWhatsApp(mensagemLista());
  }

  function renderLista() {
    const qtdTotal = lista.itens.reduce((s, i) => s + i.qtd, 0);
    const vazia = qtdTotal === 0;

    const count = $("#lista-count");
    count.textContent = qtdTotal;
    count.hidden = vazia;
    $("#lista-abrir").setAttribute("aria-label", vazia ? "Abrir minha lista" : `Abrir minha lista (${qtdTotal} ${qtdTotal === 1 ? "item" : "itens"})`);

    $("#lista-vazia").hidden = !vazia;
    $("#lista-conteudo").hidden = vazia;
    $("#lista-footer").hidden = vazia;
    if (vazia) return;

    $("#lista-itens").innerHTML = lista.itens
      .map((item, index) => {
        const { key, qtd } = item;
        const it = resolverItem(key);
        const unit = it.preco == null ? "A consultar" : it.preco === 0 ? "Cortesia" : `${moeda.format(it.preco)} cada`;
        const sub = it.preco ? moeda.format(it.preco * qtd) : "";
        const perso = key.startsWith("p|")
          ? `<p class="item__perso">${esc(textoBordado(item))} <button class="item__editar" type="button" data-editar>Editar</button></p>`
          : "";
        return `
        <li class="item" data-index="${index}">
          <img class="item__img" src="${imgSm(it.imagem)}" alt="" width="64" height="64">
          <div class="item__info">
            <p class="item__nome">${esc(it.nome)}</p>
            <p class="item__detalhe">${esc(it.detalhe)}</p>
            ${perso}
            ${config.mostrarPrecos ? `<p class="item__unit">${unit}</p>` : ""}
          </div>
          <div class="item__acoes">
            ${
              it.preco === 0
                ? ""
                : `<div class="qtd">
              <button type="button" data-qtd="-1" aria-label="Diminuir quantidade de ${esc(it.nome)}">−</button>
              <span aria-live="polite">${qtd}</span>
              <button type="button" data-qtd="1" aria-label="Aumentar quantidade de ${esc(it.nome)}">+</button>
            </div>`
            }
            ${config.mostrarPrecos && sub ? `<span class="item__subtotal">${sub}</span>` : ""}
            <button class="item__remover" type="button" data-remover>Remover</button>
          </div>
        </li>`;
      })
      .join("");

    const { total, aConsultar } = totalLista();
    $(".lista__total").hidden = !config.mostrarPrecos;
    $("#lista-total").textContent = moeda.format(total);
    $("#lista-total-nota").hidden = !(config.mostrarPrecos && aConsultar);
    atualizarEnvio();
  }

  // Quantidade, remoção e edição do bordado
  $("#lista-itens").addEventListener("click", (e) => {
    const li = e.target.closest(".item");
    if (!li) return;
    const index = Number(li.dataset.index);
    const item = lista.itens[index];
    const qtdBtn = e.target.closest("[data-qtd]");
    if (e.target.closest("[data-editar]")) {
      abrirPersonalizacao({ key: item.key, index });
      return;
    } else if (qtdBtn) {
      item.qtd += Number(qtdBtn.dataset.qtd);
      if (item.qtd < 1) lista.itens.splice(index, 1);
    } else if (e.target.closest("[data-remover]")) {
      lista.itens.splice(index, 1);
    } else return;
    salvarLista();
    renderLista();
  });

  // Observações do pedido
  const campoObs = $("#lista-obs");
  campoObs.value = lista.obs;
  campoObs.addEventListener("input", () => {
    lista.obs = campoObs.value;
    salvarLista();
    atualizarEnvio();
  });

  /* ---------- Personalização da toalha (cor do bordado + iniciais) ---------- */
  const persoEl = $("#perso");
  const persoIniciais = $("#perso-iniciais");
  let perso = null; // { key, index, btn, bordado, qtd }

  $("#perso-cores").innerHTML = [{ nome: "", cor: null }, ...bordados]
    .map((b) => {
      const rotulo = b.nome ? esc(b.nome) : "Sem bordado";
      return `
      <button class="swatch${b.cor ? "" : " swatch--nenhum"}" type="button" role="radio" aria-checked="false" data-bordado="${esc(b.nome)}" aria-label="${rotulo}" title="${rotulo}">
        <span class="dot"${b.cor ? ` style="background:${b.cor}"` : ""}></span>
      </button>`;
    })
    .join("");

  function atualizarPerso() {
    $$("#perso-cores [data-bordado]").forEach((b) => b.setAttribute("aria-checked", String(b.dataset.bordado === perso.bordado)));
    $("#perso-cor-nome").textContent = perso.bordado || "Sem bordado";
    $("#perso-iniciais-campo").hidden = !perso.bordado;
    $("#perso-qtd").textContent = perso.qtd;
  }

  // Abre para adicionar (opts.btn) ou para editar um item da lista (opts.index)
  function abrirPersonalizacao(opts) {
    const atual = opts.index != null ? lista.itens[opts.index] : null;
    const it = resolverItem(opts.key);
    perso = { key: opts.key, index: opts.index ?? null, btn: opts.btn || null, bordado: atual?.bordado || "", qtd: 1 };
    $("#perso-img").src = imgSm(it.imagem);
    $("#perso-titulo").textContent = it.nome;
    $("#perso-detalhe").textContent = it.detalhe;
    persoIniciais.value = normalizarIniciais(atual?.iniciais);
    $("#perso-salvar-label").textContent = atual ? "Salvar" : "Adicionar à lista";
    $("#perso-qtd-campo").hidden = Boolean(atual); // na edição, a quantidade é ajustada na lista
    atualizarPerso();
    if (typeof persoEl.showModal === "function") persoEl.showModal();
    else persoEl.setAttribute("open", "");
    document.body.style.overflow = "hidden";
  }

  $("#perso-cores").addEventListener("click", (e) => {
    const b = e.target.closest("[data-bordado]");
    if (!b) return;
    perso.bordado = b.dataset.bordado;
    atualizarPerso();
  });

  // Iniciais: até 2 letras em maiúsculas; com 2 letras aplica a máscara "M|R".
  // Declaradas como "function" (e não const) porque normalizarIniciais já é usada
  // ao carregar a lista salva, antes deste ponto do arquivo.
  function letrasDe(v) {
    return String(v || "").toUpperCase().replace(/[^\p{L}]/gu, "").slice(0, 2);
  }

  function mascaraIniciais(letras) {
    return letras.length === 2 ? `${letras[0]}|${letras[1]}` : letras;
  }

  function normalizarIniciais(v) {
    return mascaraIniciais(letrasDe(v));
  }

  let iniciaisAnterior = "";
  persoIniciais.addEventListener("focus", () => (iniciaisAnterior = persoIniciais.value));
  persoIniciais.addEventListener("input", (e) => {
    let letras = letrasDe(persoIniciais.value);
    // Apagar a barra da máscara apaga a letra ao lado dela
    if (e.inputType?.startsWith("delete") && iniciaisAnterior.includes("|") && !persoIniciais.value.includes("|") && letras.length === 2) {
      letras = e.inputType === "deleteContentForward" ? letras[0] : letras[1];
    }
    const valor = mascaraIniciais(letras);
    if (persoIniciais.value !== valor) {
      persoIniciais.value = valor;
      persoIniciais.setSelectionRange(valor.length, valor.length);
    }
    iniciaisAnterior = valor;
  });

  $("#perso-qtd-campo").addEventListener("click", (e) => {
    const b = e.target.closest("[data-perso-qtd]");
    if (!b) return;
    perso.qtd = Math.max(1, perso.qtd + Number(b.dataset.persoQtd));
    atualizarPerso();
  });

  $("#perso-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const dados = { bordado: perso.bordado, iniciais: perso.bordado ? normalizarIniciais(persoIniciais.value) : "" };
    if (perso.index != null) {
      editarItem(perso.index, dados);
    } else {
      adicionarNaLista(perso.key, { ...dados, qtd: perso.qtd });
      if (perso.btn) confirmarBotao(perso.btn);
    }
    persoEl.close();
  });

  $("#perso-fechar").addEventListener("click", () => persoEl.close());
  persoEl.addEventListener("click", (e) => {
    if (e.target === persoEl) persoEl.close(); // clique fora
  });
  persoEl.addEventListener("close", () => (document.body.style.overflow = listaEl.open ? "hidden" : ""));

  $("#lista-limpar").addEventListener("click", () => {
    if (!confirm("Remover todos os itens da lista?")) return;
    lista.itens = [];
    salvarLista();
    renderLista();
  });

  // Abrir / fechar o painel
  function abrirLista() {
    setMenu(false);
    $("#toast").classList.remove("is-visible");
    renderLista();
    if (typeof listaEl.showModal === "function") listaEl.showModal();
    else listaEl.setAttribute("open", "");
    document.body.style.overflow = "hidden";
  }

  function fecharLista() {
    if (listaEl.open) listaEl.close();
  }

  listaEl.addEventListener("close", () => (document.body.style.overflow = ""));
  $("#lista-abrir").addEventListener("click", abrirLista);
  $("#lista-fechar").addEventListener("click", fecharLista);
  listaEl.addEventListener("click", (e) => {
    if (e.target === listaEl || e.target.closest("[data-fechar-lista]")) fecharLista();
  });

  // Aviso de item adicionado
  const toast = $("#toast");
  function mostrarToast(msg) {
    $("#toast-msg").textContent = msg;
    toast.classList.add("is-visible");
    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => toast.classList.remove("is-visible"), 3200);
  }
  $("#toast-ver").addEventListener("click", () => {
    toast.classList.remove("is-visible");
    abrirLista();
  });

  renderLista();

  /* ---------- Lightbox ---------- */
  const lb = $("#lightbox");
  const lbImg = $("#lightbox-img");
  const lbCaption = $("#lightbox-caption");
  const lbPrev = $("#lightbox-prev");
  const lbNext = $("#lightbox-next");
  let lbLista = [];
  let lbIndex = 0;

  function mostrarLightbox() {
    const item = lbLista[lbIndex];
    lbImg.src = imgLg(item.path);
    lbImg.alt = item.alt;
    lbCaption.textContent = lbLista.length > 1 ? `${item.caption}  (${lbIndex + 1}/${lbLista.length})` : item.caption;
    lbPrev.hidden = lbNext.hidden = lbLista.length < 2;
  }

  function abrirLightbox(lista, index) {
    lbLista = lista;
    lbIndex = index;
    mostrarLightbox();
    if (typeof lb.showModal === "function") lb.showModal();
    else window.open(lbImg.src, "_blank");
  }

  const passo = (d) => {
    lbIndex = (lbIndex + d + lbLista.length) % lbLista.length;
    mostrarLightbox();
  };

  lbPrev.addEventListener("click", () => passo(-1));
  lbNext.addEventListener("click", () => passo(1));
  $("#lightbox-close").addEventListener("click", () => lb.close());
  lb.addEventListener("click", (e) => {
    if (e.target === lb) lb.close(); // clique no fundo
  });
  lb.addEventListener("keydown", (e) => {
    if (lbLista.length < 2) return;
    if (e.key === "ArrowLeft") passo(-1);
    if (e.key === "ArrowRight") passo(1);
  });

  // gesto de arrastar no celular
  let toqueX = null;
  lb.addEventListener("touchstart", (e) => (toqueX = e.touches[0].clientX), { passive: true });
  lb.addEventListener("touchend", (e) => {
    if (toqueX == null || lbLista.length < 2) return;
    const dx = e.changedTouches[0].clientX - toqueX;
    if (Math.abs(dx) > 50) passo(dx < 0 ? 1 : -1);
    toqueX = null;
  });

  /* ---------- Cabeçalho e menu ---------- */
  const header = $("#header");
  const toggle = $("#menu-toggle");

  const onScroll = () => header.classList.toggle("is-scrolled", window.scrollY > 24);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  function setMenu(aberto) {
    header.classList.toggle("is-open", aberto);
    toggle.setAttribute("aria-expanded", String(aberto));
    toggle.setAttribute("aria-label", aberto ? "Fechar menu" : "Abrir menu");
    document.body.style.overflow = aberto ? "hidden" : "";
  }

  toggle.addEventListener("click", () => setMenu(!header.classList.contains("is-open")));
  $$("#nav a").forEach((a) => a.addEventListener("click", () => setMenu(false)));
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && header.classList.contains("is-open")) setMenu(false);
  });
  matchMedia("(min-width: 961px)").addEventListener("change", (e) => e.matches && setMenu(false));

  // link ativo no menu
  const navLinks = $$(".nav__link");
  const secoes = navLinks.map((a) => $(a.getAttribute("href"))).filter(Boolean);
  const navObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navLinks.forEach((a) => a.classList.toggle("is-active", a.getAttribute("href") === `#${entry.target.id}`));
      });
    },
    { rootMargin: "-45% 0px -50% 0px" }
  );
  secoes.forEach((s) => navObserver.observe(s));

  /* ---------- Animações de entrada ---------- */
  const revealObserver = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          obs.unobserve(entry.target);
        }
      });
    },
    { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
  );
  $$(".reveal").forEach((el) => revealObserver.observe(el));
})();
