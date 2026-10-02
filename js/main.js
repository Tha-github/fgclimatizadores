// FG Climatizadores — ponto de entrada
// Cada módulo em js/modules/ expõe um init() em window.FG. Para adicionar
// um comportamento novo: crie o módulo, inclua o <script> no index.html
// (antes deste arquivo) e chame o init() abaixo.

(function (FG) {
  FG.contact?.init();
  FG.header?.init();
  FG.nav?.init();
  FG.floating?.init();
  FG.catalog?.init();
  FG.lightbox?.init();
  FG.contactForm?.init();
  FG.motion?.init();

  // Ano corrente no rodapé
  document.querySelectorAll('[data-year]').forEach((el) => {
    el.textContent = new Date().getFullYear();
  });
})(window.FG);
