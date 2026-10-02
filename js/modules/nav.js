// Navbar
// - Gaveta do mobile/tablet: abre/fecha pelo botão, overlay, Esc e ao
//   escolher um link; prende o foco e desativa (inert) o resto da página
// - Destaca o link da seção visível (.is-active + aria-current)

(function (FG) {
  const DESKTOP = window.matchMedia('(min-width: 1024px)');

  function initMenu() {
    const nav = document.querySelector('[data-nav]');
    const overlay = document.querySelector('[data-nav-overlay]');
    const abrir = document.querySelector('[data-nav-open]');
    const fechar = document.querySelector('[data-nav-close]');
    if (!nav || !abrir) return;

    // Blocos fora do header que saem do ar com a gaveta aberta
    const foraDoMenu = document.querySelectorAll('[data-menu-inert]');

    const focaveis = () => nav.querySelectorAll('a[href], button:not([disabled])');
    const estaAberto = () => nav.classList.contains('is-open');

    // devolverFoco: false quando o fechamento vem de um link do menu — aí
    // o foco segue o destino da âncora em vez de voltar ao hambúrguer.
    function setAberto(aberto, { devolverFoco = true } = {}) {
      nav.classList.toggle('is-open', aberto);
      overlay?.classList.toggle('is-visible', aberto);
      document.body.classList.toggle('is-locked', aberto);
      abrir.setAttribute('aria-expanded', String(aberto));
      foraDoMenu.forEach((el) => { el.inert = aberto; });

      if (aberto) {
        // Espera a gaveta ficar visível para conseguir focar
        requestAnimationFrame(() => fechar?.focus());
      } else if (devolverFoco) {
        abrir.focus();
      }
    }

    abrir.addEventListener('click', () => setAberto(true));
    fechar?.addEventListener('click', () => setAberto(false));
    overlay?.addEventListener('click', () => setAberto(false));

    // Escolher um link âncora fecha a gaveta e leva o foco à seção
    nav.addEventListener('click', (e) => {
      const link = e.target.closest('a[href^="#"]');
      if (!link || !estaAberto()) return;

      setAberto(false, { devolverFoco: false });
      const destino = document.querySelector(link.getAttribute('href'));
      if (destino) {
        destino.setAttribute('tabindex', '-1');
        destino.focus({ preventScroll: true });
      }
    });

    document.addEventListener('keydown', (e) => {
      if (!estaAberto()) return;

      if (e.key === 'Escape') {
        setAberto(false);
        return;
      }

      // Prende o Tab dentro da gaveta
      if (e.key === 'Tab') {
        const itens = focaveis();
        const primeiro = itens[0];
        const ultimo = itens[itens.length - 1];

        if (e.shiftKey && document.activeElement === primeiro) {
          e.preventDefault();
          ultimo.focus();
        } else if (!e.shiftKey && document.activeElement === ultimo) {
          e.preventDefault();
          primeiro.focus();
        }
      }
    });

    // Se a tela crescer até o layout desktop com a gaveta aberta, fecha
    DESKTOP.addEventListener('change', (e) => {
      if (e.matches && estaAberto()) setAberto(false, { devolverFoco: false });
    });
  }

  function initScrollSpy() {
    const links = [...document.querySelectorAll('[data-nav] .nav__link[href^="#"]')];
    const pares = links
      .map((link) => ({ link, secao: document.querySelector(link.getAttribute('href')) }))
      .filter((par) => par.secao);
    if (!pares.length) return;

    let ativo = null;

    function marcar(link) {
      if (link === ativo) return;
      ativo = link;
      links.forEach((l) => {
        const eAtivo = l === link;
        l.classList.toggle('is-active', eAtivo);
        if (eAtivo) l.setAttribute('aria-current', 'location');
        else l.removeAttribute('aria-current');
      });
    }

    // Todas as seções com id do <main>, inclusive as que não estão no menu
    // (Área de atendimento, FAQ): nelas nenhum link fica ativo, em vez de
    // o item anterior continuar marcado.
    const secoes = [...document.querySelectorAll('main > section[id]')];
    const linkDa = (secao) => pares.find((par) => par.secao === secao)?.link || null;

    // Ativa a última seção cujo topo já passou de uma linha imaginária
    // a 35% da altura da tela. No fim da página, ativa o último item do
    // menu (seções curtas no fim às vezes nunca chegam a essa linha).
    function atualizar() {
      const linha = window.innerHeight * 0.35;
      const noFim =
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;

      if (noFim) {
        marcar(pares[pares.length - 1].link);
        return;
      }

      let atual = secoes[0];
      secoes.forEach((secao) => {
        if (secao.getBoundingClientRect().top <= linha) atual = secao;
      });
      marcar(linkDa(atual));
    }

    let agendado = false;
    function agendar() {
      if (agendado) return;
      agendado = true;
      requestAnimationFrame(() => {
        agendado = false;
        atualizar();
      });
    }

    window.addEventListener('scroll', agendar, { passive: true });
    window.addEventListener('resize', agendar);
    // Primeira medição no próximo quadro, não durante o carregamento
    // (evita forçar um cálculo de layout extra na abertura da página)
    agendar();
  }

  function init() {
    initMenu();
    initScrollSpy();
  }

  FG.nav = { init };
})(window.FG);
