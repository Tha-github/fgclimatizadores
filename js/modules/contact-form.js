// Formulário de contato → WhatsApp
// Não há envio para servidor: o script valida os campos obrigatórios,
// monta a mensagem e abre o WhatsApp da empresa com ela preenchida.
// Erros aparecem no .field__error de cada campo (ligado por
// aria-describedby) e o foco vai para o primeiro campo inválido.

(function (FG) {
  const OBRIGATORIOS = {
    nome: 'Informe o seu nome.',
    cidade: 'Informe a cidade do evento.',
    tipo: 'Selecione o tipo de evento.',
  };

  // "2026-12-05" → "05/12/2026"
  const formatarData = (iso) => (iso ? iso.split('-').reverse().join('/') : '');

  function marcarErro(campo, mensagem) {
    const erro = document.getElementById(campo.getAttribute('aria-describedby'));
    campo.setAttribute('aria-invalid', mensagem ? 'true' : 'false');
    if (erro) erro.textContent = mensagem || '';
  }

  function montarMensagem(d) {
    const linhas = [
      'Olá, FG Climatizadores! Vim pelo site e gostaria de um orçamento.',
      '',
      `Nome: ${d.nome}`,
      `Cidade: ${d.cidade}`,
      `Tipo de evento: ${d.tipo}`,
    ];
    if (d.data) linhas.push(`Data do evento: ${formatarData(d.data)}`);
    if (d.interesse) linhas.push(`Interesse: ${d.interesse}`);
    if (d.mensagem) linhas.push('', d.mensagem);
    return linhas.join('\n');
  }

  function init() {
    const form = document.querySelector('[data-contact-form]');
    if (!form) return;

    // Limpa o erro assim que o campo é corrigido
    form.addEventListener('input', (e) => {
      const campo = e.target;
      if (campo.getAttribute('aria-invalid') === 'true' && campo.value.trim()) marcarErro(campo, '');
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const dados = Object.fromEntries(
        [...new FormData(form)].map(([k, v]) => [k, String(v).trim()])
      );

      let primeiroInvalido = null;
      Object.entries(OBRIGATORIOS).forEach(([nome, mensagem]) => {
        const campo = form.elements[nome];
        const invalido = !dados[nome];
        marcarErro(campo, invalido ? mensagem : '');
        if (invalido && !primeiroInvalido) primeiroInvalido = campo;
      });

      if (primeiroInvalido) {
        primeiroInvalido.focus();
        return;
      }

      const url = FG.contact.linkWhatsApp(montarMensagem(dados));
      const aba = window.open(url, '_blank');
      if (aba) aba.opener = null;
      else window.location.href = url; // bloqueador de pop-up: abre na mesma aba
    });
  }

  FG.contactForm = { init, montarMensagem };
})(window.FG);
