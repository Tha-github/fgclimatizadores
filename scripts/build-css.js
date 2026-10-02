// Gera css/site.css: todos os módulos de css/main.css num arquivo só.
//
// Por quê: com @import o navegador só descobre cada arquivo depois de
// baixar o anterior — no celular isso atrasa a primeira pintura em mais de
// 1 s. Um arquivo único é baixado de uma vez.
//
// Fluxo de trabalho:
//   1. Edite os módulos em css/ normalmente (css/main.css é o índice).
//   2. Rode:  node scripts/build-css.js
//   3. As páginas carregam css/site.css (gerado — NÃO editar à mão).
//
// O script preserva as camadas (@layer) de cada @import, corrige os
// caminhos de url() e remove comentários/espaços.

const fs = require('fs');
const path = require('path');

const RAIZ = path.join(__dirname, '..');
const ENTRADA = path.join(RAIZ, 'css', 'main.css');
const SAIDA = path.join(RAIZ, 'css', 'site.css');

const removerComentarios = (css) => css.replace(/\/\*[\s\S]*?\*\//g, '');

// url("../../x") de um módulo → caminho relativo a css/site.css
function corrigirUrls(css, pastaOrigem) {
  return css.replace(/url\(\s*(['"]?)([^'")]+)\1\s*\)/g, (trecho, aspas, url) => {
    if (/^(data:|https?:|\/|#)/.test(url)) return trecho;
    const absoluto = path.resolve(pastaOrigem, url);
    const relativo = path.relative(path.dirname(SAIDA), absoluto).split(path.sep).join('/');
    return `url("${relativo}")`;
  });
}

function minificar(css) {
  return css
    .replace(/\s+/g, ' ')
    .replace(/\s*([{};,>])\s*/g, '$1') // nunca mexe em espaços antes de ":" (seletores como ".a :hover")
    .replace(/:\s+/g, ':')
    .replace(/;}/g, '}')
    .trim();
}

const indice = removerComentarios(fs.readFileSync(ENTRADA, 'utf8'));
const partes = [];

// Declaração da ordem das camadas
const ordem = indice.match(/@layer\s+[^;{]+;/);
if (ordem) partes.push(ordem[0]);

const imports = [...indice.matchAll(/@import\s+url\(\s*["']([^"']+)["']\s*\)\s*(?:layer\(([^)]+)\))?\s*;/g)];
imports.forEach(([, arquivo, camada]) => {
  const caminho = path.join(path.dirname(ENTRADA), arquivo);
  let css = removerComentarios(fs.readFileSync(caminho, 'utf8').replace(/^﻿/, '')); // ignora BOM (marca invisível que alguns editores salvam no início)
  css = corrigirUrls(css, path.dirname(caminho));
  partes.push(camada ? `@layer ${camada.trim()}{${css}}` : css);
});

const resultado =
  '/* GERADO por scripts/build-css.js a partir de css/main.css — não editar à mão. */\n' +
  minificar(partes.join('\n')) + '\n';

fs.writeFileSync(SAIDA, resultado);

// Versão no endereço do CSS (site.css?v=…), calculada pelo conteúdo: a
// cada mudança o endereço muda e o navegador/hospedagem não serve a cópia
// antiga do cache.
const versao = require('crypto').createHash('md5').update(resultado).digest('hex').slice(0, 10);
['index.html', 'politica-de-privacidade.html', '404.html'].forEach((pagina) => {
  const caminho = path.join(RAIZ, pagina);
  if (!fs.existsSync(caminho)) return;
  const html = fs.readFileSync(caminho, 'utf8');
  const novo = html.replace(/(css\/site\.css)(\?v=[a-f0-9]+)?"/g, `$1?v=${versao}"`);
  if (novo !== html) fs.writeFileSync(caminho, novo);
});
const kb = (n) => (n / 1024).toFixed(1) + ' KB';
const original = imports.reduce((s, [, a]) => s + fs.statSync(path.join(path.dirname(ENTRADA), a)).size, 0);
console.log(`css/site.css gerado: ${imports.length} módulos, ${kb(original)} → ${kb(resultado.length)}`);
