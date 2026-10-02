// Animações decorativas contínuas (linhas de ar, ventilador, anéis) só
// rodam enquanto estão visíveis na tela. Fora dela ficam pausadas: poupa
// CPU e bateria no celular e libera o navegador para o que importa.
// Marque o elemento com data-anim; o CSS pausa tudo dentro de .is-paused.
// (prefers-reduced-motion já desliga essas animações no CSS.)

(function (FG) {
  function init() {
    const alvos = document.querySelectorAll('[data-anim]');
    if (!alvos.length || !('IntersectionObserver' in window)) return;

    const observer = new IntersectionObserver((entradas) => {
      entradas.forEach((e) => e.target.classList.toggle('is-paused', !e.isIntersecting));
    });

    alvos.forEach((el) => {
      el.classList.add('is-paused'); // começa pausado; o observer libera se estiver na tela
      observer.observe(el);
    });
  }

  FG.motion = { init };
})(window.FG);
