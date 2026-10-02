// Botão flutuante de WhatsApp
// Fica oculto enquanto QUALQUER um dos elementos listados em
// data-float-hide-near (seletores separados por vírgula) está na tela:
// hero, contato, CTA final e rodapé já têm botões de WhatsApp próprios,
// e assim o flutuante nunca cobre esses botões nem o envio do formulário.

(function (FG) {
  function init() {
    const botao = document.querySelector('[data-float-hide-near]');
    if (!botao) return;

    const referencias = [...document.querySelectorAll(botao.dataset.floatHideNear)];
    if (!referencias.length) return;

    const visiveis = new Set();

    const observer = new IntersectionObserver((entradas) => {
      entradas.forEach((e) => {
        if (e.isIntersecting) visiveis.add(e.target);
        else visiveis.delete(e.target);
      });
      botao.classList.toggle('is-hidden', visiveis.size > 0);
    });

    referencias.forEach((el) => observer.observe(el));
  }

  FG.floating = { init };
})(window.FG);
