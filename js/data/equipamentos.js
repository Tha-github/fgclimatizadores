// ============================================================
// CATÁLOGO DE EQUIPAMENTOS — EDITE AQUI
// ============================================================
// Cada objeto da lista vira um card na seção "Equipamentos".
// A ordem da lista é a ordem de exibição.
//
// REGRAS:
// - Publique SOMENTE dados confirmados pelo cliente. Campo sem dado
//   confirmado fica vazio ('' ou []) — o card se adapta e mostra
//   "Especificações técnicas sob consulta" em vez de inventar valores.
// - Ao preencher um equipamento real, troque `placeholder: true` por
//   `placeholder: false` (ou apague a linha). Isso remove o selo
//   "Em atualização" do card.
// - Não informe preço aqui sem aprovação do cliente.
//
// CAMPOS:
//   id             identificador único, sem espaços (ex.: 'fg-modelo-x')
//   nome           nome ou modelo exibido no card e enviado no WhatsApp
//   placeholder    true = item provisório, ainda não informado
//   categoria      linha pequena acima do nome (ex.: marca ou tipo) — opcional
//   descricao      1 ou 2 frases curtas — opcional
//   modalidades    ['locacao'], ['venda'] ou ['locacao', 'venda'].
//                  O filtro do catálogo só aparece quando ao menos um item
//                  tiver modalidade preenchida.
//   imagem         caminho da foto, ex.: 'assets/img/equipamentos/modelo-x.webp'
//                  (recomendado: fundo claro/neutro, 1200x1200, WebP).
//                  null = usa a ilustração genérica + aviso "Imagem ilustrativa".
//   imagemAlt      descrição da foto (ex.: 'Climatizador modelo X, vista frontal')
//   destaque       selo opcional, ex.: 'Mais procurado' — opcional
//   especificacoes lista de características CONFIRMADAS:
//                  [{ rotulo: 'Área indicada', valor: 'até 00 m²' }, ...]
// ============================================================

window.FG = window.FG || {};

window.FG.equipamentos = [
  // TROCAR AQUI: equipamento 1
  {
    id: 'modelo-01',
    nome: 'Modelo 01',
    placeholder: true,
    categoria: '',
    descricao: '',
    modalidades: [],
    imagem: null,
    imagemAlt: '',
    destaque: '',
    especificacoes: [],
  },
  // TROCAR AQUI: equipamento 2
  {
    id: 'modelo-02',
    nome: 'Modelo 02',
    placeholder: true,
    categoria: '',
    descricao: '',
    modalidades: [],
    imagem: null,
    imagemAlt: '',
    destaque: '',
    especificacoes: [],
  },
  // TROCAR AQUI: equipamento 3
  {
    id: 'modelo-03',
    nome: 'Modelo 03',
    placeholder: true,
    categoria: '',
    descricao: '',
    modalidades: [],
    imagem: null,
    imagemAlt: '',
    destaque: '',
    especificacoes: [],
  },
  // TROCAR AQUI: equipamento 4
  {
    id: 'modelo-04',
    nome: 'Modelo 04',
    placeholder: true,
    categoria: '',
    descricao: '',
    modalidades: [],
    imagem: null,
    imagemAlt: '',
    destaque: '',
    especificacoes: [],
  },
  // TROCAR AQUI: equipamento 5
  {
    id: 'modelo-05',
    nome: 'Modelo 05',
    placeholder: true,
    categoria: '',
    descricao: '',
    modalidades: [],
    imagem: null,
    imagemAlt: '',
    destaque: '',
    especificacoes: [],
  },
  // TROCAR AQUI: equipamento 6
  {
    id: 'modelo-06',
    nome: 'Modelo 06',
    placeholder: true,
    categoria: '',
    descricao: '',
    modalidades: [],
    imagem: null,
    imagemAlt: '',
    destaque: '',
    especificacoes: [],
  },

  // EXEMPLO de item preenchido (copie, ajuste e tire do comentário):
  // {
  //   id: 'nome-do-modelo',
  //   nome: 'Nome do modelo',
  //   placeholder: false,
  //   categoria: 'Marca ou tipo',
  //   descricao: 'Frase curta sobre o equipamento e onde ele é indicado.',
  //   modalidades: ['locacao', 'venda'],
  //   imagem: 'assets/img/equipamentos/nome-do-modelo.webp',
  //   imagemAlt: 'Climatizador Nome do modelo, vista frontal',
  //   destaque: '',
  //   especificacoes: [
  //     { rotulo: 'Característica confirmada', valor: 'valor informado pelo cliente' },
  //   ],
  // },
];
