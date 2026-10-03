// Preenche links e textos de contato a partir de FG.config
//   data-whatsapp="mensagem opcional" → href wa.me (sem mensagem: usa a padrão)
//   data-tel                          → href tel://   data-instagram                    → href do perfil (abre em nova aba)
//   data-instagram-text               → texto "@usuario"
//   data-horario                      → texto do horário de atendimento
// O HTML já traz os valores escritos (funciona sem JS); o script só
// garante que tudo siga o config.

(function (FG) {
  // Formata dígitos no padrão BR: (00) 0000-0000 ou (00) 00000-0000.
  // Aceita com ou sem o 55 do país na frente.
  function formatarTelefone(valor) {
    let digitos = String(valor).replace(/\D/g, '');
    if (digitos.length > 11 && digitos.startsWith('55')) digitos = digitos.slice(2);

    const ddd = digitos.slice(0, 2);
    const numero = digitos.slice(2);
    const corte = numero.length === 9 ? 5 : 4;
    return `(${ddd}) ${numero.slice(0, corte)}-${numero.slice(corte)}`;
  }

  function linkWhatsApp(mensagem) {
    const texto = mensagem || FG.config.whatsappMensagem;
    return `https://wa.me/${FG.config.whatsapp}?text=${encodeURIComponent(texto)}`;
  }

  const linkInstagram = () => `https://www.instagram.com/${FG.config.instagram}/`;

  // Abre em nova aba com segurança (noopener) e avisa o leitor de tela
  const AVISO = ' (abre em nova aba)';
  const novaAba = (el) => {
    el.target = '_blank';
    el.rel = 'noopener';
    const rotulo = el.getAttribute('aria-label');
    if (rotulo) {
      if (!rotulo.includes('nova aba')) el.setAttribute('aria-label', rotulo + AVISO);
    } else if (!el.querySelector('[data-aviso-aba]') && !el.textContent.includes('nova aba')) {
      const aviso = document.createElement('span');
      aviso.className = 'visually-hidden';
      aviso.dataset.avisoAba = '';
      aviso.textContent = AVISO;
      el.append(aviso);
    }
  };

  function init() {
    const { telefone, email, instagram, horario } = FG.config;
    const todos = (sel, fn) => document.querySelectorAll(sel).forEach(fn);

    todos('[data-whatsapp]', (el) => {
      el.href = linkWhatsApp(el.dataset.whatsapp);
      novaAba(el);
    });

    todos('[data-tel]', (el) => { el.href = `tel:+${telefone.replace(/\D/g, '')}`; });
    todos('[data-tel-text]', (el) => { el.textContent = formatarTelefone(telefone); });

    todos('[data-email]', (el) => {
      el.href = `mailto:${email}`;
      el.textContent = email;
    });
    todos('[data-email-link]', (el) => {
      const subject = el.href.includes('?') ? el.href.slice(el.href.indexOf('?')) : '';
      el.href = `mailto:${email}${subject}`;
    });

    todos('[data-instagram]', (el) => {
      el.href = linkInstagram();
      novaAba(el);
    });
    todos('[data-instagram-text]', (el) => { el.textContent = `@${instagram}`; });

    todos('[data-horario]', (el) => { el.textContent = horario; });
  }

  FG.contact = { init, linkWhatsApp, linkInstagram, formatarTelefone };
})(window.FG);
