// Catálogo de equipamentos
// Monta os cards da seção "Equipamentos" a partir de FG.equipamentos
// (js/data/equipamentos.js) usando o <template id="tpl-equipamento">
// do index.html. Para mudar o conteúdo, edite o arquivo de dados; para
// mudar a estrutura do card, edite o template; para o visual,
// css/components/product-card.css.

(function (FG) {
  const ILUSTRACAO = 'assets/img/equipamentos/ilustracao-climatizador.svg';
  const MODALIDADES = { locacao: 'Locação', venda: 'Venda' };
  const TEXTO_EM_ATUALIZACAO =
    'Informações deste equipamento em atualização. Consulte nossa equipe para conhecer as opções disponíveis.';

  // Mensagem do WhatsApp identificando o equipamento consultado
  function mensagem(eq) {
    return [
      'Olá, FG Climatizadores! Gostaria de mais informações sobre um equipamento do catálogo.',
      '',
      `Equipamento: ${eq.nome} (ref. ${eq.id})`,
      'Tenho interesse em: ( ) Locação  ( ) Compra',
      'Cidade:',
    ].join('\n');
  }

  function badge(texto, variacao) {
    const el = document.createElement('span');
    el.className = variacao ? `badge ${variacao}` : 'badge';
    el.textContent = texto;
    return el;
  }

  function criarCard(eq, tpl) {
    const frag = tpl.content.cloneNode(true);
    const $ = (sel) => frag.querySelector(sel);
    const card = $('.product-card');
    const modalidades = (eq.modalidades || []).filter((m) => MODALIDADES[m]);

    card.dataset.modalidades = modalidades.join(' ');
    card.classList.toggle('is-placeholder', Boolean(eq.placeholder));

    // Foto real ou ilustração genérica (decorativa, com aviso visível)
    const img = $('[data-img]');
    img.src = eq.imagem || ILUSTRACAO;
    img.alt = eq.imagem ? eq.imagemAlt || eq.nome : '';
    if (eq.imagem) $('[data-caption]').remove();

    // Selos
    const badges = $('[data-badges]');
    modalidades.forEach((m) => badges.append(badge(MODALIDADES[m], 'badge--dark')));
    if (eq.destaque) badges.append(badge(eq.destaque));
    if (eq.placeholder) badges.append(badge('Em atualização', 'badge--outline badge--glass'));

    // Textos
    if (eq.categoria) $('[data-categoria]').textContent = eq.categoria;
    else $('[data-categoria]').remove();

    $('[data-nome]').textContent = eq.nome;

    const descricao = eq.descricao || (eq.placeholder ? TEXTO_EM_ATUALIZACAO : '');
    if (descricao) $('[data-descricao]').textContent = descricao;
    else $('[data-descricao]').remove();

    // Características técnicas: só as confirmadas; sem elas, aviso neutro
    const specs = (eq.especificacoes || []).filter((s) => s && s.rotulo && s.valor);
    if (specs.length) {
      const dl = $('[data-specs]');
      specs.forEach(({ rotulo, valor }) => {
        const linha = document.createElement('div');
        linha.className = 'product-card__spec';
        const dt = document.createElement('dt');
        const dd = document.createElement('dd');
        dt.textContent = rotulo;
        dd.textContent = valor;
        linha.append(dt, dd);
        dl.append(linha);
      });
      $('[data-sem-specs]').remove();
    } else {
      $('[data-specs]').remove();
    }

    // Botão de consulta
    const botao = $('[data-consultar]');
    botao.href = FG.contact.linkWhatsApp(mensagem(eq));
    botao.target = '_blank';
    botao.rel = 'noopener';
    $('[data-consultar-nome]').textContent = ` sobre ${eq.nome} (abre em nova aba)`;

    return frag;
  }

  function initFiltros(grid, itens) {
    const grupo = document.querySelector('[data-catalog-filtros]');
    const status = document.querySelector('[data-catalog-status]');
    if (!grupo) return;

    // Sem nenhuma modalidade cadastrada, o filtro não teria efeito
    const temModalidade = itens.some((eq) => (eq.modalidades || []).length);
    grupo.hidden = !temModalidade;
    if (!temModalidade) return;

    const botoes = [...grupo.querySelectorAll('[data-filtro]')];

    grupo.addEventListener('click', (e) => {
      const botao = e.target.closest('[data-filtro]');
      if (!botao) return;
      const filtro = botao.dataset.filtro;

      botoes.forEach((b) => b.setAttribute('aria-pressed', String(b === botao)));

      let visiveis = 0;
      grid.querySelectorAll(':scope > li').forEach((li) => {
        const modalidades = li.querySelector('.product-card').dataset.modalidades.split(' ');
        const mostrar = filtro === 'todos' || modalidades.includes(filtro);
        li.hidden = !mostrar;
        if (mostrar) visiveis++;
      });

      if (status) {
        status.textContent = `${visiveis} ${visiveis === 1 ? 'equipamento exibido' : 'equipamentos exibidos'}.`;
      }
    });
  }

  function init() {
    const grid = document.querySelector('[data-catalog-grid]');
    const tpl = document.getElementById('tpl-equipamento');
    const itens = FG.equipamentos || [];
    if (!grid || !tpl) return;

    if (!itens.length) {
      const vazio = document.createElement('li');
      vazio.className = 'catalog__empty';
      vazio.textContent = 'Catálogo em atualização. Fale com a nossa equipe para conhecer os equipamentos disponíveis.';
      grid.append(vazio);
      return;
    }

    grid.append(...itens.map((eq) => criarCard(eq, tpl)));
    initFiltros(grid, itens);
  }

  FG.catalog = { init };
})(window.FG);
