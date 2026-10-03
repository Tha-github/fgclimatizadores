// FG Climatizadores — dados de contato e configurações do site
// Fonte única: o HTML lê daqui via atributos data-* (ver js/modules/contact.js),
// então trocar um contato aqui atualiza o site inteiro.
// Obs.: os mesmos dados aparecem escritos no HTML como fallback (sem JS) e
// no JSON-LD do <head> — ao mudar algo aqui, atualize lá também.

window.FG = window.FG || {};

window.FG.config = {
  // WhatsApp da empresa (formato 55 + DDD + número, só dígitos)
  whatsapp: '5585999210105',

  // Mensagem padrão ao abrir o WhatsApp (links sem mensagem própria)
  whatsappMensagem: 'Olá, FG Climatizadores! Vim pelo site e gostaria de mais informações.',

  // Telefone exibido e usado nos links tel: — o mesmo número do WhatsApp
  telefone: '5585999210105',

  // E-mail de contato
  email: 'fgclimatizadores@gmail.com',

  // Usuário do Instagram, sem @
  instagram: 'fgclimatizadores',

  horario: 'Todos os dias, das 08h às 22h',
};
