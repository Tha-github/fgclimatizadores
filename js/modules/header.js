// Header: adiciona .is-scrolled quando a página sai do topo (sombra/borda)

(function (FG) {
  function init() {
    const header = document.querySelector('[data-header]');
    if (!header) return;

    // Um elemento-sentinela no topo da página dispensa ouvir o evento de
    // scroll: quando ele sai da tela, a página rolou.
    const sentinela = document.createElement('div');
    sentinela.setAttribute('aria-hidden', 'true');
    sentinela.style.cssText = 'position:absolute;top:0;height:1px;width:1px;';
    document.body.prepend(sentinela);

    new IntersectionObserver(([entrada]) => {
      header.classList.toggle('is-scrolled', !entrada.isIntersecting);
    }).observe(sentinela);
  }

  FG.header = { init };
})(window.FG);
