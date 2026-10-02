// Troca o marcador "https://SEU-DOMINIO.com.br" pelo domínio real em todos
// os arquivos que precisam de URL absoluta (canonical, Open Graph, dados
// estruturados, sitemap e robots).
//
// Uso (na pasta do projeto):
//   node scripts/definir-dominio.js https://www.fgclimatizadores.com.br
//
// Pode rodar de novo para trocar um domínio já definido: o script lembra o
// último domínio aplicado em scripts/.dominio-atual.

const fs = require('fs');
const path = require('path');

const RAIZ = path.join(__dirname, '..');
const MARCADOR = 'https://SEU-DOMINIO.com.br';
const MEMORIA = path.join(__dirname, '.dominio-atual');
const ARQUIVOS = ['index.html', 'politica-de-privacidade.html', 'sitemap.xml', 'robots.txt'];

const novo = (process.argv[2] || '').trim().replace(/\/+$/, '');
if (!/^https:\/\/[a-z0-9.-]+\.[a-z]{2,}$/i.test(novo)) {
  console.error('Informe o domínio com https e sem barra no fim, ex.:');
  console.error('  node scripts/definir-dominio.js https://www.fgclimatizadores.com.br');
  process.exit(1);
}

const anterior = fs.existsSync(MEMORIA) ? fs.readFileSync(MEMORIA, 'utf8').trim() : MARCADOR;

ARQUIVOS.forEach((arquivo) => {
  const caminho = path.join(RAIZ, arquivo);
  if (!fs.existsSync(caminho)) return;
  const conteudo = fs.readFileSync(caminho, 'utf8');
  const trocas = conteudo.split(anterior).length - 1;
  fs.writeFileSync(caminho, conteudo.split(anterior).join(novo));
  console.log(`${arquivo}: ${trocas} ocorrência(s)`);
});

fs.writeFileSync(MEMORIA, novo);
console.log(`Domínio definido: ${novo}`);
