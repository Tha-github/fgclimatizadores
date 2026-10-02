// Lightbox — visualização ampliada de imagens
// Qualquer link <a href="imagem-grande" data-lightbox="grupo"> abre no
// <dialog data-lightbox-dialog>. Links do mesmo grupo navegam entre si.
//   data-caption      legenda exibida
//   data-ilustrativa  mostra o selo "Imagem ilustrativa"
// Teclado: ← → navegam, Esc fecha (nativo do <dialog>), Tab fica preso
// no diálogo, e o foco volta ao link que abriu. No toque: deslizar.
// Sem suporte a <dialog> (ou sem JS), o link abre a imagem direto.

(function (FG) {
  function init() {
    const dialog = document.querySelector('[data-lightbox-dialog]');
    if (!dialog || typeof dialog.showModal !== 'function') return;

    const img = dialog.querySelector('[data-lightbox-img]');
    const legenda = dialog.querySelector('[data-lightbox-caption]');
    const selo = dialog.querySelector('[data-lightbox-tag]');
    const contador = dialog.querySelector('[data-lightbox-counter]');
    const anterior = dialog.querySelector('[data-lightbox-prev]');
    const proxima = dialog.querySelector('[data-lightbox-next]');
    const fechar = dialog.querySelector('[data-lightbox-close]');

    let grupo = [];
    let atual = 0;
    let origem = null;

    function precarregar(i) {
      const link = grupo[(i + grupo.length) % grupo.length];
      if (link) new Image().src = link.href;
    }

    function mostrar(i) {
      atual = (i + grupo.length) % grupo.length;
      const link = grupo[atual];
      const miniatura = link.querySelector('img');

      // Mostra já a miniatura (em cache) e troca pela versão grande ao carregar
      img.src = miniatura ? miniatura.currentSrc || miniatura.src : link.href;
      img.alt = miniatura ? miniatura.alt : '';
      const grande = new Image();
      grande.onload = () => { if (grupo[atual] === link) img.src = link.href; };
      grande.src = link.href;

      legenda.textContent = link.dataset.caption || '';
      selo.hidden = !link.hasAttribute('data-ilustrativa');
      contador.textContent = `Imagem ${atual + 1} de ${grupo.length}`;

      const varias = grupo.length > 1;
      anterior.hidden = !varias;
      proxima.hidden = !varias;
      precarregar(atual + 1);
      precarregar(atual - 1);
    }

    function abrir(link) {
      origem = link;
      grupo = [...document.querySelectorAll(`[data-lightbox="${link.dataset.lightbox}"]`)];
      mostrar(grupo.indexOf(link));
      dialog.showModal();
      document.body.classList.add('is-locked');
      fechar.focus();
    }

    document.addEventListener('click', (e) => {
      const link = e.target.closest('a[data-lightbox]');
      if (!link || e.ctrlKey || e.metaKey || e.shiftKey) return; // nova aba continua funcionando
      e.preventDefault();
      abrir(link);
    });

    anterior.addEventListener('click', () => mostrar(atual - 1));
    proxima.addEventListener('click', () => mostrar(atual + 1));
    fechar.addEventListener('click', () => dialog.close());

    dialog.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') { e.preventDefault(); mostrar(atual - 1); }
      if (e.key === 'ArrowRight') { e.preventDefault(); mostrar(atual + 1); }
    });

    // Clique fora da imagem e dos controles fecha
    dialog.addEventListener('click', (e) => {
      if (e.target === dialog || e.target.classList.contains('lightbox__figure')) dialog.close();
    });

    dialog.addEventListener('close', () => {
      document.body.classList.remove('is-locked');
      img.src = 'data:,';
      origem?.focus(); // garante a volta do foco em todos os navegadores
    });

    // Deslizar para os lados troca de imagem
    let inicioX = null;
    img.addEventListener('pointerdown', (e) => { inicioX = e.clientX; });
    img.addEventListener('pointerup', (e) => {
      if (inicioX === null) return;
      const dx = e.clientX - inicioX;
      inicioX = null;
      if (Math.abs(dx) > 50) mostrar(atual + (dx < 0 ? 1 : -1));
    });
  }

  FG.lightbox = { init };
})(window.FG);
